# Cellular / LTE Telematics — Research

## Overview

Cellular connectivity enables remote monitoring, telematics, and OTA updates for connected ECUs.

## Key Modules

| Vendor | Module | Features |
|--------|--------|----------|
| Quectel | BG95 | LTE Cat M1/NB1, 2G fallback |
| Quectel | AG35 | LTE Cat 4, automotive qualified |
| SIMCom | SIM7000 | LTE Cat M1/NB1 |
| SIMCom | SIM8200 | 5G (future) |
| u-blox | SARA-R5 | LTE-M, NB-IoT, secure cloud |

## Architecture

ECU → Cellular Module → MQTT Broker → Cloud Backend

## Key Considerations

- **Data plan:** IoT-specific plans (low data, long life)
- **Power:** Cellular module draws significant current during TX
- **Antenna:** External antenna with automotive-grade connector
- **Certification:** FCC, PTCRB for module
- **Network:** 2G sunset, target LTE Cat M1/NB1

## TEN8 Applicability

- Optional module for premium TEN8 models
- Standard MQTT for cloud communication
- Hardware design to accept cellular module

## References

- Quectel Module Specifications
- SIMCom Automotive Modules
- LTE Cat M1 Standard
