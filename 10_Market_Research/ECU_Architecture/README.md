# ECU Architecture — Research

## Overview

Reference ECU architectures from open-source projects and industry standards.

## Reference Architectures

### Generic ECU Architecture

```
┌─────────────────────────────────────┐
│         Power Management            │
│  (Load dump, reverse, buck, LDO)    │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│     MCU + Memory + Peripherals      │
│  (NXP S32K, STM32, etc.)            │
└──┬───────┬───────┬────────┬─────────┘
   │       │       │        │
┌──▼───┐┌──▼───┐┌──▼───┐┌──▼──────────┐
│Inputs││Outputs││ CAN  ││ Connectivity│
│(crank││(inj.,││FD    ││ (USB, BLE,  │
│ cam, ││ ign.,││      ││  WiFi, LTE) │
│ AFR, ││ ETC) ││      ││             │
│ temp)││      ││      ││             │
└──────┘└──────┘└──────┘└─────────────┘
```

### Key Architectural Patterns

| Aspect | Options | TEN8 Choice |
|--------|---------|-------------|
| Scheduling | Bare-metal, FreeRTOS, AUTOSAR OS | FreeRTOS (initial) |
| Memory | Single bank, A/B dual, External | A/B dual internal + external SPI flash |
| Communication | Polling, interrupt, DMA | DMA for high-speed, interrupts for time-critical |
| Configuration | Compiled, EEPROM, Flash | Flash-based with backup |

## Firmware Architecture Layers

1. **HAL** (Hardware Abstraction Layer) — MCU-independent interfaces
2. **MCAL** (Microcontroller Abstraction Layer) — MCU-specific drivers
3. **BSW** (Basic Software) — OS, comm stack, diagnostics
4. **RTE** (Runtime Environment) — Communication between SWCs
5. **SWCs** (Software Components) — Engine control algorithms

## TEN8 Applicability

- Modular architecture separating HW-dependent and HW-independent layers
- CAN FD for diagnostics and tuning
- USB for desktop connection
- Cloud connectivity as optional add-on

## References

- AUTOSAR Layered Architecture
- OSEK/VDX Operating System
- Bosch: Automotive Handbook (ECU Architecture)
