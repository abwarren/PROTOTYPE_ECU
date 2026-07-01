# MCU_SELECTION.md — NXP S32K3xx Device Selection & Justification

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Repository:** github.com/abwarren/PROTOTYPE_ECU
> **Branch:** feature/hardware-schematic-v1

---

## 1. Device Selected: NXP S32K344

### Why S32K344

| Factor | Rationale |
|--------|-----------|
| **Automotive qualification** | AEC-Q100 Grade 1 (-40°C to +125°C). Full ASIL-D capable. Required for production ECU. |
| **Lockstep Cortex-M7** | Dual-core lockstep at 160 MHz provides safety-critical compute with fault detection. Single-core mode available for non-safety tasks. |
| **Hardware Security Module (HSM)** | EVITA Full HSM. Enables secure boot, firmware signing, key storage. Required for ISO/SAE 21434 compliance. |
| **CAN FD × 4** | Four CAN FD controllers. 2 for vehicle bus (primary + redundant), 1 for diagnostic, 1 spare for expansion. |
| **Ethernet MAC** | 1× 10/100 Mbps. Future-proof for cloud telemetry, workshop diagnostics, zonal architecture. |
| **Peripheral count** | 12× ADC channels (12-bit SAR), eMIOS PWM for injector/ignition timing, eTPU for precision engine control. |
| **Memory** | 2 MB Flash, 512 KB SRAM. Sufficient for full engine management + Lua scripting + OTA A/B partition. |
| **Package** | 176-pin LQFP exposed pad. Hand-solderable for prototype, suitable for automated assembly. |
| **Ecosystem** | S32 Design Studio, Real-Time Drivers (RTD), AUTOSAR MCAL. NXP application notes for automotive ECU design. |

### Alternative S32K3 Devices Considered

| Device | Flash | SRAM | CAN FD | Ethernet | Why Not Selected |
|--------|-------|------|--------|----------|------------------|
| S32K342 | 1 MB | 256 KB | 3 | No | Insufficient Flash for OTA A/B + insufficient SRAM for Lua scripting |
| S32K358 | 4 MB | 768 KB | 6 | Yes (Gb) | Overkill for V1. 289-pin BGA — harder to prototype, more PCB layers. Candidate for V2/V3. |

---

## 2. Technical Specifications

### Core

| Parameter | Value |
|-----------|-------|
| Architecture | ARM Cortex-M7 (lockstep dual-core configurable) |
| Max Frequency | 160 MHz (lockstep) / 240 MHz (split) |
| FPU | Single + double precision |
| MPU | 16 regions |
| Safety | ASIL-D capable, ISO 26262 |

### Memory

| Type | Size | Notes |
|------|------|-------|
| Flash (P-Flash) | 2 MB | 192 KB for HSM code + 1.8 MB application |
| SRAM | 512 KB | ECC protected |
| Data Flash (EEPROM emulation) | 128 KB | Wear-leveled, 100k write cycles min |

### Peripherals

| Peripheral | Count | Application |
|-----------|-------|-------------|
| CAN FD | 4 | Vehicle bus, diagnostic, expansion, spare |
| Ethernet MAC | 1 (10/100) | Cloud telemetry, workshop diagnostics |
| LIN/UART | 6 | Sensor comms, debug console |
| SPI | 4 | External ADC, FRAM, display |
| I2C | 2 | EEPROM, temp sensors |
| ADC (12-bit SAR) | 64 external channels | 12 analog inputs used (expandable) |
| eMIOS (PWM/ICU) | 24 channels | Injector, ignition, ETC, boost control, tach |
| eTPU | 32 channels | Precision engine timing (trigger decode, injection angle) |
| SENT | 3 | Future sensor interface |

### Security

| Feature | Implementation |
|---------|---------------|
| HSM | EVITA Full (CSEc + SHE + key storage) |
| Secure Boot | HSM-verified ECDSA chain of trust |
| Debug Auth | Challenge-response, permanently lockable |
| Flash Protection | Per-sector read/write/execute protection |

### Package

| Parameter | Value |
|-----------|-------|
| Package | 176-pin LQFP (HLQFP176), exposed pad |
| Pitch | 0.5 mm |
| Body Size | 24 × 24 mm |
| Temp Range | -40°C to +125°C (AEC-Q100 Grade 1) |

---

## 3. Pin Allocation

### Power & Ground (28 pins)

| Rail | Pins | Purpose |
|------|------|---------|
| VDD_HV_A | VDD_HV_A (×2) | 3.3V–5V I/O supply |
| VDD_HV_B | VDD_HV_B (×2) | 3.3V–5V I/O supply |
| VDD_HV_CAN | VDD_HV_CAN | CAN transceiver supply |
| VDD_HV_FLA | VDD_HV_FLA | Flash supply |
| V15 | V15 (×4) | 1.5V core supply (internal regulator) |
| V25 | V25, V25_CAN | 2.5V CAN supply |
| VDD_LV | VDD_LV (×2) | 1.5V core monitoring |
| VSS | VSS (×14) | Ground — ALL must be connected to solid ground plane |

