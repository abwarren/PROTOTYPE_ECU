# TB-004 — RusEFIProtocolAdapter

> **Status:** ✅ Architecture Complete (architecture frozen 2026-07-03)
> **Prerequisite:** TB-003 (Architecture)
> **Next:** TB-005 (USB Transport) — capability delivery
> **Architecture:** ADR-0012 (Protocol Layer Separation)
> **Policy:** Architecture frozen. No redesign without ADR + Engineering Review.

---

## Objective

Architecture baseline established. RusEFIProtocolAdapter exists as the bridge
between EcuProtocol interface and rusEFI firmware.

This TB is complete as an ARCHITECTURE MILESTONE. Implementation verification
happens in TB-005 (USB Transport) where the adapter will carry real bytes.

**This TB gates TB-005.** Architecture must be stable before capability delivery begins.

---

## Architecture (FROZEN)

---

## Scope

### Deliverables

- [ ] `studio/adapters/RusEFIProtocolAdapter.ts` — complete stub with mock responses
- [ ] Documented rusEFI TS protocol command mapping
- [ ] CRC32 implementation for TS protocol framing
- [ ] Mock transport for testing without physical ECU
- [ ] Unit test: handshake produces valid EcuIdentity from mock response
- [ ] Unit test: readSensors parses TS output channels format
- [ ] Unit test: readCalibration parses TS page response format

### rusEFI TS Protocol Reference

| Command | Code | Direction | Payload | Response |
|---------|------|-----------|---------|----------|
| Query Signature (HELLO) | 'S' (0x53) | → ECU | Empty | TS text: "signature = rusEFI..." |
| Output Channels | 'O' (0x4F) | → ECU | Channel names | TS text: "rpm = 800\nclt = 85.3..." |
| Read Page | 'R' (0x52) | → ECU | Page ID | TS text: page data |
| Write Chunk | 'W' (0x57) | → ECU | Compressed page data | ACK |
| Burn | 'B' (0x42) | → ECU | Empty | ACK |
| Read DTCs | 'D' (0x44) | → ECU | Empty | TS text: "P0301,Misfire..." |
| Clear DTCs | 'C' (0x43) | → ECU | Empty | ACK |

### TS Protocol Frame Format

```
[byte 0]    Command code
[byte 1-2]  Payload length (little-endian uint16)
[byte 3]    Reserved (0x00)
[byte 4..N] Payload (TS text or compressed binary)
[byte N+1..N+4] CRC32 over payload
```

### Adapter Responsibilities

```
RusEFIProtocolAdapter implements EcuProtocol:

  handshake()      → Sends 'S' → Parses signature → Returns EcuIdentity
  readSensors()    → Sends 'O' → Parses key=value → Returns SensorChannel[]
  readCalibration()→ Sends 'R' → Parses page data → Returns CalTable
  writeCalibration()→ Sends 'W'+'B' → Waits for ACK → Returns void
  readDTCs()       → Sends 'D' → Parses CSV     → Returns DiagnosticCode[]
  clearDTCs()      → Sends 'C' → Waits for ACK → Returns void
  sendCommand()    → Generic — creates frame, sends, returns response
```

### Mock Transport

For TB-004, a MockUsbTransport implements EcuTransport and returns
pre-recorded rusEFI responses. This allows testing the adapter without
a physical ECU.

---

## QA Gates

| Gate | Criteria |
|------|----------|
| Adapter compiled | TypeScript compiles without errors |
| Handshake test | Mock transport returns "Hello" response → adapter produces valid EcuIdentity |
| Sensor test | Mock transport returns "rpm = 800\nclt = 85.3" → adapter produces SensorChannel[] |
| Architecture verified | Data flows: MockTransport → RusEFIProtocolAdapter → EcuService → test assertion |
| No firmware dependency | Adapter is the only class aware of rusEFI command codes |
| Documented | rusEFI command reference committed |
| Git committed | All .ts files committed |
