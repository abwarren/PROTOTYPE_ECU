# rusEFI — Deep Analysis

## Overview

**rusEFI** is the most technically advanced open-source ECU project. It targets STM32 microcontrollers (F4/F7/H7 series) and provides a complete engine management system with active development.

## Top 10 Sources

| # | Source | URL | Type |
|---|--------|-----|------|
| 1 | Official Website | https://rusefi.com/ | Portal |
| 2 | GitHub Repository | https://github.com/rusefi/rusefi | Source Code |
| 3 | Wiki/Documentation | https://wiki.rusefi.com/ | Docs |
| 4 | Community Forum | https://rusefi.com/forum/ | Community |
| 5 | GitHub Insights | https://github.com/rusefi/rusefi/pulse | Activity |
| 6 | Hardware Designs | https://github.com/rusefi/hardware | PCBs |
| 7 | rusEFI Console | https://github.com/rusefi/rusefi_console | Desktop App |
| 8 | MotoIQ Article | https://motoiq.com/rusefi-diy-open-source-engine-management-for-your-car/2/ | Review |
| 9 | Discord Community | https://discord.gg/rusefi | Chat |
| 10 | YouTube Channel | https://www.youtube.com/@rusefi | Tutorials |

## Architecture

| Component | Implementation |
|-----------|---------------|
| **Language** | C++ ("C with classes") |
| **MCU** | STM32F4/F7/H7 |
| **Build System** | Make + GCC, Docker CI |
| **Scheduler** | Custom real-time scheduler |
| **CAN** | Full CAN bus implementation |
| **USB** | USB CDC (virtual COM port) |
| **Bootloader** | STM32 DFU mode |
| **Configuration** | Dynamic, pushed from console |
| **Console** | Java-based desktop application |
| **PCB** | Proteus, MicroRusEFi, various |

## License

- **License:** GPL (firmware and hardware)
- **Implications:** Derived works must also be GPL. Can be used as a reference but cannot incorporate into proprietary TEN8 firmware without open-sourcing the entire work.

## Strengths

- Active development with frequent releases
- Strong CI/CD with automated testing
- Broad engine support (sequential, VVT, DBW)
- Flexible pin mapping
- Lua scripting for custom logic without recompilation
- CAN bus and USB connectivity
- Well-organized GitHub with clear contribution guidelines

## Weaknesses

- Steep learning curve
- Documentation is community-maintained, sometimes outdated
- Hardware requires assembly or limited-batch boards
- Java console is not industry standard (TunerStudio dominates)
- GPL license limits commercial reuse

## Development Activity

- **Status:** Highly active
- **Contributors:** Active core team + community
- **Release cadence:** Frequent (multiple per month)
- **CI:** GitHub Actions, Docker builds, unit tests

## Reusable Components for TEN8

| Component | Reuse Potential | License Constraint |
|-----------|----------------|--------------------|
| Trigger decoding algorithms | Reference only (GPL) | Cannot copy directly |
| Fuel/ignition calculation logic | Reference only (GPL) | Must reimplement independently |
| CAN protocol design | Design pattern | Protocol ideas are not copyrightable |
| Lua scripting integration | Concept | Can reimplement independently |
| USB CDC communication | Concept | Standard protocol |
| Test-driven firmware approach | Methodology | No license restriction |

## TEN8 Differentiation Opportunities

- Move to STM32H7 (higher performance than rusEFI's F4/F7 base)
- Professional-grade enclosure (not open-frame)
- Full TunerStudio compatibility (industry standard)
- Production-ready build quality
- Commercial support and warranty
- Modern desktop software (Electron/React vs Java)
- Mobile app with BLE connectivity
- Cloud platform with telematics

## References

- [Official Website](https://rusefi.com/)
- [GitHub Repository](https://github.com/rusefi/rusefi)
- [Wiki](https://wiki.rusefi.com/)
- [Forum](https://rusefi.com/forum/)
