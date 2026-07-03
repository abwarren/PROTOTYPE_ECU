/**
 * UsbTransport — concrete Transport implementation using Tauri's serial port API
 *
 * ADR-0010: Transport moves bytes. This is the USB CDC implementation.
 * The Rust backend (lib.rs) exposes discover_ports, open_port, close_port,
 * write_port, read_port as Tauri commands. This class wraps them into the
 * EcuTransport interface.
 *
 * Layer: Transport → Protocol → Service → UI
 */

import { invoke } from "@tauri-apps/api/core";
import {
  EcuTransport,
  EcuDevice,
  Connection,
  ConnectionState,
  TransportError,
} from "./EcuTransport";

// ─── Tauri command response types ──────────────────────────────────────

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

// ─── UsbTransport ──────────────────────────────────────────────────────

export class UsbTransport implements EcuTransport {
  private stateListeners: Array<(state: ConnectionState, error?: TransportError) => void> = [];
  private _currentState: ConnectionState = ConnectionState.DISCONNECTED;

  // ── Discovery ─────────────────────────────────────────────────

  async discover(): Promise<EcuDevice[]> {
    try {
      const result: DiscoverResult = await invoke("discover_ports");
      return result.ports.map((p) => ({
        id: p.path,
        name: p.name,
        transport: "usb" as const,
        path: p.path,
      }));
    } catch (e) {
      console.error("[UsbTransport] discover failed:", e);
      return [];
    }
  }

  // ── Connect ───────────────────────────────────────────────────

  async connect(device: EcuDevice): Promise<Connection> {
    this.transition(ConnectionState.CONNECTING);
    try {
      const result: OpenResult = await invoke("open_port", {
        path: device.path,
        baudRate: 115200,
      });
      const conn: Connection = {
        id: result.handle,
        device,
        connectedAt: Date.now(),
      };
      this.transition(ConnectionState.CONNECTED);
      return conn;
    } catch (e) {
      const msg = String(e);
      this.transition(ConnectionState.ERROR, {
        code: "CONNECT_FAILED",
        message: msg,
        recoverable: true,
      });
      throw new Error(msg);
    }
  }

  // ── Disconnect ────────────────────────────────────────────────

  async disconnect(connection: Connection): Promise<void> {
    try {
      await invoke("close_port", { handle: connection.id });
    } catch (e) {
      console.warn("[UsbTransport] close_port error (ignored):", e);
    }
    this.transition(ConnectionState.DISCONNECTED);
  }

  // ── Send / Receive ────────────────────────────────────────────

  async sendFrame(connection: Connection, frame: Uint8Array): Promise<Uint8Array> {
    // Write the frame
    await invoke("write_port", {
      handle: connection.id,
      data: Array.from(frame),
    });

    // Read response (500ms timeout)
    const raw: number[] = await invoke("read_port", {
      handle: connection.id,
      timeoutMs: 500,
    });

    return new Uint8Array(raw);
  }

  // ── Heartbeat ─────────────────────────────────────────────────

  async heartbeat(connection: Connection): Promise<boolean> {
    try {
      // Try to read with short timeout — if port is dead, this fails
      await invoke("read_port", {
        handle: connection.id,
        timeoutMs: 50,
      });
      return true;
    } catch {
      return false;
    }
  }

  // ── State Management ──────────────────────────────────────────

  get currentState(): ConnectionState {
    return this._currentState;
  }

  onStateChange(
    handler: (state: ConnectionState, error?: TransportError) => void
  ): () => void {
    this.stateListeners.push(handler);
    return () => {
      this.stateListeners = this.stateListeners.filter((h) => h !== handler);
    };
  }

  private transition(state: ConnectionState, error?: TransportError): void {
    this._currentState = state;
    for (const h of this.stateListeners) {
      try {
        h(state, error);
      } catch {
        // listener errors don't break transport
      }
    }
  }
}
