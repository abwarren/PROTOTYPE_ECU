# DESIGN_ASSUMPTIONS.md — Explicit Design Assumptions

> **Policy:** Every assumption listed here is explicit. When an assumption changes,
>   every document that depends on it must be revisited.
> **Date:** 2026-07-03
> **Phase:** 0 — Design Baseline

---

## Core Assumptions

These are the foundational assumptions that the entire 7100CPT ECU design is
predicated on. If any of these change, the design must be re-evaluated from
the affected boundary inward.

### System

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| S1 | Primary target is 12V automotive systems (6–16V operating, 24V jump-start tolerant) | Entire power architecture must be redesigned for 24V-native. 24V systems can still be supported with an external DC-DC converter (documented as a known limitation). |
| S2 | Six-cylinder sequential injection is V1 target. V8 supported via wasted spark. | Requires 8-cylinder sequential driver chips and 2 additional I/O pins. Realistic V2 upgrade but would need new PCB if required for V1. |
| S3 | Maximum engine RPM: 12,000 (motorcycle/sportbike capable) | Above 12,000 RPM, MCU computation budget per ignition event drops below safety margin. Requires MCU clock increase or external timing engine. |
| S4 | Single wideband O2 sensor for V1 | Second WBO2 requires additional CJ125 IC, heater PWM channel, and ADC input. Expansion header provides these — but tuning becomes single-bank only until V2. |
| S5 | Ambient temperature range: -40°C to +85°C (under-hood) | Industrial-grade passives may fail. Full automotive (-40 to +125°C) requires AEC-Q100/Q200 components across the entire BOM, not just the MCU. |

### Communications

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| C1 | USB-C is primary tuning/programming interface | Requires alternative programming path (CAN bootloader or SWD) if USB is removed. USB-C connector takes up significant board edge space. |
| C2 | CAN FD at 8 Mbps is sufficient for all vehicle bus traffic | If higher bandwidth is needed (e.g., radar/lidar fusion), Ethernet becomes mandatory for V1 rather than V2 option. |
| C3 | Ethernet is reserved for V2 (footprint only) | V1 cannot support cloud telemetry or high-speed workshop diagnostics without external CAN-to-Ethernet bridge. |
| C4 | Bluetooth/WiFi are NOT on V1 PCB — expansion header only | Wireless tuning/dashboard requires external module. Acceptable for MVP but limits user experience. |

### Mechanical

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| M1 | PCB fits within 128 × 94 × 32 mm aluminium enclosure | Enclosure change = PCB respin. Connector positions fixed relative to enclosure cutouts. |
| M2 | Passive cooling (conduction through enclosure base) is sufficient | If thermal analysis shows junction temps exceeding 125°C for any component, heatsinking or active cooling is required. Enclosure becomes thermal design element. |
| M3 | IP67 sealing with O-ring gasket and sealed connectors | Unsealed connectors or inadequate gasket groove design = enclosure redesign. Every external connector must be IP67-rated. |
| M4 | All components on top side only (connectors on one edge) | Double-sided assembly increases cost and complicates reflow. If bottom-side components are unavoidable, assembly process changes. |
| M5 | Black anodized aluminium enclosure | Finish is cosmetic but anodizing affects thermal emissivity. Bare aluminium may dissipate heat differently. |

### Firmware

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| F1 | Firmware is rusEFI-derived (C++, open-source engine management) | If a different firmware platform is chosen, MCU pin assignments, peripheral configuration, and memory map may need revision. rusEFI already supports S32K — this assumption is low-risk. |
| F2 | MCU runs dual-core lockstep configuration (safety-critical mode) | If single-core "split" mode is used instead, safety certification path changes. Lockstep provides ASIL-D capability; split mode reduces it. |
| F3 | OTA firmware updates via USB-C in V1 (CAN OTA in V2) | V1 field updates require physical USB connection. Acceptable for motorsport/prototype, not for production OEM. |

### Manufacturing

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| MF1 | Prototype quantities: 5 units. Production: 100/yr scaling to 1,000/yr | Different PCB fab/assembly partners for prototype vs production volumes. Panelization strategy changes at >100 units. |
| MF2 | Lead-free (RoHS) assembly at standard reflow profile | If leaded solder is required (aerospace/military), component selection and PCB finish change. |
| MF3 | All ICs are hand-solderable or standard SMT (no BGA except MCU exposed pad which is LQFP) | BGA components require X-ray inspection and stricter DFM rules. Currently avoided by design — confirmed by S32K344 HLQFP176 package selection. |

### Component Supply

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| CS1 | S32K344 available within 26 weeks lead time | If lead time extends beyond 52 weeks, must evaluate pin-compatible alternatives (S32K358 in BGA — different PCB). This is the single highest supply risk (R-001). |
| CS2 | Automotive-grade passives (AEC-Q200) available with <12 week lead time | Substituting industrial-grade passives reduces reliability margin. Acceptable for prototypes, not for production. |
| CS3 | All ICs available from at least one major distributor (Digi-Key, Mouser, Arrow) | Single-source, allocation-only parts require relationship with manufacturer rep — not viable for small-volume prototype. |

---

## What These Assumptions Gate

| Document | Gated Assumptions |
|----------|-------------------|
| POWER_ARCHITECTURE.md | S1, S5 |
| MCU_SELECTION.md | F1, F2, MF3, CS1 |
| CAN_DESIGN.md | C2, C3 |
| USB_DESIGN.md | C1, F3 |
| INTERFACE_SPECIFICATION.md | S2, S4, C4, M1 |
| PROTECTION_CIRCUITS.md | S1, S5 |
| COMPONENT_SELECTION.md | CS1, CS2, CS3 |
| PCB_DESIGN_GUIDE.md | M1, M2, M3, M4, MF2 |
| MECHANICAL_DESIGN.md | M1, M4, M5 |
| THERMAL_DESIGN.md | M2, S5 |
| ENCLOSURE_SPECIFICATION.md | M1, M3, M5 |
| RFQ_PACKAGE.md | MF1, MF2 |

---

## Change Process

If any assumption above is invalidated:

1. Update DESIGN_ASSUMPTIONS.md — mark the assumption as invalidated with date
2. Identify all gated documents from the table above
3. Re-evaluate each gated document against the new assumption
4. Update affected documents
5. Re-run applicable design reviews
6. If the change affects REUSE_MATRIX.md classification, update it
7. Document in DESIGN_REVIEW.md

**No silent assumption changes.**
