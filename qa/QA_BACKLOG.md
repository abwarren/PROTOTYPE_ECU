# QA_BACKLOG.md — Living Architectural Backlog

> **Owner:** QA Agent
> **Governance:** ADR-0008 — every QA review creates entries here
> **Purpose:** Track architectural improvements across sessions — never bury findings in chat

---

## Open

### QA-001
**Subsystem:** Repository
**Priority:** Critical
**Session:** 001
**Finding:** `.gitmodules` URL is relative (`./firmware/upstream`) — fresh clones cannot init submodule.
**Recommendation:** Change URL to `https://github.com/rusefi/rusefi.git`, run `git submodule sync`.
**Status:** Open
**ADR:** —

### QA-002
**Subsystem:** CI/CD
**Priority:** High
**Session:** 001
**Finding:** `.github/workflows/ddd-check.yml` triggers on `[main, develop]` but repository uses `master`. CI never runs.
**Recommendation:** Add `master` to trigger branches.
**Status:** Open
**ADR:** —

### QA-003
**Subsystem:** Firmware
**Priority:** Critical
**Session:** 002
**Finding:** No GPL/proprietary boundary defined. All platform code at risk of GPL contamination.
**Recommendation:** Define three-layer boundary: GPL firmware ↔ IPC ↔ Proprietary applications. Formalize as ADR.
**Status:** Open
**ADR:** —

### QA-004
**Subsystem:** Firmware
**Priority:** Critical
**Session:** 002
**Finding:** No safety architecture document. ECU controls engine (fuel, ignition, throttle) without failure analysis.
**Recommendation:** Write `01_Architecture/safety-architecture.md` defining fault classes, fail-safe states, watchdog hierarchy.
**Status:** Open
**ADR:** —

### QA-005
**Subsystem:** Firmware
**Priority:** Critical
**Session:** 002
**Finding:** Architecture docs specify FreeRTOS; actual rusEFI code uses ChibiOS. Mismatch will cause integration failures.
**Recommendation:** Resolve architecture to ChibiOS for V1-V3. Document migration path to AUTOSAR OS in Phase 5.
**Status:** Open
**ADR:** —

### QA-006
**Subsystem:** Database
**Priority:** Critical
**Session:** 002
**Finding:** No database schema exists. Referenced by 6 tracer bullets and cloud architecture but undesigned.
**Recommendation:** Adopt proposed schema in `16_Quality_Audits/DATABASE_RECOMMENDATIONS.md`.
**Status:** Open
**ADR:** —

### QA-007
**Subsystem:** Protocol
**Priority:** Critical
**Session:** 002
**Finding:** No ECU ↔ Studio communication protocol specification. Firmware and Studio will implement incompatible interfaces.
**Recommendation:** Design binary framed protocol (see `16_Quality_Audits/ARCHITECTURE_IMPROVEMENTS.md` §4).
**Status:** Open
**ADR:** —

### QA-008
**Subsystem:** Repository
**Priority:** High
**Session:** 002
**Finding:** Submodule has 25K lines of generated build artifacts in working tree + 1 unpushed local commit.
**Recommendation:** Discard generated files, apply GCC fix via build script, keep submodule at pristine upstream commit.
**Status:** Open
**ADR:** —

### QA-009
**Subsystem:** Documentation
**Priority:** Medium
**Session:** 002
**Finding:** MASTER_DIRECTIVE.md §3 and CONTEXT_LIFECYCLE.md overlap ~70%. Maintenance burden.
**Recommendation:** Consolidate into MASTER_DIRECTIVE.md §3 as authoritative source. Convert CONTEXT_LIFECYCLE.md to short reference.
**Status:** Open
**ADR:** —

### QA-010
**Subsystem:** Process
**Priority:** High
**Session:** 002
**Finding:** Two competing multi-agent frameworks (20-agent spec + 11-agent ops). Process overhead disproportionate to project scale.
**Recommendation:** Adopt ADR-0008 — Two-Agent Model (Principal Engineer + Independent QA).
**Status:** Open
**ADR:** ADR-0008 (Proposed)

### QA-011
**Subsystem:** Architecture
**Priority:** Medium
**Session:** 002
**Finding:** 12 empty firmware directories + 4 empty code directories imply architecture that doesn't exist.
**Recommendation:** Populate each with README.md defining interface contract, dependencies, and implementation status.
**Status:** Open
**ADR:** —

### QA-012
**Subsystem:** Documentation
**Priority:** Medium
**Session:** 002
**Finding:** 143 markdown documents with no automated link checking. Cross-reference rot is certain.
**Recommendation:** Add link checker to DDD quality gate (`scripts/ddd-check.sh`).
**Status:** Open
**ADR:** —

### QA-013
**Subsystem:** Studio
**Priority:** Medium
**Session:** 002
**Finding:** Electron chosen but Tauri (10x smaller, 5x faster startup) not evaluated.
**Recommendation:** Prototype serial communication in Tauri. Decision gate: adopt Tauri if prototype succeeds.
**Status:** Open
**ADR:** —

### QA-014
**Subsystem:** Testing
**Priority:** High
**Session:** 002
**Finding:** No test framework exists despite mandatory "testable" tracer bullet criterion.
**Recommendation:** Create test framework scaffold before TB-001 begins.
**Status:** Open
**ADR:** —

### QA-015
**Subsystem:** Commercial
**Priority:** Medium
**Session:** 002
**Finding:** No pricing model, no revenue projections, no regulatory timeline.
**Recommendation:** Adopt tiered pricing from `16_Quality_Audits/COMMERCIAL_READINESS_REVIEW.md` §2.3.
**Status:** Open
**ADR:** —

---

## In Progress

*(None yet — no items assigned for implementation)*

---

## Resolved

*(None yet — no items closed)*

---

## Rejected

*(None yet — no items rejected)*

---

## Priority Summary

| Priority | Count | Items |
|----------|-------|-------|
| Critical | 5 | QA-001, QA-003, QA-004, QA-005, QA-006, QA-007 |
| High | 4 | QA-002, QA-008, QA-010, QA-014 |
| Medium | 6 | QA-009, QA-011, QA-012, QA-013, QA-015 |
| Low | 0 | — |

---

*Last updated: 2026-07-01 | Session: 002 | Branch: edr/architecture-review*
