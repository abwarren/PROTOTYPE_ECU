# ENGINEERING_DEBT.md — Technical Debt Register

> **Policy:** Debt is visible, prioritized, and traceable. Every item has an owner and a path to resolution.
> **Last updated:** 2026-07-03

---

## Open Debt

### Operational

| ID | Title | Impact | Probability | Effort | Owner | Status |
|----|-------|--------|------------|--------|-------|--------|
| ED-001 | GCC 12 shadow warning patch should be submitted upstream | Low | High | Small | Firmware | 🟡 Open |
| ED-002 | rusEFI output binary still named `rusefi.bin`, not `7100cpt.bin` | Low | High | Small | Firmware | 🟡 Open |
| ED-003 | USB descriptor string verification not yet performed | Low | Low | Small | Studio | 🟡 Open |
| ED-004 | No automated CI/CD pipeline for Studio build | Medium | Medium | Medium | DevOps | 🟡 Open |
| ED-005 | rusEFI upstream sync procedure not documented | Medium | High | Small | Firmware | 🟢 Addressed — `04_Firmware/UPSTREAM_SYNC.md` |
| ED-006 | Tauri app identifier still uses old namespace `com.prototype-ecu.studio` | Low | Low | Small | Studio | 🟡 Open |

### Hardware

| ID | Title | Impact | Probability | Effort | Owner | Status |
|----|-------|--------|------------|--------|-------|--------|
| ED-010 | S32K344 silicon errata not yet reviewed against pin assignment (R-007) | Medium | Medium | Medium | Hardware | 🟡 Open |
| ED-011 | 34-pin connector spare capacity limited — V2 expansion path unclear (R-008) | Low | Low | Small | Hardware | 🟡 Open |
| ED-012 | No conformal coating on prototype — moisture risk (R-A02) | Medium | High | Small | Hardware | Accepted |
| ED-013 | Single 3.3V LDO is single point of failure (R-A03) | Medium | Low | Medium | Hardware | Accepted (for prototype) |
| ED-014 | Manufacturer review not yet requested for REUSE_MATRIX.md | Medium | Medium | Small | Hardware | 🟡 Open |
| ED-015 | Injector/ignition driver IC selection deferred — alternatives documented but not evaluated | High | Medium | Large | Hardware | 🟡 Open |
| ED-016 | Buck converter thermal marginal at 85°C — production redesign likely (R-002) | High | Medium | Large | Hardware | 🟡 Open |

### Testing & Quality

| ID | Title | Impact | Probability | Effort | Owner | Status |
|----|-------|--------|------------|--------|-------|--------|
| ED-020 | No automated tests for Studio (TypeScript) | Medium | High | Medium | Studio | 🟡 Open |
| ED-021 | No automated tests for firmware build | Low | Low | Small | Firmware | 🟡 Open |
| ED-022 | No integration test framework (end-to-end Studio ↔ ECU) | High | High | Large | QA | 🟡 Open |
| ED-023 | SESSION_HANDOFF.md not yet tracked by git hooks or automation | Low | Low | Small | Process | 🟡 Open |

---

## Summary

```
Open:           12
Accepted:        2  (R-A02, R-A03)
Resolved:        0
───────────────────
Total:          14
```

**Highest priority (next sprint):** ED-015 (driver IC selection) and ED-016 (buck thermal) — both gate TB-HW-002 schematic capture. ED-005 (upstream sync doc) — prevents firmware divergence.

---

*Debt is acceptable when conscious, documented, and scheduled. Debt is dangerous when invisible.*
