# PCB_DESIGN_GUIDE.md — PCB Layout Rules & Manufacturing Notes

> **Date:** 2026-07-01
> **Reference:** IPC-2221, IPC-7351, IPC-6012 Class 3

---

## 1. PCB Specifications

| Parameter | Value |
|-----------|-------|
| Layers | 6 |
| Material | High-Tg FR4 (Tg > 170°C) |
| Thickness | 1.6 mm ± 10% |
| Copper outer | 1 oz (35 µm) |
| Copper inner | 0.5 oz (17 µm) |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) — 3 µm Ni / 0.05 µm Au |
| Solder mask | Green, LPI (Liquid Photo-Imageable) |
| Silkscreen | White |
| Min trace/space | 0.15 mm / 0.15 mm |
| Min via | 0.45 mm drill / 0.80 mm pad |
| Controlled impedance | USB (90Ω diff), CAN (120Ω diff), RMII (50Ω SE) |

---

## 2. Stack-Up Detail

```
───── L1: Signal + Components ───── 1 oz Cu + plating
       Prepreg 2116 (0.12 mm)
───── L2: Ground Plane ──────────── 0.5 oz Cu
       Core (0.20 mm)
───── L3: Signal (inner) ────────── 0.5 oz Cu
       Prepreg 7628 (0.18 mm)
───── L4: Power Plane ───────────── 0.5 oz Cu
       Core (0.20 mm)
───── L5: Signal (inner) ────────── 0.5 oz Cu
       Prepreg 2116 (0.12 mm)
───── L6: Signal + Components ───── 1 oz Cu + plating
─────────────────────────────────────────
Total: 1.6 mm (63 mil)
```

---

## 3. Design Rules

### Global Rules

| Rule | Value |
|------|-------|
| Clearance (trace-to-trace) | 0.15 mm |
| Clearance (trace-to-pad) | 0.15 mm |
| Clearance (pad-to-pad) | 0.20 mm |
| Min trace width | 0.15 mm |
| Min annular ring | 0.15 mm |
| Copper-to-edge clearance | 0.50 mm |

### Net Classes

| Class | Width | Clearance | Via |
|-------|-------|-----------|-----|
| Default (signal) | 0.20 mm | 0.15 mm | 0.45/0.80 mm |
| Power (1A) | 0.50 mm | 0.30 mm | 0.60/1.00 mm |
| Power (5A) | 1.50 mm | 0.50 mm | 0.80/1.40 mm (×2) |
| High Current (15A) | Copper pour (10 mm width) | 1.00 mm | Multiple vias |
| USB (90Ω diff) | 0.30 mm | 0.20 mm | — |
| CAN (120Ω diff) | 0.25 mm | 0.25 mm | — |
| Crystal | 0.20 mm | 0.60 mm | None allowed |

---

## 4. Component Placement

### Priority Order

1. **Connectors** — fixed by enclosure. Place first.
2. **MCU** — center of board. Orient for shortest routes to connectors.
3. **Crystal** — within 20 mm of MCU. No traces underneath.
4. **Buck converter** — near battery input. Away from analog.
5. **CAN transceivers** — within 20 mm of their connectors.
6. **Protection devices** — at connector entry points.
7. **Decoupling caps** — at each IC power pin.
8. **Test points** — accessible from bottom layer.

### Keep-Out Zones

| Zone | Area | Reason |
|------|------|--------|
| Crystal | 5 mm radius around crystal | No signal traces, no copper pour |
| Buck inductor | 10 mm radius | No analog traces. E-field radiates. |
| Antenna (future) | 15 mm from board edge, no copper | Antenna keep-out per module datasheet |
| Mounting holes | 5 mm radius from hole center | No components, no traces |

---

## 5. Via Strategy

| Via Type | Drill | Pad | Use |
|----------|-------|-----|-----|
| Standard signal | 0.45 mm | 0.80 mm | General routing |
| Power via | 0.60 mm | 1.00 mm | Power distribution (> 1A) |
| Thermal via | 0.30 mm | 0.60 mm | Under exposed pads, array of 4-9 |
| Stitching via | 0.45 mm | 0.80 mm | Ground plane stitching (board edges, between zones) |

