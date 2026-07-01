# TEN8 Desktop Software Architecture

## Overview

Professional tuning software for the TEN8 ECU platform, supporting real-time data, calibration, and analysis.

## Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|----------|
| **Framework** | Electron | Cross-platform, modern UI, rapid development |
| **Language** | TypeScript | Type safety, developer ecosystem |
| **UI Library** | React | Component model, rich visualization libraries |
| **State Management** | Zustand | Simple, performant |
| **Visualization** | Custom Canvas / WebGL | High-performance gauges and charts |
| **Serial Communication** | SerialPort (Node.js) | USB CDC, BLE bridge |
| **Data Storage** | SQLite | Local configuration, logs |
| **Map Editor** | React + Canvas | 3D fuel/ignition table editor |

## Features

### Dashboard

- Customizable gauge layouts
- Real-time data visualization (RPM, AFR, boost, temps)
- Digital and analog gauge styles
- Alert system with configurable thresholds

### Tuning

- 3D fuel table editor (RPM vs Load)
- 3D ignition table editor
- VE table auto-tuning (Wideband feedback)
- AFR target table
- Warmup and enrichment curves
- Individual cylinder trim

### Datalogging

- High-speed capture (1ms intervals)
- Playback and analysis
- Export to MLV, CSV
- Chart overlay and comparison

### Diagnostics

- DTC reader and clearer
- Sensor and actuator tests
- Live streaming data
- Freeze frame data

### Configuration

- Pin mapping
- Engine setup wizard
- Calibration file management
- Firmware update tool

## Architecture

```
┌──────────────────────────────────────────────┐
│                Electron/Svelte                │
│  ┌──────────────────────────────────────┐   │
│  │           UI Layer (React)            │   │
│  │  Dashboard | Maps | Logs | Config    │   │
│  └──────────────┬───────────────────────┘   │
│  ┌──────────────▼───────────────────────┐   │
│  │         IPC Bridge (preload)          │   │
│  └──────────────┬───────────────────────┘   │
│  ┌──────────────▼───────────────────────┐   │
│  │        Main Process (Node.js)         │   │
│  │  SerialPort | File I/O | Protocol     │   │
│  └──────────────┬───────────────────────┘   │
│  ┌──────────────▼───────────────────────┐   │
│  │         Communication Layer           │   │
│  │  USB CDC | BLE | WiFi | Cloud        │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

## Plugin System

- User-created widgets via React components
- Scripting for automated tuning operations
- Third-party integration API

## References

- Electron Documentation
- React for Desktop Applications
- TunerStudio Feature Reference (for UI/UX patterns)
