# Trigger Decoder Module

## Purpose

Decode crankshaft and camshaft position from trigger wheel patterns to determine engine position, RPM, and phase (compression vs. exhaust stroke).

## Responsibilities

- Interpret signals from variable reluctance (VR) and Hall effect sensors
- Support 40+ trigger wheel patterns (60-2, 36-1, 4-1, etc.)
- Calculate instantaneous and average RPM
- Detect sync state (crank sync, cam phase, full sync)
- Handle trigger errors and noise filtering
- Provide angular position for fuel and ignition scheduling
- Support trigger emulation for testing

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Crank sensor signal | VR/Hall input | Digital edge (rising/falling) |
| Cam sensor signal | VR/Hall input | Digital edge (optional) |
| Trigger pattern config | Configuration | Enum (pattern selection) |
| Missing tooth count | Configuration | Integer |
| Rotation direction | Configuration | Enum (CW/CCW) |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Engine RPM | RPM Calculator, all modules | float |
| Crankshaft position | Scheduler, fuel, ignition | float (°CA) |
| Engine phase | Fuel/ignition scheduling | enum |
| Sync status | Diagnostics, logging | enum |
| Trigger event count | Diagnostics | uint32 |
| Trigger error count | Diagnostics | uint32 |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| Hardware timer capture | ChibiOS GPT/ICU | Hardware |
| GPIO interrupts | ChibiOS PAL | Hardware |
| RPM calculator | `controllers/engine_cycle/rpm_calculator.cpp` | Internal |

## Source Files

| File | Purpose |
|------|---------|
| `controllers/trigger/trigger_central.cpp` | Central trigger processing and dispatch |
| `controllers/trigger/trigger_central.h` | Central trigger header |
| `controllers/trigger/trigger_decoder.cpp` | Pattern-specific decoding logic |
| `controllers/trigger/trigger_decoder.h` | Decoder interface |
| `controllers/trigger/trigger_emulator_algo.cpp` | Test signal generation |
| `controllers/trigger/trigger_emulator_algo.h` | Emulator header |
| `controllers/trigger/trigger_simulator.cpp` | Simulation mode |
| `controllers/trigger/trigger_simulator.h` | Simulator header |
| `controllers/trigger/instant_rpm_calculator.cpp` | Instantaneous RPM from trigger |
| `controllers/trigger/instant_rpm_calculator.h` | Instant RPM header |
| `controllers/trigger/decoders/` | Per-pattern decoder implementations |
| `controllers/engine_cycle/rpm_calculator.cpp` | RPM averaging and filtering |

## Supported Trigger Patterns (40+)

Examples: 60-2, 36-1, 36-2-2-2, 24-1, 12-1, 6-1, 4-1, Nissan patterns, Honda patterns, GM 7X/24X, Ford EDIS, Mitsubishi 4G63, Subaru, Toyota, etc. Full list in trigger decoder source.

## Build Dependencies

- ChibiOS ICU driver — input capture
- Hardware timer configuration — per-board in `config/boards/`

## Known Limitations

- Crank-only patterns lack cam phase detection (batch fire only)
- Some rare OEM patterns may not be supported
- High-RPM trigger noise requires filtering configuration

## Future Improvements

- [ ] Support for newer OEM patterns (BMW, VAG, etc.)
- [ ] Adaptive noise filtering
- [ ] Trigger error recovery strategies
- [ ] Hardware decoder offload (FTM/eTimer)

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| All | KEEP | Most stable, mature module |
| Phase 4+ | MODIFIABLE — add custom patterns | As needed |
