# Mobile Application — Research

## Overview

Mobile apps enable BLE/WiFi-based diagnostics, tuning, and monitoring directly from a smartphone.

## Framework Comparison

| Feature | Flutter | React Native |
|---------|---------|-------------|
| Language | Dart | JavaScript/TypeScript |
| BLE support | flutter_blue_plus | react-native-ble-plx |
| Serial/USB | flutter_libusb | Not direct |
| Performance | Native compilation | JS bridge |
| UI rendering | Skia engine | Native components |
| Automotive use | Increasing | ECU Connect (EcuTek) |

## Key Features

- **Dashboard:** Real-time gauges (RPM, AFR, temp, boost)
- **DTC Reader:** Read and clear diagnostic trouble codes
- **Datalogging:** Record and export logs
- **Tuning:** Limited calibration adjustments
- **Data Visualization:** Charts and analysis

## Connectivity

| Method | Protocol | Use |
|--------|----------|-----|
| BLE | GATT | Real-time data, periodic diagnostics |
| WiFi | TCP/UDP | High-speed datalogging |
| Cloud | REST | Data sync, remote access |

## TEN8 Mobile

- **Framework:** Flutter (best BLE and performance)
- **Features:** Dashboard, DTC, datalogging, cloud sync
- **Authentication:** Account-based with vehicle pairing
- **Platforms:** iOS and Android

## References

- Flutter: flutter.dev
- flutter_blue_plus: pub.dev
- EcuTek ECU Connect: ecutek.com
- Cobb Accessport (mobile): cobbtuning.com
