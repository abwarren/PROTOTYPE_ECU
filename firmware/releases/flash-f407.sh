#!/usr/bin/env bash
# flash-f407.sh — Flash firmware to STM32F407 Discovery board
# Usage: ./flash-f407.sh [firmware.bin]
#        ./flash-f407.sh stlink   (flash via ST-Link with openocd)
#        ./flash-f407.sh dfu      (flash via DFU)
#        ./flash-f407.sh serial   (flash via UART serial)

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
FIRMWARE="${2:-$DIR/latest/rusefi_latest.bin}"
[ ! -f "$FIRMWARE" ] && FIRMWARE="$DIR/latest/rusefi_local_build.bin"
[ ! -f "$FIRMWARE" ] && echo "No firmware binary found in $DIR/latest/" && exit 1

echo "=== 7100CPT ECU — f407-discovery Flasher ==="
echo "Firmware: $(basename "$FIRMWARE") ($(du -h "$FIRMWARE" | cut -f1))"

case "$1" in
  stlink)
    echo "Flashing via ST-Link (openocd)..."
    openocd-wrapper -f board/stm32f4discovery.cfg \
      -c "program \"$FIRMWARE\" 0x08000000 verify reset exit"
    ;;
  dfu)
    echo "Flashing via DFU (make sure board is in DFU mode)..."
    dfu-util -a 0 -s 0x08000000:leave -D "$FIRMWARE"
    ;;
  serial)
    DEV="${3:-/dev/ttyUSB0}"
    echo "Flashing via UART on $DEV..."
    stm32flash -w "$FIRMWARE" -v "$DEV"
    ;;
  *)
    echo "Usage: $0 {stlink|dfu|serial} [firmware.bin] [serial-device]"
    echo ""
    echo "  stlink  — ST-Link via openocd (onboard Discovery programmer)"
    echo "  dfu     — DFU mode (BOOT0 + reset)"
    echo "  serial  — UART bootloader (e.g., /dev/ttyUSB0 via CP210x)"
    exit 1
    ;;
esac

echo "✅ Flash complete"
