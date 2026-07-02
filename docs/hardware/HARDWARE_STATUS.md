# HARDWARE_STATUS.md — Hardware Development Status

> **Last Updated:** 2026-07-03
> **Policy:** Per Mandatory Git & GitHub Policy — this document is updated with every commit.

---

## Current Status

| Milestone | Status | Branch | Commit |
|-----------|--------|--------|--------|
| TB-HW-001 | ✅ Complete | feature/hardware-schematic-v1 | 2383820 |
| Phase 0 (Reuse Matrix) | 🟢 Approved | feature/hardware-schematic-v1 | — |
| TB-HW-002 | ⬚ Pending (Phase 0 passed — unlocked) | — | — |
| TB-HW-003 | ⬚ Pending (gated by TB-HW-002) | — | — |
| TB-HW-004 | ⬚ Pending (gated by TB-HW-003) | — | — |
| TB-HW-MRP | ⬚ Pending (gated by Phase 0) | — | — |

---

## Phase 0 Detail — Design Baseline

> **Policy:** No KiCad schematic work begins until Phase 0 is approved.

| Document | Lines | Status |
|----------|-------|--------|
| REUSE_MATRIX.md | 200+ | 🟢 Approved — 41 blocks, 4 deferred |
| INTERFACE_SPECIFICATION.md | 140+ | ✅ Updated — reconciled to 34-pin |
| TB-HW-002/README.md | 120+ | ✅ Updated — Phase 0 gate, 12 sheets |
| TB-HW-MRP/README.md | 200+ | ✅ Created — integrated MRP directive |
| PROJECT_RULES.md §9 | 30+ | ✅ Added — S32K344 reference-following policy |
| DESIGN_ASSUMPTIONS.md | 120+ | ✅ Created — 18 explicit assumptions with impact analysis |

### Reuse Matrix Summary

| Category | Reuse | Adapt | New | Total |
|----------|-------|-------|-----|-------|
| MCU & Core | 7 | 0 | 0 | 7 |
| Power | 2 | 4 | 1 | 7 |
| Communications | 5 | 1 | 1 | 7 |
| Sensor Inputs | 0 | 2 | 3 | 5 |
| Output Drivers | 0 | 0 | 6 | 6 |
| Protection | 0 | 0 | 4 | 4 |
| Connectors & Mechanical | 1 | 0 | 4 | 5 |
| **Total** | **15** | **7** | **19** | **41** |

**High-risk blocks:** Injector drivers (O1), Ignition drivers (O2) — both need peer design review before schematic capture.

### Changes Resolved From MRP Directive Review

| Conflict | Resolution |
|----------|------------|
| 42-pin vs 34-pin connector | **34-pin** per MRP directive. INTERFACE_SPECIFICATION.md updated. V1 targets 6-cylinder sequential. V8 via wasted spark. |
| 16 vs 9 vs 10 sheets | **12 sheets** (00_Cover through 11_Programming). Debug and Memory merged into MCU. Injectors and Ignition split from Outputs. |
| MRP as duplicate master | MRP integrated as **TB-HW-MRP** tracer bullet, referencing existing specs rather than re-specifying. |
| NXP reference policy | Added to **PROJECT_RULES.md §9**. All deviations require REUSE_MATRIX.md entry + justification + risk + QA. |

---

## TB-HW-001 Detail — System Engineering Specification

| Document | Lines | Status |
|----------|-------|--------|
| SYSTEM_ARCHITECTURE.md | 200+ | ✅ |
| MCU_SELECTION.md | 300+ | ✅ |
| POWER_ARCHITECTURE.md | 350+ | ✅ |
| PROTECTION_CIRCUITS.md | 250+ | ✅ |
| CAN_DESIGN.md | 180+ | ✅ |
| USB_DESIGN.md | 130+ | ✅ |
| EMC_STRATEGY.md | 200+ | ✅ |
| PCB_DESIGN_GUIDE.md | 200+ | ✅ |
| DFM_GUIDE.md | 130+ | ✅ |
| DFT_GUIDE.md | 150+ | ✅ |
| COMPONENT_SELECTION.md | 150+ | ✅ |
| INTERFACE_SPECIFICATION.md | 140+ | ✅ (v2: 34-pin) |
| COMPLIANCE_MATRIX.md | 250+ | ✅ |
| RISK_REGISTER.md | 80+ | ✅ |
| DESIGN_REVIEW.md | 100+ | ✅ |

---

## TB-HW-MRP Detail — Manufacturer Release Package

New documents required (created progressively through TB-HW-002/003/004):

| Document | Phase | Status |
|----------|-------|--------|
| REUSE_MATRIX.md | Phase 0 | 🟡 Draft |
| SCHEMATIC_OVERVIEW.md | Phase 1 | ⬚ Pending |
| THERMAL_DESIGN.md | Phase 2 | ⬚ Pending |
| MECHANICAL_DESIGN.md | Phase 2 | ⬚ Pending |
| ENCLOSURE_SPECIFICATION.md | Phase 4 | ⬚ Pending |
| BOM_GUIDE.md | Phase 3 | ⬚ Pending |
| MANUFACTURING_GUIDE.md | Phase 3 | ⬚ Pending |
| RFQ_PACKAGE.md | Phase 4 | ⬚ Pending |

---

## QA Status

| Domain | Score | Status |
|--------|-------|--------|
| Architecture | 9.5/10 | 🟢 |
| Documentation | 10/10 | 🟢 |
| Component Choices | 9/10 | 🟢 |
| Automotive Design | 9/10 | 🟢 |
| Design Baseline (Phase 0) | 9/10 | 🟢 Approved |
| Implementation | 2/10 | 🟡 Gated by TB-HW-002 |

---

## Open Risks (from RISK_REGISTER.md)

| # | Risk | Severity |
|---|------|----------|
| R-001 | S32K344 lead time > 26 weeks | 🔴 High |
| R-002 | Buck converter thermal at 85°C ambient | 🟠 Medium |
| R-003 | EMC pre-compliance failures | 🟠 Medium |
| R-004 | TLE8888 injector driver availability (alternatives documented, decision deferred) | 🟠 Medium |
| R-005 | Manufacturer review not yet requested for REUSE_MATRIX.md (early DFM feedback pending) | 🟡 Low |

---

## Next Milestone

**TB-HW-002: KiCad Schematic Capture — 12 hierarchical sheets, ERC clean. Phase 0 gate passed. Proceed.**
