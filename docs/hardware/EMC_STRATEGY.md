# EMC_STRATEGY.md — Electromagnetic Compatibility Design

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Target:** CISPR 25 Class 3 (vehicle), CISPR 32 Class B (residential)

---

## 1. EMC Philosophy

EMC is designed in, not tested in. Every component placement, every trace route, every layer assignment is made with radiated and conducted emissions in mind. Fixing EMC after layout costs 10× more than designing it in.

---

## 2. Radiated Emissions Strategy

### Sources (what radiates)

| Source | Frequency | Mechanism |
|--------|-----------|-----------|
| Buck converter switch node | 400 kHz + harmonics to 1 GHz | dv/dt and di/dt on switching node |
| CAN bus transceivers | 1–8 Mbps data edges (50 MHz–200 MHz harmonics) | Differential-mode current converted to common-mode |
| MCU clock + I/O | 160 MHz clock + harmonics | Clock edges, I/O ringing |
| USB D+/D- | 12 MHz (FS) ± harmonics | Differential signal imbalance |
| Ignition coil primary switching | 1–10 Hz in operation, 100 kHz ring on flyback | Large current transients |

### Mitigations

| Mitigation | Target Source | Implementation |
|------------|---------------|---------------|
| 6-layer PCB with solid ground plane (L2) | All | Continuous ground plane under all components. No slots, splits, or voids. |
| Shielded inductor on buck converter | Buck switch node | Coilcraft XAL series (molded, shielded). Ferrite bead on output. |
| Snubber on buck switch node | Buck ringing | 10 Ω + 1 nF RC snubber from switch node to GND. Reduces ringing below 60V. |
| CM choke on every CAN channel | CAN | ACT45B-510-2P-TL003 (51 µH CM). Placed within 10 mm of connector. |
| Split termination on CAN | CAN | 60Ω || 60Ω + 4.7 nF to GND. Reduces common-mode current by 20 dB. |
| 22 Ω series on USB D+/D- | USB | Matches 45 Ω driver impedance. Reduces reflections. |
| Ferrite bead on every I/O line > 10 cm | Long traces | 600 Ω at 100 MHz. Placed near MCU pin. |
| Ferrite bead on power input | VBAT | 600 Ω at 100 MHz. Placed at connector. With 10 µF to GND. |
| RC low-pass on analog inputs | ADC inputs | 1kΩ + 10nF (fc = 16 kHz). Placed at connector pin. |
| RC low-pass on digital inputs | Digital inputs | 100 Ω + 100 pF (fc = 16 MHz). Placed at connector pin. |

---

## 3. Conducted Emissions Strategy

### Voltage Rail Filtering

| Rail | Filter | Corner Freq | Notes |
|------|--------|-------------|-------|
| VBAT input | Ferrite bead + 10 µF || 47 µF | Two-stage filter at connector |
| 5V buck output | 100 µF electrolytic + 22 µF ceramic | — | Bulk + high-freq decoupling |
| 3.3V LDO output | 100 µF tantalum + 10 µF ceramic | — | Bulk + high-freq |
| VREF | 10 µF ceramic + 0.1 µF | — | Low noise for ADC |

### I/O Line Filtering

| Signal | Filter | Notes |
|--------|--------|-------|
| CAN H/L | CM choke + 100 pF to GND (at connector) | 100 pF shunt after CM choke. Not on CANH-to-CANL — would load the bus. |
| USB D+/D- | 22 Ω series + TPD2EUSB30 to GND | ESD device provides ~0.05 pF shunt. |
| Analog sensor inputs | 1kΩ series + 10 nF to GND | At connector pin. fc = 16 kHz. |
| Injector outputs | No filter | 12V PWM — filter would dissipate power. Ferrite bead if EMC fails. |
| Ignition outputs | No filter | Gate drive only. Low current. |

---

## 4. PCB Layout Guidelines for EMC

### Layer Stack

```
L1 (Signal + Components) — Critical signals only
  ── Prepreg ──
L2 (Solid Ground) — 0V reference for ALL signals
  ── Core ──
L3 (Signal) — Low-speed, routed over L2 ground
  ── Prepreg ──
L4 (Power Plane) — Split: 5V, 3.3V regions
  ── Core ──
L5 (Signal) — Remaining signals
  ── Prepreg ──
L6 (Signal + Components) — Low-priority + test points
```

