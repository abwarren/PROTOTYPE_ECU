# POWER_ARCHITECTURE.md — Prototype ECU Power System Design

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Reference:** ISO 16750-2, ISO 7637-2

---

## 1. System Requirements

| Parameter | Min | Nominal | Max | Notes |
|-----------|-----|---------|-----|-------|
| Input voltage (12V) | 6V | 12V | 16V | Cranking: 6V dip for 15 ms |
| Input voltage (24V) | 16V | 24V | 36V | Heavy truck / marine |
| Quiescent current (sleep) | — | — | 100 µA | Wake on CAN activity |
| Operating current (active) | — | 2A | 5A | All outputs active |
| Peak current (cranking) | — | — | 15A | Injector + ignition + starter surge |

---

## 2. Power Tree

```
Vehicle Battery (6-36V)
    │
    ├──→ Reverse Polarity Protection (ideal diode)
    │       │
    │       ├──→ Transient Suppression (TVS + load dump)
    │       │
    │       ├──→ 60V → 5V Buck Converter (LMR36506 or similar)
    │       │       │
    │       │       ├──→ 5V Rail
    │       │       │       ├──→ CAN Transceivers (×4)
    │       │       │       ├──→ USB-C VBUS switching
    │       │       │       └──→ Knock sensor interface (5V analog)
    │       │       │
    │       │       └──→ 5V → 3.3V LDO (TPS7A16xx or similar)
    │       │               │
    │       │               ├──→ 3.3V Rail (VDD_HV)
    │       │               │       ├──→ S32K344 VDD_HV_A/B/CAN/FLA
    │       │               │       ├──→ External Flash (if used)
    │       │               │       ├──→ FRAM (if used)
    │       │               │       ├──→ Ethernet PHY
    │       │               │       └──→ Status LEDs
    │       │               │
    │       │               └──→ S32K344 Internal 1.5V Regulator
    │       │                       │
    │       │                       └──→ V15 core supply (decoupled per datasheet)
    │       │
    │       ├──→ 60V → 5V Buck #2 (secondary, for sensor supply)
    │       │       │
    │       │       └──→ VREF (5.0V precision reference for ADC)
    │       │               │
    │       │               ├──→ TPS (×2), MAP, FPS, OPS (ratiometric)
    │       │               └──→ Knock bias (VREF/2 via op-amp)
    │       │
    │       └──→ Direct Battery (unregulated 12V, protected)
    │               │
    │               ├──→ Injector drivers (peak & hold, needs 12V)
    │               ├──→ Ignition drivers (IGBT, needs 12V)
    │               ├──→ ETC H-bridge (needs 12V motor supply)
    │               ├──→ Relay drivers (low-side, 12V load)
    │               └──→ WBO2 heater supply (12V, current-limited)
```

---

## 3. Detailed Blocks

### 3.1 Reverse Polarity Protection

**Circuit:** P-channel MOSFET + Zener clamp (ideal diode topology)

```
VBAT ──┬── Fuse (30A automotive blade)
       │
       ├── TVS (SMBJ33A — 33V standoff, 53.3V clamp)
       │
       ├── P-MOSFET (IPD90P04P4L-04 or similar)
       │   │   Vgs(max) = ±20V → Zener clamp gate to source
       │   │   Rds(on) < 5 mΩ at Vgs = -10V
       │   │   Continuous drain current > 15A
       │   │
       │   └──→ Protected VBAT rail
       │
       └── GND
```

**DFM Notes:**
- P-MOSFET in SO-8 or DPAK package — surface mount with thermal copper pour
- Gate-source zener: 15V (protects gate oxide)
- Gate pull-down resistor: 100k (ensures MOSFET on during normal polarity)
- Fuse holder: through-hole for field replacement

### 3.2 Transient Suppression

| Threat | Protection | Part |
|--------|-----------|------|
| Load dump (12V system) | 33V TVS, 1500W peak | SMBJ33A (or SMCJ33A for 24V) |
| ESD (±8 kV contact) | TVS on each connector pin | PESD5V0 (USB), PESD24VL (I/O) |
| Reverse battery (−14V for 60s) | P-MOSFET blocks reverse current | IPD90P04P4L-04 |
| Jump start (24V into 12V system) | Buck converter rated to 60V input | LMR36506 (3-60V input) |

### 3.3 Primary Buck Converter (12V → 5V, 2A)

**Design:** LMR36506 — 3-60V input, 5V output, 600 mA per device. Use 2 in parallel or larger device.

