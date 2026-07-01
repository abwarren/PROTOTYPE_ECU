# Upstream Fork Metadata

## rusEFI Reference

| Field | Value |
|-------|-------|
| **Repository** | https://github.com/rusefi/rusefi |
| **Fork Commit Hash** | `8540e44142d837e991e89efc062f8be3feadde8c` |
| **Fork Date** | 2026-06-30 |
| **Upstream Branch** | `master` |
| **Remote URL** | https://github.com/rusefi/rusefi.git |
| **Working Tree** | Clean (except FORK_METADATA.md) |
| **Upstream License** | GPL-3.0 |
| **Upstream Version** | Latest (firmware/development) |

## Directory Layout

```
firmware/upstream/
├── android/         # Android mobile app (Kotlin)
├── bin/             # Pre-built binaries and utilities
├── docs/            # Documentation
├── firmware/        # Main ECU firmware (C++)
├── gradle/          # Gradle build system
├── hardware/        # PCB design files (KiCad)
├── java_console/    # Java-based tuning console
├── java_tools/      # Java development tools
├── misc/            # Miscellaneous scripts and configs
├── simulator/       # Firmware simulator (PC-based testing)
└── unit_tests/      # Unit test suite
```

## Development Environment

| Tool | Notes |
|------|-------|
| **Compiler** | ARM GCC Embedded (arm-none-eabi-gcc) |
| **Build System** | GNU Make + Python scripts |
| **MCU** | STM32F4/F7/H7 series |
| **Debug** | OpenOCD + GDB |
| **CI** | GitHub Actions (Docker-based) |

## Supported Boards

rusEFI supports multiple hardware variants including:
- Proteus (STM32F7)
- MicroRusEFi (STM32F4)
- Hellen boards (various)
- Custom board configurations

## Build Instructions (Upstream)

```bash
cd firmware
make -j$(nproc)
```

## License Note

This directory contains the unmodified upstream rusEFI source code, licensed under GPL-3.0.
All modifications for this platform are in `firmware/platform/` and are documented in ADR-0002.
