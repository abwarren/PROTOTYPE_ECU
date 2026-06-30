# Technology Stack

> Technology choices explained in terms of business value — not engineering detail.

---

## Firmware

| Choice | Why | Business Value |
|--------|-----|----------------|
| C++ on ARM Cortex-M7 | Industry standard for engine control | Reliable, well-understood, any embedded engineer can work with it |
| rusEFI foundation | 10+ years of proven, tested code | We don't need to reinvent engine control — saves years of R&D |
| Module architecture | Each component can be replaced independently | Can progressively replace GPL code with proprietary implementations |
| OpenBLT bootloader | Mature open-source firmware update system | OTA updates without building a bootloader from scratch |

## Desktop Application (Prototype Studio)

| Choice | Why | Business Value |
|--------|-----|----------------|
| Electron + React | Cross-platform desktop framework | One codebase for Windows, Mac, Linux — 3x faster than building native |
| TypeScript | Type-safe JavaScript | Fewer bugs, faster development, larger talent pool |
| Canvas / WebGL | Hardware-accelerated graphics | Smooth, beautiful gauges and 3D table editors |
| Zustand | Simple state management | Fast development, easy to change |

## Cloud Platform

| Choice | Why | Business Value |
|--------|-----|----------------|
| AWS IoT Core | Managed MQTT broker for connected devices | No DevOps overhead — thousands of ECUs scale automatically |
| TimescaleDB | Time-series database built on PostgreSQL | Perfect for telemetry data (time + value pairs from ECUs) |
| OAuth 2.0 + JWT | Industry standard authentication | Secure, well-understood, integrates with any identity provider |

## Mobile App

| Choice | Why | Business Value |
|--------|-----|----------------|
| Flutter + Dart | Cross-platform mobile framework | One codebase for iOS + Android |

## Engineering Infrastructure

| Choice | Why | Business Value |
|--------|-----|----------------|
| Git (single source of truth) | Everything in one repository | New engineers can understand the entire platform from the repo alone |
| Documentation-Driven Development | Docs are first-class deliverables | Reduces key-person risk, makes company more acquirable |
| ADR records | Every architecture decision documented | Never wonder "why did we build it this way?" |

## Branding System

| Choice | Why | Business Value |
|--------|-----|----------------|
| brand.json | Single file controls all branding | Rebrand without code changes — white-label licensing is straightforward |
| Runtime brand loading | Studio loads branding dynamically | No rebuild needed for branding changes |
