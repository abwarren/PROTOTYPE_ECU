# INTERFACE_SPECIFICATION.md — Pinouts & Connector Assignments

> **Date:** 2026-07-03
> **Revision:** 2 — consolidated 34-pin per MRP directive
> **Supersedes:** Revision 1 (42-pin prototype spec, 2026-07-01)
> **Change:** 42-pin → 34-pin. V1 targets 6-cylinder sequential. V8 via
>   wasted spark. Second WBO2, oil pressure, A/C clutch → expansion header.

---

## 1. Main Harness Connector — 34-Pin Sealed Automotive

**Connector:** TE Connectivity AMPSEAL 16 (35-position, 34 used + 1 blank)
or equivalent 34-position sealed connector.
**Mating:** Gold-plated sockets. 20 AWG contacts for signal, 14-16 AWG for power.
**Pitch:** 4.0 mm (AMPSEAL) or 5.08 mm (DT)

### 1.1 Pin Assignment

| Pin | Signal | Type | Rating | Notes |
|-----|--------|------|--------|-------|
| 1 | VBAT | Power input | 15A peak | 6–36V, fused 20A |
| 2 | PWR_GND | Power return | 15A peak | High-current, to battery negative |
| 3 | INJ1 | Output | 1.5A peak | Cylinder 1, peak & hold |
| 4 | INJ2 | Output | 1.5A peak | Cylinder 2 |
| 5 | INJ3 | Output | 1.5A peak | Cylinder 3 |
| 6 | INJ4 | Output | 1.5A peak | Cylinder 4 |
| 7 | INJ5 | Output | 1.5A peak | Cylinder 5 |
| 8 | INJ6 | Output | 1.5A peak | Cylinder 6 |
| 9 | INJ7 | Output | 1.5A peak | Cylinder 7 (V8 wasted spark mode) |
| 10 | INJ8 | Output | 1.5A peak | Cylinder 8 (V8 wasted spark mode) |
| 11 | INJ_GND | Power return | — | Dedicated injector ground |
| 12 | IGN1 | Output | 100mA gate | Cylinder 1, IGBT gate drive |
| 13 | IGN2 | Output | 100mA gate | Cylinder 2 |
| 14 | IGN3 | Output | 100mA gate | Cylinder 3 |
| 15 | IGN4 | Output | 100mA gate | Cylinder 4 |
| 16 | IGN5 | Output | 100mA gate | Cylinder 5 |
| 17 | IGN6 | Output | 100mA gate | Cylinder 6 |
| 18 | IGN_GND | Power return | — | Dedicated ignition ground |
| 19 | ETC+ | Output | 3A | H-bridge, throttle motor positive |
| 20 | ETC- | Output | 3A | H-bridge, throttle motor negative |
| 21 | TPS1 | Analog input | 0–5V | Throttle position primary, ratiometric |
| 22 | TPS2 | Analog input | 0–5V | Throttle position redundant (safety) |
| 23 | MAP | Analog input | 0–5V | Manifold absolute pressure |
| 24 | CLT | Analog input | NTC | Coolant temperature (bias to VREF) |
| 25 | IAT | Analog input | NTC | Intake air temperature (bias to VREF) |
| 26 | KNOCK1 | Analog input | differential | Piezo knock sensor, bandpass filtered |
| 27 | FUEL_PRESS | Analog input | 0–5V | Fuel pressure sensor |
| 28 | WBO2_L | Analog input | 0–5V | Lambda voltage from CJ125 |
| 29 | WBO2_H- | Output | 2A PWM | Wideband sensor heater return |
| 30 | BOOST | Output | 2A PWM | Boost control solenoid, low-side |
| 31 | TACH | Output | 12V pulse | Tachometer, high-side |
| 32 | RELAY_FP | Output | 5A | Fuel pump relay, low-side |
| 33 | RELAY_FAN | Output | 5A | Radiator fan relay, low-side |
| 34 | SPARE | I/O | — | Reserved for expansion |

### 1.2 Signals Removed From 42-Pin Revision

