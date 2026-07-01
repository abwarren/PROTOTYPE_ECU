# Communications — Research

## Overview

Comprehensive research on all communication protocols relevant to ECU systems.

## Protocols

### CAN / CAN FD
- **Use:** Primary ECU-to-ECU bus, diagnostics, tuning
- **Physical:** Differential pair, 120Ω terminated
- **Speed:** Up to 1 Mbps (CAN), 8 Mbps (CAN FD)

### LIN
- **Use:** Low-cost sensor/actuator subnets
- **Architecture:** Master/slave, single wire
- **Speed:** Up to 20 kbps

### USB
- **Use:** Tuning, datalogging, firmware updates
- **Speed:** USB 2.0 HS (480 Mbps) sufficient
- **Class:** CDC (virtual COM port) for compatibility

### Bluetooth / BLE
- **Use:** Mobile diagnostics, proximity tuning
- **BLE:** Low power, good for periodic data
- **BT Classic:** Higher bandwidth for logging

### WiFi
- **Use:** OTA updates, high-speed datalogging
- **Standard:** 802.11n 2.4GHz (sufficient for ECU)

### Ethernet
- **Use:** Future zonal architectures, high-bandwidth
- **Automotive:** 100BASE-T1, 1000BASE-T1 (single pair)

### LTE / Cellular
- **Use:** Telematics, remote monitoring, cloud
- **Module:** Quectel, SIMCom automotive-grade

## Application Protocols

| Protocol | Transport | Use |
|----------|-----------|-----|
| UDS | CAN, DoIP | Diagnostics |
| XCP | CAN, Ethernet | Calibration |
| MQTT | TCP/IP | Cloud telemetry |
| WebSocket | TCP/IP | Real-time dashboards |
| HTTP/REST | TCP/IP | Cloud API |

## TEN8 Communication Stack

| Interface | Protocol | Purpose |
|-----------|----------|---------|
| CAN FD | CAN 2.0/FD | Tuning, diagnostics, sensors |
| USB | CDC ACM | Desktop tuning connection |
| BLE | GATT | Mobile app connection |
| WiFi | TCP/IP | OTA updates, local dashboards |
| Cellular | MQTT | Cloud telemetry |
| LIN | 2.0 | Expansion subnets |

## References

- ISO 11898 (CAN/CAN FD)
- ISO 17987 (LIN)
- USB-IF Specifications
- Bluetooth Core Specification
- IEEE 802.11 (WiFi)
- IEEE 802.3 (Ethernet)
- OASIS MQTT Standard
