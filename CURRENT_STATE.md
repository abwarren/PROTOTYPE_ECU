# CURRENT_STATE.md — Agent Shared State

> **Last updated:** 2026-07-03
> **Purpose:** Quick project pulse for any agent starting a new session.

---

## Current Status

| Field | Value |
|-------|-------|
| **Sprint** | 7100CPT — Engineering Execution |
| **Milestone** | Architecture frozen — shipping capabilities |
| **Maturity Level** | 3: Engineering Execution |
| **Active Branch** | `feature/tb-004-rusefi-protocol-adapter` |
| **Phase** | Engineering Execution (2026-07-03) |
| **Next Action** | TB-CI-001 — push triggers Windows build, verify green workflow |

---

## Governance Status: FROZEN

Per ADR-0007, ADR-0008, ADR-0009 — governance is complete. The following are frozen and change only with a real problem discovered during development:

- ✅ Repository structure
- ✅ Engineering workflow (Two-Agent Model)
- ✅ QA process (review loop + QA_BACKLOG)
- ✅ ADR process (propose → approve → implement → record)
- ✅ Vertical slicing (one slice per session)
- ✅ Tracer bullets (13 MVP + 6 long-term)
- ✅ Hardware design policy (NXP reference-following + Phase 0 gate)

---

## What's Active

| Area | Status | Detail |
|------|--------|--------|
| Hardware | Phase 0 approved | TB-HW-002 KiCad schematic unlocked |
| Firmware | Stable | rusEFI upstream fork, unmodified |
| Studio | TB-004 next | RusEFIProtocolAdapter stub created |
| Documentation | Active | 7100CPT branding transition complete |

---

## Tracer Bullet Status

| # | Tracer Bullet | Status |
|---|---------------|--------|
| TB-001 | Firmware Builds Under 7100CPT | ✅ Complete |
| TB-002 | 7100CPT Studio Launches | ✅ Complete |
| TB-002A | Application Core | ✅ Complete |
| TB-003 | Communication Layer Architecture | 🟡 Architecture done (impl 20%) |
| TB-004 | RusEFIProtocolAdapter | ⬚ Next |
| TB-005 | USB Communication | ⬚ Pending |
| TB-006 | ECU Identity | ⬚ Pending |
| TB-007 | Live Telemetry | ⬚ Pending |
| TB-008 | Calibration | ⬚ Pending |
| TB-009 | Diagnostics | ⬚ Pending |
| TB-HW-001 | System Engineering Spec | ✅ Complete |
| TB-HW-002 | KiCad Schematic | ⬚ Unlocked (Phase 0 passed) |
| TB-HW-003 | PCB Layout | ⬚ Pending |
| TB-HW-004 | Manufacturing Package | ⬚ Pending |
| TB-HW-MRP | Manufacturer Release Package | 🟡 Directive integrated |

---

## Session Startup Protocol

1. `git fetch --all && git pull --rebase`
2. Read `MASTER_DIRECTIVE.md`, `BRANDING.md`, `CURRENT_STATE.md`, `PROJECT_RULES.md`
3. Check recent commits: `git log --oneline -10`
4. Determine what has changed since its last run
5. Continue only with assigned tasks
6. **Compare directive against current state before implementing** (PROJECT_RULES §10.1)
