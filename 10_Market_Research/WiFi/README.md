# WiFi — Research

## Overview

WiFi enables high-bandwidth local connectivity for OTA updates, datalogging, and diagnostics.

## Key Modules

| Module | Standard | Features |
|--------|----------|----------|
| ESP32 | 802.11 b/g/n | WiFi + BLE, dual-core |
| ESP8266 | 802.11 b/g/n | Low cost, limited IO |
| WINC1500 | 802.11 b/g/n | Atmel/Microchip |
| WF121 | 802.11 b/g/n | Bluetooth + WiFi |

## Use Cases

- **OTA firmware updates** (large files, high bandwidth)
- **High-speed datalogging** (SD card or cloud offload)
- **Local tuning dashboard** (WebSocket to tablet/laptop)
- **Workshop diagnostics** (wireless connection to service tool)

## TEN8 WiFi

- ESP32 module as WiFi/BLE coprocessor
- WebSocket API for real-time data
- HTTP/HTTPS for OTA download
- Access point mode for direct connection
- Station mode for infrastructure WiFi

## References

- ESP32 Technical Reference
- IEEE 802.11 Standards
- WFA (WiFi Alliance) Certification
