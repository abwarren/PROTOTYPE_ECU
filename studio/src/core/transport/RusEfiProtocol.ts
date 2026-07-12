// RusEfiProtocol — concrete Protocol implementation for rusEFI TunerStudio binary protocol
// Implements EcuProtocol interface (ADR-0012)
// Communicates through EcuTransport, never touches USB/CAN directly.

import {
  EcuProtocol,
  EcuIdentity,
  SensorChannel,
  CalTable,
  DiagnosticCode,
} from "./EcuProtocol";
import { EcuTransport, Connection } from "./EcuTransport";
import { UsbTransport } from "./UsbTransport";

// ---- TunerStudio Protocol Constants ----
const TS_HELLO_COMMAND = 0x53; // 'S' — query ECU signature
const TS_OUTPUT_COMMAND = 0x4f; // 'O' — read output channels
const TS_READ_COMMAND = 0x52; // 'R' — read calibration page
// TB-004+ will use: TS_CHUNK_WRITE_COMMAND (0x57 'W'), TS_BURN_COMMAND (0x42 'B')
const TS_GET_TEXT = 0x47; // 'G' — get text protocol (returns \n-delimited text)
const TS_CHUNK_WRITE_COMMAND = 0x57; // 'W' — write calibration data
const TS_BURN_COMMAND = 0x42; // 'B' — commit written data to flash

// rusEFI calibration page IDs
const TS_PAGE_SETTINGS = 0x0000;
// TB-005+ will use: TS_PAGE_SCATTER_OFFSETS (0x0100), TS_PAGE_LTFT_TRIMS (0x0200), TS_PAGE_SECOND_TABLES (0x0300)

// ---- Board-Aware Channel Layout ----

interface ChannelDef {
  offset: number;
  size: "u16" | "s16";
  scale: number;
  unit: string;
  name: string;
}

interface BoardChannelLayout {
  boardPattern: RegExp; // matches board name from signature
  channels: Record<string, ChannelDef>;
}

const BOARD_LAYOUTS: BoardChannelLayout[] = [
  {
    // f407-discovery — validated against rusefi_f407-discovery.ini output channels
    boardPattern: /f407/,
    channels: {
      rpm: { offset: 4, size: "u16", scale: 1, unit: "rpm", name: "RPM" },
      batteryVoltage: { offset: 40, size: "u16", scale: 0.001, unit: "V", name: "Battery Voltage" },
      coolantTemp: { offset: 16, size: "s16", scale: 0.01, unit: "°C", name: "Coolant Temp" },
      intakeAirTemp: { offset: 18, size: "s16", scale: 0.01, unit: "°C", name: "Intake Air Temp" },
      throttlePos: { offset: 24, size: "s16", scale: 0.01, unit: "%", name: "Throttle Position" },
      map: { offset: 34, size: "u16", scale: 1 / 30, unit: "kPa", name: "MAP" },
      lambdaValue: { offset: 38, size: "u16", scale: 0.0001, unit: "λ", name: "Lambda" },
      oilPressure: { offset: 44, size: "u16", scale: 1 / 30, unit: "kPa", name: "Oil Pressure" },
    },
  },
  {
    // proteus layout — NOT VALIDATED against current firmware
    boardPattern: /proteus/i,
    channels: {
      rpm: { offset: 0, size: "u16", scale: 1, unit: "rpm", name: "RPM" },
      batteryVoltage: { offset: 40, size: "u16", scale: 0.001, unit: "V", name: "Battery Voltage" },
      coolantTemp: { offset: 16, size: "s16", scale: 0.01, unit: "°C", name: "Coolant Temp" },
      intakeAirTemp: { offset: 18, size: "s16", scale: 0.01, unit: "°C", name: "Intake Air Temp" },
      throttlePos: { offset: 24, size: "s16", scale: 0.01, unit: "%", name: "Throttle Position" },
      map: { offset: 34, size: "u16", scale: 1 / 30, unit: "kPa", name: "MAP" },
      lambdaValue: { offset: 38, size: "u16", scale: 0.0001, unit: "λ", name: "Lambda" },
      oilPressure: { offset: 44, size: "u16", scale: 1 / 30, unit: "kPa", name: "Oil Pressure" },
    },
  },
];

export class RusEfiProtocol implements EcuProtocol {
  private transport: UsbTransport;
  private detectedLayout: BoardChannelLayout | null = null;

  constructor(transport: UsbTransport) {
    this.transport = transport;
  }

  // ---- Handshake — identify the connected ECU ----

