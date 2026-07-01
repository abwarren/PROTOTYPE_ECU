# Enclosure Module

## Purpose

Provide physical protection, thermal management, and environmental sealing for the ECU electronics.

## Responsibilities

- Protect PCB and components from environmental exposure
- Provide thermal path from high-power components to ambient
- Support mounting in vehicle engine compartment or cabin
- Enable connector access and serviceability
- EMI shielding for sensitive circuits

## Specifications

| Parameter | Value |
|-----------|-------|
| **Material** | Aluminum (ADC12 die cast) |
| **Sealing** | IP67 (standard), IP6K9K (optional) |
| **Thermal** | Thermal pads to enclosure |
| **Mounting** | Bracket or direct mount |
| **Weight** | < 500g |

## Design Features

- Aluminum die-cast for thermal and EMI performance
- Thermal interface pads between power components and enclosure
- Sealed connector interfaces
- Optional conformal coating for harsh environments
- Serviceable (lid removal for board access)

## Manufacturing Deliverables

| Deliverable | Format | Description |
|-------------|--------|-------------|
| 3D Model | STEP | Complete enclosure assembly |
| 2D Drawing | PDF | Dimensioned drawings |
| Mold Design | STEP | Die cast tool design |
| Material Spec | PDF | Aluminum specification |
| Surface Finish | Spec | Powder coat or anodize |

## Known Issues

- Die cast tooling is expensive for low volume (>$10k per mold)
- 3D printing suitable for prototypes only (V1)

## Future Improvements

- [ ] Plastic injection molding for lower-cost variants
- [ ] Integrated heatsink fins for high-power applications
- [ ] IP6K9K rating for under-hood mounting
