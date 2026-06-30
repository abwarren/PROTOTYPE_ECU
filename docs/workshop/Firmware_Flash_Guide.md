# 📥 Firmware Flash Guide

> **Audience:** Workshop technicians
> **Last updated:** 2026-06-30

---

## Methods

| Method | Speed | Tools Required | Best For |
|--------|-------|---------------|----------|
| USB (Studio) | Fast | USB-C cable + Studio | Daily updates |
| USB (DFU) | Fast | USB-C cable + boot mode | Recovery |
| CAN (Bootloader) | Medium | CAN interface | Remote/updates |

## Method 1: USB via Studio (Recommended)

1. Connect ECU via USB-C cable
2. Open Studio → **Firmware** tab
3. Click **Check for Updates** (if cloud-connected)
   OR click **Browse** to select a firmware file
4. Studio will verify compatibility
5. Click **Flash Firmware**
6. Do NOT disconnect power or USB during flashing
7. ECU will restart automatically
8. Verify firmware version in Studio status bar

## Method 2: USB DFU (Recovery)

Use this method if firmware is corrupted or ECU is unresponsive.

1. Disconnect power from ECU
2. Press and hold BOOT button (located next to USB-C port)
3. Apply power while holding BOOT button
4. Release BOOT button after 2 seconds
5. ECU is now in DFU mode (no LED indication)
6. Run recovery command:
   ```bash
   cd firmware
   make dfu-recovery
   ```
7. ECU will restart with factory firmware
8. Re-flash latest firmware via Method 1

## Method 3: CAN Update

For fleet/remote updates via cloud.

1. Firmware is uploaded to cloud dashboard
2. Update campaign is created for target vehicles
3. ECU checks for updates via MQTT
4. ECU downloads and verifies firmware
5. ECU reboots to new firmware
6. ECU reports success via CAN

## Recovery Flow

```
ECU Unresponsive?
        │
        ▼
Try Power Cycle ──→ Working? → Done
        │ No
        ▼
Enter DFU Mode ──→ Flash Recovery ──→ Working? → Done
        │ No
        ▼
Contact Support ──→ Return for repair
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Studio cannot find ECU | Check USB cable, try different port, install drivers |
| DFU mode not working | Hold BOOT button longer; try 5 seconds before power-on |
| Flash fails at 50% | Check power supply voltage; retry |
| ECU stuck after flash | Enter DFU mode and flash recovery firmware |
| CAN update not starting | Verify CAN bus wiring and termination |
