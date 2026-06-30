# Sensors Module

## Purpose

Read, process, and calibrate all analog and digital sensor inputs. Convert raw ADC values, frequency signals, and digital inputs into calibrated engineering units for engine control.

## Responsibilities

- Sample analog inputs (MAP, TPS, CLT, IAT, battery, etc.) via ADC
- Process temperature sensors using thermistor curves (NTC)
- Read frequency-based sensors (flex fuel, VR RPM, wheel speed)
- Apply sensor redundancy and plausibility checks
- Sensor failure detection and fallback values
- Coordinate sensor initialization order
- Auto-generated sensor configurations

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| ADC values | MCU ADC peripheral | uint16 (0-4095) |
| Digital inputs | GPIO pins | bool |
| Frequency inputs | ICU timer capture | Hz |
| Thermistor curves | Configuration | Lookup table |
| Sensor calibration | Configuration | float (offset, scale) |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| MAP (kPa) | Fuel, ignition, logging | float |
| TPS (%) | Fuel, ignition, ETC, logging | float |
| CLT (°C) | Fuel enrichment, fan, logging | float |
| IAT (°C) | Fuel correction, logging | float |
| Battery voltage (V) | Dwell, pump, logging | float |
| Oil pressure (kPa) | Diagnostics, logging | float |
| Fuel pressure (kPa) | Fuel control, logging | float |
| Flex fuel ethanol % | Fuel trim, logging | float |

## Dependencies

| Dependency | Module | Type |
|------------|--------|------|
| ADC driver | ChibiOS ADC HAL | Hardware |
| Timer/ICU driver | ChibiOS ICU | Hardware |
| GPIO driver | ChibiOS PAL | Hardware |

## Source Files

| File | Purpose |
|------|---------|
| `controllers/sensors/allsensors.cpp` | Sensor initialization and dispatch (25 lines) |
| `controllers/sensors/allsensors.h` | Sensor interface header |
| `controllers/sensors/thermistors.cpp` | NTC thermistor curve processing (63 lines) |
| `controllers/sensors/thermistors.h` | Thermistor header |
| `controllers/sensors/tps.cpp` | Throttle position sensor (87 lines) |
| `controllers/sensors/tps.h` | TPS header |
| `controllers/sensors/flex_sensor.cpp` | Flex fuel ethanol content sensor |
| `controllers/sensors/flex_sensor.h` | Flex sensor header |
| `controllers/sensors/frequency_sensor.cpp` | Frequency/duty cycle input processing |
| `controllers/sensors/frequency_sensor.h` | Frequency sensor header |
| `controllers/sensors/redundant_sensor.cpp` | Dual sensor averaging/selection |
| `controllers/sensors/redundant_sensor.h` | Redundant sensor header |
| `controllers/sensors/sensor_checker.cpp` | Sensor health monitoring |
| `controllers/sensors/sensor_checker.h` | Sensor checker header |
| `controllers/sensors/auto_generated_sensor.cpp` | Auto-generated sensor configuration |
| `controllers/sensors/redundant_ford_tps.cpp` | Ford-specific dual TPS |
| `controllers/sensors/hella_oil_level.cpp` | Hella oil level sensor |
| `controllers/sensors/vr_pwm.cpp` | VR sensor PWM conditioning |
| `controllers/sensors/impl/software_knock.cpp` | Software knock sensor processing |
| `controllers/sensors/converters/` | Sensor-specific converters |
| `controllers/sensors/core/` | Core sensor processing |

## Known Limitations

- Sensor sampling rate limited by ADC scheduler (not hardware-timed)
- No support for automotive SENT protocol (smart sensors)
- No support for PSI5 protocol (satellite sensors)

## Future Improvements

- [ ] SENT protocol decoder for smart sensors
- [ ] PSI5 satellite sensor interface
- [ ] Hardware-timed ADC sampling for consistent measurement
- [ ] Sensor fusion (Kalman filter for redundant sensors)

## Replacement Strategy

| Phase | Action | Target |
|-------|--------|--------|
| Phase 1-2 | MODIFIABLE — add custom sensors as needed | Ongoing |
| Phase 4 | Add SENT, PSI5 support | When required |
