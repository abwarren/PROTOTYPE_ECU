# TB-HW-MRP — Manufacturer Release Package

> **Status:** ⬚ Pending (gated by Phase 0 REUSE_MATRIX.md approval)
> **Prerequisite:** TB-HW-001 (System Engineering Specification) + Phase 0 (REUSE_MATRIX.md)
> **Input:** All docs/hardware/*.md (16 specification documents + REUSE_MATRIX.md)
> **Relationship:** TB-HW-MRP supersedes TB-HW-002/003/004 quality gates with
>   production-grade deliverables. TB-HW-002/003/004 remain as implementation
>   milestones; TB-HW-MRP defines the final package standard.

---

## Objective

Produce a complete Manufacturer Release Package suitable for submission to
professional automotive PCB design houses and contract manufacturers. The
package must support: Engineering Review, DFM Review, DFT Review, Quotation,
Prototype Manufacturing, PCB Assembly, Functional Testing, and Future Production.

This is NOT a new specification. It integrates the existing TB-HW-001
specifications (16 documents in docs/hardware/) and adds the manufacturing,
quality, and RFQ deliverables needed for a production handoff.

---

## Phase 0 — Design Baseline (⬚ Current)

Before any KiCad work begins, the design foundation must be locked:

- [x] REUSE_MATRIX.md created — 41 blocks, 37% reused, 17% adapted, 46% new
- [ ] REUSE_MATRIX.md approved — all 41 rows signed off
- [ ] INTERFACE_SPECIFICATION.md reconciled to 34-pin
- [ ] 12-sheet hierarchical structure agreed
- [ ] S32K344 reference-following policy in PROJECT_RULES.md
- [ ] All existing docs/hardware/*.md verified against REUSE_MATRIX.md

**Gate:** Phase 0 approved → TB-HW-002 can start.

---

## Phase 1 — Schematic (TB-HW-002)

Per existing TB-HW-002 scope, with these additions from MRP:

- [ ] 12 hierarchical sheets (MRP reconciled from 16)
- [ ] ERC clean (0 errors, 0 warnings)
- [ ] Every component traceable to REUSE_MATRIX.md row
- [ ] All deviations from NXP reference documented in REUSE_MATRIX.md
- [ ] Schematic reviewed against REUSE_MATRIX.md (reuse blocks verified)
- [ ] Power tree matches POWER_ARCHITECTURE.md
- [ ] MCU pinout matches MCU_SELECTION.md

**Sheets:** 00_Cover, 01_Power, 02_MCU+Debug+Memory, 03_CAN, 04_USB,
05_Inputs+WBO2, 06_Injectors, 07_Ignition, 08_Outputs (ETC/Boost/Relay/Tach),
09_Protection, 10_Connectors, 11_Programming

---

## Phase 2 — PCB Layout (TB-HW-003)

Per existing TB-HW-003 scope, with MRP additions:

- [ ] 6-layer stackup per SYSTEM_ARCHITECTURE.md §4
- [ ] Controlled impedance: USB 90Ω, CAN 120Ω
- [ ] Thermal vias under all exposed pads (S32K344, buck, drivers)
- [ ] Ground plane stitching along board edges
- [ ] Manufacturing fiducials (3 per side)
- [ ] Tooling holes for panelization
- [ ] Components on top side only (connector edge exception)
- [ ] Test points accessible from bottom
- [ ] Silkscreen: polarity, pin 1, connector labels, revision, date

---

## Phase 3 — Manufacturing Package (TB-HW-004)

Per existing TB-HW-004 scope, with MRP additions:

### Deliverables

- [ ] KiCad project (all .kicad_sch, .kicad_pcb, .kicad_pro)
- [ ] Schematic PDF (all sheets)
- [ ] PCB layout PDF (all layers + assembly)
- [ ] Gerber files (RS-274X, all layers)
- [ ] NC drill files (Excellon 2)
- [ ] IPC-356 netlist
- [ ] Pick & Place (CSV, centroid, rotation)
- [ ] BOM (CSV with MPN, manufacturer, lifecycle, alternates)
- [ ] STEP model (PCB + tall components)
- [ ] Assembly Drawing (PDF)
- [ ] Fabrication Drawing (PDF)
- [ ] Manufacturing Notes (fab requirements, stackup, impedance)
- [ ] Assembly Notes (solder paste, reflow profile, special handling)
- [ ] Inspection Notes (AOI, X-ray for BGAs/exposed pads, ICT points)

---

## Phase 4 — Documentation Package

Documents that exist (TB-HW-001) are referenced. New documents are created.

### Existing (TB-HW-001 — verified, no changes needed)

| Document | Status |
|----------|--------|
| SYSTEM_ARCHITECTURE.md | ✅ Exists |
| POWER_ARCHITECTURE.md | ✅ Exists |
| MCU_SELECTION.md | ✅ Exists |
| CAN_DESIGN.md | ✅ Exists |
| USB_DESIGN.md | ✅ Exists |
| PROTECTION_CIRCUITS.md | ✅ Exists |
| EMC_STRATEGY.md | ✅ Exists |
| PCB_DESIGN_GUIDE.md | ✅ Exists |
| COMPONENT_SELECTION.md | ✅ Exists |
| COMPLIANCE_MATRIX.md | ✅ Exists |
| DESIGN_REVIEW.md | ✅ Exists |
| RISK_REGISTER.md | ✅ Exists |
| DFM_GUIDE.md | ✅ Exists |
| DFT_GUIDE.md | ✅ Exists |
| INTERFACE_SPECIFICATION.md | ✅ Updated (34-pin) |
| REUSE_MATRIX.md | ✅ Created (Phase 0) |

### New (created during TB-HW-MRP execution)

| Document | Phase | Content |
|----------|-------|---------|
| SCHEMATIC_OVERVIEW.md | Phase 1 | Sheet-by-sheet walkthrough, net classes, design rules applied |
| THERMAL_DESIGN.md | Phase 2 | Power dissipation analysis, junction temps at 85°C ambient, thermal via strategy |
| MECHANICAL_DESIGN.md | Phase 2 | Board outline, mounting holes, connector placement, keep-out zones |
| ENCLOSURE_SPECIFICATION.md | Phase 4 | 7100CPT aluminium housing, 128×94×32mm, IP67, connector cutouts, thermal interface |
| BOM_GUIDE.md | Phase 3 | BOM structure, MPN format, alternates policy, lifecycle tracking |
| MANUFACTURING_GUIDE.md | Phase 3 | Merge DFM_GUIDE.md + DFT_GUIDE.md + fab/assembly/inspection notes |
| RFQ_PACKAGE.md | Phase 4 | Project overview, quantities, specs, testing requirements, supplier questionnaire |

---

## Phase 5 — Design Reviews

| Review | Input | Deliverable |
|--------|-------|-------------|
| Power Review | POWER_ARCHITECTURE.md + schematic | Signed review |
| MCU Review | MCU_SELECTION.md + REUSE_MATRIX.md + schematic | Signed review |
| USB Review | USB_DESIGN.md + schematic | Signed review |
| CAN Review | CAN_DESIGN.md + schematic | Signed review |
| Protection Review | PROTECTION_CIRCUITS.md + schematic | Signed review |
| EMC Review | EMC_STRATEGY.md + PCB layout | Pre-compliance scan recommendation |
| Thermal Review | THERMAL_DESIGN.md + PCB layout | Junction temp sign-off |
| Mechanical Review | MECHANICAL_DESIGN.md + STEP | Enclosure fit check |
| DFM Review | DFM_GUIDE.md + Gerbers | Manufacturing sign-off |
| DFT Review | DFT_GUIDE.md + PCB layout | Test coverage assessment |
| Risk Review | RISK_REGISTER.md | Updated risk register |

---

## Phase 6 — RFQ Package

`docs/manufacturing/RFQ_PACKAGE.md` containing:

- [ ] Project overview (7100CPT ECU, automotive engine management)
- [ ] Expected quantities (prototype: 5, production: 100/yr scaling to 1,000/yr)
- [ ] PCB specification (6-layer, High-Tg FR4, controlled impedance)
- [ ] Assembly specification (top-side only, mixed SMT/THT, lead-free)
- [ ] Testing requirements (ICT, functional test, burn-in)
- [ ] Programming requirements (SWD, initial firmware flash)
- [ ] Packaging (ESD-safe, moisture barrier)
- [ ] Preferred certifications (ISO 9001, IATF 16949, IPC-A-610 Class 3)
- [ ] Required lead time (prototype: 4 weeks, production: 8 weeks)
- [ ] Supplier questionnaire (DFM, DFT, schematic review, component substitution, supply chain, EMC, thermal, pricing, MOQ, lead times)

---

## Quality Gates

The package is NOT COMPLETE until:

- [ ] REUSE_MATRIX.md approved (Phase 0)
- [ ] KiCad project exists with 12 hierarchical sheets
- [ ] ERC passes (0 errors, 0 warnings)
- [ ] PCB layout complete, 6-layer
- [ ] DRC passes (0 errors)
- [ ] BOM generated with alternates
- [ ] Netlist generated (IPC-356)
- [ ] Gerbers generated and reviewed
- [ ] STEP models attached
- [ ] All MRP documents created
- [ ] Design reviews signed off
- [ ] Compliance matrix updated
- [ ] RFQ package ready
- [ ] Git tag created: v0.1-mrp
- [ ] GitHub updated

---

## Document Authority

TB-HW-MRP is the umbrella tracer bullet for the hardware release. It does NOT
replace:

- `MASTER_DIRECTIVE.md` (repository governance)
- `docs/hardware/SYSTEM_ARCHITECTURE.md` (hardware architecture)
- Individual `docs/hardware/*.md` (domain specifications)

It DEFINES the manufacturing release standard, references existing specs,
and adds the deliverables needed for manufacturer handoff.

**Conflicts:** If any other document contradicts TB-HW-MRP, TB-HW-MRP prevails
for manufacturing release scope. For architectural decisions, the original
domain specification prevails — and the conflict must be documented in
DESIGN_REVIEW.md.
