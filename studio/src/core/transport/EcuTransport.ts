// Transport abstraction layer — ADR-0010
// Studio never talks to USB/CAN/BLE directly. All communication goes through this trait.

export interface EcuDevice {
  id: string;
  name: string;
  transport: string;        // "usb", "can", "ble", "ethernet"
  path: string;             // OS-specific path (COM3, /dev/ttyACM0, can0)
  serialNumber?: string;
  firmwareVersion?: string;
}

export interface Connection {
  id: string;
  device: EcuDevice;
  connectedAt: number;
}

export enum ConnectionState {
  DISCONNECTED = "disconnected",
  DISCOVERING = "discovering",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

export interface TransportError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface EcuTransport {
  // Discover available ECUs
  discover(): Promise<EcuDevice[]>;

  // Connect to a specific ECU
  connect(device: EcuDevice): Promise<Connection>;

  // Disconnect
  disconnect(connection: Connection): Promise<void>;

  // Send raw frame, receive response
  sendFrame(connection: Connection, frame: Uint8Array): Promise<Uint8Array>;

  // Check connection health
  heartbeat(connection: Connection): Promise<boolean>;

  // State observable
  onStateChange(handler: (state: ConnectionState, error?: TransportError) => void): () => void;
}
