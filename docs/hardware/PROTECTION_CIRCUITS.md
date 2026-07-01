# PROTECTION_CIRCUITS.md — Input & Output Protection Design

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Reference:** ISO 16750-2, ISO 7637-2, IEC 61000-4-2

---

## 1. Protection Strategy Overview

```
External World                    ECU Boundary                    MCU
──────────────                    ────────────                    ───

Vehicle Battery ─→ Reverse Polarity ─→ TVS Clamp ─→ Buck ─→ 3.3V ─→ MCU
CAN Bus        ─→ CM Choke + ESD  ─→ Transceiver ─→ CAN_RX/TX ─→ MCU
USB-C          ─→ ESD Array       ─→ ESD + EMI   ─→ USB_DP/DM ─→ MCU
Sensor Inputs  ─→ RC Filter +     ─→ Op-amp      ─→ ADC pin   ─→ MCU
                  Clamp Diodes       Buffer
Injector Load  ─→ Flyback Diode   ─→ Current     ─→ PWM pin   ─→ MCU
                                      Sense
Ignition Coil  ─→ IGBT Clamp      ─→ Gate Drive  ─→ PWM pin   ─→ MCU
```

**Principle:** Every pin exposed to the outside world has at least one stage of protection before reaching the MCU.

---

## 2. Transient Voltage Suppression (TVS)

### Primary TVS — Battery Input

| Parameter | Value |
|-----------|-------|
| Part | SMCJ33A (or 5.0SMDJ33A for 24V systems) |
| Standoff voltage | 33V |
| Breakdown voltage | 36.7–40.6V |
| Clamping voltage | 53.3V at 28.1A |
| Peak pulse power | 1500W (10/1000 µs) |
| Package | SMC (DO-214AB) |

**Placement:** Within 10 mm of battery connector. Directly across VBAT and GND. Minimal trace inductance.

**DFM:** Place on bottom layer under connector for shortest path.

### Secondary TVS — Protected Rails

| Rail | Part | Standoff | Clamp |
|------|------|----------|-------|
| 5V | SMAJ6.0A | 6.0V | 10.3V |
| 3.3V | SMAJ3.3A | 3.3V | 5.9V |
| VREF | PESD5V0S1BA (ESD only) | 5.0V | — |

---

## 3. Load Dump Protection

### Requirement (ISO 16750-2, Test Pulse 5a)

- 12V system: 87V peak, 400 ms, Ri = 0.5 Ω
- 24V system: 174V peak, 350 ms, Ri = 1.5 Ω

### Design

| Component | Function |
|-----------|----------|
| SMCJ33A TVS | Clamps load dump to ~53V |
| LMR36506 (60V-rated buck) | Survives clamped load dump |
| 100 µF electrolytic at input | Absorbs energy during clamp |

**DFM:** TVS must be rated for repetitive load dump (not a one-time event). SMCJ33A rated for unlimited pulses at 25°C.

**Risk:** If battery is disconnected while alternator is charging (load dump), TVS absorbs the full alternator energy. Verify TVS pulse rating at max alternator current (~100A).

---

## 4. ESD Protection

### Requirement (IEC 61000-4-2)

- Contact discharge: ±8 kV
- Air discharge: ±15 kV

### Implementation

| Interface | Protection Device | Notes |
|-----------|------------------|-------|
| USB D+/D- | TPD2EUSB30 (2-ch ESD) | 0.05 pF capacitance — does not degrade USB signals |
| USB VBUS | PESD5V0S1BA | 5V standoff |
| CAN H/L | NUP2105L (dual, integrated in transceiver) | 24V standoff, bidirectional |
| Sensor inputs | 100 Ω series + BAV99 clamp to VREF/GND | Current-limited, clamp to rails |
| Digital inputs | 1k series + BAT54S clamp to 3.3V/GND | Current-limited to < 1 mA fault |
| Debug header | No ESD (internal use only) | Protected by enclosure |

---

## 5. Reverse Polarity Protection

### Requirement
- Survive −14V applied for 60 seconds (ISO 16750-2)
- No damage, no fuse blow

### Design: P-Channel MOSFET (Ideal Diode)

```
VBAT ──┬── Fuse ──┬── TVS ──┬── P-MOSFET ──┬── Protected VBAT
       │          │         │   (D→S)      │
       │          │         │              │
       │          ├─────────┼── Gate ──────┤
       │          │              │         │
       │          │          Zener 15V     │
       │          │              │         │
       │          │             GND        │
       │          │                        │
       └──────────┴────────────────────────┴── GND
```

**Normal polarity (VBAT > 0V):** Gate pulled low through 100k. P-MOSFET conducts. Vdrop < 50 mV at 15A.

