# Power Supply Design for ECUs — Research

## Overview

Automotive power supply design must handle wide voltage ranges, load dump, reverse battery, transients, and extreme temperatures.

## Key Requirements

| Parameter | Requirement |
|-----------|------------|
| Input voltage | 6V - 36V (nominal 12V/24V) |
| Load dump | 60V (ISO 7637-2 Pulse 5) |
| Reverse battery | -14V protection |
| Cranking | 4.5V - 6V (cold crank) |
| Jump start | 24V for 12V systems |
| Ripple | 50mVp-p max |

## Architecture

1. **Input Protection** — TVS diodes, reverse polarity, EMI filter
2. **Pre-Regulator** — Wide VIN buck (LM5000 series, TI)
3. **Main Rails:**
   - 5V: MCU IO, analog, sensor supply
   - 3.3V: MCU core, logic, CAN transceiver
   - 1.2-1.8V: MCU core (internal regulation often)
4. **Driver Supply:**
   - 12V: Injector drivers, ignition drivers, relay coils
   - 5V ref: Sensor reference (precise, low noise)

## Key Components

| Function | Recommended Part |
|----------|-----------------|
| Reverse protection | P-channel MOSFET (ideal diode) |
| Load dump protection | TVS (SMCJ series, 600W+) |
| Buck regulator | LM53635 (TI), LMR33630 (TI) |
| LDO | TPS7B69 (TI), NCV4275 |
| Supervisor | TPS3701 (TI) |

## TEN8 Applicability

- Design for ISO 7637 compliance
- Separate power stages for MCU vs drivers
- Watchdog supervisor for safety
- Power sequencing for MCU requirements

## References

- ISO 7637-2: Electrical transient conduction
- TI: Automotive Power Supply Design Guide
- NXP: AN13295 Power Supply for S32K
