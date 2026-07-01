# Hardware Architecture

## Overview

The ECU hardware is designed as a professional standalone ECU platform suitable for a wide range of engines. Hardware designs are brand-neutral — all identifiers use platform-internal naming.

## Requirements

| Requirement | Specification |
|-------------|---------------|
| Input voltage | 6-36V (12V/24V nominal) |
| Operating temp | -40°C to +125°C |
| Processor | ARM Cortex-M7 @ 320+ MHz |
| Memory | 2MB+ Flash, 512KB+ RAM |
| CAN | 2x CAN FD |
| USB | 1x USB 2.0 FS/HS |
| BLE | 1x BLE 5.0 |
| Injector outputs | 8 (peak & hold) |
| Ignition outputs | 8 (smart IGBT) |
| Analog inputs | 12 (0-5V, 0-12V) |
| Temp sensor inputs | 4 (bias resistor) |
| Knock input | 2 (differential) |
| Wideband O2 | 2 (CJ125/CB131) |
| ETC (DBW) | 2 (H-bridge) |
| Boost control | 1 (PWM solenoid) |
| Tach output | 1 (high-side) |
| Relay drives | 4 (low-side) |

## Block Diagram

```
[Power Supply] ──┬── [MCU Core] ──┬── [CAN FD x2]
                 │                │
                 │         ┌──────┴──────┐
                 │         │  [Cellular]  │
                 │         │  (Optional)  │
                 │         └─────────────┘
                 │
    ┌────────────┴───────────────────────┬──────────────┐
    │                                    │              │
[Injector Drv x8]                    [Input Ckts]   [USB]
[Ignition Drv x8]                    [Sensor Ckts]  [BLE]
[ETC H-Bridge x2]                    [Knock Ckts]   [WiFi]
[Low-Side Out x4]                    [WBO2 Ckts]    [LTE]
[Boost Solenoid]                                    [WiFi]
```

## PCB Design

- **Layers:** 6-layer stackup
- **Material:** High-Tg FR4 (Tg > 170°C)
- **Copper:** 1oz signal, 2oz power, 3oz driver
- **Standards:** IPC-6012 Class 3
- **EMC:** CISPR 25 designed from start

## Enclosure

- **Material:** Aluminum (ADC12 die cast)
- **Sealing:** IP67 (standard), IP6K9K (optional)
- **Connectors:** Deutsch DTM (TE Connectivity)
- **Thermal:** Thermal pads to enclosure

## Interfaces

| Interface | Connector | Protocol |
|-----------|-----------|----------|
| Main harness | 42-pin Deutsch DTM | Custom pinout |
| CAN bus | 4-pin Deutsch DTM | CAN FD |
| USB | USB-C | CDC ACM |
| Antenna | FAKRA | BLE/WiFi/LTE |

## Board Identification

Each board has a unique ID that identifies the hardware revision, configuration, and capabilities. The board ID format is defined in `branding/brand.json`:

```
{product_short_name}-{board_revision}-{variant}
```

Example: `EPC-BASE-01`

## Trade-offs

| Choice | Alternative | Rationale |
|--------|-------------|-----------|
| NXP S32K3 vs STM32H7 | STM32H7 for lower cost | S32K3 for automotive qualification, HSM, reliability |
| Aluminum vs plastic | Plastic for lower cost | Aluminum for thermal and EMI performance |
| Deutsch vs Molex connectors | Both viable | Deutsch has wider aftermarket compatibility |
| Full AEC-Q vs industrial grade | Industrial for lower cost | Production version must be fully automotive qualified |

## Future Roadmap

1. **V1 Prototype** — STM32H7 + industrial components (testing)
2. **V1 Production** — NXP S32K3 + automotive components
3. **V2** — Higher channel count, integrated cellular
4. **V3** — ASIL-D safety, zonal architecture ready

## References

- NXP: S32K3 Reference Design
- TE Connectivity: Deutsch Connector Guide
- ISO 16750: Environmental Testing
