# CAPABILITY_MATRIX.md — Verified Product Capabilities

> **Policy:** Updated whenever a Tracer Bullet completes. Every capability must
>   be backed by a successful demonstration and QA evidence.
> **Last updated:** 2026-07-03

---

## Capability Levels

| Level | Meaning | Gate |
|-------|---------|------|
| **C0** | Designed | Architecture documented, interfaces defined |
| **C1** | Implemented | Code written, compiles, committed |
| **C2** | Demonstrated | Demo Gate passed, evidence captured |
| **C3** | QA Verified | Independent QA review approved |
| **C4** | Production Ready | Tested on target hardware, documentation complete |

A capability advances one level at a time. No skipped levels.

---

## Software Capabilities

| # | Capability | Level | TB | Evidence |
|---|-----------|-------|-----|----------|
| 1 | Firmware builds | C3 | TB-001 | Build log: `rusefi.bin` 727 KB, QA verified |
| 2 | Studio launches | C3 | TB-002 | Tauri window, dark theme, branding, QA verified |
| 3 | Application core | C2 | TB-002A | 7 service interfaces, BrandProvider |
| 4 | Comm architecture | C0 | TB-003 | 3-layer: Service → Protocol → Transport |
| 5 | Protocol adapter | C1 | TB-004 | RusEFIProtocolAdapter, 7 command map |

| 6 | USB transport | C0 | TB-005 | NEXT — design complete, implementation pending |
| 7 | ECU discovery | C0 | TB-006 | Architecture defined |
| 8 | ECU handshake | C0 | TB-007 | Architecture defined |
| 9 | Live telemetry | C0 | TB-008 | Architecture defined |
| 10 | Calibration read | C0 | TB-009 | Architecture defined |
| 11 | Calibration write | C0 | TB-010 | Architecture defined |
| 12 | Diagnostics | C0 | TB-011 | Architecture defined |
| 13 | Firmware flash | C0 | TB-012 | Architecture defined |
| 14 | Calibration DB save | C0 | TB-013 | Architecture defined |
| 15 | Calibration DB load | C0 | TB-014 | Architecture defined |
| 16 | Tuning session report | C0 | TB-015 | Architecture defined |
| 17 | Cloud sync | C0 | TB-016 | Architecture defined |

---

## Hardware Capabilities

| # | Capability | Level | TB | Evidence |
|---|-----------|-------|-----|----------|
| H1 | System design spec | C3 | TB-HW-001 | 16 spec documents, QA verified |
| H2 | Reuse matrix | C3 | Phase 0 | 41 blocks, 4 deferred, approved |
| H3 | Interface spec | C2 | — | 34-pin, 12 sheets, frozen |
| H4 | KiCad schematic | C0 | TB-HW-002 | Phase 0 gate passed, unlocked |
| H5 | PCB layout | C0 | TB-HW-003 | Gated by schematic |
| H6 | Manufacturing package | C0 | TB-HW-004 | Gated by PCB layout |

---

## Level Summary

```
Software
  C4 Production:   0
  C3 QA Verified:   3  ████░░░░░░░░░░░░░░░░
  C2 Demonstrated:  1  █░░░░░░░░░░░░░░░░░░░
  C1 Implemented:   1  █░░░░░░░░░░░░░░░░░░░
  C0 Designed:     12  ██████████████░░░░░░

Hardware
  C3 QA Verified:   2  ████████████░░░░░░░░
  C2 Demonstrated:  1  ██████░░░░░░░░░░░░░░
  C0 Designed:       3  ██████████████████░░
```

**Next capability to advance:** TB-005 USB Transport (C0 → C1: implement UsbTransport)

---

*Updated per PROJECT_RULES.md §11.3. Every capability must be backed by evidence.*