### Clock (3 pins)

| Pin | Function |
|-----|----------|
| EXTAL | 40 MHz crystal input |
| XTAL | 40 MHz crystal output |
| EXTAL32 | 32.768 kHz RTC crystal (optional) |

### Debug & Programming (5 pins)

| Pin | Function | Notes |
|-----|----------|-------|
| JTAG_TMS / SWDIO | SWD data | 10-pin Cortex debug header |
| JTAG_TCK / SWCLK | SWD clock | — |
| JTAG_TDO / SWO | Serial wire output | Trace (optional) |
| JTAG_TDI | JTAG data in | — |
| RESET_b | External reset | Active low, 10k pull-up to VDD_HV |

### CAN FD (8 pins)

| CAN | TX | RX | Termination |
|-----|-----|-----|-------------|
| CAN0 | PTB0 (CAN0_TX) | PTB1 (CAN0_RX) | Split termination + CM choke |
| CAN1 | PTC8 (CAN1_TX) | PTC9 (CAN1_RX) | Split termination + CM choke |
| CAN2 | PTE4 (CAN2_TX) | PTE5 (CAN2_RX) | Spare / diagnostic only header |
| CAN3 | PTF0 (CAN3_TX) | PTF1 (CAN3_RX) | Future expansion |

### USB (2 pins)

| Signal | Pin | Notes |
|--------|-----|-------|
| USB_DP | USB0_DP | USB 2.0 FS (12 Mbps), external PHY for HS |
| USB_DM | USB0_DM | — |

### Ethernet (MII/RMII — 9 pins)

| Signal | Pin |
|--------|-----|
| RMII_TXD0 | PTD10 |
| RMII_TXD1 | PTD11 |
| RMII_TXEN | PTD12 |
| RMII_RXD0 | PTD13 |
| RMII_RXD1 | PTD14 |
| RMII_CRS_DV | PTD15 |
| RMII_RXER | PTE0 |
| RMII_MDC | PTE1 |
| RMII_MDIO | PTE2 |

*Ethernet PHY: external (TI DP83848 or Microchip KSZ8081). MII/RMII interface from S32K344.*

### ADC Inputs (12 channels)

| Channel | Pin | Signal | Notes |
|---------|-----|--------|-------|
| ADC0 | PTA0 | TPS (Throttle Position) | 0–5V, 10k pull-down |
| ADC1 | PTA1 | MAP (Manifold Pressure) | 0–5V |
| ADC2 | PTA2 | CLT (Coolant Temp) | NTC thermistor, bias to VREF |
| ADC3 | PTA3 | IAT (Intake Air Temp) | NTC thermistor |
| ADC4 | PTA4 | WBO2 #1 (Lambda) | 0–5V, CJ125 interface |
| ADC5 | PTA5 | WBO2 #2 (Lambda) | 0–5V |
| ADC6 | PTA6 | TPS #2 (redundant) | Safety — dual sensor plausibility |
| ADC7 | PTA7 | Battery voltage | 1:10 divider from VBAT |
| ADC8 | PTB2 | Knock #1 | Bandpass filtered, biased to VREF/2 |
| ADC9 | PTB3 | Knock #2 | — |
| ADC10 | PTB4 | Fuel pressure | 0–5V |
| ADC11 | PTB5 | Oil pressure | 0–5V |

### eMIOS / eTPU Outputs

| Output | Pin | Signal | Driver Type |
|--------|-----|--------|-------------|
| eMIOS0 | PTC0 | Injector 1 | Peak & hold (TLE8888) |
| eMIOS1 | PTC1 | Injector 2 | Peak & hold |
| eMIOS2 | PTC2 | Injector 3 | Peak & hold |
| eMIOS3 | PTC3 | Injector 4 | Peak & hold |
| eMIOS4 | PTC4 | Injector 5 | Peak & hold |
| eMIOS5 | PTC5 | Injector 6 | Peak & hold |
| eMIOS6 | PTC6 | Injector 7 | Peak & hold |
| eMIOS7 | PTC7 | Injector 8 | Peak & hold |
| eMIOS8 | PTD0 | Ignition 1 | IGBT gate drive |
| eMIOS9 | PTD1 | Ignition 2 | IGBT gate drive |
| eMIOS10 | PTD2 | Ignition 3 | IGBT gate drive |
| eMIOS11 | PTD3 | Ignition 4 | IGBT gate drive |
| eMIOS12 | PTD4 | Ignition 5 | IGBT gate drive |
| eMIOS13 | PTD5 | Ignition 6 | IGBT gate drive |
| eMIOS14 | PTD6 | Ignition 7 | IGBT gate drive |
| eMIOS15 | PTD7 | Ignition 8 | IGBT gate drive |
| eMIOS16 | PTE6 | ETC H-bridge A | DRV8873 or similar |
| eMIOS17 | PTE7 | ETC H-bridge B | — |
| eMIOS18 | PTE8 | Boost solenoid | PWM low-side (TLE8110) |
| eMIOS19 | PTE9 | Tach output | High-side driver |
| eMIOS20 | PTE10 | Relay 1 (Fuel pump) | Low-side (TLE8110) |
| eMIOS21 | PTE11 | Relay 2 (Radiator fan) | Low-side |
| eMIOS22 | PTE12 | Relay 3 (A/C clutch) | Low-side |
| eMIOS23 | PTE13 | Relay 4 (Spare) | Low-side |

