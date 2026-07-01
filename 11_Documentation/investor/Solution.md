# Solution

## What We're Building

**Prototype ECU** is a complete engine management platform with three layers:

### 1. Prototype ECU (The Hardware + Firmware)

A professional standalone ECU that controls fuel, ignition, boost, and all engine systems. Based on proven open-source firmware (rusEFI), giving us years of production testing on thousands of engines worldwide.

- STM32H7 MCU (320MHz Cortex-M7)
- 2MB flash, 1MB RAM
- 2x CAN FD, USB-C, BLE
- 8 injector / 8 ignition outputs
- Electronic throttle control
- Wideband O2 support
- $500-1,500 target price

### 2. Prototype Studio (The Desktop Application)

This is our primary differentiator. A modern, beautiful, cloud-connected desktop application that sets a new standard for ECU tuning software.

- Dark mode, animated gauges, resizable widgets
- Dockable windows and drag-and-drop layouts
- Global command palette (search anything)
- Cloud backup and sync
- AI-assisted tuning panel
- Plugin system for extensibility

### 3. Prototype Cloud (The Connectivity Layer)

Connected ECUs that enable remote diagnostics, OTA updates, and fleet management.

- Real-time telemetry
- Remote calibration
- OTA firmware updates
- Fleet dashboard
- Mobile app for on-the-go monitoring

## The Architecture

```
┌─────────────────────────────────────────────────────┐
│              Prototype Studio (Desktop)              │
│  Modern UI | Calibration | Diagnostics | Datalogging │
├─────────────────────────────────────────────────────┤
│              Prototype Cloud (Optional)              │
│  Telemetry | OTA | Remote Diag | Fleet Management   │
├─────────────────────────────────────────────────────┤
│              Prototype ECU (Firmware)                │
│  Proven Engine Control | CAN | Sensors | Safety      │
└─────────────────────────────────────────────────────┘
```

## Why This Works

| Problem | Our Solution |
|---------|--------------|
| Legacy software | Modern, beautiful UI |
| High cost | 1/3 to 1/2 the price of competitors |
| No connectivity | Cloud-native from day one |
| Difficult to use | Intuitive, searchable interface |
| No mobile access | BLE companion app |
| No AI | Reserved AI panel for future |

## What Makes This Defensible

1. **Brand and UX** — A modern UI that people want to use
2. **Ecosystem lock-in** — Cloud profiles, calibration library, plugin marketplace
3. **Hardware integration** — Optimized firmware-hardware-software stack
4. **White-label architecture** — Can serve OEM customers without rewriting
5. **Community** — Open-source foundation with proprietary value layer
