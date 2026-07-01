# STM32H7 — MCU Research

## Overview

STM32H7 series offers the highest performance Cortex-M7 MCUs with excellent public documentation and ecosystem.

## Key Specs

- **Core:** ARM Cortex-M7 @ up to 550 MHz + Cortex-M4 @ 240 MHz (dual-core variants)
- **Performance:** >1000 DMIPS
- **ADC:** 16-bit, up to 36 channels
- **Timers:** HRTIM (184ps resolution), advanced PWM
- **CAN:** CAN FD (2x, 3x)
- **Ethernet:** 1x 10/100 MAC
- **Security:** HASH, AES, TRNG, Secure Boot
- **AEC-Q100:** Selected variants qualified

## Strengths

- Excellent public documentation and ecosystem
- High performance at reasonable cost
- Rich peripheral set
- Dual-core options for safety/lockstep

## Weaknesses

- Limited AEC-Q100 variants
- Not designed specifically for automotive safety domains
- No built-in HSM like NXP/Infineon

## Key Resources

- STM32H7 Reference Manual
- STM32CubeIDE and HAL
- Application Notes (ANxxxx series)

## TEN8 Applicability

**Excellent for prototyping and initial development.** Move to S32K3 or AURIX for production.
