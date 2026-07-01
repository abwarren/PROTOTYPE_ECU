// USB CDC Transport — wraps Tauri serialport commands into EcuTransport trait (ADR-0010)

import { invoke } from "@tauri-apps/api/core";
import {
  EcuTransport,
  EcuDevice,
  Connection,
  ConnectionState,
  TransportError,
} from "./EcuTransport";

interface SerialDevice {
  name: string;
  path: string;
  vid: number;
  pid: number;
  serial_number: string | null;
}

interface ConnectionInfo {
  id: string;
  path: string;
}

export class UsbTransport implements EcuTransport {
  private stateListeners: Array<(state: ConnectionState, error?: TransportError) => void> = [];
  private currentState: ConnectionState = ConnectionState.DISCONNECTED;
  private activeConnection: Connection | null = null;

  private setState(state: ConnectionState, error?: TransportError) {
    this.currentState = state;
    this.stateListeners.forEach((fn) => fn(state, error));
  }

  onStateChange(
    handler: (state: ConnectionState, error?: TransportError) => void,
  ): () => void {
    this.stateListeners.push(handler);
    return () => {
      this.stateListeners = this.stateListeners.filter((h) => h !== handler);
    };
  }

  async discover(): Promise<EcuDevice[]> {
    this.setState(ConnectionState.DISCOVERING);
    try {
      const devices: SerialDevice[] = await invoke("list_serial_ports");
      const ecuDevices: EcuDevice[] = devices
        .filter((d) => d.vid !== 0 || d.pid !== 0)
        .map((d) => ({
          id: d.path,
          name: d.serial_number
            ? `Prototype ECU (${d.serial_number})`
            : `USB Device (${d.vid.toString(16)}:${d.pid.toString(16)})`,
          transport: "usb" as const,
          path: d.path,
          serialNumber: d.serial_number ?? undefined,
        }));

      this.setState(ConnectionState.DISCONNECTED);
      return ecuDevices;
    } catch (e) {
      this.setState(ConnectionState.ERROR, {
        code: "DISCOVERY_FAILED",
        message: String(e),
        recoverable: true,
      });
      return [];
    }
  }

  async connect(device: EcuDevice): Promise<Connection> {
    this.setState(ConnectionState.CONNECTING);
    try {
      const info: ConnectionInfo = await invoke("connect_serial", {
        path: device.path,
        baudRate: 115200,
      });

      const conn: Connection = {
        id: info.id,
        device,
        connectedAt: Date.now(),
      };

      this.activeConnection = conn;
      this.setState(ConnectionState.CONNECTED);

      return conn;
    } catch (e) {
      this.setState(ConnectionState.ERROR, {
        code: "CONNECT_FAILED",
        message: String(e),
        recoverable: true,
      });
      throw e;
    }
  }

  async disconnect(_connection: Connection): Promise<void> {
    try {
      await invoke("disconnect_serial");
    } catch {
      // Best-effort disconnect
    }
    this.activeConnection = null;
    this.setState(ConnectionState.DISCONNECTED);
  }

  async sendFrame(_connection: Connection, frame: Uint8Array): Promise<Uint8Array> {
    try {
      const response: number[] = await invoke("send_frame", {
        data: Array.from(frame),
      });
      return new Uint8Array(response);
    } catch (e) {
      throw {
        code: "SEND_FAILED",
        message: String(e),
        recoverable: true,
      } as TransportError;
    }
  }

  async heartbeat(_connection: Connection): Promise<boolean> {
    try {
      return await invoke("heartbeat_serial");
    } catch {
      return false;
    }
  }
}
