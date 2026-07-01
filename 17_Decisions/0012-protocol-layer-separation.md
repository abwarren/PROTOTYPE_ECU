# ADR-0012: Protocol Layer Separation — Three-Layer Communication Architecture

## Status

Accepted

## Context

ADR-0010 established the Transport Abstraction Layer — a trait-based interface that prevents Studio from coupling to USB directly. ADR-0011 established Repository trait interfaces for storage. Between them sits a gap: the communication protocol.

Currently, TB-003 was scoped as "Communication Layer (Transport Abstraction)" — combining protocol framing and byte transport into one concern. However, these are distinct responsibilities with different change rates:

- **Transport changes** when you switch physical interfaces (USB → CAN → BLE). This is infrastructure.
- **Protocol changes** when you upgrade the ECU firmware or add new message types. This is product.

Coupling them forces you to modify transport implementations when the protocol evolves, and vice versa.

## Decision

Adopt a **three-layer communication architecture**:

```
                 Prototype Studio (UI)
                        │
                        ▼
               ECU Service Layer
                        │  Business logic — connect, read sensors,
                        │  write calibration, read DTCs, flash firmware
                        ▼
               Protocol Layer
                        │  Packet framing, CRC, handshake,
                        │  capability negotiation, command encoding,
                        │  response parsing, protocol errors
                        ▼
               Transport Layer
                        │  Moving bytes — USB, CAN, Ethernet, BLE
        ┌────────┬────────┬────────┬──────────┐
        │        │        │        │          │
       USB      CAN    Ethernet   BLE    Cloud Relay
```

### Layer Responsibilities

| Layer | Knows About | Does NOT Know About |
|-------|-------------|---------------------|
| **ECU Service** | Calibrations, sensors, DTCs, firmware versions | USB, CAN, packet framing |
| **Protocol** | Frame types, CRC, handshake sequences, capability flags | USB, CAN, calibration tables |
| **Transport** | Bytes, connection lifecycle, device paths | ECU protocol, tuning concepts |

### Principle

> Transport moves bytes. Protocol understands ECU messages. Services implement business workflows. UI never talks directly to protocol or transport.

### Interface Design

```typescript
// Protocol layer — understands ECU message format
interface EcuProtocol {
  // High-level operations that services call
  handshake(transport: EcuTransport, conn: Connection): Promise<EcuIdentity>;
  readSensors(transport: EcuTransport, conn: Connection, channels: string[]): Promise<SensorData>;
  writeCalibration(transport: EcuTransport, conn: Connection, table: CalTable): Promise<void>;
  readCalibration(transport: EcuTransport, conn: Connection, tableId: string): Promise<CalTable>;
  readDTCs(transport: EcuTransport, conn: Connection): Promise<DiagnosticCode[]>;
  // Low-level — for protocol extensions
  sendCommand(transport: EcuTransport, conn: Connection, cmd: number, payload: Uint8Array): Promise<Uint8Array>;
}

// Transport layer — moves bytes (ADR-0010)
interface EcuTransport {
  discover(): Promise<EcuDevice[]>;
  connect(device: EcuDevice): Promise<Connection>;
  disconnect(connection: Connection): Promise<void>;
  sendFrame(connection: Connection, frame: Uint8Array): Promise<Uint8Array>;
  heartbeat(connection: Connection): Promise<boolean>;
}

// ECU Service layer — business logic that the UI calls
class EcuService {
  constructor(protocol: EcuProtocol, transport: EcuTransport);
  connect(): Promise<EcuIdentity>;
  getLiveData(channels: string[]): AsyncIterable<SensorData>;
  loadCalibration(tableId: string): Promise<CalTable>;
  saveCalibration(table: CalTable): Promise<void>;
  getFaultCodes(): Promise<DiagnosticCode[]>;
}
```

### ECU Identity

Every ECU returns metadata on handshake:

```json
{
  "vendor": "Prototype ECU",
  "board": "S32K344",
  "firmware": "0.1.0",
  "protocol": 1,
  "gitSha": "abc1234",
  "serial": "PE-2026-0001",
  "features": ["logging", "flash", "realtime", "can"]
}
```

This lets Studio adapt its UI for the connected ECU — enabling/disabling features, warning about firmware incompatibility, and displaying ECU identity in the status bar.

### Benefits

- Adding a new transport (CAN, BLE) requires only a Transport implementation — Protocol and Services are unchanged
- Adding a new ECU feature (new sensor, new DTC) requires only Protocol + Service updates — Transport is unchanged
- UI never imports protocol framing code or transport device paths
- Protocol can be tested with a mock Transport (byte arrays, no hardware)
- Services can be tested with a mock Protocol (pre-canned sensor data)
- Future ECU families: swap Protocol implementation, reuse Transport and Services

### Relationship to Existing ADRs

| ADR | Layer | This ADR |
|-----|-------|----------|
| ADR-0010 | Transport | ADR-0012 adds Protocol above it |
| ADR-0011 | Storage | Orthogonal — repositories are for persistence |
| ADR-0009 | Platform Strategy | ADR-0012 formalizes the Studio/firmware interface |

## Consequences

### Positive
- Three clean layers with well-defined interfaces
- Each layer testable in isolation with mocks
- Transport changes don't ripple into business logic
- Protocol changes don't require USB driver modifications
- Future ECU families: swap protocol, keep everything else

### Negative
- One additional abstraction (Protocol layer) — 6 interfaces vs 1
- Slightly more code for the initial USB-only implementation
- Requires discipline to keep layers separated

### Mitigations
- The Protocol interface is deliberately small (6 methods for V1)
- The three-layer pattern is standard in networking (OSI model) — engineers understand it
- The abstraction pays for itself on the first new transport or protocol version

## Priority

P0 — must be in place before TB-003 implementation. The layers are defined as interfaces; USB is the first implementation.
