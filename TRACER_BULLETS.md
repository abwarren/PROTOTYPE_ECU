# TRACER_BULLETS.md — Tracer Bullet Development Methodology

> **Version:** 1.0.0
> **Status:** Active — MANDATORY
> **Governance:** See `MASTER_DIRECTIVE.md` §3.15
> **Purpose:** Validate complete end-to-end workflows early. Build complete vertical slices that prove the architecture.

---

## 1. Philosophy

Prototype ECU shall follow a Tracer Bullet development methodology.

The objective is to validate complete end-to-end workflows early.

Do not build isolated components in isolation. Build complete vertical slices that exercise the entire stack from user interaction to final output.

**Tracer bullets reduce engineering risk.** They validate architecture. They expose integration problems early. They produce measurable progress. They allow continuous demonstration to investors.

---

## 2. Principles

Every tracer bullet must:

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Cross subsystems** | Exercise at least 3 subsystems end-to-end |
| 2 | **Deployable** | Produce a working artifact, not a mock |
| 3 | **Testable** | Include automated verification |
| 4 | **Documented** | Update relevant subsystem documentation |
| 5 | **Committed** | All work committed to Git |
| 6 | **Pushed** | Verified on GitHub |
| 7 | **Measurable** | Produce visible, demonstrable value |

---

## 3. Defined Tracer Bullets

### MVP Tracer Bullets (Phase 1 — Immediate)

These are the first 9 tracer bullets that deliver a demonstrable MVP. Each is a small, complete vertical slice.

### TB-001 — Firmware Builds Under Prototype ECU Project

```
Configure rusEFI build → Apply Prototype ECU branding → Compile successfully →
Verify binary output → Document build pipeline
```

**Validates:** Build system, toolchain, branding injection
**Subsystems crossed:** 2 (Firmware, Build)
**Priority:** P0 — blocks everything

---

### TB-002 — Prototype Studio Launches

```
Create Tauri/Electron project → Load brand.json → Render window →
Display Prototype ECU branding → Dark theme → Responsive shell
```

**Validates:** Studio framework, branding system, build pipeline
**Subsystems crossed:** 2 (Studio, Branding)
**Priority:** P0

---

### TB-002A — Application Core

```
Logging system → Configuration manager → Settings persistence →
Error handling → Workspace/project model → Plugin registry (stub)
```

**Validates:** Application architecture, configuration, error handling, project model
**Subsystems crossed:** 2 (Studio, Configuration)
**Priority:** P0 — foundational capabilities needed by all subsequent bullets

---

### TB-003 — Communication Layer (Transport Abstraction)

```
Define Transport trait → Implement USB CDC transport → Implement ECU discovery →
Implement handshake protocol → Implement heartbeat → Connection state machine →
Studio connects via Communication Service (not direct USB)
```

**Validates:** Transport abstraction, USB CDC transport, Protocol handshake, Connection lifecycle
**Subsystems crossed:** 3 (Studio, Transport, Protocol)
**Architecture:** ADR-0010 — UI depends on Transport trait, not USB directly
**Priority:** P0

```
Prototype Studio (UI)
        │
        ▼
  Communication Service
        │
        ▼
  Transport Interface (trait)
        │
 ┌──────┼──────────┬──────────┐
 │      │          │          │
USB    CAN      Ethernet    BLE
 │      │          │          │
 └──────┴──────────┴──────────┘
        │
        ▼
     Firmware
```

---

### TB-004 — Read Live RPM and Coolant Temperature

```
ECU sends telemetry → Studio parses protocol → Gauges update in real-time →
RPM gauge + Coolant temp gauge rendered
```

**Validates:** Telemetry protocol, Real-time UI rendering, Gauge system
**Subsystems crossed:** 3 (Studio, Protocol, Firmware)
**Priority:** P0

---

### TB-005 — Modify One Calibration and Write to ECU

```
Open calibration table → Modify one value → Write to ECU → ECU acknowledges →
Value verified on next read
```

**Validates:** Calibration protocol, Table editor UI, Read-modify-write cycle
**Subsystems crossed:** 3 (Studio, Protocol, Firmware)
**Priority:** P0

---

### TB-006 — Save Calibration to PostgreSQL

```
Save calibration → Write to PostgreSQL → Store metadata (vehicle, date, tuner) →
Calibration appears in vehicle history
```

**Validates:** Database schema, Studio ↔ DB integration, Version history
**Subsystems crossed:** 3 (Studio, Database, Protocol)
**Priority:** P1

---

### TB-007 — Load Calibration from PostgreSQL

```
Open vehicle → Browse calibration history → Select calibration → Load into Studio →
Display values in table editor
```

**Validates:** Database read path, Calibration versioning, Vehicle-calibration relationship
**Subsystems crossed:** 3 (Studio, Database, Protocol)
**Priority:** P1

---

### TB-008 — Generate Tuning Session Report

```
End tuning session → Generate report → Include: vehicle info, calibration changes,
before/after dyno estimates, tuner notes → Export as PDF/HTML
```

**Validates:** Reporting engine, Session workflow, Workshop documentation
**Subsystems crossed:** 4 (Studio, Database, Reporting, Workshop)
**Priority:** P1

---

### TB-009 — Cloud Sync (Optional MVP)

