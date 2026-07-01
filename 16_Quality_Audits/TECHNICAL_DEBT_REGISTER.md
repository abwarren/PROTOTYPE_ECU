# TECHNICAL_DEBT_REGISTER.md — Expanded Debt Tracking

> **Type:** EDR Companion — Debt Domain
> **Governance:** Per ADR-0007 — proposals only
> **Baseline:** Extends `11_Documentation/TECH_DEBT.md` items D-001 through D-012

---

## New Debt Items Identified During EDR

| ID | Description | Impact | Priority | Target |
|----|-------------|--------|----------|--------|
| D-013 | FreeRTOS/ChibiOS mismatch — architecture says FreeRTOS, code uses ChibiOS | Architecture: High | P0 | Phase 0 |
| D-014 | GPL/proprietary boundary undefined — all platform code at contamination risk | Legal: Critical | P0 | Phase 0 |
| D-015 | No safety architecture document — ECU controls engine without failure analysis | Safety: Critical | P0 | Phase 0 |
| D-016 | .gitmodules URL relative — fresh clones cannot init submodule | Repository: Critical | P0 | Immediate |
| D-017 | CI triggers on [main, develop] — never runs against master | Quality: High | P0 | Immediate |
| D-018 | No database schema — referenced by 6 tracer bullets but undesigned | Architecture: High | P0 | Phase 0 |
| D-019 | No ECU communication protocol spec — firmware and Studio will diverge | Integration: Critical | P0 | Phase 0 |
| D-020 | 25K lines of generated build artifacts in submodule working tree | Repository: Medium | P1 | Immediate |
| D-021 | Submodule local commit unpushed — GCC fix lost on re-clone | Repository: High | P1 | Immediate |
| D-022 | Two competing agent systems (20-agent spec + 11-agent ops) | Process: High | P1 | Phase 0 |
| D-023 | MASTER_DIRECTIVE/CONTEXT_LIFECYCLE 70% content overlap | Documentation: Medium | P2 | Phase 0 |
| D-024 | 143 .md files with no automated link-checking | Documentation: Medium | P2 | Phase 0 |
| D-025 | 12 empty firmware directories — implied architecture doesn't exist | Architecture: Medium | P2 | Phase 0 |
| D-026 | ADR dates incorrect (2024 instead of 2026) — undermines historical record | Documentation: Low | P2 | Phase 0 |
| D-027 | No test framework despite mandatory "testable" tracer bullet criterion | Testing: High | P2 | Phase 1 |
| D-028 | Electron choice not validated — Tauri may be significantly better | Architecture: Medium | P2 | Phase 1 |
| D-029 | AWS vs self-hosted cloud ambiguity — two architectures being planned | Architecture: Medium | P2 | Phase 1 |
| D-030 | Copyright year 2024 in brand.json — stale before first release | Branding: Low | P3 | Phase 1 |
| D-031 | Studio technology stack predates Tauri v1.0 — should be re-evaluated | Architecture: Medium | P2 | Phase 1 |
| D-032 | Session index has placeholder entries for sessions that haven't happened | Process: Low | P3 | Phase 0 |
| D-033 | No reproducible build pipeline — firmware build depends on local toolchain | Build: Medium | P2 | Phase 1 |
| D-034 | rusEFI branding strings not traced in source (D-010) — prerequisite for brand separation | Brand: Medium | P2 | Phase 1 |

---

## Debt Classification

### P0 (Blocking — must fix before any implementation)
- D-013: FreeRTOS/ChibiOS mismatch
- D-014: GPL boundary undefined
- D-015: No safety architecture
- D-016: .gitmodules broken
- D-017: CI never runs
- D-018: No database schema
- D-019: No protocol specification

### P1 (Critical — fix before Phase 1 ends)
- D-020: Submodule build artifacts
- D-021: Unpushed submodule commit
- D-022: Competing agent systems
- D-027: No test framework

### P2 (Important — fix in current phase)
- D-023 through D-029, D-031, D-033, D-034

### P3 (Nice to have)
- D-030, D-032

---

## Relationship to Existing Debt

Items D-001 through D-012 in `11_Documentation/TECH_DEBT.md` remain valid. This register adds items D-013 through D-034. Where there is overlap (e.g., D-010 and D-034 both relate to branding), the newer item provides updated context.

After review and acceptance, these items should be merged into `11_Documentation/TECH_DEBT.md`.

---

*Per ADR-0007, this is a proposal. Debt items should be reviewed and merged into the authoritative TECH_DEBT.md.*
