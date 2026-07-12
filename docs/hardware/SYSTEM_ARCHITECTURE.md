# SYSTEM_ARCHITECTURE.md — ECU Hardware System Design

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **MCU:** NXP S32K344
> **PCB:** 6-layer, High-Tg FR4

---

## 1. System Block Diagram

```
                          Vehicle Battery (6-36V)
                                  │
                    ┌─────────────┴─────────────┐
                    │     POWER MANAGEMENT       │
                    │  Reverse Polarity • TVS     │
                    │  Buck (12V→5V) • LDO (5V→3.3V) │
                    │  VREF (5.0V precision)     │
                    │  Watchdog • Reset           │
                    └─────────────┬─────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
    ┌──────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐
    │  MCU CORE    │       │  COMMS       │       │  SENSORS     │
    │              │       │              │       │              │
    │ S32K344      │       │ CAN FD ×4    │       │ TPS ×2       │
    │ 160 MHz      │       │ USB-C FS     │       │ MAP          │
    │ Lockstep CM7 │       │ Ethernet PHY │       │ CLT / IAT    │
    │ 2MB Flash    │       │ (future)     │       │ WBO2 ×2      │
    │ 512KB SRAM   │       │              │       │ Knock ×2     │
    │ HSM EVITA    │       │              │       │ Fuel Press   │
    └──────┬───────┘       └──────┬───────┘       │ Oil Press    │
           │                      │               └──────┬───────┘
           │                      │                      │
    ┌──────▼──────────────────────▼──────────────────────▼───────┐
    │                       OUTPUT DRIVERS                       │
    │                                                           │
    │  Injector ×8 (Peak & Hold)    Ignition ×8 (IGBT)          │
    │  ETC H-Bridge ×2              Boost Solenoid ×1           │
    │  Tach Output ×1               Relay ×4 (Low-Side)         │
    └───────────────────────────┬───────────────────────────────┘
                                │
                        ┌───────▼───────┐
                        │  CONNECTORS   │
                        │               │
                        │ 42-pin Main   │
                        │ 4-pin CAN ×2  │
                        │ USB-C ×1      │
                        │ 10-pin Debug  │
                        └───────────────┘
```

---

## 2. Hierarchical Sheet Structure (KiCad)

```
Prototype_ECU.kicad_sch
├── 00_Cover_Sheet
│   ├── Revision history
│   ├── Block diagram
│   └── Design notes
│
├── 01_Power
│   ├── Reverse polarity protection
│   ├── TVS + load dump
│   ├── Buck converter (12V → 5V)
│   ├── LDO (5V → 3.3V)
│   ├── VREF (5.0V precision)
│   ├── Power sequencing
│   └── Reset generation
│
├── 02_MCU
│   ├── S32K344 core
│   ├── Clock (40 MHz + 32.768 kHz)
│   ├── Reset circuit
│   ├── Boot configuration
│   ├── Decoupling (per datasheet)
│   └── Debug header (10-pin SWD)
│
├── 03_Communications
│   ├── CAN0 (Primary vehicle bus)
│   ├── CAN1 (Secondary vehicle bus)
│   ├── CAN2 (Diagnostic port)
│   ├── CAN3 (Spare — unpopulated)
│   ├── USB-C (Device mode)
│   └── Ethernet PHY (future — unpopulated)
│
├── 04_Inputs
│   ├── Analog inputs (TPS, MAP, CLT, IAT, pressure)
│   ├── WBO2 interface (CJ125 ×2)
│   ├── Knock input (TLE2072 or similar)
│   ├── Digital inputs (frequency, switch)
│   └── Battery voltage monitor
│
├── 05_Outputs
│   ├── Injector drivers (TLE8888 ×2)
│   ├── Ignition drivers (IGBT gate drive)
│   ├── ETC H-bridge (DRV8873 ×2)
│   ├── Boost solenoid (low-side PWM)
│   ├── Relay drivers (low-side)
│   └── Tach output (high-side)
│
├── 06_Protection
│   ├── Watchdog (TPS3850)
│   ├── Safe state FET (cuts output 12V)
│   ├── ESD protection
│   └── Fuse + overcurrent
│
├── 07_Memory
│   ├── External Flash (optional — S32K344 has 2MB)
│   ├── FRAM (optional — Fujitsu MB85RS)
│   └── EEPROM (optional — via S32K344 data flash)
│
├── 08_Connectors
│   ├── 42-pin main harness (Deutsch DTM)
│   ├── CAN connectors (Deutsch DTM 4-pin)
│   ├── USB-C
│   └── Debug header
│
└── 09_Power_Distribution
    ├── Power tree diagram (text)
    ├── Decoupling map
    └── Test point locations
```

