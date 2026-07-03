# 7100CPT Platform Roadmap

> **Phase:** Architecture Frozen → Capability Delivery
> **Last updated:** 2026-07-03
> **Tracks:** 5 parallel development tracks, advancing independently

---

## Product Vision

7100CPT is a professional standalone engine management platform: custom ECU
hardware, modern desktop tuning Studio, cloud telemetry, and AI-assisted
calibration — built on a proven rusEFI firmware foundation.

---

## Five Parallel Tracks

```
FOUNDATION     ██████████████████████████  COMPLETE
  Firmware     ██████████████████████████  rusEFI fork builds, architecture frozen
  Governance   ██████████████████████████  12 ADRs, Two-Agent model
  QA           ██████████████████████████  Review loop, QA_BACKLOG
  Docs         ██████████████████████████  17 hardware specs, 5 TB docs, DECISION_LOG

CONNECTIVITY   ██░░░░░░░░░░░░░░░░░░░░░░░░  NEXT
  USB          ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-005 — detect, connect, heartbeat, disconnect
  Discovery    ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-006 — scan, identify, version
  Handshake    ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-007 — HELLO, response, timeout, retry
  Identity     ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-007 — vendor, board, firmware, serial

CONTROL        ░░░░░░░░░░░░░░░░░░░░░░░░░░  PLANNED
  Telemetry    ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-008 — RPM, CLT, TPS, MAP live streaming
  Calibration  ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-009 — read, TB-010 — write, verify
  Diagnostics  ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-011 — read DTCs, clear DTCs

INTELLIGENCE   ░░░░░░░░░░░░░░░░░░░░░░░░░░  FUTURE
  AI tuning    ░░░░░░░░░░░░░░░░░░░░░░░░░░  AI-assisted calibration recommendations
  Reports      ░░░░░░░░░░░░░░░░░░░░░░░░░░  Session reports, dyno estimates
  Cloud        ░░░░░░░░░░░░░░░░░░░░░░░░░░  Telemetry sync, OTA, fleet management

HARDWARE       ███░░░░░░░░░░░░░░░░░░░░░░░  DESIGN PHASE
  Specs        ██████████████████████████  TB-HW-001 — 16 documents, NXP S32K344
  Design       ██████████████████████████  Phase 0 approved, 34-pin interface frozen
  Schematic    ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-HW-002 — KiCad, 12 sheets, unlocked
  PCB          ░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-HW-003 — 6-layer layout
  Manufacturing░░░░░░░░░░░░░░░░░░░░░░░░░░  TB-HW-004 — Gerbers, BOM, assembly
  Prototype    ░░░░░░░░░░░░░░░░░░░░░░░░░░  5 units, enclosure, vehicle testing
```

---

## Track Details

### Foundation (✅ Complete)

| Item | Status | Reference |
|------|--------|-----------|
| Repository structure | ✅ | 18-directory system |
| Firmware fork | ✅ | rusEFI at `8540e44`, builds f407-discovery |
| Architecture | ✅ Frozen | 3-layer: Service → Protocol → Transport |
| Governance | ✅ | 12 ADRs, Two-Agent model |
| QA process | ✅ | Review loop, QA_BACKLOG |
| Capability tracking | ✅ | CAPABILITY_MATRIX.md, C0-C4 levels |
| Decision log | ✅ | docs/engineering/DECISION_LOG.md |
| Branding | ✅ | 7100CPT, BRANDING.md |

### Connectivity (⬚ Next: TB-005)

| TB | Capability | Level | Demo Gate |
|----|-----------|-------|-----------|
| TB-005 | USB Transport | C0 | Detect, connect, heartbeat, disconnect |
| TB-006 | ECU Discovery | C0 | Scan, identify, version, serial |
| TB-007 | Handshake | C0 | HELLO, response, timeout, retry |

**End-to-end**: 7100CPT Studio → USB detect → connect → handshake → identity → disconnect

### Control (⬚ Planned)

| TB | Capability | Level |
|----|-----------|-------|
| TB-008 | Live Telemetry | C0 |
| TB-009 | Calibration Read | C0 |
| TB-010 | Calibration Write | C0 |
| TB-011 | Diagnostics | C0 |
| TB-012 | Firmware Flash | C0 |

### Intelligence (⬚ Future)

| TB | Capability | Level |
|----|-----------|-------|
| TB-013 | Calibration DB Save | C0 |
| TB-014 | Calibration DB Load | C0 |
| TB-015 | Session Reports | C0 |
| TB-016 | Cloud Sync | C0 |

### Hardware (🟡 Design Phase)

| TB | Milestone | Status |
|----|-----------|--------|
| TB-HW-001 | System Design Spec | ✅ C3 |
| Phase 0 | Reuse Matrix | ✅ C3 |
| TB-HW-002 | KiCad Schematic | ⬚ C0 (unlocked) |
| TB-HW-003 | PCB Layout | ⬚ C0 |
| TB-HW-004 | Manufacturing Package | ⬚ C0 |
| TB-HW-MRP | Manufacturer Release Package | 🟡 Integrated |

---

## Current Sprint

```
Next action:  TB-005 — USB Transport (C0 → C1)
Goal:         First working capability demonstration
              Studio detects USB ECU, connects, sends heartbeat, disconnects
Blocked by:   Nothing
Estimates:    One engineering session
```

---

*Progress tracked in CAPABILITY_MATRIX.md. Decisions in DECISION_LOG.md.*
