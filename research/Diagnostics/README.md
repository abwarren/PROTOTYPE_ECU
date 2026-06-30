# Diagnostics — Research

## Overview

Automotive diagnostics enable fault detection, reporting, and system monitoring. OBD-II is mandatory for road vehicles in most markets.

## Key Standards

| Standard | Description |
|----------|-------------|
| ISO 14229 | UDS — Unified Diagnostic Services |
| ISO 15031 | OBD-II / EOBD (emissions) |
| ISO 15765 | Diagnostics on CAN (DoCAN) |
| SAE J1979 | OBD-II PIDs |
| SAE J2012 | Diagnostic Trouble Codes (DTC) |

## UDS Services

| ID | Service | Purpose |
|----|---------|---------|
| 0x10 | DiagnosticSessionControl | Change session |
| 0x11 | ECUReset | Reset ECU |
| 0x27 | SecurityAccess | Authentication |
| 0x22 | ReadDataByIdentifier | Read parameter |
| 0x2E | WriteDataByIdentifier | Write parameter |
| 0x31 | RoutineControl | Run routine |
| 0x34 | RequestDownload | Start firmware update |
| 0x35 | RequestUpload | Start data upload |
| 0x36 | TransferData | Transfer firmware/data |
| 0x37 | RequestTransferExit | End transfer |

## TEN8 Diagnostics

- Full UDS implementation on CAN FD
- OBD-II compliance for emissions markets
- Enhanced manufacturer-specific diagnostics
- Remote diagnostics via cloud platform

## References

- ISO 14229-1: UDS Specification
- ISO 15765-2: DoCAN Transport Layer
- SAE J1979-DA: OBD-II PIDs
