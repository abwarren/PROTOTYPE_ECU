# DFT_GUIDE.md — Design for Test

> **Date:** 2026-07-01
> **Reference:** IEEE 1149.1 (JTAG), IPC-TM-650

---

## 1. Test Strategy Overview

| Test Phase | Method | Coverage |
|-----------|--------|----------|
| Bare PCB | Flying probe (100% nets) | Opens, shorts, netlist |
| Assembled PCB | ICT (In-Circuit Test) via test points | Component presence, value, orientation |
| Functional | MCU self-test + external stimuli | All interfaces operational |
| Boundary Scan | JTAG (if implemented) | Interconnects between JTAG devices |
| Environmental | Thermal cycling, vibration, EMC | Reliability validation |

---

## 2. Test Point Requirements

| Rule | Value |
|------|-------|
| Test point pad size | 1.0 mm diameter minimum |
| Test point spacing | 2.54 mm (100 mil) minimum center-to-center |
| Location | All on bottom layer (L6) for single-sided flying probe access |
| Accessibility | No components within 3 mm of test point |
| Net coverage | Every net has at least one test point |

### Critical Test Points

| Net | Test Point Label | Notes |
|-----|-----------------|-------|
| VBAT | TP_VBAT | Input voltage verification |
| 5V0 | TP_5V0 | Buck output |
| 3V3 | TP_3V3 | LDO output |
| VREF | TP_VREF | Precision reference (must be 5.000V ± 0.05%) |
| V15 | TP_V15 | S32K344 core voltage |
| GND | TP_GND (×4) | Ground reference — 4 distributed test points |
| RESET | TP_RESET | Active low — should be high in operation |
| CAN0_H, CAN0_L | TP_CAN0H, TP_CAN0L | Differential voltage ~2V recessive |
| USB_DP, USB_DM | TP_USBD, TP_USBM | 3.3V when idle |
| nWATCHDOG | TP_nWD | Toggle at 50 Hz — verify with scope |

---

## 3. Functional Test Plan

### Power-On Test (Automated, < 2 seconds)

| Step | Test | Pass Criteria |
|------|------|---------------|
| 1 | Apply 12V, measure VBAT | 12V ± 5% at TP_VBAT |
| 2 | Measure 5V rail | 5.0V ± 5% at TP_5V0 |
| 3 | Measure 3.3V rail | 3.3V ± 2% at TP_3V3 |
| 4 | Measure VREF | 5.000V ± 0.1% at TP_VREF |
| 5 | Measure V15 | 1.50V ± 5% at TP_V15 |
| 6 | Verify RESET high | 3.3V at TP_RESET |
| 7 | Verify watchdog toggling | 50 Hz square wave at TP_nWD |
| 8 | Measure total current | < 500 mA at 12V (idle, no outputs) |

### Communication Test

| Step | Test | Pass Criteria |
|------|------|---------------|
| 9 | CAN0 loopback (external jumper CAN0→CAN1) | Send on CAN0, receive on CAN1 |
| 10 | CAN0 termination resistance | 60Ω between CANH-CANL (power off) |
| 11 | USB enumeration | Device appears as CDC ACM on host PC |
| 12 | USB loopback | Echo test — host sends, ECU responds |

### Input Test

| Step | Test | Pass Criteria |
|------|------|---------------|
| 13 | Apply 0-5V sweep to ADC0 (TPS1) | ADC reads linear 0–4095 |
| 14 | Apply 0-5V to ADC2 (CLT) | ADC reads expected voltage |
| 15 | Short WBO2 heater to GND | Current sense reads expected load |

### Output Test

| Step | Test | Pass Criteria |
|------|------|---------------|
| 16 | Pulse injector 1 (50% duty) | Scope confirms 12V PWM at connector |
| 17 | Pulse ignition 1 (10% duty) | Scope confirms gate drive pulse |
| 18 | Toggle relay 1 (fuel pump) | Multimeter confirms continuity |

### Safety Test

| Step | Test | Pass Criteria |
|------|------|---------------|
| 19 | Disable watchdog (hold nWD high) | RESET asserted within 200 ms. All outputs off. |
| 20 | Drop input to 5V | Brown-out triggers. MCU enters safe state. |
| 21 | Short output to GND (injector 1) | Driver reports fault via SPI. Output disabled. |

---

## 4. Boundary Scan (Future)

S32K344 supports JTAG (IEEE 1149.1). Boundary scan can verify:

- MCU-to-CAN transceiver connections (TXD, RXD, STB)
- MCU-to-TLE8888 SPI connections
- MCU-to-external-memory SPI connections
- Open/short on all MCU I/O pins

**For V1:** Boundary scan not implemented in firmware. Hardware supports it (JTAG pins accessible on debug header).

**For production:** Boundary scan test vectors reduce ICT fixture cost (fewer physical probes needed).

---

## 5. Test Fixture Requirements

### Prototype (Manual)

- Bench power supply (12V, 5A)
- Oscilloscope (2-ch, 100 MHz)
- Multimeter
- USB-C cable to host PC
- CAN bus terminator (120Ω)
- Breakout box for 42-pin connector

### Production (Automated)

- Pogo-pin test fixture (bed-of-nails) on bottom side
- NI DAQ or similar for analog stimulus/measurement
- CAN bus interface (PCAN-USB or similar)
- Automated test script (Python + pytest)

---

## 6. DFT Coverage Estimate

| Test Type | Nets Covered | % of Total |
|-----------|-------------|------------|
| Flying probe (bare PCB) | All | 100% |
| ICT (assembled) | Power rails + 20 critical nets | ~40% |
| Functional | All interfaces | ~80% |
| Boundary scan | MCU I/O only | ~50% |

*ICT limited by test point placement. Only nets with dedicated test pads can be probed.*
