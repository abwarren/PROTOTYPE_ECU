# TB-003 — Communication Layer Architecture

> **Status:** ✅ Architecture Complete / 🟡 Implementation Partial / ⬚ Verification Not Started
> **Date:** 2026-07-03
> **Prerequisite:** TB-002A (Application Core)
> **Architecture:** ADR-0010 (Transport Abstraction), ADR-0012 (Protocol Layer Separation)

---

## Objective

Define and validate the three-layer communication architecture: Transport,
Protocol, and Service. The architecture is proven when a concrete adapter
(RusEFIProtocolAdapter) successfully handshakes with a connected ECU.

---

## Architecture (✅ 100%)

```
7100CPT Studio (UI)
        │
        ▼
  EcuService                ← Business logic (connect, get identity, read sensors)
        │
        ▼
  EcuProtocol (interface)   ← Protocol contract (handshake, sensors, calibration, DTCs)
        ▲
        │
  RusEFIProtocolAdapter     ← CONCRETE IMPLEMENTATION — understands rusEFI TS protocol
        │
        ▼
  EcuTransport (interface)  ← Transport contract (discover, connect, sendFrame, heartbeat)
        ▲
        │
  UsbTransport              ← CONCRETE IMPLEMENTATION — USB CDC raw bytes
        │
        ▼
  rusEFI Firmware
```

### Delivered Interfaces (TB-002A)

| Layer | File | Status |
|-------|------|--------|
| Transport interface | `studio/core/transport/EcuTransport.ts` | ✅ |
| Protocol interface | `studio/core/transport/EcuProtocol.ts` | ✅ |
| Service layer | `studio/core/services/EcuService.ts` | ✅ |
| Adapter | `studio/adapters/RusEFIProtocolAdapter.ts` | 🟡 Stub |

### Design Intent

- **Transport moves bytes.** USB, CAN, BLE, Ethernet — all implement EcuTransport.
- **Protocol understands ECU messages.** Different firmware = different adapters.
- **Service implements business workflows.** UI talks only to Service.
- **UI never touches Transport or Protocol directly.**

### Future Adapters

```
EcuProtocol interface
    ├── RusEFIProtocolAdapter      ← rusEFI firmware (current)
    ├── 7100CPTProtocolAdapter     ← 7100CPT native firmware (future)
    ├── HaltechProtocolAdapter     ← Haltech Elite (future)
    ├── LinkProtocolAdapter        ← Link ECU (future)
    └── BoschProtocolAdapter       ← Bosch Motorsport (future)
```

---

## Implementation (🟡 20%)

| Component | Status | Notes |
|-----------|--------|-------|
| EcuTransport interface | ✅ | discover, connect, disconnect, sendFrame, heartbeat, onStateChange |
| EcuProtocol interface | ✅ | handshake, readSensors, readCalibration, writeCalibration, readDTCs, clearDTCs, sendCommand |
| EcuService | ✅ | discover, connect, disconnect, getLiveData, loadCalibration, saveCalibration, getFaultCodes, clearFaultCodes |
| RusEFIProtocolAdapter | 🟡 Stub | Command IDs mapped, TS protocol framing scaffolding, handshake/readSensors/readCalibration stubs defined |
| UsbTransport | ⬚ | No concrete transport implementation |
| rusEFI command reference | 🟡 Partial | Command IDs documented (HELLO, OUTPUT_CHANNELS, READ_PAGE, WRITE_CHUNK, BURN, READ_DTCS, CLEAR_DTCS). Full TS protocol framing TBD. |

---

## Verification (⬚ 0%)

| Gate | Status |
|------|--------|
| Adapter creates valid TS protocol frames | ⬚ |
| End-to-end handshake with rusEFI | ⬚ |
| Live sensor data parsed correctly | ⬚ |
| Calibration read/write round-trip | ⬚ |

---

## Next

**TB-004: RusEFIProtocolAdapter** — Complete stub implementation with mock
responses, verify architecture can flow real data through the stack.
