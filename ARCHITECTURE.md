# Platform Architecture

## Design Principles

1. **White-label by default** — No product or company names hardcoded in any component. All branding comes from `branding/brand.json`.
2. **Modular and replaceable** — Every module is designed so it can be independently replaced with a proprietary implementation over time.
3. **Separation of concerns** — Firmware, Studio, Cloud, Mobile, and Hardware are independent projects within this monorepo.
4. **Upstream compatibility** — Firmware maintains a documented relationship with its upstream source. Changes are tracked and referenced.

## System Architecture

```
                          ┌─────────────────────────────────┐
                          │         Customer/User           │
                          └──────────┬──────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌────────────────┐   ┌──────────────────┐   ┌──────────────────┐
     │  Studio        │   │  Mobile App      │   │  Docs / Portal   │
     │  (Desktop UI)  │   │  (BLE/WiFi)      │   │  (Web)           │
     └────────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
              │                    │                       │
              │      ┌─────────────┼───────────────────────┘
              │      │             │
              ▼      ▼             ▼
     ┌────────────────────────────────────────────────────────┐
     │                 Communication Layer                     │
     │     CAN FD │ USB CDC │ BLE │ WiFi │ MQTT │ HTTP       │
     └──────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┼─────────────────────────────┐
              │             │                             │
              ▼             ▼                             ▼
     ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐
     │  Firmware      │  │  Bootloader    │  │  Cloud Platform  │
     │  (ECU)         │  │  (Secure)      │  │  (Telemetry/OTA) │
     └────────────────┘  └────────────────┘  └──────────────────┘
```

## Layer Stack

```
┌──────────────────────────────────────────────────────┐
│                  Application Layer                    │
│  Studio │ Mobile │ Cloud │ SDK                        │
├──────────────────────────────────────────────────────┤
│                   Service Layer                       │
│  Auth │ Storage │ Branding │ Updates │ Telemetry      │
├──────────────────────────────────────────────────────┤
│               Communication Layer                     │
│  Protocol │ Transport │ Serialization                  │
├──────────────────────────────────────────────────────┤
│               Firmware Layer                          │
│  Scheduler │ Fuel │ Ignition │ Sensors │ CAN │ Diag   │
├──────────────────────────────────────────────────────┤
│               Hardware Abstraction                    │
│  MCAL │ Drivers │ Board Support                       │
├──────────────────────────────────────────────────────┤
│                    Hardware                           │
│  PCB │ Enclosure │ Connectors                         │
└──────────────────────────────────────────────────────┘
```

## Module Classification

Each module is classified into one of:

| Classification | Meaning |
|----------------|---------|
| **KEEP** | Stable, no changes needed |
| **MODIFIABLE** | Can be improved but not replaced |
| **REPLACE** | Planned for replacement with proprietary implementation |
| **PROPRIETARY** | Already a proprietary implementation |

See [TECH_DEBT.md](./TECH_DEBT.md) for per-module classification.