  async handshake(
    _transport: EcuTransport,
    conn: Connection
  ): Promise<EcuIdentity> {
    const devicePath = conn.device.path;

    // Step 1: Send plain-text 'S' to get the raw signature
    // rusEFI responds with: "rusEFI <board> <year>.<month>.<day>.<signature>\n"
    const rawSig = await this.transport.querySignature(devicePath);
    console.log("[RusEfiProtocol] Raw signature:", rawSig);

    // Step 2: Parse the signature into EcuIdentity (also sets detectedLayout)
    const identity = this.parseSignature(rawSig);

    // Step 3: Send CRC-framed 'S' to confirm protocol mode
    // (After this, all communication uses CRC framing)
    try {
      const crcResp = await this.transport.sendCommand(
        devicePath,
        TS_HELLO_COMMAND
      );
      const crcSig = new TextDecoder().decode(crcResp);
      console.log("[RusEfiProtocol] CRC signature:", crcSig);
    } catch (err) {
      console.warn("[RusEfiProtocol] CRC handshake failed, using plain-text:", err);
    }

    return identity;
  }

  // ---- Read sensor channels in real-time ----

  async readSensors(
    _transport: EcuTransport,
    conn: Connection,
    channels: string[]
  ): Promise<SensorChannel[]> {
    const devicePath = conn.device.path;

    // Build output channels command payload: offset(2) + count(2)
    const offset = 0;
    const count = 1024; // standard rusEFI output channel block size
    const payload = new Uint8Array(4);
    const view = new DataView(payload.buffer);
    view.setUint16(0, offset, false); // big-endian
    view.setUint16(2, count, false);

    const data = await this.transport.sendCommand(
      devicePath,
      TS_OUTPUT_COMMAND,
      payload
    );

    // Parse the live data response
    // rusEFI output channels are a packed struct — we parse known offsets
    return this.parseLiveData(data, channels);
  }

  // ---- Calibration read ----

  async readCalibration(
    _transport: EcuTransport,
    conn: Connection,
    _tableId: string
  ): Promise<CalTable> {
    const devicePath = conn.device.path;

    // Read from settings page (0x00)
    const page = TS_PAGE_SETTINGS;
    const offset = 0;
    const count = 288; // rusEFI settings page size for f407-discovery

    const payload = new Uint8Array(6);
    const view = new DataView(payload.buffer);
    view.setUint16(0, page, false); // big-endian
    view.setUint16(2, offset, false);
    view.setUint16(4, count, false);

    const data = await this.transport.sendCommand(
      devicePath,
      TS_READ_COMMAND,
      payload
    );

    // Return as a raw calibration table (parsing deferred to calibration editor)
    return {
      id: _tableId,
      name: _tableId,
      type: "raw",
      axisX: { label: "offset", values: [] },
      axisY: { label: "offset", values: [] },
      data: [[data.length]], // placeholder
    };
  }

  async writeCalibration(
    _transport: EcuTransport,
    conn: Connection,
    table: CalTable
  ): Promise<void> {
    const devicePath = conn.device.path;
    const page = TS_PAGE_SETTINGS;

    // Flatten the 2D table data into a byte array (uint16 LE)
    // rusEFI stores calibration tables as uint16_t values in little-endian
    const flatValues: number[] = [];
    for (const row of table.data) {
      for (const val of row) {
        // Clamp to uint16 range
        const clamped = Math.max(0, Math.min(65535, Math.round(val)));
        flatValues.push(clamped & 0xff);        // low byte
        flatValues.push((clamped >> 8) & 0xff); // high byte
      }
    }

    const dataBytes = new Uint8Array(flatValues);
    const offset = 0;
    const count = dataBytes.length;

    // Step 1: Chunk Write — send the data to the ECU
    // Payload: page(2) + offset(2) + count(2) + data(N)
    const writePayload = new Uint8Array(2 + 2 + 2 + count);
    const writeView = new DataView(writePayload.buffer);
    writeView.setUint16(0, page, false);       // big-endian
    writeView.setUint16(2, offset, false);     // big-endian
    writeView.setUint16(4, count, false);      // big-endian
    writePayload.set(dataBytes, 6);

    console.log(
      `[RusEfiProtocol] Writing ${count} bytes to page ${page}, offset ${offset}`
    );

    await this.transport.sendCommand(
      devicePath,
      TS_CHUNK_WRITE_COMMAND,
      writePayload
    );

    // Step 2: Burn — commit the written data to flash
    // Payload: page(2)
    const burnPayload = new Uint8Array(2);
    const burnView = new DataView(burnPayload.buffer);
    burnView.setUint16(0, page, false); // big-endian

    console.log(`[RusEfiProtocol] Burning page ${page}`);
    await this.transport.sendCommand(
      devicePath,
      TS_BURN_COMMAND,
      burnPayload
    );

    console.log("[RusEfiProtocol] Calibration write + burn complete");
  }

  // ---- Diagnostics ----

  async readDTCs(
    _transport: EcuTransport,
    conn: Connection
  ): Promise<DiagnosticCode[]> {
    const devicePath = conn.device.path;

    try {
      // Use text protocol command to get human-readable status
      const data = await this.transport.sendCommand(
        devicePath,
        TS_GET_TEXT
      );
      const text = new TextDecoder().decode(data);

      // Parse warning/error lines
      const codes: DiagnosticCode[] = [];
      for (const line of text.split("\n")) {
        if (line.trim()) {
          // Extract warning codes from lines like "warning: CUSTOM_OBD_XX"
          const match = line.match(/warning.*?([A-Z]\d+|[A-Z_]+)/i);
          codes.push({
            code: match ? match[1] : "TEXT",
            description: line.trim(),
            status: "active",
          });
        }
      }
      return codes;
    } catch {
      return [];
    }
  }