**Key rule:** Every signal on L1 has an immediate return path on L2 directly beneath it. No exceptions. This minimizes loop area for every trace.

### Critical Placements

| Component | Placement Rule |
|-----------|---------------|
| Crystal (40 MHz) | Within 20 mm of MCU EXTAL/XTAL. No traces under crystal. Guard ring around crystal. |
| Buck inductor | Away from analog inputs (> 30 mm). Shielded inductor preferred. |
| CAN transceivers | Within 20 mm of connector. CM choke between transceiver and connector. |
| USB ESD device | Within 10 mm of USB-C connector. Between connector and MCU. |
| VREF | Within 20 mm of MCU VREFH pin. Guard trace. |
| ADC input filters | At connector pin. Filtered trace to MCU ADC input. Away from switching nodes. |

### Routing Rules

| Signal | Track Width | Spacing | Impedance | Notes |
|--------|-------------|---------|-----------|-------|
| USB D+/D- | 0.30 mm | 0.20 mm | 90 Ω diff | Matched length (< 2 mm skew) |
| CAN H/L | 0.25 mm | 0.25 mm | 120 Ω diff | Matched length (< 5 mm skew) |
| RMII (Ethernet) | 0.20 mm | 0.20 mm | 50 Ω SE | Matched length clock-to-data (< 10 mm) |
| Crystal | 0.20 mm | 3× trace width | N/A | Symmetric. No vias. |
| Analog | 0.25 mm | 3× trace width | N/A | Guard trace to GND if > 30 mm |
| Power switch node | 0.5 mm+ | 3× trace width | N/A | Minimum length. No layer changes. |
| High-current (> 2A) | 1.0 mm+ (2 oz if possible) | 2× trace width | N/A | Use copper pours, not traces, for high current |

---

## 5. Pre-Compliance Testing Plan

### Recommended Equipment

| Equipment | Purpose | Cost |
|-----------|---------|------|
| Spectrum analyzer + near-field probes | Identify radiating sources | $1K (Rigol DSA815) or rental |
| LISN (Line Impedance Stabilization Network) | Conducted emissions measurement | $500 (Tekbox TBLC08) |
| TEM cell (optional) | Radiated emissions in small enclosure | $2K |

### Test Procedure

1. **Conducted emissions** (150 kHz–108 MHz) — LISN on VBAT input. Scan buck converter at full load, idle, and CAN transmitting.
2. **Radiated near-field** (150 kHz–1 GHz) — Near-field probe over buck inductor, CAN transceiver, MCU, USB. Identify hot spots.
3. **Radiated far-field** (30 MHz–1 GHz) — EMC chamber (rental). Full CISPR 25 setup with antenna at 1m.

### Acceptance Criteria (V1 Prototype)

- Pass CISPR 25 Class 3 with 6 dB margin on all measured frequencies
- If any frequency exceeds limit by < 6 dB: acceptable for prototype. Document for V2 fix.
- If any frequency exceeds limit by > 6 dB: investigate and fix before production

---

## 6. Immunity Strategy

| Threat | Mitigation |
|--------|-----------|
| Radiated immunity (20 MHz–2 GHz, 30 V/m) | Solid ground plane. Ferrites on I/O. Shielded enclosure (aluminum). |
| Conducted immunity (150 kHz–80 MHz, BCI) | Ferrites on all I/O. TVS on all power rails. 100 nF at every connector pin. |
| ESD (±8 kV contact) | TVS or ESD-specific devices on every external connector. |
| Magnetic field (1 kHz, 100 A/m) | Twist all wire pairs. Keep loop areas small. No large current loops on PCB. |

---

## 7. Open Issues

| # | Issue | Action |
|---|-------|--------|
| E-001 | Pre-compliance EMC testing not budgeted | Allocate $2K for EMC lab session before PCB fab |
| E-002 | Shielded enclosure design not started | Mechanical engineer to design aluminum enclosure with EMI gaskets |
| E-003 | Ignition coil primary switching conducted emissions unknown | Test on prototype. Add ferrite if needed. |
