# Dicktator ECU — Competitive Analysis

## Overview

**Dicktator** is a South African commercial aftermarket ECU manufacturer. It is the dominant budget standalone ECU in the Southern African market, known for low cost and local support availability.

## Top Sources

| # | Source | URL | Type |
|---|--------|-----|------|
| 1 | Official Website | https://www.dicktator.co.za/ | Portal |
| 2 | Dicktator 60-2 Product | https://www.dicktator.co.za/product/dicktator-60-2/ | Specs |
| 3 | Facebook Page | https://www.facebook.com/DicktatorHQ/ | Community |
| 4 | South African forums (various) | Various | Discussions |

## Product Lineup

| Model | Focus | Price (ZAR) | Price (USD est.) |
|-------|-------|-------------|------------------|
| Dicktator 60-2 | General purpose ECU | ~R4,350 | ~$230-250 |
| Dicktator (older variants) | Basic engine management | Lower | ~$150-200 |

## Technical Specifications (Dicktator 60-2)

| Specification | Detail |
|--------------|--------|
| **Supported engines** | 1-12 cylinders (except 3-cyl) |
| **Trigger inputs** | Optimized for 60-1 / 60-2 trigger wheels |
| **Injector drivers** | Twin drivers |
| **Ignition drivers** | Triple (supports smart/dumb igniters) |
| **Load sensing** | MAP sensor (integrated or external), TPS |
| **MAP range** | -100kPa to 200kPa (3 BAR) |
| **Sensor calibration** | Water temp, air temp, TPS — user-calibrated |
| **Idle control** | 2-wire idle motor |
| **General outputs** | Fuel pump relay, 1 general-purpose output, tacho |
| **Communication** | Serial / USB-to-serial |
| **Datalogging** | Up to 60 samples/second to PC |
| **Rev limiter** | Fuel cut or spark cut |
| **CAN bus** | None |
| **Mobile app** | None |
| **Cloud** | None |

## Software

- **Name:** Dicktator Tuning Software (proprietary)
- **Type:** Windows desktop application
- **Features:** Real-time tuning, datalogging, fuel/ignition map editing
- **License:** Proprietary (free with hardware)

## Strengths

- **Lowest price point** of any commercial ECU (~$230)
- **Dominant local presence** in South Africa — widely available, many tuners
- **Simple installation** — straightforward wiring for common engine swaps
- **Good for basic setups** — naturally aspirated and mild turbo applications
- **Local manufacturing** — no import delays or currency issues in ZA

## Weaknesses

- **No CAN bus** — no integration with modern vehicle networks
- **No knock control** — no closed-loop knock detection
- **No mobile app** — laptop required for tuning and logging
- **No cloud/telematics** — no remote connectivity
- **Limited documentation** — sparse technical references outside South Africa
- **No global support** — no community outside ZA
- **Aging architecture** — limited expansion capability
- **No OTA updates** — must reflash via cable
- **No real-time Ethernet/WiFi** — serial-only tuning

## Relevance to TEN8

### Threat Level: LOW (for global market), MEDIUM (for South African market)

| Dimension | Dicktator | TEN8 Advantage |
|-----------|-----------|----------------|
| **CAN FD** | None | **Major** — full CAN FD support |
| **Connectivity** | Serial only | **Major** — USB, BLE, WiFi, Cellular |
| **Mobile app** | None | **Major** — full mobile diagnostics |
| **Cloud** | None | **Major** — telemetry, OTA, fleet mgmt |
| **Documentation** | Minimal | **Major** — comprehensive docs |
| **Price** | ~$230 | TEN8 ($400-$1200) is more expensive, but offers 10x the features |
| **Local support (ZA)** | Excellent | Need to build local presence |

### Key Insight

Dicktator proves there is a **strong market in South Africa and developing regions** for affordable standalone ECUs. TEN8 could enter this market with a **significantly superior product** at a still-reasonable price point, particularly if TEN8 supports:
- South African engine swap favorites (1UZ-FE, RB25, 2JZ, Ford V8s)
- Local distribution and support
- Affordable entry-level TEN8 Lite variant

## References

- [Official Site](https://www.dicktator.co.za/)
- [Dicktator 60-2 Product Page](https://www.dicktator.co.za/product/dicktator-60-2/)
- [Facebook Community](https://www.facebook.com/DicktatorHQ/)