**Alternative for higher current:** LMR33630 (3-36V input, 5V output, 3A).

| Parameter | Value |
|-----------|-------|
| Vin | 6-36V (survives 60V load dump) |
| Vout | 5.0V ± 2% |
| Iout(max) | 3A continuous |
| Switching freq | 400 kHz (above AM radio band, below conducted EMI limits) |
| Inductor | 15 µH, 5A saturation, shielded (Coilcraft XAL series) |

**Output Capacitors:**
- 2× 22 µF ceramic (X7R, 25V) — low ESR for ripple
- 1× 100 µF electrolytic (25V, low ESR) — bulk decoupling

**Input Capacitors:**
- 2× 10 µF ceramic (X7R, 50V)
- 1× 47 µF electrolytic (50V) — bulk input

**DFM Notes:**
- Inductor: shielded to reduce radiated EMI
- Place input caps within 5 mm of VIN pin
- Thermal vias under exposed pad to ground plane
- Snubber (10 Ω + 1 nF) on switch node if ringing exceeds 60V

### 3.4 LDO (5V → 3.3V, 500 mA)

**Design:** TPS7A1633 — 60V input, 3.3V fixed output, 100 mA. Parallel with larger device.

**Alternative for higher current:** TPS7A4700 (adjustable, 1A) or TPS7A8300 (2A, low noise).

| Parameter | Value |
|-----------|-------|
| Vin | 5.0V |
| Vout | 3.3V ± 1% |
| Iout(max) | 500 mA |
| Dropout | 200 mV at 500 mA |

**Output Capacitors:**
- 10 µF ceramic (X7R) — required for stability
- 100 µF tantalum — bulk decoupling for MCU

**DFM Notes:**
- Thermal vias under exposed pad
- Place close to MCU VDD_HV pins
- Ferrite bead (600 Ω @ 100 MHz) on output for EMI filtering

### 3.5 VREF (Precision 5.0V Reference)

**Design:** REF5050IDGKT — 5.0V precision reference, 0.05% accuracy, 3 ppm/°C drift.

| Parameter | Value |
|-----------|-------|
| Vin | 6-12V (from primary buck, boosted or separate LDO) |
| Vout | 5.000V ± 0.05% |
| Iout | 10 mA max |
| Temp drift | 3 ppm/°C |

**Loads:**
- All ratiometric sensors (TPS, MAP, FPS, OPS)
- ADC VREFH input on S32K344
- Knock sensor bias divider

**DFM Notes:**
- Place within 20 mm of MCU VREFH pin
- Guard ring around VREF trace
- 10 µF + 0.1 µF decoupling at output

---

## 4. Power Sequencing

```
Power applied:
  1. VBAT rises → P-MOSFET turns on → protected VBAT available (t < 1 ms)
  2. Buck converter starts → 5V rail stable (t < 5 ms)
  3. LDO starts → 3.3V rail stable (t < 7 ms)
  4. S32K344 V15 internal regulator starts → 1.5V core (t < 10 ms)
  5. POR released → RESET_b goes high → bootROM runs (t < 15 ms)

Power removed:
  1. VBAT falls
  2. Buck converter drops out at ~4.5V input
  3. 5V rail decays → 3.3V rail follows
  4. Brown-out detect at 2.7V on VDD_HV → MCU enters safe state
  5. All outputs default to safe state (injectors off, ignition off, ETC idle)
```

**Critical requirement:** ETC motor supply must drop before MCU loses control. This is guaranteed by:
- ETC driver powered from same 12V rail as MCU buck
- MCU brown-out triggers before 5V rail drops below ETC driver minimum

---

## 5. Ground Strategy

```
┌─────────────────────────────────────────┐
│              GROUND PLANE                │
│         (Layer 2, solid copper)          │
│                                          │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  │
│  │ Digital  │  │  Analog   │  │ Power  │  │
│  │ Ground   │  │  Ground   │  │ Ground │  │
│  │          │  │           │  │        │  │
│  │ MCU,     │  │ Sensors,  │  │ Buck,  │  │
│  │ CAN,     │  │ ADC,      │  │ LDO,   │  │
│  │ USB,     │  │ VREF,     │  │ FETs   │  │
│  │ ETH      │  │ Knock     │  │        │  │
│  └────┬─────┘  └─────┬─────┘  └───┬────┘  │
│       │              │            │        │
│       └──────────────┼────────────┘        │
│                      │                     │
│              ┌───────▼────────┐            │
│              │  STAR POINT    │            │
│              │  (near MCU)    │            │
│              └────────────────┘            │
└─────────────────────────────────────────┘
```

