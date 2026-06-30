# Speeduino — Analysis

## Overview

**Speeduino** is the most popular open-source ECU project by community size. It started as an Arduino-based system and has evolved to support more powerful MCUs including STM32 and Teensy.

## Top 10 Sources

| # | Source | URL | Type |
|---|--------|-----|------|
| 1 | Official Website | https://speeduino.com/home/ | Portal |
| 2 | GitHub (Firmware) | https://github.com/speeduino/speeduino | Source Code |
| 3 | GitHub (Hardware) | https://github.com/speeduino/Hardware | PCBs |
| 4 | Wiki/Documentation | https://wiki.speeduino.com/en/ | Docs |
| 5 | Community Forum | https://speeduino.com/forum/ | Community |
| 6 | TunerStudio Integration | https://www.tunerstudio.com/ | Tuning SW |
| 7 | Facebook Group | https://www.facebook.com/groups/speeduino/ | Community |
| 8 | Speeduino Wiki (GitHub) | https://github.com/speeduino/speeduino/wiki | Docs |
| 9 | Wiki Manual | https://wiki.speeduino.com/en/Home | Manual |
| 10 | Community Hardware Vendors | Various (forum vendors) | Hardware |

## Architecture

| Component | Implementation |
|-----------|---------------|
| **Language** | C++ (Arduino framework) |
| **MCU** | ATmega2560, STM32F407, Teensy 3.x/4.x |
| **Build System** | Arduino IDE / PlatformIO |
| **Scheduler** | Simple loop + timer interrupts |
| **CAN** | Via MCP2515 or integrated |
| **Tuning** | TunerStudio (industry standard) |
| **Bootloader** | Arduino bootloader / STM32 DFU |
| **PCB Designs** | KiCad, various community designs |

## License

- **License:** Open source (firmware and hardware)
- **Implications:** Similar to rusEFI — reference only for TEN8

## Strengths

- Largest community of any open-source ECU
- Lowest cost entry point (~$50-150)
- TunerStudio compatible (industry standard tuning software)
- Extensive wiki documentation
- Active forum with thousands of users
- Regular firmware releases (every 1-2 months)
- Wide sensor and actuator support

## Weaknesses

- ATmega2560 is underpowered for advanced features
- CAN implementation less polished than rusEFI
- Drive-by-wire support is limited/nascent
- Arduino framework is not automotive-grade
- Limited real-time determinism
- PCB designs vary in quality across community
- Some advanced features require Teensy/STM32 upgrade

## TEN8 Applicability

- **TunerStudio integration model** is critical — TEN8 must support TunerStudio
- **Community building approach** is a reference
- **Hardware cost optimization** strategies are valuable
- **Architecture** should supersede Arduino limitations with professional MCU

## References

- [Official Site](https://speeduino.com/home/)
- [Firmware GitHub](https://github.com/speeduino/speeduino)
- [Hardware GitHub](https://github.com/speeduino/Hardware)
- [Wiki](https://wiki.speeduino.com/en/)
- [Forum](https://speeduino.com/forum/)
