// Protocol layer — ADR-0012
// Understands ECU messages. Transport moves bytes. Protocol understands frames.
// Service layer implements business workflows on top of Protocol.

import { EcuTransport, Connection, EcuDevice } from "./EcuTransport";

// ---- ECU Identity ----
export interface EcuIdentity {
  vendor: string;
  board: string;
  firmware: string;
  protocol: number;
  gitSha: string;
  serial: string;
  features: string[];
}

// ---- Sensor Data ----
export interface SensorChannel {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

// ---- Calibration Table ----
export interface CalTable {
  id: string;
  name: string;
  type: string;              // "fuel_ve", "ignition", "afr_target", etc.
  axisX: { label: string; values: number[] };
  axisY: { label: string; values: number[] };
  data: number[][];
}

// ---- Diagnostic Codes ----
export interface DiagnosticCode {
  code: string;              // "P0301"
  description: string;
  status: "active" | "pending" | "historic";
}

// ---- Protocol Interface ----
export interface EcuProtocol {
  // Handshake — identify the connected ECU
  handshake(transport: EcuTransport, conn: Connection): Promise<EcuIdentity>;

  // Read sensor channels in real-time
  readSensors(
    transport: EcuTransport,
    conn: Connection,
    channels: string[]
  ): Promise<SensorChannel[]>;

  // Calibration read/write
  readCalibration(
    transport: EcuTransport,
    conn: Connection,
    tableId: string
  ): Promise<CalTable>;

  writeCalibration(
    transport: EcuTransport,
    conn: Connection,
    table: CalTable
  ): Promise<void>;

  // Diagnostics
  readDTCs(transport: EcuTransport, conn: Connection): Promise<DiagnosticCode[]>;
  clearDTCs(transport: EcuTransport, conn: Connection): Promise<void>;

  // Low-level — for protocol extensions
  sendCommand(
    transport: EcuTransport,
    conn: Connection,
    cmd: number,
    payload: Uint8Array
  ): Promise<Uint8Array>;
}

// ---- ECU Service Layer ----
// Business logic that the UI calls. Never knows about USB, CAN, or protocol frames.

export class EcuService {
  private _identity: EcuIdentity | null = null;

  constructor(
    private protocol: EcuProtocol,
    private transport: EcuTransport
  ) {}

  async discover(): Promise<EcuDevice[]> {
    return this.transport.discover();
  }

  async connect(device: EcuDevice): Promise<EcuIdentity> {
    const conn = await this.transport.connect(device);
    this._identity = await this.protocol.handshake(this.transport, conn);
    return this._identity;
  }

  async disconnect(connection: Connection): Promise<void> {
    await this.transport.disconnect(connection);
    this._identity = null;
  }

  get identity(): EcuIdentity | null {
    return this._identity;
  }

  async getLiveData(channels: string[], connection: Connection): Promise<SensorChannel[]> {
    return this.protocol.readSensors(this.transport, connection, channels);
  }

  async loadCalibration(tableId: string, connection: Connection): Promise<CalTable> {
    return this.protocol.readCalibration(this.transport, connection, tableId);
  }

  async saveCalibration(table: CalTable, connection: Connection): Promise<void> {
    return this.protocol.writeCalibration(this.transport, connection, table);
  }

  async getFaultCodes(connection: Connection): Promise<DiagnosticCode[]> {
    return this.protocol.readDTCs(this.transport, connection);
  }

  async clearFaultCodes(connection: Connection): Promise<void> {
    return this.protocol.clearDTCs(this.transport, connection);
  }
}
