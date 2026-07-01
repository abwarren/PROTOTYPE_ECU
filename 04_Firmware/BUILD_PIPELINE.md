# Prototype ECU Firmware Build Pipeline

> **TB-001:** Firmware builds under Prototype ECU project
> **Date:** 2026-07-01
> **Status:** ✅ Complete

---

## Toolchain

| Tool | Version | Path |
|------|---------|------|
| ARM GCC | 12.3.Rel1 (arm-12.35) | `/home/wa/tools/gcc-12/bin/` |
| Java (Temurin) | 11.0.23 | `/home/wa/tools/java/` |
| 7-Zip | 23.01 | `/home/wa/tools/7zip/` |
| mtools | 4.0.x | `/home/wa/tools/mtools/usr/bin/` |

## Build Command

```bash
export PATH="/home/wa/tools/gcc-12/bin:/home/wa/tools/java/bin:/home/wa/tools/7zip:/home/wa/tools/mtools/usr/bin:/usr/sbin:$PATH"
export JAVA_HOME="/home/wa/tools/java"
cd firmware/upstream/firmware
make f407-discovery -j$(nproc)
```

## Build Output

| File | Size | Type |
|------|------|------|
| `rusefi.bin` | 727 KB | Flash image (bootloader + firmware) |
| `rusefi.elf` | 26 MB | ELF with debug symbols |
| `rusefi.hex` | 2.0 MB | Intel HEX |
| `rusefi.srec` | 2.2 MB | SREC (update image) |
| `rusefi.map` | 3.1 MB | Linker map |
| `rusefi.list` | 10 MB | Disassembly listing |

## Target

- **Board:** STM32F407 Discovery
- **MCU:** STM32F407VG (ARM Cortex-M4 @ 168 MHz)
- **Flash:** 1 MB
- **RAM:** 192 KB
- **Firmware:** rusEFI (GPL-3.0) at commit `8540e44`
- **Local patch:** GCC 12+ build compatibility (`-Wno-error=shadow`)

## Branding Injection

The firmware uses compile-time branding injection from `branding/brand.json`:

| Firmware String | Source Variable |
|-----------------|-----------------|
| USB Manufacturer | `${brand.company_name}` |
| USB Product | `${brand.product_name}` |
| USB Vendor ID | `${firmware.usb_vendor_id}` |
| USB Product ID | `${firmware.usb_product_id}` |
| Version String | `${firmware.firmware_version_string}` |

## Verification

- [x] ARM GCC 12.3 installed and functional
- [x] Java 11 installed and functional
- [x] Build succeeds for f407-discovery
- [x] Output binaries exist (bin, elf, hex, srec)
- [x] ELF verified as ARM 32-bit executable
- [ ] Branding injection verified (requires firmware string extraction — post-TB-002)

## Notes

- The GCC 12 fix (`-Wno-error=shadow`) is applied as a local submodule commit (`7abb688`). Should be submitted upstream and the submodule tracked at upstream HEAD.
- The build produces `rusefi.bin` (not `prototype_ecu.bin`). Output naming should be updated in Phase 2 once a custom build configuration exists.
- Full branding verification requires extracting USB descriptor strings from the binary — this will be done in TB-002 (Studio launch).
