# Bluetooth / BLE — Research

## Overview

Bluetooth Low Energy (BLE) is the primary candidate for mobile-to-ECU communication for diagnostics and tuning.

## Key Modules

| Module | Standard | Range | Power |
|--------|----------|-------|-------|
| HC-05 | BT 2.0 | 10m | Medium |
| RN4871 | BLE 4.2 | 100m | Low |
| NINA-B3 | BLE 5.0 | 300m+ | Very Low |
| ESP32 | WiFi+BLE 4.2 | 100m | Medium |

## BLE vs Classic Bluetooth

| Feature | BLE | Classic BT |
|---------|-----|-----------|
| Power consumption | Very low | Medium |
| Data rate | 1-2 Mbps | 3 Mbps |
| Pairing | Simplified | More complex |
| Range | 100m+ (BLE 5.0) | 10-100m |
| Automotive use | Mobile tuning | Audio/infotainment |

## TEN4 BLE Implementation

- **BLE 5.0** module (NINA-B3 or similar)
- **GATT service** for ECU data
- **Characteristics:** RPM, AFR, temperature, DTCs
- **Authentication:** Secure pairing with passkey

## References

- Bluetooth Core Specification 5.0+
- u-blox: NINA-B3 Datasheet
- ESP32 BLE Architecture
