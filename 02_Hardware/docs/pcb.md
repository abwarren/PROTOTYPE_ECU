# PCB Module

> **Policy:** Every PCB revision must include schematics, PCB layout, BOM, manufacturing files, assembly notes, bring-up notes, revision notes, and test results.

## Purpose

Design and manufacture the ECU printed circuit board, providing the physical platform for all electronic components.

## Responsibilities

- MCU and peripheral component placement
- Power supply regulation and distribution
- Signal conditioning for all sensor inputs
- High-current driver circuits (injectors, ignition, relays)
- CAN transceiver and USB PHY
- EMC compliance (CISPR 25)
- Thermal management of power components

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Power (6-36V) | Vehicle battery | DC |
| Sensor signals | Analog/digital sensors | 0-5V, PWM, freq |
| CAN bus | Vehicle CAN network | Differential |
| USB | Tuning software | Differential |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Injector drive | Fuel injectors | Peak & hold current |
| Ignition drive | Coil drivers/IGBTs | Gate drive |
| ETC drive | Electronic throttle | H-bridge PWM |
| Relay drives | Fans, pumps, etc. | Low-side switch |
| CAN bus | Vehicle/scan tool | Differential |
| USB | Tuning PC | Differential |

## Design Specifications

| Parameter | Value |
|-----------|-------|
| **Layers** | 6-layer stackup |
| **Material** | High-Tg FR4 (Tg > 170°C) |
| **Copper** | 1oz signal, 2oz power, 3oz driver |
| **Standard** | IPC-6012 Class 3 |
| **EMC** | CISPR 25 designed from start |
| **Operating temp** | -40°C to +125°C |

## Connectors

| Interface | Connector | Type |
|-----------|-----------|------|
| Main harness | 34-pin AMPSEAL 16 | Sealed |
| CAN bus | 4-pin Deutsch DTM | Sealed |
| USB | USB-C | CDC ACM |
| Antenna | FAKRA | BLE/WiFi/LTE |

## Manufacturing Deliverables

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Gerber Files | RS-274X | All layers including NC drill |
| Stackup | PDF | Layer stackup with material specs |
| IPC Netlist | IPC-356 | Netlist for electrical testing |
| BOM | CSV/Excel | Component list with MPNs |
| Pick & Place | CSV | XY coordinates for assembly |
| FAI Report | PDF | First article inspection |

## Known Issues

- V1 prototype uses STM32H7 (industrial grade); production will migrate to NXP S32K3 (automotive grade)

## Future Improvements

- [ ] NXP S32K3 migration for automotive qualification
- [ ] Integrated cellular module
- [ ] Higher channel count (16 injectors, 16 ignition)
- [ ] ASIL-D safety capable design
