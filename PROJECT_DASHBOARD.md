# 7100CPT Platform — Engineering Dashboard

> **Phase:** Engineering Execution
> **Last updated:** 2026-07-03
> **Purpose:** First thing every engineer and QA reviewer opens.

---

## Pulse

| Metric | Value |
|--------|-------|
| **Version** | 0.1.0-dev |
| **Sprint** | Engineering Execution |
| **Current TB** | TB-005B — USB Transport Verification |
| **Architecture** | FROZEN |
| **rusEFI submodule** | `7abb688` (33 commits behind `0c955db`) |
| **Sync procedure** | Documented — `04_Firmware/UPSTREAM_SYNC.md` |
| **Active Branch** | `feature/hardware-schematic-v1` |
| **Latest Commit** | `10ad18d` |
| **Next Action** | Produce native Tauri binary → verify USB detect/connect/heartbeat/disconnect |
| **TB numbering** | Reconciled across CAPABILITY_MATRIX, PROJECT_DASHBOARD, ROADMAP, CURRENT_STATE |

---

## Verified Capabilities

```
Firmware      ██████████████████████████  100%   TB-001 (C3)
Studio        ██████████████████████░░░░   85%   TB-002/002A (C2-C3)
Connectivity  ██████░░░░░░░░░░░░░░░░░░░░   30%   TB-003 (C0), TB-004 (C1), TB-005A (C1)
Calibration   ░░░░░░░░░░░░░░░░░░░░░░░░░░    0%
Diagnostics   ░░░░░░░░░░░░░░░░░░░░░░░░░░    0%
Hardware      ██████░░░░░░░░░░░░░░░░░░░░   25%   TB-HW-001, Phase 0 (C2-C3)
Manufacturing ░░░░░░░░░░░░░░░░░░░░░░░░░░    0%
```

---

## Tracer Bullet Pipeline

| # | TB | Status | Evidence | Demo Gate |
|---|-----|--------|----------|-----------|
| TB-001 | Firmware builds | ✅ C3 | Build log verified | — |
| TB-002 | Studio launches | ✅ C3 | Screenshot verified | — |
| TB-002A | Application core | ✅ C2 | 7 interfaces, QA sign-off | — |
| TB-003 | Comm architecture | ✅ C0 | 3-layer design | — |
| TB-004 | Protocol adapter | ✅ C1 | RusEfiProtocol.ts (339 lines), Rust serial.rs (394 lines), CRC32 framing, TS:0err | ⬚ Hardware needed |
| TB-005A | USB Transport (impl) | ✅ C1 | UsbTransport.ts (177 lines), 8 Rust commands, App.tsx wired, TS:0err, Vite:977ms | ⬚ GTK headers or CI |
| TB-005B | USB Transport (verify) | ⬚ NEXT | — | 🔲 detect → connect → heartbeat → disconnect |
| TB-CI-001 | Windows CI Pipeline | ⬚ | Workflow YAML created | 🔲 Green workflow + .exe |
| TB-006 | ECU Discovery | ⬚ | Architecture defined | 🔲 Scan, identify, version |
| TB-007 | Handshake | ⬚ | Architecture defined | 🔲 HELLO, timeout, retry |
| TB-008 | Live Telemetry | ⬚ | Architecture defined | 🔲 RPM, CLT, TPS streaming |
| TB-009 | Calibration Read | ⬚ | Architecture defined | 🔲 Read table, checksum |

---

## Capability Dependency Graph

```
                    TB-005 USB Transport
                           │
                           ▼
                    TB-006 ECU Discovery
                           │
                           ▼
                    TB-007 Handshake
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     TB-008 Live Telemetry      Calibration Read (TB-009)
              │                         │
              │                         ▼
              │               Calibration Write (TB-010)
              │                         │
              └───────────┬─────────────┘
                          ▼
                  Diagnostics (TB-011)
                          │
                          ▼
                  Firmware Flash (TB-012)

PARALLEL TRACK (no TB dependency)

  TB-CI-001 Windows CI Pipeline  (multiplies all subsequent TBs)
  TB-HW-002 KiCad Schematic      (unlocked, runs independently)
```

**What can be parallelized:** TB-HW-002 (hardware) runs independently of
software TB-005–012. TB-CI-001 runs in parallel. Within software, nothing
is parallel until after TB-007 (Handshake) — then Telemetry and Calibration
Read can proceed on separate workstreams.

---

## Open Risks

| # | Risk | Severity |
|---|------|----------|
| R-001 | S32K344 lead time > 26 weeks | 🔴 High |
| R-002 | Buck converter thermal at 85°C | 🟠 Medium |
| R-003 | EMC pre-compliance failures | 🟠 Medium |
| R-004 | TLE8888 supply (alternatives documented) | 🟠 Medium |
| R-005 | Manufacturer review not yet requested | 🟡 Low |
| R-006 | Zero automated tests — every change risks regression | 🔴 Critical |
| R-007 | TB-005B blocked on native build (GTK headers or CI) | 🟠 High |

---

## QA Status

| Metric | Status |
|--------|--------|
| Architecture | 🟢 Frozen |
| Documentation | 🟢 Mature |
| Capability Tracking | 🟢 Active — reconciled 2026-07-03 |
| Engineering Process | 🟢 Mature |
| Build | 🟢 Passing (TS, Vite) |
| Native Build | 🔴 Blocked (GTK headers missing) |
| Tests | 🔴 0 automated tests |
| CI/CD | 🟡 Workflow YAML exists, never triggered |

---

## Core Documents

| Document | Purpose |
|----------|---------|
| [MASTER_DIRECTIVE.md](MASTER_DIRECTIVE.md) | Specification contract |
| [PROJECT_RULES.md](PROJECT_RULES.md) | How work gets done |
| [ROADMAP.md](11_Documentation/ROADMAP.md) | What comes next |
| [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) | What works today |
| [PROJECT_STATUS.md](11_Documentation/PROJECT_STATUS.md) | Detailed progress |
| [DECISION_LOG.md](docs/engineering/DECISION_LOG.md) | Why decisions were made |
| [ENGINEERING_DEBT.md](ENGINEERING_DEBT.md) | Known debt, prioritized |
| [ENGINEERING_STANDARDS.md](docs/engineering/ENGINEERING_STANDARDS.md) | Single reference — all engineering standards |
| [CURRENT_STATE.md](CURRENT_STATE.md) | Agent shared state |
| [BRANDING.md](BRANDING.md) | Product identity |
| [README.md](README.md) | Project overview |
