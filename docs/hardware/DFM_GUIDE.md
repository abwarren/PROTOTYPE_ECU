# DFM_GUIDE.md — Design for Manufacture

> **Date:** 2026-07-01
> **Reference:** IPC-7351, IPC-A-610 Class 3, IATF 16949 considerations

---

## 1. Component Selection for Manufacturability

| Rule | Application |
|------|-------------|
| Minimum package: 0402 | No 0201 or 01005 — requires specialized placement |
| No BGA packages | All QFP, QFN, SOIC — inspectable without X-ray |
| Exposed pad packages | All QFN/HVSON have exposed pads with thermal vias |
| Connectors with through-hole retention tabs | USB-C, Deutsch connectors — mechanical stress on SMT pads |
| Polarity markings on all polarized components | Capacitors, diodes, ICs — silkscreen dot or bar |
| Pin 1 indicators on all ICs | Silkscreen dot on PCB, matching package marking |

---

## 2. PCB Layout for Manufacturability

### Panelization (for production quantities)

- Individual board: 140 × 100 mm (estimated)
- Panel: 2×2 array (280 × 200 mm panel)
- Routing: 2.0 mm gap between boards with mouse-bite tabs
- Tabs: 5 per board edge, 1.5 mm wide, routed halfway through
- Tooling holes: 3.2 mm diameter at 4 corners of panel
- Fiducials: 1.0 mm at 3 corners of each board + 3 on panel rails

### Fiducial Marks

| Location | Count | Size |
|----------|-------|------|
| Global (board corners) | 3 | 1.0 mm pad, 2.0 mm clearance |
| Local (fine-pitch ICs) | 2 per IC (< 0.5 mm pitch) | 1.0 mm pad |

### Component Spacing

| Component Type | Min Spacing |
|---------------|-------------|
| 0402 to 0402 | 0.3 mm |
| 0603 to 0603 | 0.4 mm |
| SOIC to SOIC | 1.0 mm |
| QFP to QFP | 3.0 mm (for rework access) |
| Connector to board edge | 2.0 mm |
| Tall component (> 5 mm) to tall component | 5.0 mm (for placement head clearance) |

---

## 3. Solder Paste & Stencil

### Stencil Design

| Parameter | Value |
|-----------|-------|
| Thickness | 0.12 mm (5 mil) |
| Material | Stainless steel, laser-cut |
| Aperture reduction | 10% for fine-pitch (< 0.5 mm), 1:1 for standard |
| Home-plate apertures | For QFN exposed pads — reduces voiding |

### Solder Paste

| Parameter | Value |
|-----------|-------|
| Alloy | SAC305 (Sn96.5/Ag3.0/Cu0.5) |
| Flux | No-clean, ROL0 |
| Particle size | Type 4 (20–38 µm) for fine-pitch |

---

## 4. Reflow Profile

| Phase | Temp Range | Duration |
|-------|-----------|----------|
| Preheat | 25°C → 150°C | 60–120s |
| Soak | 150°C → 200°C | 60–120s |
| Reflow | > 217°C | 60–90s (TAL) |
| Peak | 245°C ± 5°C | 10–30s |
| Cooling | < 4°C/s | To < 100°C |

*Profile must be verified with thermocouple on the largest thermal mass component (S32K344).*

---

## 5. Inspection Criteria (IPC-A-610 Class 3)

| Defect | Accept/Reject |
|--------|---------------|
| Solder bridging | Reject — any bridge |
| Insufficient solder | Reject — less than 75% fillet height |
| Tombstoning | Reject — any lifted component |
| Solder balls | Reject — > 0.13 mm within 0.13 mm of traces |
| Voiding (QFN pads) | Reject — > 25% void area |
| Component misalignment | Reject — > 25% off pad (Class 3) |

---

## 6. Manufacturing Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| QFN voiding (TJA1043 HVSON-14) | Medium | Medium | Home-plate stencil apertures. X-ray inspection on first article. |
| Tombstoning (0402 passives) | Low | Low | Balanced copper on both pads. Paste deposit verification. |
| Connector coplanarity (USB-C) | Medium | High | Mid-mount connector requires precise placement. Jig for hand-solder if needed. |
| Thermal mass imbalance (large MCU vs 0402) | Low | Medium | Profile based on MCU requirements. Smaller parts follow. |
| Solder wicking into thermal vias | Medium | Medium | Tent vias on back side. Plug vias if wicking observed. |

---

## 7. Assembly Sequence (Prototype)

1. **SMT Bottom Side** — Low-profile passives, test points
2. **Reflow Bottom Side**
3. **SMT Top Side** — ICs, passives, connectors
4. **Reflow Top Side**
5. **Through-Hole** — Connectors, fuse holder, large capacitors
6. **Hand Solder or Selective Wave**
7. **Inspection** — AOI + X-ray for QFN
8. **Conformal Coating** (if required)
9. **Functional Test**
