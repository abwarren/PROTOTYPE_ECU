// rusEFI Protocol Implementation — ADR-0012
// Handles binary framing, CRC, handshake, capability exchange.
// Implements EcuProtocol interface on top of EcuTransport.

import {
  EcuProtocol,
  EcuIdentity,
  SensorChannel,
  CalTable,
  DiagnosticCode,
} from "./EcuProtocol";
import { EcuTransport, Connection } from "./EcuTransport";

// ---- Binary Frame Format (rusEFI) ----
// Frame: [Magic: 2B][Length: 2B][Type: 1B][Seq: 1B][Payload: N][CRC: 2B]
// Magic: 0xAA 0x55
// Length: payload length (little-endian)
// Type: message type
// Seq: sequence number (monotonic)
// CRC: CRC-16 of [Type..Payload]

const MAGIC_1 = 0xaa;
const MAGIC_2 = 0x55;

// Message types
const MSG_HANDSHAKE = 0x01;
const MSG_HANDSHAKE_RESP = 0x81;
const MSG_TELEMETRY_STREAM = 0x02;
const MSG_TELEMETRY_REQUEST = 0x03;
const MSG_CAL_READ = 0x10;
const MSG_CAL_WRITE = 0x11;
const MSG_CAL_RESP = 0x90;
const MSG_DTC_READ = 0x20;
const MSG_DTC_RESP = 0xa0;
const MSG_DTC_CLEAR = 0x21;
const MSG_IDENTITY = 0x40;
const MSG_IDENTITY_RESP = 0xc0;

// CRC-16 table
function crc16(data: Uint8Array): number {
  let crc = 0xffff;
  for (const b of data) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return crc & 0xffff;
}

function encodeFrame(type: number, seq: number, payload: Uint8Array): Uint8Array {
  const buf = new Uint8Array(6 + payload.length + 2);
  buf[0] = MAGIC_1;
  buf[1] = MAGIC_2;
  buf[2] = payload.length & 0xff; // length low
  buf[3] = (payload.length >> 8) & 0xff; // length high
  buf[4] = type;
  buf[5] = seq;
  buf.set(payload, 6);

  // CRC over [type..payload]
  const crcData = new Uint8Array(1 + 1 + payload.length);
  crcData[0] = type;
  crcData[1] = seq;
  crcData.set(payload, 2);
  const crc = crc16(crcData);
  buf[buf.length - 2] = (crc >> 8) & 0xff;
  buf[buf.length - 1] = crc & 0xff;

  return buf;
}

function decodeFrame(raw: Uint8Array): {
  type: number;
  seq: number;
  payload: Uint8Array;
} | null {
  if (raw.length < 8) return null;
  if (raw[0] !== MAGIC_1 || raw[1] !== MAGIC_2) return null;

  const payloadLen = raw[2] | (raw[3] << 8);
  const expectedLen = 6 + payloadLen + 2;
  if (raw.length < expectedLen) return null;

  const type = raw[4];
  const seq = raw[5];
  const payload = raw.slice(6, 6 + payloadLen);

  // Verify CRC
  const crcData = new Uint8Array(raw.slice(4, 6 + payloadLen));
  const expectedCrc = (raw[expectedLen - 2] << 8) | raw[expectedLen - 1];
  const actualCrc = crc16(crcData);
  if (expectedCrc !== actualCrc) return null;

  return { type, seq, payload };
}

// ---- Text Encoder/Decoder ----
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ---- rusEFI Protocol Implementation ----
export class RusEFIProtocol implements EcuProtocol {
  private seq = 0;

  private nextSeq(): number {
    this.seq = (this.seq + 1) & 0xff;
    return this.seq;
  }

