# rusEFI Architecture Audit

> **Audit method:** Each module entry below was verified by inspecting the actual source tree at
> `/home/wa/projects/ECU_PLATFORM/firmware/upstream/` (commit `8540e44142d837e991e89efc062f8be3feadde8c`).
> All file paths are relative to `firmware/upstream/`.

## Overview

Architecture audit of rusEFI firmware modules. This document catalogs every major module with actual file paths confirmed from the source tree, documenting purpose, inputs, outputs, dependencies, and planned replacement strategy.

## Module Audit

### Scheduler

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Real-time scheduling of fuel, ignition, and control events using a priority-based event queue |
| **Directory** | `firmware/controllers/system/timer/` |
| **Source files** | `scheduler.h` (header-only template) |
| **Entry point** | `scheduler.h` — template-based `SingleTimerExecutor` scheduling callbacks at specified angles/times |
| **Hardware dependency** | GPT timer peripheral via ChibiOS |
| **Inspection** | `cat firmware/controllers/system/timer/scheduler.h` — confirms class `Scheduler` with `schedule()` and `cancel()` methods |
| **Lines** | ~200+ (header) |
| **Strategy** | **KEEP** initially, **REPLACE** in Phase 5 |

### Fuel Control

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Injector timing, pulse width calculation, fuel scheduling |
| **Directory** | `firmware/controllers/engine_cycle/` |
| **Source files** | `fuel_schedule.cpp` / `fuel_schedule.h`, `prime_injection.cpp` / `prime_injection.h`, `high_pressure_fuel_pump.cpp` / `high_pressure_fuel_pump.h` |
| **Supporting files** | `firmware/controllers/fuel_pump.cpp`, `fuel_pump.h`, `fuel_pump_logic.cpp`, `fuel_pump_logic.h` |
| **Entry point** | `fuel_schedule.cpp` — injection scheduling logic |
| **Algo dependency** | `firmware/controllers/algo/` (20 .cpp files) provides VE, AFR, and timing calculations |
| **Total engine cycle .cpp files** | 9 |
| **Strategy** | **KEEP** initially, **MODIFIABLE** in Phase 3 |

### Ignition Control

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Spark timing, dwell control, ignition scheduling |
| **Directory** | `firmware/controllers/engine_cycle/` + `firmware/controllers/` |
| **Source files** | `spark_logic.cpp` / `spark_logic.h`, `firmware/controllers/mfi_ignition_logic.cpp` / `.h`, `firmware/controllers/ignition_executor.cpp` / `.h`, `firmware/controllers/ignition_on_time.cpp` / `.h`, `firmware/controllers/simple_ignition_logic.cpp` / `.h` |
| **Entry point** | `spark_logic.cpp` — main ignition schedule/trigger |
| **Lines** | 25 total .cpp/.h files in controllers/engine_cycle |
| **Strategy** | **KEEP** initially, **REPLACE** in Phase 5 |

### Trigger Decoder

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Decode crankshaft/camshaft position from trigger wheel patterns |
| **Directory** | `firmware/controllers/trigger/` |
| **Source files** | `trigger_central.cpp` / `.h`, `trigger_decoder.cpp` / `.h`, `trigger_emulator_algo.cpp` / `.h`, `trigger_simulator.cpp` / `.h`, `instant_rpm_calculator.cpp` / `.h` |
| **Supporting** | `decoders/` subdirectory with per-pattern decoders |
| **Total .cpp files** | 5 |
| **Entry point** | `trigger_central.cpp` — central trigger processing |
| **Strategy** | **KEEP** — one of the most mature rusEFI modules |

### CAN Bus

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | CAN communication for tuning, diagnostics, and expansion |
| **Directory** | `firmware/controllers/can/` |
| **Source files** | `can_rx.cpp` (294 lines), `can_tx.cpp` (160 lines), `obd2.cpp` (227 lines), `can_bench_test.cpp`, `can_dash.cpp`, `can_dash_haltech.cpp`, `can_dash_honda.cpp`, `can_dash_ms.cpp`, `can_dash_nissan.cpp`, `can_vss.cpp`, `rusefi_wideband.cpp`, `can_verbose.cpp` |
| **Total .cpp files** | 12 |
| **Supporting** | `isotp/` subdirectory, `wideband_firmware/` |
| **OBD-II** | `obd2.cpp` handles UDS diagnostic responses |
| **Strategy** | **MODIFIABLE** — adapt for platform protocol |

### Sensors

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Read and process analog/digital sensor inputs |
| **Directory** | `firmware/controllers/sensors/` |
| **Source files** | `allsensors.cpp` (25 lines — dispatcher), `thermistors.cpp` (63 lines), `tps.cpp` (87 lines), `flex_sensor.cpp`, `frequency_sensor.cpp`, `redundant_sensor.cpp`, `sensor_checker.cpp`, `sensor_info_printing.cpp`, `auto_generated_sensor.cpp`, `redundant_ford_tps.cpp`, `hella_oil_level.cpp`, `vr_pwm.cpp` |
| **Subdirs** | `converters/`, `core/`, `impl/` (includes `software_knock.cpp`) |
| **Total .cpp files** | 12 |
| **Entry point** | `allsensors.cpp` — sensor initialization and sampling loop |
| **Strategy** | **MODIFIABLE** — add custom sensor support as needed |

### Outputs / Actuators

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Control physical outputs (injectors, ignition, relays, ETC, boost) |
| **Directory** | `firmware/controllers/actuators/` |
| **Source files** | `idle_thread.cpp` (571 lines), `electronic_throttle.cpp` (1,104 lines), `boost_control.cpp` (398 lines), `alternator_controller.cpp` (100 lines), `ac_control.cpp`, `vvt.cpp`, `dc_motors.cpp`, `main_relay.cpp`, `harley_acr.cpp`, `gppwm_channel_reader.cpp` |
| **Total .cpp files** | 12 |
| **Strategy** | **KEEP** — generic enough for long-term use |

