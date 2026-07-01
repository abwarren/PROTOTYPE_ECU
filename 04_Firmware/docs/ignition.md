# Ignition Module

## Purpose

Controls spark timing, dwell duration, and ignition firing sequence. Optimizes combustion timing for power, efficiency, and emissions across all operating conditions.

## Responsibilities

- Calculate spark advance angle based on engine load and RPM
- Schedule ignition events relative to crankshaft position
- Control dwell time (coil charge time)
- Support multiple ignition types (distributor, COP, wasted spark)
- Individual cylinder timing trim
- Closed-loop knock detection and retard
- Dwell voltage compensation

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Engine RPM | RPM Calculator | float |
| Manifold Absolute Pressure (MAP) | MAP Sensor | float (kPa) |
| Throttle Position (TPS) | TPS Sensor | float (%) |
| Knock Level | Knock sensor processing | float |
| Ignition Timing Table | Configuration | 3D table (RPM × Load) |
| Dwell Time Table | Configuration | 3D table (voltage × RPM) |
| Cylinder Trim Table | Configuration | 1D array (per cylinder) |
| Battery Voltage | ADC | float (V) |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Ignition firing commands | IGBT/smart coil drivers | Timing signal |
| Dwell control signal | Coil charge control | Pulse width |
| Knock retard amount | Diagnostic logging | float (°) |
| Ignition status | CAN bus broadcast | enum/bitfield |
| Spark angle | Diagnostic display | float (°BTDC) |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| Scheduler | `controllers/system/timer/scheduler.h` | Internal |
| Trigger decoder | `controllers/trigger/` | Internal |
| Knock control | `controllers/engine_cycle/knock_controller.cpp` | Internal |
| Configuration | `controllers/algo/` | Internal |
| RPM calculator | `controllers/engine_cycle/rpm_calculator.cpp` | Internal |

## Source Files

| File | Purpose |
|------|---------|
| `controllers/engine_cycle/spark_logic.cpp` | Main spark scheduling logic |
| `controllers/engine_cycle/spark_logic.h` | Spark schedule header |
| `controllers/mfi_ignition_logic.cpp` | Multi-fire ignition logic |
| `controllers/mfi_ignition_logic.h` | MFI ignition header |
| `controllers/ignition_executor.cpp` | Ignition execution driver |
| `controllers/ignition_executor.h` | Ignition executor header |
| `controllers/ignition_on_time.cpp` | Dwell/duration calculation |
| `controllers/ignition_on_time.h` | Ignition timing header |
| `controllers/simple_ignition_logic.cpp` | Basic ignition (distributor) |
| `controllers/simple_ignition_logic.h` | Simple ignition header |

## Build Dependencies

- `controllers/algo/` — timing calculations, knock processing
- ChibiOS — PWM/timer hardware for coil drivers
- Trigger decoder — crankshaft position for angular scheduling

## Known Limitations

- rusEFI ignition algorithm is GPL-3.0 licensed
- Knock detection is basic bandpass filtering — no cylinder-specific knock windowing
- No ion-sense knock detection (requires special spark plugs)
- Dwell control is table-based, not adaptive

## Future Improvements

- [ ] Per-cylinder knock windowing and retard
- [ ] Adaptive dwell control (real-time coil monitoring)
- [ ] Ion-sense ignition feedback
- [ ] Multi-spark strategies for cold start and idle
- [ ] Model-based knock prediction (MBT estimator)

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| Phase 1-2 | Keep upstream ignition logic | No changes |
| Phase 3 | MODIFIABLE — add custom knock processing | Q3 2027 |
| Phase 5 | REPLACE — proprietary ignition algorithm | 2028 |