| Removed Signal | Disposition |
|----------------|-------------|
| IGN7, IGN8 | V1 supports 6-cylinder sequential. V8 uses wasted spark (IGN1-6 fire paired cylinders). IGN7/8 added in V2 via expansion. |
| WBO2 #2 Lambda + Heater | Single wideband for V1. Second sensor via expansion header or CAN. |
| KNOCK2 | Single knock sensor for V1. Second via expansion. |
| OIL_PRESS | Calculated from other sensors or via CAN expansion. |
| RELAY3 (A/C clutch) | Expansion header. |
| RELAY4 (Spare relay) | Consolidated into single SPARE pin (pin 34). |
| GND pins (×2 extra) | Consolidated to PWR_GND (pin 2) + dedicated INJ_GND (pin 11) + IGN_GND (pin 18). |

### 1.3 Expansion Header (Internal, 6-Pin 0.1")

For signals not on main connector. Available for V1.5/V2 integration.

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | 5V | VREF output, 100mA max |
| 2 | GND | Signal ground |
| 3 | WBO2_2_L | Second wideband lambda (future) |
| 4 | KNOCK2 | Second knock sensor (future) |
| 5 | OIL_PRESS | Oil pressure (future) |
| 6 | SPARE_IO | Configurable GPIO/ADC |

---

## 2. CAN Connectors — 4-Pin Deutsch DTM

**Connector:** TE Connectivity DTM06-4S

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | GND | |
| 2 | CAN_H | |
| 3 | CAN_L | |
| 4 | VBAT (fused, optional) | For bus-powered devices |

- **CAN0:** Primary powertrain bus (engine, transmission, ABS)
- **CAN1:** Body/expansion bus (dashboard, datalogger, PDM)

---

## 3. Diagnostic Connector — 4-Pin Deutsch DTM

**Connector:** TE Connectivity DTM06-4S (with dust cap for workshop use)

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | GND | |
| 2 | CAN_H (CAN2) | Diagnostic CAN |
| 3 | CAN_L (CAN2) | |
| 4 | VBAT (fused 1A) | For scan tool power |

---

## 4. USB-C Connector

**Connector:** Panel-mount USB-C with O-ring seal for IP67.
Mid-mount SMT: Molex 105450-0101 or equivalent.

| Pin | Signal |
|-----|--------|
| A6/B6 | USB D+ |
| A7/B7 | USB D- |
| A5/B5 | CC (5.1kΩ to GND, UFP identification) |
| A1/A12/B1/B12 | GND |
| Shell | Shield (1MΩ \|\| 100nF to GND) |

VBUS: No connect (self-powered device). S32K344 USB0_DP/DM with 22Ω series.

---

## 5. Debug Header — 10-Pin 0.05" (SWD)

| Pin | Signal |
|-----|--------|
| 1 | VTref (3.3V) |
| 2 | SWDIO |
| 3 | GND |
| 4 | SWCLK |
| 5 | GND |
| 6 | SWO (optional) |
| 7 | NC |
| 8 | NC |
| 9 | GND |
| 10 | RESET |

**Footprint:** Samtec FTSH-105 or Tag-Connect TC2050 (no-connector for production).

---

## 6. Pin Summary

| Connector | Pins Used | Pins Total | Sealed |
|-----------|----------|------------|--------|
| Main Harness (34-pin) | 34 | 34 | Yes |
| CAN0 | 4 | 4 | Yes |
| CAN1 | 4 | 4 | Yes |
| Diagnostic | 4 | 4 | Yes |
| USB-C | 4 | 16 | Yes (panel mount) |
| Debug (internal) | 5 | 10 | No |
| Expansion (internal) | 6 | 6 | No |

---

## 7. Wire Gauge Recommendations

| Signal | AWG | Notes |
|--------|-----|-------|
| VBAT / PWR_GND | 14–16 | Main power, up to 15A cranking |
| Injector output | 18 | 8 × 1.5A peak, bundled with INJ_GND |
| Ignition output | 20 | Low current gate drive to external IGBT |
| ETC motor | 18 | Up to 3A |
| Relay output | 18 | Up to 5A |
| Sensor signal | 22 | Shielded for knock and WBO2 |
| CAN bus | 22 | Twisted pair, 120Ω characteristic |
| WBO2 heater | 18 | Up to 2A PWM |

---

*Next: Can be read alongside REUSE_MATRIX.md for TB-HW-002 schematic capture.*
