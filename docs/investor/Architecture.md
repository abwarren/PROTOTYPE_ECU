# Platform Architecture

> Plain-language overview. See engineering docs for implementation details.

---

## High-Level Architecture

The platform has three layers, each independent and independently replaceable.

```
┌─────────────────────────────────────────────────────────────┐
│              Prototype Studio (Desktop App)                   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Dashboard │  │Tuning    │  │Dat logging│  │Diagnostics│    │
│  │(Gauges)  │  │(Tables)  │  │(Analysis)│  │(DTCs)    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
├─────────────────────────────────────────────────────────────┤
│              Prototype Cloud (Optional Service)               │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Telemetry │  │OTA       │  │Fleet     │  │Mobile    │    │
│  │(Data)    │  │(Updates) │  │(Mgmt)    │  │(App)     │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
├─────────────────────────────────────────────────────────────┤
│              Prototype ECU (Firmware + Hardware)              │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Engine    │  │Sensors   │  │CAN Bus   │  │Bootloader│    │
│  │Control   │  │(Inputs)  │  │(Comms)   │  │(Updates) │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Core Design Decisions

### White-Label from Day One

Everything is built as a white-label platform. The product name, company name, logos, colors, and all customer-facing strings are configured from a single file (`brand.json`). Changing the brand requires editing one file — no source code changes.

This means:
- We can sell the same platform under different brands
- OEM customers can rebrand without forking
- We can pivot the product name without engineering cost

### Separation of Concerns

The Studio, Cloud, and ECU firmware are independent projects within the same repository. They communicate through defined protocols, not shared code. Any component can be replaced without affecting the others.

### Proven Foundation

The ECU firmware is based on 10+ years of open-source development (rusEFI). We're not inventing engine control from scratch — we're building on proven technology and adding proprietary value where it matters (branding, cloud, mobile, and the user experience).

## Data Flow

```
[Tuner] ←→ [Studio] ←→ [USB/CAN] ←→ [ECU Firmware] ←→ [Engine]
              ↑
              ↓
           [Cloud]
              ↑
              ↓
           [Mobile]
```

The tuner interacts with Studio, which communicates with the ECU. Cloud is optional — the platform works fully offline, with cloud features available when connected.

## Branding Layer

All branding is configured from `branding/brand.json`:

```json
{
  "product_name": "Prototype ECU",
  "company_name": "Prototype ECU Inc.",
  "firmware": { "usb_string": "${product_name}" },
  "studio": { "window_title": "${product_name} Studio" },
  "cloud": { "portal_name": "${product_name} Cloud" }
}
```

Change this file, rebuild, and the entire platform is rebranded.