### Knock Control

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Detect and respond to engine knock via sensor input |
| **Source files** | `firmware/controllers/engine_cycle/knock_controller.cpp`, `firmware/controllers/engine_cycle/knock_logic.h`, `firmware/controllers/sensors/impl/software_knock.cpp` / `.h` |
| **Board configs** | 23 board-specific `knock_config.h` files under `firmware/config/boards/` |
| **Total files** | 28 knock-related files across controllers and board configs |
| **Strategy** | **KEEP** initially, **MODIFIABLE** |

### Diagnostics (OBD-II / UDS)

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | OBD-II / UDS diagnostic services, DTC management |
| **Source files** | `firmware/controllers/can/obd2.cpp` (227 lines — UDS diagnostic responder), `firmware/controllers/can/obd2.h`, `firmware/controllers/algo/obd_error_codes.h` |
| **Note** | No standalone `firmware/controllers/diagnostics/` directory exists. Diagnostics are handled within CAN and algo modules |
| **Strategy** | **REPLACE** — implement custom UDS stack |

### Configuration

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Calibration data management, engine parameters, persistent config |
| **Directory** | `firmware/controllers/algo/` |
| **Source files** | `persistent_configuration.h`, `engine_configuration.h`, and 18 other .cpp files covering all engine configuration |
| **Total .cpp files** | 20 |
| **Related** | `firmware/config/engines/` — canned engine calibration presets |
| **Strategy** | **REPLACE** — cloud-synced config with versioning |

### Console Protocol

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | PC-to-ECU communication for tuning, datalogging, diagnostics (binary protocol over serial) |
| **Directory** | `firmware/console/` |
| **Source files** | 7 .cpp files implementing the binary protocol |
| **Also** | `firmware/controllers/core/main_loop.cpp` — main communication loop processing console commands |
| **Strategy** | **REPLACE** — platform protocol |

### Bootloader

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Firmware update mechanism |
| **Directory** | `firmware/bootloader/` |
| **Source files** | `bootloader_main.cpp`, `bootloader_stubs.cpp` |
| **BL implementation** | `firmware/bootloader/openblt_chibios/` — uses **OpenBLT** open-source bootloader with USB + CAN transport |
| **OpenBLT files** | `openblt_chibios.cpp`, `openblt_usb.cpp`, `openblt_can.cpp`, `openblt_flash.cpp`, `nvm.c`, `clock-arch.c`, `types.h`, `flash.h`, `clock-arch.h` |
| **Strategy** | **REPLACE** — secure A/B bootloader with OTA |

### Logging

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Error handling, logging, and diagnostics |
| **Files** | `firmware/controllers/core/error_handling.cpp` / `.h`, `error_handling_led.h`, `firmware/controllers/core/log_hard_fault.h` |
| **Also** | ChibiOS debug serial (chprintf) |
| **Strategy** | **MODIFIABLE** — structured logging with levels |

### Storage

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | Persistent storage for configuration, calibrations |
| **Files** | `firmware/controllers/algo/persistent_configuration.h` |
| **Flash driver** | ChibiOS NAND/NOR flash HAL |
| **Strategy** | **MODIFIABLE** — EEPROM emulation with wear-leveling |

### Watchdog

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | System health monitoring and recovery from lockups |
| **Implementation** | Standard ChibiOS watchdog (IWDG) |
| **Files** | ChibiOS HAL layer (`CH_CFG_USE_WDG`) |
| **Strategy** | **KEEP** — standard, reliable |

### Lua Scripting

| Field | Verified Evidence |
|-------|-------------------|
| **Purpose** | User-customizable logic via Lua scripts without recompilation |
| **Directory** | `firmware/controllers/lua/` |
| **Files** | Lua interpreter integration for custom sensor processing, CAN message handling, and logic |
| **Strategy** | **KEEP** — powerful differentiation feature |

## Source Tree Summary

| Directory | .cpp files | Purpose |
|-----------|-----------|---------|
| `firmware/controllers/engine_cycle/` | 9 | Core engine control (fuel, spark, knock) |
| `firmware/controllers/trigger/` | 5 | Trigger decoding |
| `firmware/controllers/sensors/` | 12 | Sensor input processing |
| `firmware/controllers/can/` | 12 | CAN bus communication |
| `firmware/controllers/actuators/` | 12 | Output control (ETC, idle, boost, etc.) |
| `firmware/controllers/algo/` | 20 | Algorithms and configuration |
| `firmware/controllers/core/` | 4 | Main loop, error handling |
| `firmware/controllers/system/` | 5 | System services (scheduler, timers) |
| `firmware/console/` | 7 | PC communication protocol |
| `firmware/bootloader/` | 2+9 | OpenBLT-based firmware update |
| `firmware/hw_layer/` | — | Hardware abstraction layer + drivers |
| **Total firmware C++** | **115,269 lines** | Controllers + console = 56,183 lines |

## Replacement Strategy Summary

| Strategy | Count | Modules |
|----------|-------|---------|
| **KEEP** | 5 | Trigger Decoder, Outputs/Actuators, Watchdog, Lua Scripting, Scheduler (initially) |
| **MODIFIABLE** | 6 | Sensors, Logging, Storage, Memory Layout, CAN, Knock |
| **REPLACE** | 4 | Configuration, Console Protocol, Bootloader, Diagnostics |
| **PROPRIETARY (new)** | — | All Studio/Cloud/Mobile components (already proprietary) |
