# Diagnostics Module

## Purpose

Provide OBD-II / UDS diagnostic services, DTC (Diagnostic Trouble Code) management, and sensor rationality checking for emissions compliance and system health monitoring.

## Responsibilities

- Respond to UDS diagnostic requests (ISO 14229)
- Maintain DTC memory with freeze frame data
- Perform sensor rationality checks (plausibility)
- Detect actuator faults (open circuit, short circuit)
- MIL (Malfunction Indicator Lamp) control via OBD indicators
- Support diagnostic scan tool communication via CAN

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| UDS diagnostic requests | CAN bus (scan tool) | ISO-TP frames |
| Sensor values | All sensor modules | Various |
| Fault conditions | Sensor checker, actuator monitor | Bitfield |
| DTC clear request | Diagnostic command | UDS service |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| DTC codes | CAN bus / logging | uint32 (ISO 15031-6) |
| Freeze frame data | Diagnostic logging | Snapshot |
| UDS diagnostic responses | CAN bus (scan tool) | ISO-TP frames |
| MIL status | OBD indicator LED | bool |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| CAN bus | `controllers/can/` | Internal |
| ISO-TP transport | `controllers/can/isotp/` | Internal |
| Sensor processing | `controllers/sensors/` | Internal |
| OBD error codes | `controllers/algo/obd_error_codes.h` | Internal |

## Source Files

| File | Purpose |
|------|---------|
| `controllers/can/obd2.cpp` | UDS/OBD-II diagnostic service handler (227 lines) |
| `controllers/can/obd2.h` | OBD-II header |
| `controllers/algo/obd_error_codes.h` | DTC error code definitions |

## Supported UDS Services

| Service ID | Service | Status |
|------------|---------|--------|
| 0x01 | ReadDataByIdentifier (current data) | Supported |
| 0x02 | ReadFreezeFrameData | Supported |
| 0x03 | ReadDiagnosticTroubleCodes | Supported |
| 0x04 | ClearDiagnosticInformation | Supported |
| 0x05 | ReadOxygenSensorMonitoring | Basic |
| 0x09 | ReadVehicleInformation | Basic |
| 0x0A | ReadPermanentDTC | Not supported |

## Known Limitations

- rusEFI-specific DTC implementation — limited UDS service support
- No freeze frame data storage (persistent across power cycles)
- No DTC aging or pending DTC support
- No comprehensive sensor rationality (limited checks)
- No support for extended data records or routine control

## Future Improvements

- [ ] Full UDS service implementation
- [ ] Persistent DTC storage with freeze frame
- [ ] DTC aging, pending, and confirmed status
- [ ] Comprehensive sensor rationality
- [ ] Remote diagnostics via cloud

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| Phase 2 | REPLACE — implement custom UDS stack | Q4 2026 |
