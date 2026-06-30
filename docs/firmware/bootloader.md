# Bootloader Module

## Purpose

Provide secure, reliable firmware update capability supporting USB and CAN transport. Enables field-updatable firmware without special hardware tools.

## Responsibilities

- Manage firmware update process via USB and CAN
- Validate firmware image integrity (CRC)
- Coordinate with OpenBLT for flash programming
- Handle update failure and fallback to existing firmware
- Support DFU mode for recovery

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Firmware binary | USB (DFU/CDC) or CAN | Binary data stream |
| Update request | CAN message or GPIO trigger | Command |
| Boot mode selection | Boot pin or firmware flag | GPIO/digital |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Flash write operations | Flash controller | Page erase/write |
| Boot selection | Bootloader state machine | Bank select |
| Status indication | LED, CAN, USB | Blink pattern/frame |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| Flash driver | ChibiOS NAND/NOR HAL | Hardware |
| USB peripheral | ChibiOS USB HAL | Hardware |
| CAN peripheral | ChibiOS CAN HAL | Hardware |

## Source Files

| File | Purpose |
|------|---------|
| `bootloader/bootloader_main.cpp` | Bootloader entry point |
| `bootloader/bootloader_stubs.cpp` | Bootloader stub functions |
| `bootloader/openblt_chibios/openblt_chibios.cpp` | OpenBLT integration |
| `bootloader/openblt_chibios/openblt_usb.cpp` | USB transport |
| `bootloader/openblt_chibios/openblt_can.cpp` | CAN transport |
| `bootloader/openblt_chibios/openblt_flash.cpp` | Flash programming |
| `bootloader/openblt_chibios/nvm.c` | NVM driver |
| `bootloader/openblt_chibios/clock-arch.c` | Clock configuration |
| `bootloader/openblt_chibios/types.h` | Type definitions |
| `bootloader/openblt_chibios/flash.h` | Flash interface |
| `bootloader/hw_layer/bootloader.cpp` | Hardware bootloader support |
| `bootloader/hw_layer/stm32_dfu.cpp` | STM32 DFU mode support |

## Build Dependencies

- OpenBLT library
- ChibiOS (USB CDC, CAN drivers)
- Board-specific flash layout configuration

## Known Limitations

- No secure boot (signature verification)
- No A/B dual-bank redundancy
- No encryption (firmware binary is transmitted in plaintext)
- No anti-rollback protection
- Recovery requires hardware DFU mode (button + power cycle)

## Future Improvements

- [ ] Secure boot with ECDSA signature verification
- [ ] A/B dual-bank flash for safe OTA updates
- [ ] Firmware encryption (AES-256-GCM)
- [ ] Anti-rollback monotonic counter
- [ ] UDS-based update protocol (ISO 14229)

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| Phase 1-2 | KEEP — OpenBLT is functional | No changes |
| Phase 3 | REPLACE — secure A/B bootloader with OTA | Q1-Q2 2027 |
