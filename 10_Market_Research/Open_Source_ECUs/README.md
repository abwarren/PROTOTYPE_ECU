# Open Source ECU Platforms — Research

Comprehensive analysis of major open-source ECU projects for learning, benchmarking, and selective reuse.

## Projects Researched

| Project | Status | License | MCU | Tuning Software |
|---------|--------|---------|-----|-----------------|
| **rusEFI** | Active, high activity | GPL | STM32F4/F7/H7 | rusEFI Console (Java) |
| **Speeduino** | Active, mature | Open source | ATmega2560, STM32, Teensy | TunerStudio |
| **MegaSquirt** | Active, commercial | Partially proprietary | Various | TunerStudio, MegaTune |
| **FreeEMS** | Inactive/Abandoned | GPL | Freescale HCS12 | Custom |
| **LibreEMS** | Inactive/Abandoned | GPL | Freescale HCS12 | Custom |

## Key Findings

- **rusEFI** and **Speeduino** are the only truly active open-source ECU projects suitable as reference implementations
- **MegaSquirt** is the market leader but has restrictive licensing
- **FreeEMS** and **LibreEMS** are historical projects — useful for architectural lessons only
- All active projects use **TunerStudio** or a Java-based console for tuning

## TEN8 Applicability

- rusEFI's architecture (STM32-based, modular firmware, CAN/USB) is the strongest reference for TEN8
- Speeduino's community and TunerStudio integration model is valuable for ecosystem design
- MegaSquirt's commercial model provides lessons in productization
- See individual subfolders for detailed analysis
