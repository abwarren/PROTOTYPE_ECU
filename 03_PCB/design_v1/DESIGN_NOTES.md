# 7100CPT PCB V1 — Design Notes

> **Last updated:** 2026-07-07

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

## Known Issues

### Wiring Gaps
- 10_Connectors: Connector symbols (J1A/J1B via DTM_42PIN) are placed but have no
  wire segments — they must be wired to their respective signal nets
- 11_Programming: TC2050, resistors, and test points are placed but lack wire connections
  to power rails and MCU debug signals

### Connector Symbol Migration
- Sheet 10 currently uses DTM_42PIN custom symbols (from the original 42-pin Deutsch design)
- These must be replaced with a 34-pin AMPSEAL 16 symbol and footprint
- The existing DTM_42PIN symbol in 7100CPT.kicad_sym can serve as a template
- Open items:
  - Create AMPSEAL-16-35POS symbol in 7100CPT.kicad_sym
  - Replace J1A/J1B symbol instances on Sheet 10
  - Wire the 34 signal pins to their respective nets

### Cover Sheet
- Block diagram is ASCII text, not KiCad symbol instances — purely decorative
- Should be converted to proper hierarchical sheet symbols when time permits
