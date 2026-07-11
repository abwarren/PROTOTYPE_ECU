# 7100CPT PCB V1 — Design Notes

> **Last updated:** 2026-07-11

## Layer Stackup Decision

The current PCB V1 uses a **2-layer** stackup (F.Cu + B.Cu), while the production spec
in DESIGN_PACKAGE.md calls for **6-layer**.

**Rationale for 2-layer prototype:**
- Lower prototype cost (JLCPCB/PCBWay ~$5 vs ~$50 for 6-layer)
- Faster turnaround for initial bring-up and firmware development
- Adequate for basic functional testing of power, CAN, and sensor paths

**Transition to 6-layer (production):**
- Required for CISPR 25 Class 3 EMC compliance
- Dedicated ground plane (Layer 2) for controlled impedance and noise isolation
- Required for CAN FD signal integrity at longer bus lengths
- Mandatory before automotive validation testing

**Gate:** Move to 6-layer when TB-HW-003 (PCB Layout V2) begins.

## Fixes Applied (2026-07-11)

### Connector Migration (42-pin Deutsch → 35-pin AMPSEAL 16)
- Created AMPSEAL16_35PIN symbol in 7100CPT.kicad_sym
- Replaced DTM_42PIN on Sheet 10 with AMPSEAL16_35PIN (J1)
- Signal mapping consolidated: grounds merged from 4→3 per signal class
- Dropped from original 42-pin set: KNOCK2, OP, RELAY_SP (moved to spare/NC)
- Added WBO2-specific 4-pin Deutsch DTM connectors (J6, J7) for sensor pigtails
- Updated INTERFACE_SPECIFICATION.md with new pinout

### Library Path Fix
- sym-lib-table: ${KIPRJMOD}/symbols/ → ${KIPRJMOD}/../symbols/
- fp-lib-table: ${KIPRJMOD}/footprints/ → ${KIPRJMOD}/../footprints/
- Resolves KiCad not finding custom symbols/footprints

### MCU Reference Alignment
- All 11 sheets: comment 2 updated from "NXP S32K344" to "STM32F407VG"
- Cover sheet ASCII art and BOM summary updated to STM32F407VG

### Sheet 11 Wiring
- Added global labels (+3V3, SWDIO, SWCLK, SWO, ~RESET, +5V)
- Wired TC2050 debug header through series resistors to global labels
- Connected test points to respective power/signal rails

## Known Issues

### Wiring Gaps
- 10_Connectors: Signal labels placed but AMPSEAL pins not yet wired to bus labels
  (hierarchical connectivity via global labels pending full sheet cross-reference)
- Cover sheet block diagram is ASCII text, not KiCad symbol instances
- 35-pin AMPSEAL footprint (7100CPT:AMPSEAL-16-35) not yet created in footprint library

### Signal Consolidation from 42-pin → 35-pin AMPSEAL
- Dropped signals that are optional for V1 prototype:
  - KNOCK2 (dual-knock deferred)
  - OP (oil pressure — FP retained as priority)
  - RELAY_SP (spare relay position)
- WBO2 moved to dedicated 4-pin Deutsch DTM pigtails (J6, J7) — better sensor placement

### Connector Symbol Migration — Future
- Create AMPSEAL-16-35 footprint in 7100CPT.pretty
- Add WBO2 connector footprint (DTM06-4S)
- Wire cross-sheet global labels on Sheet 10 to complete signal routing