  async clearDTCs(
    _transport: EcuTransport,
    _conn: Connection
  ): Promise<void> {
    // rusEFI doesn't have a DTC clear command — faults clear on reboot
    console.log("[RusEfiProtocol] clearDTCs — not supported by rusEFI");
  }

  // ---- Low-level command ----

  async sendCommand(
    _transport: EcuTransport,
    conn: Connection,
    cmd: number,
    payload: Uint8Array
  ): Promise<Uint8Array> {
    return this.transport.sendCommand(conn.device.path, cmd, payload);
  }

  // ---- Signature Parsing ----

  /**
   * Parse a rusEFI signature string into EcuIdentity.
   *
   * Expected format:
   *   "rusEFI <board_name> <year>.<month>.<day>.<firmware_version>"
   *
   * Example:
   *   "rusEFI f407-discovery 2024.06.15.release_20240615"
   *
   * Also sets detectedLayout based on the board name.
   */
  private parseSignature(raw: string): EcuIdentity {
    // Remove null terminators and whitespace
    const sig = raw.replace(/\0/g, "").trim();

    // Pattern: "rusEFI <board> <version>"
    const re =
      /rus(?:Efi|EFI|efi)\s+(\S+)\s+(\d{4}\.\d{2}\.\d{2}\.\S*)/;
    const match = sig.match(re);

    const board = match ? match[1] : "unknown";
    const firmware = match ? match[2] : "0.0.0";

    // Detect board layout from the board name
    this.detectedLayout =
      BOARD_LAYOUTS.find((layout) => layout.boardPattern.test(board)) ?? null;
    if (this.detectedLayout) {
      console.log(
        `[RusEfiProtocol] Detected board layout: ${board} (${Object.keys(this.detectedLayout.channels).length} channels)`
      );
    } else {
      console.warn(
        `[RusEfiProtocol] No matching board layout for "${board}" — sensors will be empty`
      );
    }

    return {
      vendor: "rusEFI",
      board,
      firmware,
      protocol: 1,
      gitSha: firmware, // rusEFI uses date.version for firmware identity
      serial: sig, // full signature as serial identifier
      features: this.detectFeatures(board, sig),
    };
  }

  private detectFeatures(board: string, sig: string): string[] {
    const features: string[] = [];
    if (sig.includes("wideband")) features.push("wideband");
    if (sig.includes("CAN")) features.push("can");
    if (sig.includes("ETB") || sig.includes("ETC")) features.push("etc");
    if (board.includes("f7") || board.includes("h7")) features.push("high_perf");
    features.push("usb");
    return features;
  }

  // ---- Live Data Parsing ----

  /**
   * Parse rusEFI output channel binary data into sensor readings.
   *
   * Uses the board layout detected during handshake to determine the correct
   * offsets, sizes, and scales for each sensor channel. This ensures correct
   * readings regardless of which rusEFI board is connected.
   *
   * The rusEFI output channels struct (tsOutputChannels / output_channels_s)
   * is defined in firmware/console/binary/output_channels.txt and varies by
   * board (f407-discovery, proteus, etc.).
   */
  private parseLiveData(
    data: Uint8Array,
    _filter: string[]
  ): SensorChannel[] {
    const channels: SensorChannel[] = [];
    const now = Date.now();
    const view = new DataView(
      data.buffer,
      data.byteOffset,
      data.byteLength
    );

    // If no board layout was detected during handshake, return empty
    if (!this.detectedLayout) {
      console.warn("[RusEfiProtocol] parseLiveData: no detected board layout");
      return channels;
    }

    // Parse each known channel using the detected board's layout
    for (const [id, def] of Object.entries(this.detectedLayout.channels)) {
      const endOffset = def.size === "u16" ? def.offset + 2 : def.offset + 2;
      if (data.length < endOffset) {
        // Not enough data — skip this channel rather than crash
        continue;
      }

      let raw: number;
      try {
        if (def.size === "u16") {
          raw = view.getUint16(def.offset, true); // little-endian (ARM target)
        } else {
          raw = view.getInt16(def.offset, true); // little-endian
        }
      } catch (err) {
        console.warn(`[RusEfiProtocol] Failed to parse channel "${id}" at offset ${def.offset}:`, err);
        continue;
      }

      channels.push({
        id,
        name: def.name,
        value: raw * def.scale,
        unit: def.unit,
        timestamp: now,
      });
    }

    // Filter if specific channels requested
    if (_filter.length > 0) {
      return channels.filter((c) => _filter.includes(c.id));
    }

    return channels;
  }
}
