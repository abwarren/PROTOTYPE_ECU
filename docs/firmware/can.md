# CAN Bus Module

## Purpose

Provide CAN bus communication for tuning, diagnostics, broadcast data, and expansion module integration.

## Responsibilities

- Transmit real-time engine data on CAN bus
- Receive and process tuning/configuration commands
- Handle UDS diagnostic requests (OBD-II compliance)
- Support multiple CAN dash protocols (MoTeC, Haltech, AIM, etc.)
- Manage CAN bus error handling and bus-off recovery
- Provide CAN bridge for tuning software

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| CAN frames | CAN transceiver (TJA1040/SN65HVD23x) | Frame stream |
| Engine data (RPM, AFR, temps, etc.) | All sensor/control modules | Various |
| Diagnostic requests | Tuning software or scan tool | UDS frames |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Broadcast frames | CAN bus | CAN 2.0 / CAN FD |
| Diagnostic responses | Tuning software | UDS frames |
| Dash protocol frames | Aftermarket dash displays | Manufacturer-specific |
| Wideband controller data | ECU | CAN frames |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| CAN peripheral driver | ChibiOS CAN HAL | Hardware |
| Sensor processing | `controllers/sensors/` | Internal |
| Configuration | `controllers/algo/` | Internal |

## Source Files

| File | Purpose |
|------|---------|
| `controllers/can/can_rx.cpp` | CAN receive processing (294 lines) |
| `controllers/can/can_rx.h` | CAN RX header |
| `controllers/can/can_tx.cpp` | CAN transmit scheduling (160 lines) |
| `controllers/can/can_tx.h` | CAN TX header |
| `controllers/can/obd2.cpp` | UDS/OBD-II diagnostic responder (227 lines) |
| `controllers/can/obd2.h` | OBD-II header |
| `controllers/can/can_bench_test.cpp` | CAN bus diagnostic testing |
| `controllers/can/can_dash.cpp` | Generic dash display broadcast |
| `controllers/can/can_dash_haltech.cpp` | Haltech dash protocol |
| `controllers/can/can_dash_honda.cpp` | Honda dash protocol |
| `controllers/can/can_dash_ms.cpp` | MegaSquirt dash protocol |
| `controllers/can/can_dash_nissan.cpp` | Nissan dash protocol |
| `controllers/can/can_vss.cpp` | Vehicle speed sensor via CAN |
| `controllers/can/can_verbose.cpp` | Verbose CAN logging |
| `controllers/can/rusefi_wideband.cpp` | rusEFI wideband controller |
| `controllers/can/isotp/` | ISO 15765-2 (ISO-TP) transport layer |

## Supported Dash Protocols

- MoTeC
- Haltech (including Haltech Gemini)
- AIM Motorsport
- Honda OEM
- Nissan OEM
- MegaSquirt/MS format
- VAG OEM
- BMW OEM

## Build Dependencies

- ChibiOS CAN HAL (CAN1, CAN2 peripherals)
- Board-specific transceiver configuration

## Known Limitations

- CAN FD support varies by board hardware
- Dash protocol implementations are reverse-engineered (no official specs)
- Bus load not monitored — may overload at high broadcast rates
- No CANopen or J1939 support

## Future Improvements

- [ ] Platform protocol (replace rusEFI-specific protocol)
- [ ] CAN FD native support across all boards
- [ ] Bus load monitoring and adaptive broadcast rate
- [ ] J1939 support for commercial vehicle applications
- [ ] SecOC (secure CAN communication)

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| Phase 1-2 | MODIFIABLE — adapt for platform protocol | Q1 2027 |
| Phase 3 | Add SecOC, CAN FD | Q3 2027 |
| Phase 4 | J1939 support | When needed |