**Reverse polarity (VBAT < 0V):** Gate voltage > Source voltage. P-MOSFET blocks. No current flows.

**Gate protection:** 15V Zener diode (gate-source). Protects Vgs(max) = ±20V.

**Component:** IPD90P04P4L-04 or NTMFS5C670NL (N-channel with gate driver — lower Rds(on) but more complex).

### Alternative: Ideal Diode Controller + N-MOSFET

| Part | Notes |
|------|-------|
| LM74610-Q1 | Zero Iq, no ground reference needed. Drives N-MOSFET. |
| LTC4359 | Ideal diode controller. 6-80V input. Drives N-MOSFET. |

**Recommendation:** LM74610-Q1 for production (automotive qualified). P-MOSFET acceptable for prototype.

---

## 6. Overcurrent Protection

| Rail | Protection | Rating |
|------|-----------|--------|
| Battery input | 30A ATO blade fuse | Fast-blow |
| 5V buck output | Current limit in LMR33630 (4.5A typ) | Auto-recovery |
| 3.3V LDO output | Current limit in LDO (thermal shutdown) | Auto-recovery |
| Injector channels | TLE8888 internal current limit (configurable) | Per-channel |
| Ignition channels | 100 mA gate drive limit | Resistor-limited |
| USB VBUS | TPS25200 eFuse — 5V, 2.5A limit | Auto-recovery |

**DFM:** Fuse holder accessible without opening enclosure (through-panel or inline). Mark fuse rating on enclosure.

---

## 7. Short Circuit Protection

### Injector Outputs

Each injector channel has:
- **TLE8888 integrated driver** — current limit, over-temp shutdown, open-load detection
- **External flyback diode** across each injector coil (at connector)
- **Diagnostic feedback** to MCU (fault status via SPI)

### Ignition Outputs

Each ignition channel has:
- **Gate resistor** (10 Ω) — limits gate charge current
- **IGBT desaturation detection** — shuts down output if coil shorted
- **Flyback clamp** integrated in IGBT

### ETC H-Bridge

- **DRV8873** — integrated current sense, overcurrent shutdown, fault output
- **External bulk capacitor** (100 µF) at motor supply — absorbs regenerative energy
- **Dual throttle position sensors** — MCU software validates both agree; shuts down ETC on mismatch

---

## 8. Watchdog Strategy

| Level | Implementation | Timeout | Action |
|-------|---------------|---------|--------|
| **Internal SWT** | S32K344 Software Watchdog Timer | 100 ms | MCU reset |
| **External Watchdog** | TPS3850 (window watchdog) | 200 ms | MCU reset + safe state assert |
| **Safe State Circuit** | Discrete logic: RESET activates FET that disables injector + ignition 12V rail | — | All outputs off |

**External Watchdog:**
- TPS3850G33 — 3.3V supply, 1.6-2.6s window timeout
- WDI pin toggled by MCU GPIO at 50 Hz (every 10 ms)
- RESET output to MCU RESET_b + safe state FET gate
- If MCU stops toggling for > 200 ms → RESET asserted → MCU resets + outputs disabled

**DFM:**
- Watchdog is NOT inside MCU (internal watchdog shares power rail — both can fail)
- External watchdog has independent 3.3V supply (could be from separate LDO in production)

---

## 9. Brown-Out Handling

### Detection

S32K344 LVD (Low Voltage Detect):
- LVD threshold: 2.70V on VDD_HV
- Hysteresis: 100 mV (re-arms at 2.80V)

### Response

On brown-out:
1. MCU has ~1 ms before VDD_HV drops below 2.3V (minimum operating)
2. NMI (Non-Maskable Interrupt) fires immediately
3. ISR does in < 100 µs:
   - Disable all injector PWM outputs
   - Disable all ignition outputs
   - Set ETC to idle position (H-bridge brake)
   - Save diagnostic snapshot to EEPROM
   - Enter safe state

**Hardware backup:** If software fails to respond, external watchdog timeout (200 ms) cuts all outputs.

---

## 10. Design Review Checklist

| Check | Status |
|-------|--------|
| TVS on battery input | ✅ SMCJ33A |
| TVS on all power rails | ✅ 5V, 3.3V, VREF |
| Reverse polarity protected | ✅ P-MOSFET ideal diode |
| Load dump clamped to < 60V | ✅ TVS + 60V-rated buck |
| ESD on all external connectors | ✅ USB, CAN. Sensor inputs via clamp diodes. |
| Overcurrent on all outputs | ✅ Fuse, buck current limit, driver IC limits |
| Short circuit detection | ✅ TLE8888 diagnostics, DRV8873 fault |
| External watchdog | ✅ TPS3850 |
| Safe state on power loss | ✅ Hardware FET cuts output rails |
| Watchdog not inside MCU | ✅ External IC |
