/**
 * RusEFIProtocolAdapter — implements EcuProtocol for rusEFI firmware
 *
 * This is the ONLY class in the Studio that knows about rusEFI protocol details.
 * All other layers communicate through EcuProtocol interface.
 *
 * Architecture:
 *   7100CPT Studio → EcuService → EcuProtocol (interface) ← RusEFIProtocolAdapter → UsbTransport → rusEFI
 *
 * If firmware changes (rusEFI → 7100CPT native, Haltech, Link, Bosch),
 * create a new adapter implementing EcuProtocol. Studio remains unchanged.
 *
 * Status: Stub implementation. Maps documented rusEFI packet commands.
 *         TODO: Implement real TS protocol parsing when TB-005 (USB Communication) begins.
 */

import { EcuProtocol, EcuIdentity, SensorChannel, CalTable, DiagnosticCode } from "../core/transport/EcuProtocol";
import { EcuTransport, Connection } from "../core/transport/EcuTransport";

// ─── rusEFI Command IDs ────────────────────────────────────────────────
// Reference: rusEFI firmware/console/binary/tunerstudio_io.h
// Real implementations will use rusEFI's TS (TunerStudio) protocol framing.

const RUSEFI_CMD = {
  HELLO:              0x53,  // 'S' — query ECU signature
  OUTPUT_CHANNELS:    0x4F,  // 'O' — read output channels (live data)
  READ_PAGE:          0x52,  // 'R' — read calibration page
  WRITE_CHUNK:        0x57,  // 'W' — write calibration chunk
  BURN:               0x42,  // 'B' — burn calibration to flash
  READ_DTCS:          0x44,  // 'D' — read diagnostic trouble codes
  CLEAR_DTCS:         0x43,  // 'C' — clear DTCs
} as const;

// ─── rusEFI Signature Response (HELLO command) ─────────────────────────
interface RusEFISignature {
  signature: string;       // "rusEFI 2026.07"
  tsSignature: string;     // "rusEFI master.2026.07.01.f407-discovery"
  maxPacketSize: number;
  firmwareVersion: string;
  boardType: string;
  buildTimestamp: number;
}

/**
 * Parses a rusEFI TS protocol text response into key-value pairs.
 * Format: "key = value\nkey = value\n..."
 */
function parseTSResponse(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0) {
      const key = line.substring(0, eq).trim();
      const value = line.substring(eq + 1).trim();
      result[key] = value;
    }
  }
  return result;
}

/**
 * Creates a rusEFI TS protocol command frame.
 * Format: [command_code, payload_length_lo, payload_length_hi, ...payload, CRC32]
 * CRC32 is computed over payload only.
 */
function createTSFrame(command: number, payload: Uint8Array): Uint8Array {
  const len = payload.length;
  const frame = new Uint8Array(4 + len + 4); // cmd + len16 + payload + crc32
  frame[0] = command;
  frame[1] = len & 0xFF;
  frame[2] = (len >> 8) & 0xFF;
  frame[3] = 0x00; // reserved
  frame.set(payload, 4);
  // CRC32 placeholder — real implementation uses actual CRC32 over payload
  // For stub: zero CRC
  return frame;
}

// ─── RusEFIProtocolAdapter ─────────────────────────────────────────────

export class RusEFIProtocolAdapter implements EcuProtocol {
  readonly name = "RusEFIProtocolAdapter";
  readonly firmware = "rusEFI";

  /**
   * Handshake — send HELLO command, parse rusEFI signature response.
   * Maps to rusEFI's "S" (Query Signature) command.
   */
  async handshake(transport: EcuTransport, conn: Connection): Promise<EcuIdentity> {
    const frame = createTSFrame(RUSEFI_CMD.HELLO, new Uint8Array(0));
    const response = await transport.sendFrame(conn, frame);
    const text = new TextDecoder().decode(response);

    const sig = parseTSResponse(text);

    return {
      vendor: "rusEFI",
      board: sig.boardType ?? "unknown",
      firmware: sig.firmwareVersion ?? "unknown",
      protocol: 1,
      gitSha: sig.buildTimestamp ?? "unknown",
      serial: sig.signature ?? "unknown",
      features: ["sensors", "calibration", "diagnostics"],
    };
  }

