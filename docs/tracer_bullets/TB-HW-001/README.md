# TB-HW-001 — System Engineering Specification (SDS)

> **Status:** ✅ Complete
> **Date:** 2026-07-01
> **Branch:** feature/hardware-schematic-v1
> **Commit:** e8fc254
> **QA:** 🟢 Approved — Foundation for TB-HW-002

---

## What Was Completed

Complete System Design Specification (SDS) for the Prototype ECU hardware. This is the engineering specification that TB-HW-002 (KiCad schematic) and TB-HW-003 (PCB layout) will implement.

### Scope: Requirements → Architecture → Specification

This milestone covers:
- ✅ System architecture (block diagram, hierarchical sheet structure)
- ✅ MCU selection with full justification (NXP S32K344)
- ✅ Power architecture (power tree, buck/LDO, sequencing, budget)
- ✅ Protection strategy (TVS, load dump, ESD, watchdog, safe state)
- ✅ Communications design (CAN FD ×4, USB-C, Ethernet)
- ✅ Input/output specification (12 analog, 8 injector, 8 ignition, 2 ETC)
- ✅ EMC strategy (emissions, immunity, pre-compliance plan)
- ✅ Compliance matrix (10 automotive standards mapped)
- ✅ Design rules (PCB stackup, trace rules, controlled impedance)
- ✅ DFM/DFT guides (manufacturing, test, inspection)
- ✅ Component selection (critical BOM with alternatives)
- ✅ Interface specification (42-pin main harness pinout)
- ✅ Risk register (10 open + 3 accepted)
- ✅ Design review (12-area scored)

### NOT in scope (these are TB-HW-002 / TB-HW-003):
- ❌ KiCad schematic capture — exists as documentation, not as .kicad_sch
- ❌ ERC/DRC — no schematic file to check
- ❌ PCB layout — not started
- ❌ Simulation — not started
- ❌ Manufacturing files — not generated

---

## QA Assessment

| Domain | Score | Status |
|--------|-------|--------|
| Architecture | 9.5/10 | 🟢 Excellent — 9 hierarchical sheets, clean separation |
| Documentation | 10/10 | 🟢 16 documents, every decision justified |
| Component Choices | 9/10 | 🟢 Automotive-grade throughout, alternatives documented |
| Automotive Design | 9/10 | 🟢 ISO 16750/7637/26262 designed in, not bolted on |
| Implementation | 2/10 | 🟡 Expected — schematic not yet captured in CAD |
| **Overall** | **8.5/10** | **🟢 APPROVED — proceed to TB-HW-002** |

Note: Implementation score of 2/10 is expected and correct for this milestone. This is a specification, not a captured schematic. The 65K words of design documentation are the deliverable.

---

## Next: TB-HW-002 — KiCad Schematic Capture

Create the KiCad project with 10 hierarchical sheets implementing this specification. ERC clean. Netlist generated. Every component traceable to the design rationale herein.
