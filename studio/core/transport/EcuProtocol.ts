/**
 * EcuProtocol — interface that all firmware adapters must implement
 *
 * Architecture (ADR-0012):
 *   7100CPT Studio → EcuService → EcuProtocol (interface) ← Adapter → Transport → ECU
 *
 * Protocol understands ECU messages.
 * Transport moves bytes.
 * Adapter implements this interface for a specific firmware (rusEFI, Haltech, etc.).
 * EcuService implements business workflows on top of Protocol.
 *
 * Current adapters:
 *   adapters/RusEFIProtocolAdapter.ts — rusEFI firmware (TS protocol)
 * Future adapters:
 *   adapters/7100CPTProtocolAdapter.ts    — 7100CPT native firmware
 *   adapters/HaltechProtocolAdapter.ts    — Haltech Elite
 *   adapters/LinkProtocolAdapter.ts       — Link ECU
 *   adapters/BoschProtocolAdapter.ts      — Bosch Motorsport
 */

import { EcuTransport, Connection } from "./EcuTransport";

// ─── ECU Identity (returned on handshake) ──────────────────────────────

export interface EcuIdentity {
  vendor: string;           // "rusEFI", "7100CPT", "Haltech", "Link", "Bosch"
  board: string;            // "f407-discovery", "7100CPT-v1", etc.
  firmware: string;         // Firmware version string
  protocol: number;         // Protocol version number
  gitSha: string;           // Build commit SHA or timestamp
  serial: string;           // ECU serial number
  features: string[];       // Supported features: ["sensors", "calibration", "diagnostics"]
}

// ─── Sensor Data ──────────────────────────────────────────────────────

export interface SensorChannel {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

// ─── Calibration Table ────────────────────────────────────────────────

export interface CalTable {
  id: string;
  name: string;
  type: string;              // "fuel_ve", "ignition", "afr_target", etc.
  axisX: { label: string; values: number[] };
  axisY: { label: string; values: number[] };
  data: number[][];
}

// ─── Diagnostic Codes ─────────────────────────────────────────────────

export interface DiagnosticCode {
  code: string;              // "P0301"
  description: string;
  status: "active" | "pending" | "historic";
}

// ─── Protocol Interface ───────────────────────────────────────────────

export interface EcuProtocol {
  /** Identify the connected ECU (firmware, board, features) */
  handshake(transport: EcuTransport, conn: Connection): Promise<EcuIdentity>;

  /** Read sensor channels in real-time */
  readSensors(
    transport: EcuTransport,
    conn: Connection,
    channels: string[]
  ): Promise<SensorChannel[]>;

  /** Read a calibration table from ECU */
  readCalibration(
    transport: EcuTransport,
    conn: Connection,
    tableId: string
  ): Promise<CalTable>;

  /** Write a calibration table to ECU */
  writeCalibration(
    transport: EcuTransport,
    conn: Connection,
    table: CalTable
  ): Promise<void>;

  /** Read diagnostic trouble codes */
  readDTCs(transport: EcuTransport, conn: Connection): Promise<DiagnosticCode[]>;

  /** Clear all diagnostic trouble codes */
  clearDTCs(transport: EcuTransport, conn: Connection): Promise<void>;

  /** Low-level command — for protocol extensions */
  sendCommand(
    transport: EcuTransport,
    conn: Connection,
    cmd: number,
    payload: Uint8Array
  ): Promise<Uint8Array>;
}