  /**
   * Read sensor channels using rusEFI's output channels command.
   * Maps to rusEFI's "O" (Output Channels) command.
   */
  async readSensors(
    transport: EcuTransport,
    conn: Connection,
    channels: string[]
  ): Promise<SensorChannel[]> {
    // Build channel list payload: "channel1,channel2,..."
    const payload = new TextEncoder().encode(channels.join(","));
    const frame = createTSFrame(RUSEFI_CMD.OUTPUT_CHANNELS, payload);
    const response = await transport.sendFrame(conn, frame);
    const text = new TextDecoder().decode(response);

    // Parse TS response: "channel = value"
    const data = parseTSResponse(text);
    const result: SensorChannel[] = [];

    for (const [id, valueStr] of Object.entries(data)) {
      const value = parseFloat(valueStr);
      if (!isNaN(value)) {
        result.push({
          id,
          name: id,                   // TODO: map channel ID to human-readable name
          value,
          unit: "raw",                // TODO: resolve unit from channel metadata
          timestamp: Date.now(),
        });
      }
    }

    return result;
  }

  /**
   * Read a calibration table using rusEFI's page read command.
   * Maps to rusEFI's "R" (Read Page) command.
   */
  async readCalibration(
    transport: EcuTransport,
    conn: Connection,
    tableId: string
  ): Promise<CalTable> {
    const payload = new TextEncoder().encode(tableId);
    const frame = createTSFrame(RUSEFI_CMD.READ_PAGE, payload);
    const response = await transport.sendFrame(conn, frame);
    const text = new TextDecoder().decode(response);

    // Parse TS page response — format TBD by actual firmware
    // Stub: return empty table structure
    return {
      id: tableId,
      name: tableId,
      type: "unknown",
      axisX: { label: "x", values: [] },
      axisY: { label: "y", values: [] },
      data: [],
    };
  }

  /**
   * Write a calibration table using rusEFI's chunk write + burn sequence.
   * Maps to rusEFI's "W" (Write Chunk) + "B" (Burn) commands.
   */
  async writeCalibration(
    transport: EcuTransport,
    conn: Connection,
    table: CalTable
  ): Promise<void> {
    // Step 1: Write data chunks
    const payload = new TextEncoder().encode(JSON.stringify(table));
    const writeFrame = createTSFrame(RUSEFI_CMD.WRITE_CHUNK, payload);
    await transport.sendFrame(conn, writeFrame);

    // Step 2: Burn to flash
    const burnFrame = createTSFrame(RUSEFI_CMD.BURN, new Uint8Array(0));
    await transport.sendFrame(conn, burnFrame);
  }

  /**
   * Read diagnostic trouble codes.
   * Maps to rusEFI's "D" (Read DTCs) command.
   */
  async readDTCs(transport: EcuTransport, conn: Connection): Promise<DiagnosticCode[]> {
    const frame = createTSFrame(RUSEFI_CMD.READ_DTCS, new Uint8Array(0));
    const response = await transport.sendFrame(conn, frame);
    const text = new TextDecoder().decode(response);

    // Parse TS response format: "P0301,Misfire Cylinder 1,active"
    const codes: DiagnosticCode[] = [];
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(",");
      if (parts.length >= 3) {
        codes.push({
          code: parts[0].trim(),
          description: parts[1].trim(),
          status: parts[2].trim() as "active" | "pending" | "historic",
        });
      }
    }

    return codes;
  }

  /**
   * Clear all diagnostic trouble codes.
   * Maps to rusEFI's "C" (Clear DTCs) command.
   */
  async clearDTCs(transport: EcuTransport, conn: Connection): Promise<void> {
    const frame = createTSFrame(RUSEFI_CMD.CLEAR_DTCS, new Uint8Array(0));
    await transport.sendFrame(conn, frame);
  }

  /**
   * Send a raw command for protocol extensions.
   * Exposes low-level access for commands not yet in the EcuProtocol interface.
   */
  async sendCommand(
    transport: EcuTransport,
    conn: Connection,
    cmd: number,
    payload: Uint8Array
  ): Promise<Uint8Array> {
    const frame = createTSFrame(cmd, payload);
    return transport.sendFrame(conn, frame);
  }
}

// ─── Exports ───────────────────────────────────────────────────────────

export { RUSEFI_CMD };
export type { RusEFISignature };