---

## 3. Signal Summary

| Category | Count | Interface |
|----------|-------|-----------|
| Analog inputs | 12 | ADC (12-bit SAR) |
| Digital inputs | 4 | GPIO with configurable pull |
| Frequency inputs | 2 | eMIOS input capture |
| Injector outputs | 8 | Peak & hold (TLE8888) |
| Ignition outputs | 8 | IGBT gate drive |
| ETC H-bridge | 2 | DRV8873 PWM |
| Boost solenoid | 1 | Low-side PWM |
| Relay outputs | 4 | Low-side switch |
| Tach output | 1 | High-side driver |
| CAN FD | 4 | TJA1043 transceiver |
| USB | 1 | USB 2.0 FS device |
| Ethernet | 1 | RMII to PHY (future) |
| Status LEDs | 3 | GPIO (power, CAN, fault) |

**Total MCU I/O used:** ~80 of 176 pins (45%)

---

## 4. PCB Stack-Up

| Layer | Material | Copper | Purpose |
|-------|----------|--------|---------|
| 1 (Top) | Signal + Components | 1 oz | Critical signals, components, connectors |
| 2 | Ground Plane | 0.5 oz | Solid ground — uninterrupted under all signal traces |
| Prepreg | FR4 2116 | — | — |
| 3 | Signal (inner) | 0.5 oz | Low-speed signals, I2C, SPI |
| Core | FR4 High-Tg | — | — |
| 4 | Power Plane | 0.5 oz | Split: 5V, 3.3V regions |
| Prepreg | FR4 2116 | — | — |
| 5 | Signal (inner) | 0.5 oz | Remaining signals |
| 6 (Bottom) | Signal + Components | 1 oz | Low-priority components, test points |

- **Total thickness:** 1.6 mm
- **Material:** High-Tg FR4 (Tg > 170°C) — required for lead-free reflow and under-hood temps
- **Controlled impedance:** USB 90Ω differential, CAN 120Ω differential

---

## 5. Critical Design Rules

| Rule | Value | Reason |
|------|-------|--------|
| Minimum trace width | 0.15 mm (6 mil) | Standard for 1 oz copper |
| Minimum spacing | 0.15 mm | IPC-2221 for 12V |
| Via diameter | 0.45 mm drill / 0.8 mm pad | Standard PTH |
| Via-to-via spacing | 0.5 mm | Fabrication minimum |
| Trace-to-board edge | 0.5 mm | Mechanical clearance |
| Annular ring | 0.15 mm | IPC Class 3 |
| Soldermask expansion | 0.1 mm | Standard |
| Paste mask reduction | 0% | 1:1 for hand-assembly-friendly pads |

---

## 6. Design Review Status

| Review | Status | Date |
|--------|--------|------|
| Schematic Review | ⬚ Pending | — |
| Power Review | ✅ Draft complete | 2026-07-01 |
| Safety Review | ⬚ Pending | — |
| EMC Review | ✅ Guided | 2026-07-01 |
| Manufacturing Review | ⬚ Pending | — |
| DFM Review | ✅ Guided | 2026-07-01 |
| DFT Review | ✅ Guided | 2026-07-01 |
| Thermal Review | ⚠️ Buck marginal at 85°C | 2026-07-01 |
