# Thermal Management — Research

## Overview

Automotive ECUs operate from -40°C to +125°C ambient. Thermal management is critical for reliability.

## Heat Sources

| Component | Power Dissipation |
|-----------|------------------|
| MCU | 0.5-3W |
| Injector drivers | 1-5W per channel |
| Ignition IGBTs | 0.5-2W per channel |
| Voltage regulators | 0.5-3W |
| CAN transceivers | 0.1-0.3W |

## Cooling Strategies

| Method | Application | Effectiveness |
|--------|-------------|---------------|
| Conduction | PCB copper → enclosure | Good |
| Natural convection | With ventilation | Limited |
| Sealed enclosure | No airflow | With heat sink |
| Active cooling | Fan (rare in ECUs) | Best |

## PCB Thermal Design

1. **Heavy copper** (2-3 oz) for power paths
2. **Thermal vias** array under power components
3. **Copper pours** connected to vias for heat spreading
4. **Component placement** — separate hot from sensitive

## Enclosure Thermal Design

1. **Aluminum** enclosure as heat sink
2. **Thermal pads** (Silicone, Boron Nitride) between PCB and case
3. **Potting compounds** — thermally conductive epoxy/silicone
4. **Heat sink fins** on enclosure for convection

## TEN8 Thermal Strategy

- Aluminum enclosure with thermal pads to PCB
- Separate power board with thick copper
- Thermal simulation during PCB design
- Derating analysis for all components

## References

- IPC-2152: Thermal Design Guide
- Bergquist: Thermal Interface Material Guide
- ISO 16750: Environmental testing temperature ranges
- Würth: Thermal Management Design Guide
