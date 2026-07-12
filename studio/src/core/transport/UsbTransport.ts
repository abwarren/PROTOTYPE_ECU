// UsbTransport — concrete Transport implementation over Tauri serial port commands
// Implements EcuTransport interface (ADR-0010)
// Wraps Tauri Rust backend invoke() calls

import { invoke } from "@tauri-apps/api/core";
import {
  EcuTransport,
  EcuDevice,
  Connection,
  ConnectionState,
  TransportError,
} from "./EcuTransport";

/** Raw port info returned from Rust list_ports command */
interface RawPortInfo {
  path: string;
  name: string;
  serial_number: string | null;
  vendor_id: number | null;
  product_id: number | null;
  transport: string;
}

export class UsbTransport implements EcuTransport {
  private stateChangeHandlers: Array<
    (state: ConnectionState, error?: TransportError) => void
  > = [];
  private currentState: ConnectionState = ConnectionState.DISCONNECTED;

  // ---- EcuTransport Interface ----

  async discover(): Promise<EcuDevice[]> {
    try {
      const ports: RawPortInfo[] = await invoke("list_ports");
      return ports.map((p) => ({
        id: p.path,
        name: p.name,
        transport: p.transport,
        path: p.path,
        serialNumber: p.serial_number ?? undefined,
      }));
    } catch (err) {
      console.error("[UsbTransport] discover error:", err);
      return [];
    }
  }

  async connect(device: EcuDevice): Promise<Connection> {
    this.emitState(ConnectionState.CONNECTING);

    try {
      // Open the port at 115200 baud (standard rusEFI rate)
      await invoke("open_port", { path: device.path, baudRate: 115200 });

      const conn: Connection = {
        id: `usb-${device.path}`,
        device,
        connectedAt: Date.now(),
      };

      this.emitState(ConnectionState.CONNECTED);
      return conn;
    } catch (err) {
      const error: TransportError = {
        code: "CONNECT_FAILED",
        message: String(err),
        recoverable: true,
      };
      this.emitState(ConnectionState.ERROR, error);
      throw error;
    }
  }

  async disconnect(connection: Connection): Promise<void> {
    try {
      await invoke("close_port", { path: connection.device.path });
    } catch (err) {
      console.error("[UsbTransport] disconnect error:", err);
    }
    this.emitState(ConnectionState.DISCONNECTED);
  }

  async sendFrame(
    connection: Connection,
    frame: Uint8Array
  ): Promise<Uint8Array> {
    try {
      // send_frame expects: path, command (u8), payload (number[])
      // For raw byte transport, we use write_raw directly for plain-text
      const data = Array.from(frame);
      const result: number[] = await invoke("send_frame", {
        path: connection.device.path,
        command: data[0], // first byte is the command
        payload: data.slice(1),
      });
      return new Uint8Array(result);
    } catch (err) {
      console.error("[UsbTransport] sendFrame error:", err);
      throw err;
    }
  }

  async heartbeat(connection: Connection): Promise<boolean> {
    try {
      // On rusEFI, sending 'S' (plain text) and getting a response = alive
      await invoke("write_raw", {
        path: connection.device.path,
        data: [0x53], // 'S'
      });
      // Small delay for ECU to respond
      await this.sleep(100);
      const result: number[] = await invoke("read_raw", {
        path: connection.device.path,
        maxBytes: 1,
        timeoutMs: 200,
      });
      return result.length > 0;
    } catch {
      return false;
    }
  }

  onStateChange(
    handler: (state: ConnectionState, error?: TransportError) => void
  ): () => void {
    this.stateChangeHandlers.push(handler);
    // Immediately notify of current state
    handler(this.currentState);
    return () => {
      this.stateChangeHandlers = this.stateChangeHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  // ---- Protocol-level helpers (used by RusEfiProtocol) ----

  /** Send the plain-text 'S' query and get the ECU signature */
  async querySignature(devicePath: string): Promise<string> {
    try {
      const signature: string = await invoke("query_ecu", {
        path: devicePath,
      });
      return signature;
    } catch (err) {
      console.error("[UsbTransport] querySignature error:", err);
      throw err;
    }
  }

  /** Send a CRC-framed command and get the response payload */
  async sendCommand(
    devicePath: string,
    command: number,
    payload: Uint8Array = new Uint8Array(0)
  ): Promise<Uint8Array> {
    const result: number[] = await invoke("send_frame", {
      path: devicePath,
      command,
      payload: Array.from(payload),
    });
    return new Uint8Array(result);
  }

  // ---- Internal ----

  private emitState(state: ConnectionState, error?: TransportError) {
    this.currentState = state;
    for (const handler of this.stateChangeHandlers) {
      handler(state, error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