**Thermal via rules:**
- Under all exposed pads (MCU, buck converter, CAN transceivers, LDOs)
- 0.30 mm drill, 1.0 mm pitch grid
- Connect to all ground/power planes
- Tent vias (cover with solder mask) to prevent solder wicking

**Stitching via rules:**
- Along board edge: every 5 mm
- Between ground regions: every 10 mm
- Near connectors: 2 vias per connector within 5 mm

---

## 6. Controlled Impedance Traces

| Signal | Type | Z0 | Zdiff | Layer | Trace/Spacing |
|--------|------|-----|-------|-------|---------------|
| USB D+/D- | Differential | — | 90Ω ± 10% | L1 | 0.30 mm / 0.20 mm |
| CAN H/L | Differential | — | 120Ω ± 10% | L1 | 0.25 mm / 0.25 mm |
| RMII TX/RX | Single-ended | 50Ω ± 10% | — | L1 | 0.35 mm |

*These values assume standard 1.6mm 6-layer stackup. Verify with manufacturer's impedance calculator before fabrication.*

---

## 7. Manufacturing Notes

### Gerber Files

- RS-274X format, 2:4 precision (imperial, 0.0001 inch)
- Include: NC drill file (Excellon 2), IPC-356 netlist
- All layers: .GTL, .GTS, .GTO, .GTP, .G1–.G6 (signals + planes)

### Fabrication Notes (Include in README.txt with Gerbers)

```
1. Material: High-Tg FR4, Tg > 170°C
2. IPC-6012 Class 3 acceptance
3. ENIG finish: 3µm Ni, 0.05µm Au
4. Controlled impedance on USB, CAN, RMII per supplied stackup
5. 100% electrical test (flying probe)
6. TDR report for controlled impedance traces
7. Cross-section coupon for stackup verification
8. Date code and UL marking on silkscreen
9. Solder mask: green LPI, both sides
10. No HASL — ENIG only
```

### Panelization

For production (not prototype):
- 2×2 array (4 boards per panel)
- 5 mm routing gap with mouse-bite tabs (5 tabs per side, 1.5 mm tab width)
- Tooling holes: 3.2 mm at panel corners
- Fiducials: 1.0 mm pads at 3 corners of each board + panel corners

---

## 8. Assembly Notes

### SMT Assembly

- Solder paste: SAC305 (Sn96.5/Ag3.0/Cu0.5), no-clean flux
- Stencil: 0.12 mm (5 mil) laser-cut stainless steel
- Reflow profile: per SAC305 specification (peak 245°C, TAL > 60s above 217°C)
- Placement: 0402 and larger. No 0201 or 01005.
- BGA: none (all QFP / QFN packages)

### Through-Hole Assembly

- Wave solder or selective solder for connectors, fuse holder, large capacitors
- Hand-solder acceptable for prototype (1-5 units)
- Gold-plated pads for connector pins

### Inspection

- AOI (Automated Optical Inspection) for SMT
- X-ray for QFN exposed pads (voiding < 25%)
- Visual inspection to IPC-A-610 Class 3

---

## 9. Test Points

| Signal | Test Point | Notes |
|--------|-----------|-------|
| VBAT | 2.0 mm pad | Voltage check |
| 5V | 1.5 mm pad | Voltage check |
| 3.3V | 1.5 mm pad | Voltage check |
| VREF | 1.5 mm pad | Voltage check |
| V15 | 1.0 mm pad | MCU core voltage |
| RESET | 1.0 mm pad | Reset monitor |
| CAN0 H/L | 2× 1.0 mm pads | Differential probe |
| USB D+/D- | 2× 1.0 mm pads | Differential probe |
| SWDIO / SWCLK | 1.0 mm pads on debug header | Already accessible |
| All GPIO (spare) | Via to L6 as 1.0 mm pad | Flying probe access |
| Ground reference | Multiple 2.0 mm pads | Scope ground clip |
