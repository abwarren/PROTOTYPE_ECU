# TEN8 Communication Protocol

## Overview

The TEN8 protocol defines how the ECU communicates with tuning software, mobile apps, and cloud services.

## Protocol Layers

```
┌───────────────────────────────────────────────┐
│           Application Protocol                  │
│  Real-time data | Tuning | Diagnostics | OTA   │
├───────────────────────────────────────────────┤
│              Transport Layer                     │
│  CAN FD | USB CDC | BLE GATT | TCP/IP | MQTT   │
├───────────────────────────────────────────────┤
│              Physical Layer                      │
│  CAN transceiver | USB PHY | BLE radio | Eth    │
└───────────────────────────────────────────────┘
```

## Transport-Specific Protocols

### CAN FD (Primary Tuning & Diagnostics)

- **Baud rate:** 500 kbps arbitration, 2 Mbps data phase
- **Protocol:** UDS (ISO 14229) over CAN FD
- **Data:** Real-time data via 0x22 ReadDataByIdentifier
- **Tuning:** Calibration via 0x2E WriteDataByIdentifier
- **Reprogramming:** 0x34/0x36/0x37 (RequestDownload/TransferData/Exit)

### USB (Desktop Connection)

- **Class:** CDC ACM (virtual COM port)
- **Baud:** No baud rate limitation (USB native)
- **Protocol:** Same as CAN FD payloads (bridge mode)
- **Bulk transfers:** For high-speed datalogging

### BLE (Mobile Connection)

- **GATT Service:** TEN8 ECU Data Service
- **Characteristics:**
  - RPM (notify, 2 bytes, little-endian)
  - Lambda (notify, 2 bytes, scaled)
  - Temperature (notify, 2 bytes)
  - DTC count (read, 1 byte)
  - DTC codes (read, variable)
  - Status (notify, 2 byte bitfield)
  - Command (write, variable)

### WiFi (High-Bandwidth)

- **WebSocket:** JSON stream for real-time dashboard
- **HTTP:** REST API for configuration
- **FTP/HTTP:** OTA firmware download

### Cellular (Cloud)

- **MQTT:** Telemetry data to cloud broker
- **Topic structure:** `ten8/{vehicle_id}/{parameter}`
- **QoS 1:** For critical data (DTCs, alarms)
- **QoS 0:** For periodic telemetry

## Data Format

- **Real-time:** Binary, compact, little-endian
- **Configuration:** JSON for readability (converted to binary on ECU)
- **Datalogs:** Custom binary format (converted to CSV/MLV externally)

## Security

- **CAN:** UDS SecurityAccess (0x27) for write operations
- **USB:** Session authentication for tuning
- **BLE:** Passkey pairing
- **Cloud:** mTLS with device certificates

## References

- ISO 14229 (UDS)
- ISO 15765 (DoCAN)
- OASIS MQTT Standard
- Bluetooth GATT Specification
