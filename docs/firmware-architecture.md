# Firmware Architecture

## Overview

The firmware provides real-time engine control with a modular, safety-conscious architecture. All branding is injected at compile time from `branding/brand.json`.

## Architecture Layers

```
┌──────────────────────────────────────────────────┐
│              Application Layer                    │
│  Fuel | Ignition | ETC | Knock | Diagnostics      │
├──────────────────────────────────────────────────┤
│              Middleware Layer                      │
│  Scheduler | Config | Comms | Calibration         │
├──────────────────────────────────────────────────┤
│           Hardware Abstraction Layer (HAL)         │
│  Timers | ADC | GPIO | CAN | DMA                  │
├──────────────────────────────────────────────────┤
│           MCU Drivers (MCAL)                       │
│  STM32 HAL | Low-level drivers                    │
├──────────────────────────────────────────────────┤
│                  RTOS                              │
│              FreeRTOS                              │
└──────────────────────────────────────────────────┘
```

## Branding Injection Points

| Location | Branding Variable | Source |
|----------|-------------------|--------|
| USB Vendor/Product ID | `${usb_vendor_id}`, `${usb_product_id}` | brand.json |
| USB Manufacturer String | `${usb_manufacturer_string}` | brand.json |
| USB Product String | `${usb_product_string}` | brand.json |
| Firmware Version String | `${firmware_version_string}` | brand.json |
| Bootloader Version | `${bootloader_version_string}` | brand.json |
| Board ID | `${board_id_identifier}` | brand.json |
| Splash/Serial Text | `${default_splash_text}` | brand.json |
| Build Date/Hash | `@BUILD_DATE@`, `@BUILD_HASH@` | Build system |

## RTOS

- **Current:** FreeRTOS (well-known, good ecosystem)
- **Future:** AUTOSAR OS for production safety compliance
- **Scheduling:** Fixed-priority preemptive with time-triggered tasks

## Task Priorities

| Task | Priority | Period | Deadline |
|------|----------|--------|----------|
| Trigger Decode | Highest | 100µs | 100µs |
| Fuel Schedule | High | 1ms | 1ms |
| Ignition Schedule | High | 1ms | 1ms |
| Control Loops | Medium | 5ms | 5ms |
| CAN Communication | Medium | 10ms | 10ms |
| Diagnostics | Low | 100ms | 100ms |
| Cloud/Telemetry | Lowest | 1s | 1s |

## Engine Control Algorithms

### Trigger Decoding

- Support for most common trigger patterns (60-2, 36-1, 4-1, Hall, etc.)
- Hardware timer capture with interrupt processing
- Angular scheduling for ignition/injection

### Fuel Control

- Speed-density (MAP + RPM + VE table)
- Alpha-N (TPS + RPM for ITB applications)
- MAF-based (future)
- Closed-loop lambda via wideband O2
- Acceleration enrichment
- Warm-up enrichment

### Ignition Control

- Distributor and coil-on-plug support
- Direct fire and wasted spark
- Individual cylinder trim
- Dwell time control
- Knock control (bandpass filtered, per-cylinder)

### Electronic Throttle Control

- Dual sensor plausibility monitoring
- PID control with feed-forward
- Safe state / limp-home modes
- Position servo loop @ 1-5 kHz

### Diagnostics

- Full OBD-II via UDS on CAN FD
- DTC storage with freeze frame
- Sensor rationality checks
- Actuator fault detection

## Memory Management

- **Flash:** A/B dual bank for OTA updates
- **EEPROM Emulation:** Flash-based with wear leveling
- **Config:** Calibration data with CRC protection
- **Diagnostic Logs:** Circular buffer in flash

## References

- AUTOSAR Layered Architecture
- FreeRTOS Documentation
- OSEK/VDX OS Specification
