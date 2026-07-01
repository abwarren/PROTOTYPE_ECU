# TB-HW-003 — PCB Layout

> **Status:** ⬚ Pending (blocked by TB-HW-002)
> **Prerequisite:** TB-HW-002 (KiCad Schematic)
> **Reference:** PCB_DESIGN_GUIDE.md, EMC_STRATEGY.md

---

## Objective

Route the 6-layer PCB implementing the TB-HW-002 schematic. DRC clean. Controlled impedance verified.

### Scope

- [ ] 6-layer PCB routed per PCB_DESIGN_GUIDE.md stackup
- [ ] DRC clean (0 errors)
- [ ] Length matching on USB D+/D- (< 2 mm skew)
- [ ] Length matching on CAN H/L (< 5 mm skew)
- [ ] Controlled impedance verified (USB 90Ω, CAN 120Ω, RMII 50Ω)
- [ ] All decoupling caps placed per MCU datasheet
- [ ] Thermal vias under all exposed pads
- [ ] Ground plane stitching along board edges
- [ ] Test points accessible from bottom layer
- [ ] Silkscreen: polarity marks, pin 1 indicators, connector labels
- [ ] 3D model alignment check (if models exist)

### QA Gates

| Gate | Criteria |
|------|----------|
| DRC Clean | 0 errors |
| Impedance Verified | USB, CAN, RMII within ±10% |
| Length Matching | Diff pairs matched to spec |
| Test Points | Every critical net has accessible test point |
| Manufacturing | Fiducials, tooling holes, board outline correct |
| Silkscreen | No overlapping, all polarity marks present |
