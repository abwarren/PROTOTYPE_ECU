/**
 * EcuService — business logic layer for ECU communication
 *
 * Architecture:
 *   7100CPT Studio → EcuService → EcuProtocol (interface) → Adapter → Transport → ECU
 *
 * UI communicates ONLY with EcuService.
 * EcuService communicates ONLY through EcuProtocol interface.
 * EcuService never touches Transport directly.
 * No service method knows about USB, CAN, or protocol frames.
 */

import { EcuProtocol, EcuIdentity, SensorChannel, CalTable, DiagnosticCode } from "../transport/EcuProtocol";
import { EcuTransport, EcuDevice, Connection } from "../transport/EcuTransport";

export class EcuService {
  private _identity: EcuIdentity | null = null;

  constructor(
    private protocol: EcuProtocol,
    private transport: EcuTransport
  ) {}

  // ── Discovery ──────────────────────────────────────────────

  async discover(): Promise<EcuDevice[]> {
    return this.transport.discover();
  }

  // ── Connection ─────────────────────────────────────────────

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

  // ── Live Data ──────────────────────────────────────────────

  async getLiveData(channels: string[], connection: Connection): Promise<SensorChannel[]> {
    return this.protocol.readSensors(this.transport, connection, channels);
  }

  // ── Calibration ────────────────────────────────────────────

  async loadCalibration(tableId: string, connection: Connection): Promise<CalTable> {
    return this.protocol.readCalibration(this.transport, connection, tableId);
  }

  async saveCalibration(table: CalTable, connection: Connection): Promise<void> {
    return this.protocol.writeCalibration(this.transport, connection, table);
  }

  // ── Diagnostics ────────────────────────────────────────────

  async getFaultCodes(connection: Connection): Promise<DiagnosticCode[]> {
    return this.protocol.readDTCs(this.transport, connection);
  }

  async clearFaultCodes(connection: Connection): Promise<void> {
    return this.protocol.clearDTCs(this.transport, connection);
  }
}
