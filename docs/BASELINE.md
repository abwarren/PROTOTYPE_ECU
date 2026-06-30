# Baseline

> **Date:** 2026-06-30
> **Purpose:** Record the repository state at the time of DDD policy adoption.
> **Policy:** This document establishes the baseline against which all future work is measured.

---

## Repository Baseline

| Property | Value |
|----------|-------|
| **Date** | 2026-06-30 |
| **Platform Name** | ECU Platform Core (white-label) |
| **Policy** | Documentation-Driven Development V1.0 |
| **Git Branch** | master (initial) |
| **rusEFI Upstream** | `https://github.com/rusefi/rusefi.git` |
| **rusEFI Commit** | `8540e44142d837e991e89efc062f8be3feadde8c` |
| **rusEFI Version** | Latest development (shallow clone) |

## State at Baseline

### Completed
- Repository structure (white-label layout)
- Brand abstraction layer (`branding/brand.json`)
- Root documentation (10 documents)
- Architecture documentation (9 neutral documents)
- Architecture audit (16 modules, source-verified)
- 4 Architecture Decision Records
- Research corpus migrated
- DDD policy adopted

### In Progress (Phase 1)
- Firmware build toolchain verification
- Brand separation (rusEFI string tracing)
- Firmware identity system

### Not Started
- Studio development (Phase 2)
- Cloud platform (Phase 3)
- Mobile app (Phase 3)
- Hardware design (Phase 4)

## Documentation Baseline

| Document | Status | Notes |
|----------|--------|-------|
| `README.md` | ✅ Complete | Platform overview |
| `ARCHITECTURE.md` | ✅ Complete | System architecture |
| `ROADMAP.md` | ✅ Complete | 5-phase roadmap |
| `PROJECT_STATUS.md` | ✅ Complete | Per-component tracking |
| `CHANGELOG.md` | ✅ Complete | All changes logged |
| `TECH_DEBT.md` | ✅ Complete | 12 debt items |
| `DECISIONS.md` | ✅ Complete | Decision index |
| `BUILD.md` | ✅ Complete | Build instructions |
| `RELEASE_NOTES.md` | ✅ Complete | Release tracking |
| `BASELINE.md` | ✅ Current | This document |
| `CONTRIBUTING.md` | ✅ Complete | DDD policy, standards |
| `docs/README.md` | ✅ Complete | Documentation index |
| `docs/history/2026-06-30.md` | ✅ Complete | First daily log |
| `docs/firmware/*.md` | 7 documents | Fuel, ignition, trigger, sensors, can, diagnostics, bootloader |
| `docs/onboarding/new-engineer-guide.md` | ✅ Complete | Onboarding guide |

## Module Classification Baseline

| Strategy | Count | Modules |
|----------|-------|---------|
| KEEP | 5 | Trigger Decoder, Actuators, Watchdog, Lua, Scheduler |
| MODIFIABLE | 6 | Sensors, Logging, Storage, Memory Layout, CAN, Knock |
| REPLACE | 4 | Configuration, Console Protocol, Bootloader, Diagnostics |
| PROPRIETARY | — | All Studio/Cloud/Mobile components |

## ADR Baseline

| ADR | Title | Status |
|-----|-------|--------|
| 0001 | White-label platform architecture | Accepted |
| 0002 | rusEFI as firmware foundation | Accepted |
| 0003 | V1 differentiator is UI, not firmware | Accepted |
| 0004 | BrandManager — single source of truth | Accepted |

## Debt Baseline

12 recorded debt items (D-001 through D-012). See `TECH_DEBT.md` for details.
