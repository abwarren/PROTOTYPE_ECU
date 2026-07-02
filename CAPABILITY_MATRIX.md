# CAPABILITY_MATRIX.md — Verified Product Capabilities

> **Policy:** Updated whenever a Tracer Bullet completes. Every capability must
>   be backed by a successful demonstration and QA evidence.
> **Last updated:** 2026-07-03

---

## Verified Capabilities

| # | Capability | Status | TB | Evidence | Date |
|---|-----------|--------|-----|----------|------|
| 1 | Firmware builds | ✅ Verified | TB-001 | Build log: `rusefi.bin` 727 KB | 2026-07-01 |
| 2 | Studio launches | ✅ Verified | TB-002 | Tauri window, dark theme, branding | 2026-07-01 |
| 3 | Application core | ✅ Verified | TB-002A | 7 service interfaces, BrandProvider | 2026-07-01 |
| 4 | Comm architecture | ✅ Design Complete | TB-003 | 3-layer: Service → Protocol → Transport | 2026-07-03 |
| 5 | Protocol adapter | ✅ Stub | TB-004 | RusEFIProtocolAdapter, 7 command map | 2026-07-03 |

---

## Capabilities In Progress

| # | Capability | Status | TB | Required Demo |
|---|-----------|--------|-----|---------------|
| 6 | USB detection | ⏳ NEXT | TB-005 | Detect, connect, heartbeat, disconnect |
| 7 | ECU discovery | ⬚ | TB-006 | Scan, identify, firmware version, serial |
| 8 | ECU handshake | ⬚ | TB-007 | HELLO command, response, timeout, retry |
| 9 | Live telemetry | ⬚ | TB-008 | RPM, CLT, TPS streaming to Studio |
| 10 | Calibration read | ⬚ | TB-009 | Read cal table, validate checksum, display |
| 11 | Calibration write | ⬚ | TB-010 | Write cal table, burn, verify |
| 12 | Diagnostics | ⬚ | TB-011 | Read DTCs, clear DTCs, verify clear |
| 13 | Firmware flash | ⬚ | TB-012 | Flash via USB, verify checksum, reboot |
| 14 | Calibration DB save | ⬚ | TB-013 | Save to PostgreSQL, version history |
| 15 | Calibration DB load | ⬚ | TB-014 | Load from PostgreSQL, display values |
| 16 | Tuning session report | ⬚ | TB-015 | Generate PDF/HTML report |
| 17 | Cloud sync | ⬚ | TB-016 | Sync to cloud, verify dashboard |

---

## Hardware Capabilities

| # | Capability | Status | TB | Evidence |
|---|-----------|--------|-----|----------|
| H1 | System design spec | ✅ Verified | TB-HW-001 | 16 spec documents |
| H2 | Reuse matrix | ✅ Approved | Phase 0 | 41 blocks, 4 deferred |
| H3 | Interface spec | ✅ Frozen | — | 34-pin, 12 sheets |
| H4 | KiCad schematic | ⬚ Unlocked | TB-HW-002 | Phase 0 gate passed |
| H5 | PCB layout | ⬚ | TB-HW-003 | Gated by schematic |
| H6 | Manufacturing package | ⬚ | TB-HW-004 | Gated by PCB layout |

---

## Summary

```
Verified:       5  ████░░░░░░░░░░░░░░░░
In Progress:    0  ░░░░░░░░░░░░░░░░░░░░
Next:           1  ░░░░░░░░░░░░░░░░░░░░  (TB-005 USB Transport)
Pending:       11  ░░░░░░░░░░░░░░░░░░░░
──────────────────
Total:         17
```

**Next capability to verify:** USB Transport (TB-005) — detect, connect, heartbeat, disconnect.
