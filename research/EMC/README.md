# Electromagnetic Compatibility (EMC) — Research

## Overview

EMC compliance is critical for automotive ECUs. The ECU must not emit excessive interference and must be immune to external electromagnetic fields.

## Key Standards

| Standard | Focus |
|----------|-------|
| **CISPR 25** | Radio disturbance characteristics (emissions) |
| **ISO 11452** | Radiated electromagnetic immunity |
| **ISO 7637** | Electrical transient conduction |
| **ISO 10605** | Electrostatic discharge (ESD) |

## CISPR 25 — Emissions Limits

| Band | Frequency | Limits (Peak/Quasi/Average) |
|------|-----------|------------------------------|
| LF | 150 kHz - 30 MHz | Conducted |
| HF | 30 MHz - 1 GHz | Radiated |

## Design for EMC

### PCB Level

1. Continuous ground plane on L2
2. Decoupling capacitors near every IC
3. Ferrite beads on power inputs
4. LC filters at connector entry/exit
5. Guard traces around clock signals
6. Minimize high-frequency loop areas
7. Separate analog/digital sections

### Enclosure Level

1. Aluminum enclosure provides natural shielding
2. Conductive gaskets at seams
3. Shielded cable entries
4. Grounded mounting points

### Component Level

1. CAN transceivers with EMC-optimized signal (TJA1043)
2. TVS diodes on all external connections
3. Common-mode chokes on differential pairs

## TEN8 EMC Strategy

- Design for CISPR 25 Class 5 (strictest) from start
- Aluminum enclosure for natural shielding
- Full pre-compliance testing before certification

## References

- CISPR 25: Vehicles — Radio disturbance characteristics
- ISO 11452: Component test methods for EMC
- NXP: EMC Design Guidelines for Automotive
- Wurth Elektronik: EMC Filter Design Guide
