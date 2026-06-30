# Fuel Module

## Purpose

Controls fuel injection timing, pulse width calculation, and fuel delivery scheduling. Determines the optimal air-fuel ratio for engine operation under all conditions.

## Responsibilities

- Calculate injector pulse width based on engine load and RPM
- Schedule injection events relative to crankshaft position
- Support multiple injection strategies (sequential, batch, simultaneous)
- Handle transient enrichment (acceleration, warm-up, after-start)
- Closed-loop lambda target tracking via wideband O2 feedback
- Prime injection during engine start
- High-pressure fuel pump control (GDI engines)

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Engine RPM | RPM Calculator | float |
| Manifold Absolute Pressure (MAP) | MAP Sensor | float (kPa) |
| Throttle Position (TPS) | TPS Sensor | float (%) |
| Coolant Temperature (CLT) | Thermistor input | float (°C) |
| Intake Air Temperature (IAT) | Thermistor input | float (°C) |
| Air-Fuel Ratio (AFR) | Wideband O2 sensor | float (lambda) |
| VE Table | Configuration | 3D table (RPM × Load) |
| AFR Target Table | Configuration | 3D table (RPM × Load) |
| Injector Flow Rate | Configuration | float (cc/min) |
| Fuel pressure | Configuration/sensor | float (kPa) |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Injector pulse commands | Injector driver hardware | PWM/timing |
| Fuel trim values | Diagnostic logging | float (%) |
| Fuel status | CAN bus broadcast | enum |
| Injection timing angle | Engine scheduler | float (°BTDC) |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| Scheduler | `controllers/system/timer/scheduler.h` | Internal |
| Sensor processing | `controllers/sensors/` | Internal |
| Trigger decoder | `controllers/trigger/` | Internal |
| Configuration | `controllers/algo/` | Internal |
| RPM calculator | `controllers/engine_cycle/rpm_calculator.cpp` | Internal |

## Source Files

| File | Purpose |
|------|---------|
| `controllers/engine_cycle/fuel_schedule.cpp` | Main injection scheduling logic |
| `controllers/engine_cycle/fuel_schedule.h` | Fuel schedule header and types |
| `controllers/engine_cycle/prime_injection.cpp` | Prime injection during cranking |
| `controllers/engine_cycle/prime_injection.h` | Prime injection header |
| `controllers/engine_cycle/high_pressure_fuel_pump.cpp` | GDI high-pressure pump control |
| `controllers/engine_cycle/high_pressure_fuel_pump.h` | HPFP header |
| `controllers/fuel_pump.cpp` | Fuel pump relay control |
| `controllers/fuel_pump.h` | Fuel pump header |
| `controllers/fuel_pump_logic.cpp` | Fuel pump scheduling logic |
| `controllers/fuel_pump_logic.h` | Fuel pump logic header |

## Build Dependencies

- `controllers/algo/` — VE calculations, AFR targets, interpolation
- ChibiOS — PWM/timer hardware for injector control
- Configuration system — table storage and calibration access

## Known Limitations

- rusEFI fuel algorithm is GPL-3.0 licensed — cannot be used in proprietary firmware without full rewrite
- No direct cylinder-independent fueling (uses trim table instead of per-cylinder)
- High-pressure pump control limited to basic GDI support
- No ethanol content-based fueling (requires flex sensor integration)

## Future Improvements

- [ ] Per-cylinder fuel trim with individual cylinder lambda control
- [ ] Model-based fuel control (Smith predictor, observer)
- [ ] Flex-fuel ethanol content adaptation
- [ ] Multi-point injection strategies for GDI + port injection
- [ ] Real-time fuel film compensation (wall-wetting model)

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| Phase 1-2 | Keep upstream fuel logic | No changes |
| Phase 3 | MODIFIABLE — add custom enrichment curves | Q2 2027 |
| Phase 5 | REPLACE — proprietary fuel algorithm | 2028 |
