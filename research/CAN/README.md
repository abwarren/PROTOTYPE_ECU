# CAN Bus — Research

## Overview

CAN bus is the backbone of automotive communication. TEN8 must implement both classic CAN (ISO 11898) and CAN FD.

## Key Standards

| Standard | Focus |
|----------|-------|
| ISO 11898-1 | Data link layer (CAN 2.0, CAN FD) |
| ISO 11898-2 | High-speed medium access unit |
| ISO 11898-3 | Low-speed fault-tolerant |
| ISO 15765-2 | Transport layer (ISO-TP) |
| SAE J1939 | Heavy-duty vehicle protocol |

## CAN vs CAN FD

| Feature | CAN 2.0 | CAN FD |
|---------|---------|--------|
| Max data rate | 1 Mbps | 8 Mbps (data phase) |
| Max payload | 8 bytes | 64 bytes |
| CRC | 15-bit | 17/21-bit |
| Backward compatible | - | Yes (same physical layer) |

## Transceivers

| Part | Type | Features |
|------|------|----------|
| TJA1040 | High-speed CAN | Standard |
| TJA1051 | High-speed CAN | Improved EMC |
| TJA1043 | CAN FD | Standby, wake |
| TJA1463 | CAN FD/SIC | Signal improvement |

## TEN8 CAN Implementation

- CAN FD on main bus (tuning, diagnostics)
- Classic CAN on secondary bus (sensor expansion)
- ISO-TP for large data transfers
- UDS on CAN for diagnostics

## References

- CAN in Automation (CiA): https://www.can-cia.org/
- Vector Informatik: CAN technical articles
- NXP: CAN Application Notes
