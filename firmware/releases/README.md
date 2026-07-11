# Firmware Releases — 7100CPT ECU Platform

## Directory Layout

```
firmware/releases/
├── latest/          # Autoupdate bundle (firmware + OpenBLT bootloader)
│   ├── rusefi_latest.bin          → Full flash image (bootloader + firmware)
│   ├── rusefi_latest_update.srec  → Update image for OpenBLT
│   ├── openblt.bin                → OpenBLT bootloader standalone
│   ├── rusefi_f407-discovery.ini  → TunerStudio config
│   └── console/                   → rusEFI console JAR
├── full/            # Full release bundle (+ scripts, drivers, openocd)
│   └── rusefi.snapshot.f407-discovery/
│       ├── rusefi_latest.bin
│       ├── rusefi_latest_update.srec
│       ├── bin/flash_stlink.sh    → Flash via ST-Link
│       ├── bin/switch_to_dfu.sh   → Switch to DFU mode
│       └── drivers/               → ST-Link drivers
└── README.md
```

## Source: 2026-07-11 (latest nightly from rusEFI upstream)
- **Board:** STM32F407 Discovery (f407-discovery)
- **Full image:** 775 KB `.bin`
- **Update image:** 2.2 MB `.srec`
- **OpenBLT bootloader:** 23 KB
- **Build:** `c4ce60f5362d7fa9b7eabcc4034b6bb848452e47`

## Local Build (if newer required)
- `firmware/upstream/firmware/build/rusefi.bin` — 728 KB local build

## Flashing

### Via ST-Link (ST-Link/V2 on Discovery board)
```bash
openocd-wrapper -f board/stm32f4discovery.cfg -c "program firmware/releases/latest/rusefi_latest.bin 0x08000000 verify reset exit"
```

### Via DFU (USB)
```bash
# Enter DFU mode (press BOOT0 + RESET or use switch_to_dfu.sh)
dfu-util -a 0 -s 0x08000000:leave -D firmware/releases/latest/rusefi_latest.bin
```

### Via STM32 ROM bootloader (UART serial)
```bash
stm32flash -w firmware/releases/latest/rusefi_latest.bin -v /dev/ttyUSB0
```
