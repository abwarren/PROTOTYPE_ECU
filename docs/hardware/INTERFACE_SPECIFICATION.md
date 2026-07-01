# INTERFACE_SPECIFICATION.md — Pinouts & Connector Assignments

> **Date:** 2026-07-01

---

## 1. Main Harness Connector — 42-Pin Deutsch DTM

**Connector:** TE Connectivity DTM06-12SA (receptacle, 12-position) × 4 banks or equivalent 42-position.
**Mating:** DTM04-12PB (plug) with gold-plated sockets.

| Pin | Signal | Type | Notes |
|-----|--------|------|-------|
| A1 | VBAT | Power input | 6–36V |
| A2 | GND | Power return | High-current |
| A3 | GND | Power return | |
| A4 | Injector 1 | Output | P&H driver |
| A5 | Injector 2 | Output | |
| A6 | Injector 3 | Output | |
| A7 | Injector 4 | Output | |
| B1 | Injector 5 | Output | |
| B2 | Injector 6 | Output | |
| B3 | Injector 7 | Output | |
| B4 | Injector 8 | Output | |
| B5 | GND (Injectors) | Power return | Dedicated return |
| B6 | Ignition 1 | Output | IGBT gate |
| B7 | Ignition 2 | Output | |
| C1 | Ignition 3 | Output | |
| C2 | Ignition 4 | Output | |
| C3 | Ignition 5 | Output | |
| C4 | Ignition 6 | Output | |
| C5 | Ignition 7 | Output | |
| C6 | Ignition 8 | Output | |
| C7 | GND (Ignition) | Power return | |
| D1 | ETC Motor + | Output | H-bridge, 3A max |
| D2 | ETC Motor − | Output | |
| D3 | TPS #1 | Analog input | 0–5V, ratiometric |
| D4 | TPS #2 | Analog input | Safety redundant |
| D5 | MAP Sensor | Analog input | 0–5V |
| D6 | CLT (Coolant Temp) | Analog input | NTC thermistor |
| D7 | IAT (Intake Air Temp) | Analog input | NTC thermistor |
| E1 | WBO2 #1 Lambda | Analog input | 0–5V from CJ125 |
| E2 | WBO2 #1 Heater − | Output | 12V PWM, 2A |
| E3 | WBO2 #2 Lambda | Analog input | |
| E4 | WBO2 #2 Heater − | Output | |
| E5 | Knock Sensor #1 | Analog input | Differential |
| E6 | Knock Sensor #2 | Analog input | |
| E7 | Fuel Pressure | Analog input | 0–5V |
| F1 | Oil Pressure | Analog input | 0–5V |
| F2 | Boost Solenoid | Output | PWM low-side, 2A |
| F3 | Tach Output | Output | High-side, 12V |
| F4 | Relay 1 (Fuel Pump) | Output | Low-side, 5A |
| F5 | Relay 2 (Radiator Fan) | Output | Low-side, 5A |
| F6 | Relay 3 (A/C Clutch) | Output | Low-side, 3A |
| F7 | Relay 4 (Spare) | Output | Low-side |

---

## 2. CAN Connectors — 4-Pin Deutsch DTM

**Connector:** TE Connectivity DTM06-4S

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | GND | |
| 2 | CAN_H | |
| 3 | CAN_L | |
| 4 | VBAT (fused, optional) | For bus-powered devices |

*Two connectors: CAN0 (primary powertrain), CAN1 (body bus).*

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

**Connector:** Molex 105450-0101 (mid-mount, 16-pin SMT)

| Pin | Signal |
|-----|--------|
| A6/B6 | USB D+ |
| A7/B7 | USB D- |
| A5/B5 | CC (5.1kΩ to GND) |
| A1/A12/B1/B12 | GND |
| Shell | Shield (1MΩ || 100nF to GND) |

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

---

## 6. Pin Summary

| Connector | Pins Used | Pins Total | Spare |
|-----------|----------|------------|-------|
| Main Harness (42-pin) | 35 | 42 | 7 |
| CAN × 2 | 8 | 8 | 0 |
| Diagnostic | 4 | 4 | 0 |
| USB-C | 4 | 16 | 12 |
| Debug (internal) | 5 | 10 | 5 |

---

## 7. Wire Gauge Recommendations

| Signal | AWG | Notes |
|--------|-----|-------|
| VBAT / GND | 14–16 | Main power, up to 15A |
| Injector power | 18 | 8 × 1.5A peak |
| Ignition output | 20 | Low current gate drive |
| Sensor signal | 22 | Shielded for knock, WBO2 |
| CAN bus | 22 | Twisted pair, 120Ω |
| ETC motor | 18 | Up to 3A |
| Relay output | 18 | Up to 5A |
