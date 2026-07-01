# TEN8 Mobile Application Architecture

## Overview

Cross-platform mobile app for diagnostics, monitoring, and basic tuning via BLE/WiFi.

## Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|----------|
| **Framework** | Flutter | High performance, excellent BLE support |
| **Language** | Dart | Type-safe, Flutter-native |
| **BLE** | flutter_blue_plus | Mature, well-maintained |
| **State** | Riverpod | Reactive, testable |
| **Charts** | fl_chart | Interactive charting |
| **HTTP** | dio | Cloud API communication |
| **Local Storage** | Hive / Isar | Fast embedded DB |

## Features

### Dashboard

- Real-time gauge display (RPM, AFR, temp, boost)
- Swipeable gauge pages
- Portrait and landscape layouts
- Dark mode for night use

### Diagnostics

- Read diagnostic trouble codes (DTCs)
- Clear DTCs
- Freeze frame data
- Live sensor data
- Actuator tests

### Datalogging

- Configurable channel selection
- Log to phone storage
- Export CSV
- Share logs

### Tuning (Limited)

- Calibration file upload/download
- Map viewing (no editing — desktop is primary tuning tool)
- Firmware update initiation

### Cloud

- User account and vehicle registration
- Telemetry sync
- Remote diagnostics requests
- OTA update status

## Connectivity

| Method | Mode | Data Rate |
|--------|------|-----------|
| BLE | Direct to ECU | 1-2 Mbps (sufficient for periodic data) |
| WiFi | Direct or infrastructure | 50+ Mbps (datalogging) |
| Cloud | Cellular/WiFi | Remote diagnostics |

## Architecture

```
┌────────────────────────────────────────────┐
│                Flutter App                  │
│  ┌──────────────────────────────────────┐ │
│  │            UI Layer                   │ │
│  │  Dashboard | DTC | Logs | Settings   │ │
│  └──────────────┬───────────────────────┘ │
│  ┌──────────────▼───────────────────────┐ │
│  │         Service Layer                 │ │
│  │  BLE Service | WiFi | Cloud API      │ │
│  └──────────────┬───────────────────────┘ │
│  ┌──────────────▼───────────────────────┐ │
│  │          Communication Layer          │ │
│  │  BLE | WiFi | HTTP | MQTT            │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

## References

- Flutter Documentation: flutter.dev
- flutter_blue_plus: pub.dev/packages/flutter_blue_plus
- Riverpod State Management: pub.dev/packages/riverpod
