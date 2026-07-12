# 7100CPT ECU — Hardware Design Package

> **Revision:** 0.1
> **Date:** 2026-07-03
> **Status:** 🟢 Phase 0 Approved — Ready for Schematic Capture
> **Capability:** TB-HW-001 (System Design Spec) — C3 Verified
| **Next:** TB-HW-003 (PCB Layout) — Unlocked

---

## 1. Package Overview

This is the complete hardware design package for the 7100CPT ECU Platform.
It provides everything a professional automotive PCB design house needs to:

1. Review the engineering design
2. Quote manufacturing costs
3. Begin schematic capture and PCB layout
4. Evaluate against automotive compliance requirements

## 2. Product Identity

| Property | Value |
|----------|-------|
| Product | 7100CPT Engine Control Unit |
| Type | Standalone Programmable ECU |
| Platform | STM32F407VG (ARM Cortex-M4) |
| Firmware | rusEFI-derived (GPL-3.0 upstream) — f407-discovery target |
| Application | Professional tuning, motorsport, OEM retrofit |
| Brand | 7100CPT |

## 3. Design Specifications

| Property | Value |
|----------|-------|
| PCB Construction | 6-Layer FR-4 (4-Layer acceptable for prototype) |
| PCB Standard | IPC Class 3 |
| Material | High-Tg FR-4 (TG170+) |
| Copper | 2 oz Power Layers, 1 oz Signal Layers |
| Surface Finish | ENIG (Electroless Nickel Immersion Gold) |
| Board Thickness | 1.6 mm |
| Operating Temperature | -40°C to +85°C |
| Target Lifecycle | Automotive (15-year) |
| Enclosure | 6061-T6 CNC Aluminium, Black Hard Anodized, IP67 |
| Main Connector | 34-pin AMPSEAL 16 sealed automotive |

## 4. Interfaces

| Interface | Quantity | Type |
|-----------|----------|------|
| USB-C | 1 | Device mode, CDC serial |
| CAN FD | 4 | TJA1043 transceivers |
| SWD Programming | 1 | Tag-Connect TC2050 |
| Main Harness | 1 | 34-pin AMPSEAL 16 |
| CAN Expansion | 2 | DEUTSCH DT 4-pin |

## 5. Design Document Index

### Core Specifications (docs/hardware/)

| # | Document | Purpose | Status |
|---|----------|---------|--------|
| 1 | SYSTEM_ARCHITECTURE.md | Block diagram, sheet hierarchy, design rules | ✅ |
| 2 | MCU_SELECTION.md | STM32F407VG justification, pin allocation, clock | ✅ |
| 3 | POWER_ARCHITECTURE.md | 6-36V input → Buck → LDO tree, power budget | ✅ |
| 4 | PROTECTION_CIRCUITS.md | TVS, load dump, ESD, reverse polarity, watchdog | ✅ |
| 5 | CAN_DESIGN.md | CAN FD ×4, TJA1043, CM chokes, termination | ✅ |
| 6 | USB_DESIGN.md | USB-C device, ESD, CC resistors | ✅ |
| 7 | EMC_STRATEGY.md | CISPR 25 Class 3, conducted/radiated plan | ✅ |
| 8 | PCB_DESIGN_GUIDE.md | 6-layer stackup, impedance, via strategy | ✅ |
| 9 | DFM_GUIDE.md | Component selection, stencil, reflow | ✅ |
| 10 | DFT_GUIDE.md | Test points, functional test, boundary scan | ✅ |
| 11 | COMPONENT_SELECTION.md | Critical BOM with alternates, lead time risks | ✅ |
| 12 | INTERFACE_SPECIFICATION.md | 34-pin connector frozen pinout | ✅ |
| 13 | COMPLIANCE_MATRIX.md | ISO 16750, 7637, CISPR 25 mapped to design | ✅ |
| 14 | RISK_REGISTER.md | Open + accepted risks with mitigation | ✅ |
| 15 | DESIGN_REVIEW.md | 12-area scored design review | ✅ |
| 16 | DESIGN_ASSUMPTIONS.md | Explicit assumptions with impact analysis | ✅ |
| 17 | HARDWARE_STATUS.md | Current milestone, open risks | ✅ |

### Phase 0 Gate Document

| Document | Purpose | Status |
|----------|---------|--------|
| REUSE_MATRIX.md | 41 circuit blocks with NXP reference provenance | ✅ APPROVED |

### KiCad Project (hardware/kicad/project/)

