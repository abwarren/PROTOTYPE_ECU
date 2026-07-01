# TB-001 — Firmware Builds Under Prototype ECU Project

> **Status:** ✅ Complete (retroactive)
> **Date:** 2026-07-01
> **QA:** 🟢 Approved

---

## What Was Demonstrated

rusEFI firmware builds from source under the Prototype ECU toolchain.

### Evidence
- ARM GCC 12.3 installed, Java 11 installed
- Build: `make f407-discovery -j$(nproc)` succeeds
- Output: rusefi.bin (727 KB), rusefi.elf (26 MB), rusefi.hex (2 MB)
- ELF verified as ARM 32-bit executable

### P0 Quick Wins
- .gitmodules fixed (relative → absolute URL)
- CI fixed (master added to trigger branches)
- Submodule cleaned (25K lines of artifacts discarded)
- FORK_METADATA.md preserved

### Files
- `04_Firmware/BUILD_PIPELINE.md` — documented build pipeline
- `firmware/FORK_METADATA.md` — fork metadata
