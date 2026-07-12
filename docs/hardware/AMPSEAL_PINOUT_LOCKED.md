# 7100CPT ECU — AMPSEAL 16 Pin Assignment (LOCKED V1)

> **Status:** 🔒 LOCKED — 2026-07-12
> **Connector:** TE Connectivity AMPSEAL 16, 35-position
> **Plug housing:** 1-967648-1 (male pins)
> **Receptacle:** 1-967647-1 (female sockets)
> **Wire range:** 14-22 AWG per pin

| Pin | Signal | Type | Dir | Sheet | MCU Pin | Notes |
|-----|--------|------|:---:|:-----:|---------|-------|
| 1 | VBAT | Power input | → | 01 | — | 6–36V, 15A max, fused 30A ATO |
| 2 | GND_PWR | Power return | ← | 01 | — | Main power ground |
| 3 | INJ1 | Injector 1 | → | 06 | TLE8888 OUT1 | P&H driver, 1.5A peak |
| 4 | INJ2 | Injector 2 | → | 06 | TLE8888 OUT2 | |
| 5 | INJ3 | Injector 3 | → | 06 | TLE8888 OUT3 | |
| 6 | INJ4 | Injector 4 | → | 06 | TLE8888 OUT4 | |
| 7 | INJ5 | Injector 5 | → | 06 | TLE8888 OUT5 | |
| 8 | INJ6 | Injector 6 | → | 06 | TLE8888 OUT6 | |
| 9 | INJ7 | Injector 7 | → | 06 | TLE8888 OUT7 | |
| 10 | INJ8 | Injector 8 | → | 06 | TLE8888 OUT8 | |
| 11 | GND_INJ | Injector return | ← | 06 | — | Dedicated injector ground |
| 12 | IGN1 | Ignition 1 | → | 07 | PB0 | IGBT gate drive |
| 13 | IGN2 | Ignition 2 | → | 07 | PB1 | |
| 14 | IGN3 | Ignition 3 | → | 07 | PB10 | |
| 15 | IGN4 | Ignition 4 | → | 07 | PB11 | |
| 16 | IGN5 | Ignition 5 | → | 07 | PD0 | |
| 17 | IGN6 | Ignition 6 | → | 07 | PD1 | |
| 18 | IGN7 | Ignition 7 | → | 07 | PB3/SWO | Shared with debug SWO |
| 19 | IGN8 | Ignition 8 | → | 07 | PC6 | Shared with trigger input |
| 20 | GND_IGN | Ignition return | ← | 07 | — | Dedicated ignition ground |
| 21 | ETC_P | ETC Motor + | → | 08 | PA8 | DRV8873 OUT1, 3A max |
| 22 | ETC_N | ETC Motor − | → | 08 | PA15 | DRV8873 OUT2 |
| 23 | TPS1 | TPS Signal 1 | ← | 05 | PA3 (ADC3) | 0–5V ratiometric |
| 24 | TPS2 | TPS Signal 2 | ← | 05 | PC0 (ADC10) | Safety redundant |
| 25 | MAP | MAP Sensor | ← | 05 | PA0 (ADC0) | 0–5V |
| 26 | CLT | Coolant Temp | ← | 05 | PA1 (ADC1) | NTC thermistor |
| 27 | IAT | Intake Air Temp | ← | 05 | PA2 (ADC2) | NTC thermistor |
| 28 | BOOST | Boost Solenoid | → | 08 | PB0 | PWM low-side, 2A |
| 29 | TACH | Tach Output | → | 08 | PB1 | High-side, 12V |
| 30 | RELAY_FP | Fuel Pump Relay | → | 08 | PC10 | Low-side, 5A |
| 31 | RELAY_FAN | Radiator Fan Relay | → | 08 | PC11 | Low-side, 5A |
| 32 | RELAY_AC | A/C Clutch Relay | → | 08 | PC12 | Low-side, 3A |
| 33 | SENS_GND | Sensor Ground | ← | 05 | — | Dedicated sensor return |
| 34 | FP | Fuel Pressure | ← | 05 | PC3 (ADC13) | 0–5V |
| 35 | NC | Spare | — | — | — | Unpopulated |

**Notes:**
- Total active: 34 signals + 1 NC spare
- All injector outputs via TLE8888 SPI — no direct MCU GPIO
- Ignition outputs via direct IGBT gate drive (ISL9V3040S3ST)
- ETC via DRV8873 H-bridge with current sense feedback
- Sensor rails share SENS_GND (pin 33), separate from power grounds
- Wire 14 AWG for VBAT/GND_PWR, 18 AWG for injector/ETC, 20 AWG for ignition, 22 AWG for sensors/CAN