| File | Purpose |
|------|---------|
| ECU.kicad_pro | Project file — net classes, ERC rules, sheet list |
| ECU.kicad_sch | Root schematic — 12 hierarchical sheet symbols |
| 00_Cover.kicad_sch | Revision history, block diagram, BOM summary |
| 01_Power.kicad_sch | Power architecture — reverse polarity, buck, LDO, VREF |
| 02_MCU_Debug_Memory.kicad_sch | STM32F407VG core, clock, decoupling, boot, debug |
| 03_CAN.kicad_sch | CAN FD ×4, TJA1043, CM chokes, termination |
| 04_USB.kicad_sch | USB-C, ESD, CC resistors |
| 05_Inputs_WBO2.kicad_sch | Analog inputs, WBO2 (CJ125), knock |
| 06_Injectors.kicad_sch | Peak & Hold ×8, TLE8888 or alternative |
| 07_Ignition.kicad_sch | IGBT gate drive ×6 |
| 08_Outputs.kicad_sch | ETC (DRV8873), boost, relays, tach |
| 09_Protection.kicad_sch | Watchdog (TPS3850), safe-state FET, ESD |
| 10_Connectors.kicad_sch | 34-pin AMPSEAL, CAN, USB, SWD, expansion |
| 11_Programming.kicad_sch | Boot config, SWD, test points, LEDs |
| sym-lib-table | Symbol library table → symbols/7100CPT.kicad_sym |
| fp-lib-table | Footprint library table → footprints/7100CPT.pretty/ |
| symbols/7100CPT.kicad_sym | Custom symbols (STM32F407VG, TLE8888, TPS3850, etc.) |
| footprints/7100CPT.pretty/ | Custom footprints (to be populated during TB-HW-002) |

### Supporting Documents

| Document | Purpose |
|----------|---------|
| 02_Hardware/docs/enclosure.md | CNC enclosure — 6061-T6, IP67, dimensions |
| 02_Hardware/docs/pcb.md | PCB construction spec — stackup, material |
| ENGINEERING_DEBT.md | 14 tracked debt items, 2 accepted |
| ENGINEERING_REVIEW.md | Independent engineering audit (2026-07-03) |

## 6. Architecture Decisions

| ADR | Title | Impact on Hardware |
|-----|-------|--------------------|
| ADR-0003 | rusEFI as firmware foundation | Unmodified upstream — adapter pattern isolates firmware |
| ADR-0004 | V1 differentiator is Studio | Hardware is production-grade but not exotic |
| D-004 | Reuse Matrix Phase 0 Gate | All MCU circuits follow STM32/ST reference designs |
| D-005 | rusEFI firmware unchanged | Hardware must support rusEFI protocol over USB CDC |

## 7. Manufacturing Services Requested

| Service | Status |
|---------|--------|
| Schematic Review | ⬚ Pending |
| PCB Layout Review | ⬚ Pending |
| DFM | ⬚ Pending |
| DFT | ⬚ Pending |
| EMC Review | ⬚ Pending |
| PCB Fabrication | ⬚ Pending |
| PCB Assembly | ⬚ Pending |
| Functional Testing | ⬚ Pending |
| Firmware Programming | ⬚ Pending |
| CNC Enclosure | ⬚ Pending |
| Prototype Assembly | ⬚ Pending |

## 8. Quantities

| Phase | Quantity | Purpose |
|-------|----------|---------|
| Prototype | 10 units | Development, testing, validation |
| Production | 1,000+ units | Commercial deployment |

## 9. Document Maturity

```
Specification Phase:      ██████████████████████████  100%  (18 documents, C3 verified)
Phase 0 Gate:             ██████████████████████████  100%  (REUSE_MATRIX.md approved)
KiCad Schematic:          ██████████████████████████  100%  (235 symbols, 12 populated sheets)
PCB Layout:               ░░░░░░░░░░░░░░░░░░░░░░░░░░    0%
Manufacturing:            ░░░░░░░░░░░░░░░░░░░░░░░░░░    0%
```

## 10. How to Use This Package

### For PCB Design Houses

1. Start with SYSTEM_ARCHITECTURE.md for block diagram and sheet hierarchy
2. Review REUSE_MATRIX.md for circuit provenance decisions
3. Read INTERFACE_SPECIFICATION.md for connector pinout
4. Open hardware/kicad/project/ECU.kicad_pro in KiCad 8.0+
5. Each sheet has reference notes pointing to the relevant specification doc
6. COMPONENT_SELECTION.md contains the critical BOM with alternatives

### For Engineers

1. Read ENGINEERING_REVIEW.md for the independent audit findings
2. Read RISK_REGISTER.md for known risks
3. Read ENGINEERING_DEBT.md for tracked technical debt
4. Read DESIGN_ASSUMPTIONS.md before modifying any circuits

### For QA Reviewers

1. Verify REUSE_MATRIX.md for circuit traceability
2. Verify COMPLIANCE_MATRIX.md against automotive standards
3. Verify ERC/DRC reports when schematic and PCB are captured

---

## 11. Revision History

| Rev | Date | Author | Changes |
|-----|------|--------|---------|
| 0.1 | 2026-07-03 | Principal Engineer | Initial design package. 18 spec docs + KiCad project skeleton. Phase 0 approved. TB-HW-002 unlocked. |
| 0.2 | 2026-07-03 | Principal Engineer | TB-HW-002 complete. 235 symbols placed across 12 sheets. All circuits populated per COMPONENT_SELECTION.md. |

---

*This is the complete hardware design package for the 7100CPT ECU Platform as of 2026-07-03.*
*KiCad project: hardware/kicad/project/ECU.kicad_pro*
