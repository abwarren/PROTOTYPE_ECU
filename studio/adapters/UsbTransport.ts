/**
 * UsbTransport — USB CDC transport implementation for rusEFI ECU
 *
 * Implements EcuTransport using Tauri IPC commands (Rust serialport backend).
 *
 * Architecture (TB-005):
 *   UsbTransport → Tauri invoke() → Rust serialport → OS USB stack → rusEFI USB CDC
 *
 * Demo Gate requirements:
 *   ✓ USB device detected in discover()
 *   ✓ Connect succeeds (open port, configure baud/parity)
 *   ✓ Send heartbeat → ECU responds (or timeout handled gracefully)
 *   ✓ Disconnect succeeds (port released)
 *   ✓ Reconnect after disconnect (state machine reset)
 */

import {
  EcuTransport,
  EcuDevice,
  Connection,
  ConnectionState,
  TransportError,
} from "../core/transport/EcuTransport";

// ─── Tauri IPC —─────────────────────────────────────────────────────────

declare global {
  interface Window {
    __TAURI__?: {
      invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
    };
  }
}

interface PortInfo {
  path: string;
  name: string;
}

interface DiscoverResult {
  ports: PortInfo[];
}

interface OpenResult {
  handle: string;
}

// ─── Constants ─────────────────────────────────────────────────────────

const USB_CDC_BAUD = 115200;
const HEARTBEAT_TIMEOUT_MS = 500;
const FRAME_TIMEOUT_MS = 1000;

// ─── Helpers ────────────────────────────────────────────────────────────

function isTauri(): boolean {
  return typeof window !== "undefined" && !!window.__TAURI__;
}

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauri()) {
    throw new Error(`[UsbTransport] Tauri not available — cannot invoke ${cmd}`);
  }
  return window.__TAURI__!.invoke<T>(cmd, args);
}

// ─── UsbTransport —─────────────────────────────────────────────────────

export class UsbTransport implements EcuTransport {
  private _activeConnection: Connection | null = null;
  private _portHandle: string | null = null;
  private _stateHandlers: Array<(state: ConnectionState, error?: TransportError) => void> = [];
  private _currentState: ConnectionState = ConnectionState.DISCONNECTED;
  private _connectionId = 0;

  // ── State ─────────────────────────────────────────────────────────────

  private setState(state: ConnectionState, error?: TransportError): void {
    this._currentState = state;
    for (const handler of this._stateHandlers) {
      try { handler(state, error); } catch (e) { /* swallow */ }
    }
  }

  onStateChange(handler: (state: ConnectionState, error?: TransportError) => void): () => void {
    this._stateHandlers.push(handler);
    handler(this._currentState);
    return () => { this._stateHandlers = this._stateHandlers.filter(h => h !== handler); };
  }

  // ── Discover ──────────────────────────────────────────────────────────

  async discover(): Promise<EcuDevice[]> {
    this.setState(ConnectionState.DISCOVERING);

    if (!isTauri()) {
      console.warn("[UsbTransport] Not in Tauri — returning empty device list");
      this.setState(ConnectionState.DISCONNECTED);
      return [];
    }

    try {
      const result = await invoke<DiscoverResult>("discover_ports");
      const devices: EcuDevice[] = result.ports.map((p) => ({
        id: p.path,
        name: p.name,
        transport: "usb" as const,
        path: p.path,
      }));

      console.log(`[UsbTransport] Discovered ${devices.length} device(s)`);
      devices.forEach((d) => console.log(`  → ${d.name} (${d.path})`));

      this.setState(ConnectionState.DISCONNECTED);
      return devices;
    } catch (err) {
      const error: TransportError = {
        code: "DISCOVERY_FAILED",
        message: `Port enumeration failed: ${(err as Error).message}`,
        recoverable: true,
      };
      this.setState(ConnectionState.ERROR, error);
      return [];
    }
  }

  // ── Connect ───────────────────────────────────────────────────────────

  async connect(device: EcuDevice): Promise<Connection> {
    this.setState(ConnectionState.CONNECTING);

    if (!isTauri()) {
      throw new Error("[UsbTransport] Cannot connect outside Tauri");
    }

    try {
      console.log(`[UsbTransport] Opening ${device.path} @ ${USB_CDC_BAUD} baud...`);
      const result = await invoke<OpenResult>("open_port", {
        path: device.path,
        baudRate: USB_CDC_BAUD,
      });

      this._portHandle = result.handle;
      this._connectionId += 1;

      const connection: Connection = {
        id: `usb-${this._connectionId}`,
        device,
        connectedAt: Date.now(),
      };

      this._activeConnection = connection;
      this.setState(ConnectionState.CONNECTED);
      console.log(`[UsbTransport] Connected — handle: ${result.handle}`);
      return connection;
    } catch (err) {
      const error: TransportError = {
        code: "CONNECT_FAILED",
        message: `Failed to open ${device.path}: ${(err as Error).message}`,
        recoverable: true,
      };
      this.setState(ConnectionState.ERROR, error);
      throw new Error(error.message);
    }
  }

  // ── Disconnect ────────────────────────────────────────────────────────

  async disconnect(connection: Connection): Promise<void> {
    if (!this._portHandle) return;

    try {
      await invoke("close_port", { handle: this._portHandle });
      console.log(`[UsbTransport] Disconnected from ${connection.device.path}`);
    } catch (err) {
      console.error("[UsbTransport] Error during disconnect:", err);
    } finally {
      this._portHandle = null;
      this._activeConnection = null;
      this.setState(ConnectionState.DISCONNECTED);
    }
  }

  // ── Send/Receive ──────────────────────────────────────────────────────

  async sendFrame(connection: Connection, frame: Uint8Array): Promise<Uint8Array> {
    if (!this._portHandle) {
      throw new Error("[UsbTransport] Not connected");
    }

    try {
      // Send
      await invoke("write_port", {
        handle: this._portHandle,
        data: Array.from(frame),
      });

      // Receive
      const raw = await invoke<number[]>("read_port", {
        handle: this._portHandle,
        timeoutMs: FRAME_TIMEOUT_MS,
      });

      return new Uint8Array(raw);
    } catch (err) {
      const msg = (err as Error).message || "";
      if (msg.includes("not found") || msg.includes("disconnected")) {
        this._portHandle = null;
        this._activeConnection = null;
        this.setState(ConnectionState.ERROR, {
          code: "DEVICE_UNPLUGGED",
          message: "USB device unplugged",
          recoverable: true,
        });
        this.setState(ConnectionState.DISCONNECTED);
      }
      throw err;
    }
  }

  // ── Heartbeat ─────────────────────────────────────────────────────────

  async heartbeat(connection: Connection): Promise<boolean> {
    if (!this._portHandle) return false;

    try {
      // Send rusEFI HELLO probe ('S')
      await invoke("write_port", {
        handle: this._portHandle,
        data: [0x53],
      });

      const raw = await invoke<number[]>("read_port", {
        handle: this._portHandle,
        timeoutMs: HEARTBEAT_TIMEOUT_MS,
      });

      return raw.length > 0;
    } catch {
      return false;
    }
  }

  // ── Accessors ─────────────────────────────────────────────────────────

  get currentState(): ConnectionState {
    return this._currentState;
  }

  get activeConnection(): Connection | null {
    return this._activeConnection;
  }
}