```
Studio online → Sync calibrations to cloud → Verify on cloud dashboard →
Workshop retrieves history from cloud
```

**Validates:** Cloud infrastructure, Offline/online sync, Multi-device access
**Subsystems crossed:** 4 (Studio, Database, Cloud, Workshop)
**Priority:** P2 — Optional for MVP

---

### Long-Term Tracer Bullets (Phase 2-3)

### Tracer Bullet 001 — Live RPM Pipeline

```
Open Prototype Studio → Connect ECU → Read RPM → Display RPM →
Log RPM → Store RPM in database → Upload to cloud → Display on dashboard
```

**Validates:** Desktop Studio, Firmware, Communications, Database, Cloud, Logging, UI

**Subsystems crossed:** 7

---

### Tracer Bullet 002 — Calibration Write Pipeline

```
Open Studio → Modify ignition table → Write to ECU → ECU accepts calibration →
Save calibration → Version control calibration → Cloud backup
```

**Validates:** Desktop Studio, Firmware, Calibration Protocol, Version Control, Cloud Storage

**Subsystems crossed:** 5

---

### Tracer Bullet 003 — Live Telemetry Pipeline

```
Vehicle starts → Live telemetry → Cloud sync → Mobile app updates →
Workshop dashboard updates
```

**Validates:** Firmware, Cellular/WiFi, Cloud Ingestion, Mobile, Workshop Dashboard

**Subsystems crossed:** 5

---

### Tracer Bullet 004 — Firmware Update Pipeline

```
Firmware update → Package firmware → Flash ECU → Verify checksum →
Reboot → Reconnect → Version recorded
```

**Validates:** OTA Pipeline, Bootloader, Firmware, Checksum Verification, Version Management

**Subsystems crossed:** 5

---

### Tracer Bullet 005 — Vehicle Setup Pipeline

```
Create new vehicle → Select manufacturer → Select engine →
Generate base calibration → Connect ECU → Start tuning session
```

**Validates:** Studio, Calibration Engine, ECU Communication, Vehicle Database

**Subsystems crossed:** 4

---

### Tracer Bullet 006 — Customer & Workshop Pipeline

```
Create customer → Assign vehicle → Assign tune → Generate report →
Store in cloud → Workshop retrieves history
```

**Validates:** Cloud, Customer Management, Workshop Portal, Reporting

**Subsystems crossed:** 4

---

## 4. Execution Order

### MVP Phase (Phase 1 — Immediate)

Tracer bullets are executed in strict sequence. Each builds on the infrastructure validated by the previous one.

| # | Tracer Bullet | Priority | Prerequisites |
|---|---------------|----------|---------------|
| TB-001 | Firmware Builds Under Prototype ECU | P0 | None |
| TB-002 | Prototype Studio Launches | P0 | None (parallel with TB-001) |
| TB-002A | Application Core | P0 | TB-002 |
| TB-003 | Communication Layer (Transport Abstraction) | P0 | TB-002A |
| TB-004 | Read Live RPM and Coolant Temp | P0 | TB-003 |
| TB-005 | Modify One Calibration | P0 | TB-004 |
| TB-006 | Save Calibration to PostgreSQL | P1 | TB-005, ADR-0011 |
| TB-007 | Load Calibration from PostgreSQL | P1 | TB-006 |
| TB-008 | Generate Tuning Session Report | P1 | TB-007 |
| TB-009 | Cloud Sync | P2 | TB-007 |

### Long-Term Phase (Phase 2-3)

| # | Tracer Bullet | Priority | Prerequisites |
|---|---------------|----------|---------------|
| TB-001 | Live RPM Pipeline | P0 | Firmware builds, Studio scaffold, USB/CAN communication |
| TB-002 | Calibration Write Pipeline | P0 | TB-001 complete |
| TB-003 | Live Telemetry Pipeline | P1 | TB-001 complete, Cloud infrastructure |
| TB-004 | Firmware Update Pipeline | P1 | Bootloader exists |
| TB-005 | Vehicle Setup Pipeline | P2 | TB-001, TB-002 complete |
| TB-006 | Customer & Workshop Pipeline | P2 | TB-003, Cloud platform |

---

## 5. Completion Criteria

A tracer bullet is complete when:

1. ✅ Architecture validated — the end-to-end path works
2. ✅ Integration validated — all subsystem interfaces proven
3. ✅ Documentation updated — architecture, API, and subsystem docs reflect reality
4. ✅ Tests pass — automated verification in place
5. ✅ Committed — all work in Git
6. ✅ Pushed — verified on GitHub
7. ✅ SESSION_HANDOFF updated — next session can continue

---

## 6. Rule

Every major subsystem must receive a tracer bullet before extensive feature development begins.

Tracer bullets are mandatory.

Tracer bullets become automated regression tests — they must continue to pass for the life of the project.

---

## 7. Relationship to Vertical Slicing

Tracer bullets are a special class of vertical slice — they are the first slice through a subsystem's full stack. Subsequent vertical slices add depth and features within the validated architecture.

```
Tracer Bullet   →   Proves the architecture works end-to-end
Vertical Slice  →   Adds production features within proven architecture
```

Do not begin feature development on a subsystem until its tracer bullet validates the integration points.

---

*This methodology is mandatory per MASTER_DIRECTIVE.md §3.15.*
