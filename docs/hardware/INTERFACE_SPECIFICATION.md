# INTERFACE_SPECIFICATION.md — Pinouts & Connector Assignments

> **Date:** 2026-07-11
> **Status:** Updated — 42-pin Deutsch → 35-pin AMPSEAL 16 migration complete

---

## 1. Main Harness Connector — 35-Pin AMPSEAL 16

**Connector:** TE Connectivity AMPSEAL 16, 35-position
- Plug housing: 1-967648-1 (male pins)
- Receptacle: 1-967647-1 (female sockets)
- **Mating:** Gold-plated socket cavities, 14-22 AWG per pin function

| Pin | Signal | Type | Notes |
|-----|--------|------|-------|
| 1 | VBAT | Power input | 6–36V, 15A max |
| 2 | GND_PWR | Power return | High-current ground |
| 3 | INJ1 | Output | Peak & hold driver |
| 4 | INJ2 | Output | |
| 5 | INJ3 | Output | |
| 6 | INJ4 | Output | |
| 7 | INJ5 | Output | |
| 8 | INJ6 | Output | |
| 9 | INJ7 | Output | |
| 10 | INJ8 | Output | |
| 11 | GND_INJ | Power return | Injector dedicated ground |
| 12 | IGN1 | Output | IGBT gate drive |
| 13 | IGN2 | Output | |
| 14 | IGN3 | Output | |
| 15 | IGN4 | Output | |
| 16 | IGN5 | Output | |
| 17 | IGN6 | Output | |
| 18 | IGN7 | Output | |
| 19 | IGN8 | Output | |
| 20 | GND_IGN | Power return | Ignition dedicated ground |
| 21 | ETC_P | Output | H-bridge, 3A max |
| 22 | ETC_N | Output | |
| 23 | TPS1 | Analog input | 0–5V, ratiometric |
| 24 | TPS2 | Analog input | Safety redundant |
| 25 | MAP | Analog input | 0–5V |
| 26 | CLT | Analog input | NTC thermistor |
| 27 | IAT | Analog input | NTC thermistor |
| 28 | BOOST | Output | PWM low-side, 2A |
| 29 | TACH | Output | High-side, 12V |
| 30 | RELAY_FP | Output | Fuel pump relay, low-side 5A |
| 31 | RELAY_FAN | Output | Radiator fan relay, low-side 5A |
| 32 | RELAY_AC | Output | A/C clutch relay, low-side 3A |
| 33 | SENS_GND | Power return | Sensor ground |
| 34 | FP | Analog input | 0–5V fuel pressure |
| 35 | NC | — | Spare |

**Design decisions vs previous 42-pin Deutsch DTM:**
- Consolidated power grounds: 3 pins → PWR_GND + dedicated INJ/IGN/SENS returns
- WBO2 signals moved to dedicated 4-pin Deutsch DTM pigtails (J6, J7)
- Dropped: KNOCK2 (dual-knock deferred), OP (oil pressure), RELAY_SP (spare)
- Total: 34 active signals + 1 NC spare

---

## 2. CAN Connectors — 4-Pin Deutsch DTM

**Connector:** TE Connectivity DTM06-4S

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | GND | |
| 2 | CAN_H | |
| 3 | CAN_L | |
| 4 | VBAT (fused, optional) | For bus-powered devices |

*Two connectors: CAN0 (J3, primary powertrain), CAN1 (J4, body bus).*

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

## 4. WBO2 Sensor Connectors — 2x 4-Pin Deutsch DTM

**Connector:** TE Connectivity DTM06-4S per sensor

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | GND | Sensor ground |
| 2 | LAMBDA | 0–5V from CJ125 |
| 3 | HEATER | 12V PWM, 2A |
| 4 | VBAT | Fused sensor power |

*Two connectors: J6 (WBO2 #1), J7 (WBO2 #2). LSU 4.9 4-wire wideband.*

---

## 5. USB-C Connector

**Connector:** Molex 105450-0101 (mid-mount, 16-pin SMT)

| Signal | Notes |
|--------|-------|
| USB D+/D- | Via 22R series, TPD2EUSB30 ESD |
| CC | 5.1kΩ to GND (UFP device mode) |
| VBUS | TPS25200 eFuse, 5V/2.5A |
| Shield | 1MΩ || 100nF to GND |

---

## 6. Debug Header — 10-Pin 0.05" (SWD)

**Connector:** Tag-Connect TC2050-IDC (no-connector footprint)

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | VTref (3.3V) | Target reference voltage |
| 2 | SWDIO | 22R series |
| 3 | GND | |
| 4 | SWCLK | 22R series |
| 5 | GND | |
| 6 | SWO (optional) | |
| 7 | NC | |
| 8 | NC | |
| 9 | GND | |
| 10 | ~RESET | |

---

## 7. Pin Summary

| Connector | Pins Used | Pins Total | Spare |
|-----------|----------|------------|-------|
| Main Harness (35-pin AMPSEAL) | 34 | 35 | 1 |
| CAN × 2 (4-pin Deutsch) | 8 | 8 | 0 |
| Diagnostic (4-pin Deutsch) | 4 | 4 | 0 |
| WBO2 × 2 (4-pin Deutsch) | 8 | 8 | 0 |
| USB-C | 4 | 16 | 12 |
| Debug (internal) | 5 | 10 | 5 |

---

## 8. Wire Gauge Recommendations

| Signal | AWG | Notes |
|--------|-----|-------|
| VBAT / GND | 14–16 | Main power, up to 15A |
| Injector power | 18 | 8 × 1.5A peak |
| Ignition output | 20 | Low current gate drive |
| Sensor signal | 22 | Shielded for knock, WBO2 |
| CAN bus | 22 | Twisted pair, 120Ω |
| ETC motor | 18 | Up to 3A |
| Relay output | 18 | Up to 5A |
| WBO2 heater | 20 | 2A PWM each |
