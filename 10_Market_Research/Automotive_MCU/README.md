# Automotive Microcontrollers — Research

## Overview

Comprehensive comparison of automotive-grade MCU families suitable for ECU development.

## MCU Families Researched

| Family | Core | Safety | Security | Typical Use |
|--------|------|--------|----------|-------------|
| **NXP S32K1xx** | Cortex-M4F | ASIL-B | CSEc | Body, Gateway |
| **NXP S32K3xx** | Cortex-M7 | ASIL-D | HSM (EVITA) | Domain Control |
| **Infineon AURIX TC2xx** | TriCore | ASIL-D | HSM | Powertrain |
| **Infineon AURIX TC3xx** | TriCore (multi) | ASIL-D | HSM Full EVITA | ADAS, Powertrain |
| **Infineon AURIX TC4xx** | TriCore (next-gen) | ASIL-D | HSM+AI | Next-gen Domain |
| **STM32H7 (Auto)** | Cortex-M7 | Limited | Crypto | Infotainment, Gateway |
| **Renesas RH850** | G4MH proprietary | ASIL-D | Advanced HSM | Zonal, Powertrain |

## Detailed Comparison

### Performance

| MCU | Max Freq | DMIPS | FPU |
|-----|----------|-------|-----|
| NXP S32K1 | 112 MHz | 168 | Yes |
| NXP S32K3 | 320 MHz | ~600 | Yes |
| AURIX TC3xx | 300 MHz+ | >1000 | Yes |
| STM32H7 | 550 MHz | ~1027 | Yes (double) |
| RH850 | Varies | High | Yes |

### CAN Support

| MCU | CAN 2.0 | CAN FD | FlexRay | Ethernet |
|-----|---------|--------|---------|----------|
| NXP S32K1 | Yes | No | No | No |
| NXP S32K3 | Yes | Yes | Yes | Yes (1G) |
| AURIX TC3xx | Yes | Yes | Yes | Yes |
| STM32H7 | Yes | Yes | No | Yes |
| RH850 | Yes | Yes | Yes | Yes |

### ADC

| MCU | Resolution | Channels | Conversion Speed |
|-----|-----------|----------|----------------|
| NXP S32K3 | 12-bit | Up to 32 | Fast |
| AURIX TC3xx | 12-bit | Up to 64 | Very fast |
| STM32H7 | 16-bit | Up to 36 | Very fast |
| RH850 | 10/12-bit | Up to 40 | Fast |

### Timers

| MCU | Timer Modules | PWM Channels | High-Resolution |
|-----|--------------|-------------|-----------------|
| NXP S32K3 | eTPU, FTM | Many | Yes |
| AURIX TC3xx | GTM, CCU6 | Many | Yes |
| STM32H7 | HRTIM, TIM | Many | Yes (184ps) |
| RH850 | TAUD, TSG | Many | Yes |

### Security

| MCU | HSM | SHE | EVITA | Secure Boot | Crypto Accelerators |
|-----|-----|-----|-------|-------------|--------------------|
| NXP S32K3 | Yes | Yes | Full | Yes | AES, ECC, RSA |
| AURIX TC3xx | Yes | Yes | Full | Yes | AES, ECC, RSA, ECDSA |
| STM32H7 | No | Yes | No | Basic | AES, HASH, TRNG |
| RH850 | Yes | Yes | Full | Yes | AES, ECC, RSA |

### Development Ecosystem

| MCU | IDE | SDK | Debug Probe | Documentation |
|-----|-----|-----|-------------|--------------|
| NXP S32K | S32 Design Studio | RTD (AUTOSAR), MCAL | Lauterbach, PE Micro | Good public docs |
| AURIX | AURIX Dev Studio | iLLD, MCAL | Lauterbach | NDA/Partner portal |
| STM32H7 | STM32CubeIDE | HAL, LL, RTOS | ST-Link, J-Link | Excellent public docs |
| RH850 | CS+, e² studio | FCL | Lauterbach, Renesas | Public/NDA |

## Availability & Lead Times

- **NXP S32K:** Moderate availability, extended lifecycle
- **Infineon AURIX:** Long lead times, requires planning
- **STM32H7:** Good availability (industrial variants)
- **Renesas RH850:** Moderate, varies by region

## TEN8 MCU Selection Criteria

| Requirement | Priority |
|------------|----------|
| AEC-Q100 qualified | Critical |
| CAN FD support | Critical |
| High-res timers for ignition | Critical |
| 12+ bit ADC with many channels | Critical |
| Security HSM | High |
| ASIL-B or better | High |
| Public documentation | High |
| Developer ecosystem | High |
| Availability / lead time | High |
| Cost | Medium |

## Recommendation for TEN8

**Primary candidate:** **NXP S32K3xx** — Best balance of automotive qualification, performance, CAN FD, security HSM, ASIL-D, and public documentation. Most accessible for a startup while still being production-grade.

**Secondary candidate:** **STM32H7 (AEC-Q100 variant)** — If starting with prototyping before moving to fully automotive-qualified production hardware.

**Consider for high-end:** **Infineon AURIX TC3xx** — If TEN8 targets ASIL-D safety systems. But the NDA barrier and ecosystem cost are significant.

## References

- NXP S32K3 Product Page: https://www.nxp.com/products/processors-and-microcontrollers/s32-automotive-platform/s32k-general-purpose-mcus:S32K-Family
- Infineon AURIX: https://www.infineon.com/cms/en/product/microcontroller/32-bit-tri-core-microcontroller/
- STM32H7 Automotive: https://www.st.com/en/automotive-microcontrollers/stm32h7-series.html
- Renesas RH850: https://www.renesas.com/us/en/products/microcontrollers-microprocessors/rh850-automotive-mcus