---

## 4. Clock Architecture

```
40 MHz Crystal (NX5032GA-40.000000MHZ)
    │
    ├──→ S32K344 EXTAL/XTAL
    │       │
    │       ├── PLL × 8 = 320 MHz (max) → SYSCLK = 160 MHz
    │       ├── PLL × 4 = 160 MHz → CAN FD clock
    │       └── ÷ 1600 = 100 kHz → LPO (low-power oscillator)
    │
    └──→ Ethernet PHY (RMII requires 50 MHz — from PHY crystal or MCU MII clock)
```

- **40 MHz fundamental:** chosen for exact CAN FD timing (CAN bit rate = 40 MHz ÷ N)
- **32.768 kHz RTC crystal:** optional for timekeeping, important for diagnostic log timestamps
- **Load capacitors:** 2× 18 pF on 40 MHz, 2× 12 pF on 32.768 kHz (verify with crystal datasheet)
- **External oscillator:** not required — S32K344 internal oscillator sufficient for startup

---

## 5. Reset & Boot Configuration

### Power-On Reset

```
VBAT (6-36V) → Buck → 3.3V → LDO → 1.5V (V15 rail from internal regulator)
                                        │
                                    POR (t < 2ms)
                                        │
                                    RESET_b released (external pull-up)
                                        │
                                    BootROM starts
                                        │
                                    Checks BOOT_CFG pins
                                        │
                                    Boots from P-Flash by default
```

### Boot Configuration

| Pin | Function | State | Mode |
|-----|----------|-------|------|
| BOOT_CFG0 | Boot source select | LOW (GND) | Boot from P-Flash |
| BOOT_CFG1 | Reserved | LOW (GND) | — |

*Default: boot from internal Flash. JTAG/SWD always available for recovery.*

### Reset Sources

| Source | Implementation |
|--------|---------------|
| External reset | 10k pull-up to VDD_HV, 100 nF to GND. Push-button on header for dev. |
| Watchdog reset | Internal SWT (Software Watchdog Timer). 100 ms timeout. |
| Brown-out reset | LVD (Low Voltage Detect) on VDD_HV. Triggers at 2.7V. |

---

## 6. Programming & Debug Interface

### 10-pin Cortex Debug Header (0.05" pitch)

| Pin | Signal | Notes |
|-----|--------|-------|
| 1 | VTref | 3.3V target reference |
| 2 | SWDIO | Data |
| 3 | GND | — |
| 4 | SWCLK | Clock |
| 5 | GND | — |
| 6 | SWO | Trace (optional) |
| 7 | NC | — |
| 8 | NC | — |
| 9 | GND | — |
| 10 | RESET | MCU reset |

- **Header:** Samtec FTSH-105 or Tag-Connect TC2050 (no-connector footprint)
- **Protection:** 22 Ω series resistors on SWDIO and SWCLK
- **Production:** Debug port fused off after programming (HSM lock)

---

## 7. Summary

| Parameter | Selected Value | Justification |
|-----------|---------------|---------------|
| MCU | NXP S32K344 | Automotive ASIL-D, HSM, 4× CAN FD, Ethernet, 2 MB Flash |
| Package | HLQFP176 | Prototype-friendly, 0.5 mm pitch, exposed pad |
| Core config | Dual-core lockstep | Safety-critical engine control |
| Clock | 40 MHz crystal | CAN FD timing, PLL to 160 MHz |
| Flash | 2 MB | OTA A/B partition + application |
| SRAM | 512 KB | ECC protected, sufficient for Lua + engine model |
| CAN FD | 4 instances | 2 vehicle + 1 diagnostic + 1 spare |
| Ethernet | 1× 10/100 MAC | Future cloud/workshop connectivity |