- **Single ground plane** — no split planes. Star-point connection at a single location near the MCU.
- **Analog sensor returns** routed as differential pairs to the star point
- **High-current returns** (injectors, ignition) routed directly to star point with wide traces (>2 mm)
- **Chassis ground** connected at star point via 1 MΩ || 10 nF (AC-coupled for ESD)

---

## 6. Decoupling Strategy

| Rail | Bulk | High-Freq | Placement |
|------|------|-----------|-----------|
| VBAT | 47 µF electrolytic + 2× 10 µF ceramic | — | Near connector |
| 5V | 100 µF electrolytic | 2× 22 µF + 4× 0.1 µF ceramic | Near buck + distributed |
| 3.3V | 100 µF tantalum | 10 µF + 4× 0.1 µF at MCU | Per MCU VDD bank |
| 1.5V (V15) | Per datasheet | 2× 2.2 µF ceramic at each V15 pin | Within 5 mm of pin |
| VREF | 10 µF ceramic | 0.1 µF ceramic | Within 10 mm of MCU VREFH |

---

## 7. Power Budget

| Rail | Load | Current (typ) | Current (max) |
|------|------|--------------|---------------|
| 3.3V | S32K344 (160 MHz) | 150 mA | 250 mA |
| 3.3V | External Flash (if used) | 20 mA | 40 mA |
| 3.3V | Ethernet PHY | 50 mA | 80 mA |
| 3.3V | LEDs + misc | 10 mA | 20 mA |
| 3.3V | **Subtotal** | **230 mA** | **390 mA** |
| 5V | CAN transceivers ×4 | 20 mA | 40 mA |
| 5V | USB VBUS (device mode) | 0 mA | 0 mA |
| 5V | Sensor supply (VREF buffer) | 10 mA | 15 mA |
| 5V | **Subtotal** | **30 mA** | **55 mA** |
| 12V | Injectors (×8, peak & hold) | 4A avg | 12A peak |
| 12V | Ignition (×8, IGBT) | 2A avg | 8A peak |
| 12V | ETC motor | 1A | 3A peak |
| 12V | WBO2 heaters ×2 | 2A | 4A |
| 12V | Relay coils ×4 | 0.4A | 0.8A |
| 12V | **Subtotal** | **9.4A** | **27.8A** |

**Total input power (max):** ~15A continuous, ~30A peak (cranking + all outputs).
**Fuse rating:** 30A automotive blade fuse (ATO/ATC).

---

## 8. Thermal Considerations

| Component | Package | Pd (max) | θJA | Tj(max) | Notes |
|-----------|---------|----------|-----|---------|-------|
| S32K344 | HLQFP176 | 0.5W | 35°C/W | 125°C | Exposed pad to plane |
| LMR33630 | SOIC-8 EP | 1.5W | 40°C/W | 125°C | Thermal vias required |
| Injector FETs | DPAK | 2W each | 50°C/W | 150°C | 2 oz copper pour for heat spreading |
| Ignition IGBTs | DPAK | 1W each | 50°C/W | 150°C | — |

**At Tamb = 85°C (engine bay):**
- S32K344: Tj = 85 + (0.5 × 35) = 102.5°C ✅
- LMR33630: Tj = 85 + (1.5 × 40) = 145°C ❌ — requires heatsink or different part

**Mitigation for LMR33630:**
- Use larger package (VQFN with better θJA) or synchronous buck with external FETs
- Alternative: TPS54560 (5A, SOIC-8 EP, θJA = 32°C/W → Tj = 85 + 48 = 133°C — still marginal)
- **Recommendation:** Use automotive-grade buck controller with external MOSFETs for production. For prototype, acceptable with thermal pad to enclosure.

---

## 9. Design Review Checklist

| Check | Status |
|-------|--------|
| Reverse polarity protected | ✅ P-MOSFET ideal diode |
| Load dump suppressed | ✅ 33V TVS, 60V-rated buck |
| Brown-out detection | ✅ S32K344 LVD at 2.7V |
| Safe state on power loss | ✅ ETC returns to idle, injectors off |
| Quiescent current < 100 µA | ⚠️ To verify — buck quiescent 25 µA typ |
| All rails decoupled | ✅ Per datasheet |
| Single ground plane | ✅ Star-point topology |
| Thermal budget within limits | ⚠️ Buck converter marginal at 85°C ambient |