  async handshake(transport: EcuTransport, conn: Connection): Promise<EcuIdentity> {
    // Send handshake
    const handshakeFrame = encodeFrame(MSG_HANDSHAKE, this.nextSeq(), new Uint8Array());
    const response = await transport.sendFrame(conn, handshakeFrame);
    const decoded = decodeFrame(response);

    if (!decoded || decoded.type !== MSG_HANDSHAKE_RESP) {
      // Fallback: try identity command directly
      return this.readIdentity(transport, conn);
    }

    try {
      return JSON.parse(decoder.decode(decoded.payload)) as EcuIdentity;
    } catch {
      return this.readIdentity(transport, conn);
    }
  }

  private async readIdentity(transport: EcuTransport, conn: Connection): Promise<EcuIdentity> {
    const frame = encodeFrame(MSG_IDENTITY, this.nextSeq(), new Uint8Array());
    const response = await transport.sendFrame(conn, frame);
    const decoded = decodeFrame(response);

    if (decoded && decoded.type === MSG_IDENTITY_RESP) {
      try {
        return JSON.parse(decoder.decode(decoded.payload)) as EcuIdentity;
      } catch {
        // fall through
      }
    }

    // Return generic identity if ECU doesn't respond with structured data
    return {
      vendor: "rusEFI",
      board: "unknown",
      firmware: "unknown",
      protocol: 1,
      gitSha: "unknown",
      serial: "unknown",
      features: ["realtime"],
    };
  }

  async readSensors(
    transport: EcuTransport,
    conn: Connection,
    channels: string[],
  ): Promise<SensorChannel[]> {
    const payload = encoder.encode(JSON.stringify(channels));
    const frame = encodeFrame(MSG_TELEMETRY_REQUEST, this.nextSeq(), payload);
    const response = await transport.sendFrame(conn, frame);
    const decoded = decodeFrame(response);

    if (!decoded) return [];

    try {
      return JSON.parse(decoder.decode(decoded.payload)) as SensorChannel[];
    } catch {
      return [];
    }
  }

  async readCalibration(
    transport: EcuTransport,
    conn: Connection,
    tableId: string,
  ): Promise<CalTable> {
    const payload = encoder.encode(tableId);
    const frame = encodeFrame(MSG_CAL_READ, this.nextSeq(), payload);
    const response = await transport.sendFrame(conn, frame);
    const decoded = decodeFrame(response);

    if (decoded && decoded.type === MSG_CAL_RESP) {
      return JSON.parse(decoder.decode(decoded.payload)) as CalTable;
    }

    throw new Error(`Failed to read calibration table: ${tableId}`);
  }

  async writeCalibration(
    transport: EcuTransport,
    conn: Connection,
    table: CalTable,
  ): Promise<void> {
    const payload = encoder.encode(JSON.stringify(table));
    const frame = encodeFrame(MSG_CAL_WRITE, this.nextSeq(), payload);
    const response = await transport.sendFrame(conn, frame);
    const decoded = decodeFrame(response);

    if (!decoded || decoded.type !== MSG_CAL_RESP) {
      throw new Error("Calibration write not acknowledged");
    }
  }

  async readDTCs(transport: EcuTransport, conn: Connection): Promise<DiagnosticCode[]> {
    const frame = encodeFrame(MSG_DTC_READ, this.nextSeq(), new Uint8Array());
    const response = await transport.sendFrame(conn, frame);
    const decoded = decodeFrame(response);

    if (decoded && decoded.type === MSG_DTC_RESP) {
      try {
        return JSON.parse(decoder.decode(decoded.payload)) as DiagnosticCode[];
      } catch {
        return [];
      }
    }
    return [];
  }

  async clearDTCs(transport: EcuTransport, conn: Connection): Promise<void> {
    const frame = encodeFrame(MSG_DTC_CLEAR, this.nextSeq(), new Uint8Array());
    await transport.sendFrame(conn, frame);
  }

  async sendCommand(
    transport: EcuTransport,
    conn: Connection,
    cmd: number,
    payload: Uint8Array,
  ): Promise<Uint8Array> {
    const frame = encodeFrame(cmd, this.nextSeq(), payload);
    return transport.sendFrame(conn, frame);
  }
}

// ---- Transport Index ----
export { UsbTransport } from "./UsbTransport";
