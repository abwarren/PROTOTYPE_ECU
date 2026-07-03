# Upstream Fork Metadata

## rusEFI Reference

| Field | Value |
|-------|-------|
| **Repository** | https://github.com/rusefi/rusefi |
| **Integration method** | Git submodule at `firmware/upstream/` |
| **Fork Date** | 2026-06-30 |
| **Fork Point (upstream base)** | `8540e44` (2026-06-30) |
| **Local HEAD** | `7abb688` |
| **Upstream HEAD** | `0c955db` (2026-07-02) |
| **Behind upstream** | ~33 commits |
| **Upstream Branch** | `master` |
| **Remote URL** | https://github.com/rusefi/rusefi.git |
| **Upstream License** | GPL-3.0 |

## Local Patches

| SHA | Description | File | Upstream Status |
|-----|-------------|------|-----------------|
| `7abb688` | Add `-Wno-error=shadow` for GCC 12+ compatibility | `firmware/Makefile` (+2 lines) | Not submitted |

This patch follows the existing pattern (`-Wno-error=tautological-compare`)
and is a candidate for upstream contribution.

## Sync Procedure

See `04_Firmware/UPSTREAM_SYNC.md` for the documented procedure covering:
- Checking current state
- Fast-forward (no local patches)
- Rebase (with GCC 12 patch)
- Build verification
- Rollback
- Upstream contribution process

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
| **Compiler** | ARM GCC Embedded 12.3 (arm-none-eabi-gcc) |
| **Build System** | GNU Make + Python scripts |
| **MCU** | STM32F4/F7/H7 series |
| **Target** | STM32F407 Discovery (f407-discovery) |
| **Debug** | OpenOCD + GDB |
| **CI** | GitHub Actions (Docker-based) |

## Build Instructions

```bash
export PATH="/home/wa/tools/gcc-12/bin:/home/wa/tools/java/bin:/home/wa/tools/7zip:/home/wa/tools/mtools/usr/bin:/usr/sbin:$PATH"
export JAVA_HOME="/home/wa/tools/java"
cd firmware/upstream/firmware
make -j$(nproc)
```

## License Note

This directory contains the rusEFI source code as a Git submodule, licensed
under GPL-3.0. The submodule tracks upstream `master`. Local modifications are
limited to the GCC 12 build compatibility patch and are documented above.
