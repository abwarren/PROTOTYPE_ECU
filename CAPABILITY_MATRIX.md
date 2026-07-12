# CAPABILITY_MATRIX.md — Verified Product Capabilities

> **Policy:** Updated whenever a Tracer Bullet advances. Every capability must
>   be backed by evidence. Progress is measured by verified capabilities, not
>   documents written or code committed.
> **Last updated:** 2026-07-03
> **Reconciled:** TB numbering matches PROJECT_DASHBOARD.md, PROJECT_STATUS.md, ROADMAP.md

---

## Capability Levels

| Level | Meaning | Gate |
|-------|---------|------|
| **C0** | Designed | Architecture documented, interfaces defined |
| **C1** | Implemented | Code written, compiles, committed |
| **C2** | Demonstrated | Demo Gate passed, evidence captured (log, screenshot, protocol dump) |
| **C3** | QA Verified | Independent QA review approved |
| **C4** | Production Ready | Tested on target hardware, documentation complete |

A capability advances one level at a time. No skipped levels.
**C1 (Implemented) =/= Complete.** A capability at C1 has code that compiles.
It has NOT been demonstrated, verified, or tested on hardware.
Only C2+ (Demo Gate passed with evidence) counts as a working capability.

---

## Software Capabilities

| # | Capability | Level | TB | Evidence | Demo Gate |
|---|-----------|-------|-----|----------|-----------|
| 1 | Firmware builds | C3 | TB-001 | Clean build: `rusefi.bin` 744KB, ARM ELF, QA verified | N/A |
| 2 | Studio launches | C3 | TB-002 | Tauri window, dark theme, branding loaded, QA verified | N/A |
| 3 | Application core | C2 | TB-002A | 7 service interfaces, BrandProvider, QA sign-off | N/A |
| 4 | Comm architecture | C0 | TB-003 | 3-layer design: Service → Protocol → Transport | N/A (architecture-only TB) |
| 5 | Protocol adapter | C1 | TB-004 | RusEfiProtocol.ts (339 lines), 7 commands, CRC32 framing, signature parser. TS: 0 err | ⬚ Hardware needed |
| 6 | USB transport (impl) | C1 | TB-005A | UsbTransport.ts (177 lines), Rust serial.rs (394 lines, 8 commands), App.tsx wired. TS: 0 err, Vite: 977ms | ⬚ GTK headers needed for native binary |
| 7 | USB transport (verify) | C0 | TB-005B | Architecture defined | 🔲 detect → connect → heartbeat → disconnect |
| 8 | Windows CI pipeline | C0 | TB-CI-001 | Workflow YAML created, push trigger configured | 🔲 Green workflow + downloadable .exe |
| 9 | ECU discovery | C0 | TB-006 | Architecture defined | — |
| 10 | ECU handshake | C0 | TB-007 | Architecture defined | — |
| 11 | Live telemetry | C0 | TB-008 | Architecture defined | — |
| 12 | Calibration read | C0 | TB-009 | Architecture defined | — |
| 13 | Calibration write | C0 | TB-010 | Architecture defined | — |
| 14 | Diagnostics | C0 | TB-011 | Architecture defined | — |
| 15 | Firmware flash | C0 | TB-012 | Architecture defined | — |
| 16 | Calibration DB save | C0 | TB-013 | Architecture defined | — |
| 17 | Calibration DB load | C0 | TB-014 | Architecture defined | — |
| 18 | Tuning session report | C0 | TB-015 | Architecture defined | — |
| 19 | Cloud sync | C0 | TB-016 | Architecture defined | — |

---

## Hardware Capabilities

| # | Capability | Level | TB | Evidence | Status |
|---|-----------|-------|-----|----------|--------|
| H1 | System design spec | C3 | TB-HW-001 | 18 spec documents, QA verified | ✅ |
| H2 | Reuse matrix | C3 | Phase 0 | 41 blocks, approved | ✅ |
| H3 | Interface spec | C2 | — | 34-pin, frozen | ✅ |
| H4 | KiCad schematic | C0 | TB-HW-002 | Project skeleton committed (13 files, 12 sheets). Components not yet placed | 🔲 Unlocked |
| H5 | PCB layout | C0 | TB-HW-003 | Gated by schematic | ⬚ |
| H6 | Manufacturing package | C0 | TB-HW-004 | Gated by PCB layout | ⬚ |

---

## Level Summary

```
Software
  C4 Production:       0
  C3 QA Verified:       3  ████░░░░░░░░░░░░░░░░  (TB-001, TB-002, TB-002A QA)
  C2 Demonstrated:      1  █░░░░░░░░░░░░░░░░░░░  (TB-002A core)
  C1 Implemented:       2  ██░░░░░░░░░░░░░░░░░░  (TB-004 adapter, TB-005A USB impl)
  C0 Designed:         13  █████████████████░░░░  (architecture through cloud sync)

Hardware
  C3 QA Verified:       2  ████████████░░░░░░░░  (TB-HW-001 spec, Reuse Matrix)
  C2 Demonstrated:      1  ██████░░░░░░░░░░░░░░  (Interface spec)
  C1 Implemented:       0
  C0 Designed:          3  ██████████████████░░  (Schematic, PCB, Manufacturing)

KEY METRIC: 7 capabilities at C2+ (demonstrated & verified)
```

---

## Implementation ≠ Complete

Capabilities at C1 have working code that compiles. They have NOT been
demonstrated. The Demo Gate column shows what's needed to advance to C2.

**Next capability to advance:** TB-005B USB Transport Verification (C0 → C2)
- Blocked by: Native Tauri binary (needs GTK headers on Linux, or CI pipeline on Windows)
- Demo Gate: detect USB → connect → heartbeat → disconnect

**Priority after TB-005B:** TB-CI-001 Windows CI Pipeline (C0 → C2)
- Capability multiplier: enables native builds on every commit

---

*Updated per PROJECT_RULES.md §11.3. Every capability must be backed by evidence.*
*TB numbering reconciled with PROJECT_DASHBOARD.md, PROJECT_STATUS.md, ROADMAP.md — 2026-07-03.*
