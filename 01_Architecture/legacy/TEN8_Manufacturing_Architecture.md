# TEN8 Manufacturing Architecture

## Overview

Production-ready manufacturing package for TEN8 ECU, designed for Chinese PCB/PCBA and enclosure manufacturing.

## Manufacturing Package Contents

### PCB Manufacturing

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Gerber Files | RS-274X | All layers including NC drill |
| Stackup | PDF | Layer stackup with material specs |
| IPC Netlist | IPC-356 | Netlist for electrical testing |
| BOM | CSV/Excel | Component list with MPNs |
| Pick & Place | CSV | XY coordinates for assembly |
| FAI Report | PDF | First article inspection criteria |

### PCBA Manufacturing

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Assembly Drawing | PDF | Component placement diagram |
| Solder Paste Stencil | Gerber | Stencil apertures |
| Test Points | CSV | ICT/flying probe test points |
| Programming File | Binary | Pre-programmed firmware |
| Test Procedure | PDF | Functional test specification |

### Enclosure Manufacturing

| Deliverable | Format | Description |
|-------------|--------|-------------|
| 3D Model | STEP | Complete enclosure assembly |
| 2D Drawing | PDF | Dimensioned drawings |
| Mold Design | STEP | Injection mold tool design |
| Material Spec | PDF | Plastic/aluminum specification |

## Manufacturing Process

### Phase 1: Prototype (1-100 units)

- **PCB:** PCBWay or JLCPCB (4-6 layers)
- **Assembly:** Manual or semi-automated
- **Enclosure:** 3D printed (SLS or FDM)
- **Testing:** Manual functional test

### Phase 2: Low Volume (100-1000 units)

- **PCB:** IATF 16949 manufacturer (Kinwong)
- **Assembly:** SMT line at same manufacturer
- **Enclosure:** Injection molded (aluminum tool)
- **Testing:** Automated functional test with jig

### Phase 3: Medium Volume (1000-10000 units)

- **PCB:** High-volume IATF 16949
- **Assembly:** Full SMT with AOI and X-ray
- **Enclosure:** Die cast aluminum (production tool)
- **Testing:** ICT + functional test

### Phase 4: High Volume (10000+ units)

- **Full production line:** Automated PCB, assembly, testing
- **Burn-in:** 24-48 hour burn-in at temperature
- **Quality:** Statistical process control (SPC)

## Supplier Selection Criteria

| Criteria | Weight |
|----------|--------|
| IATF 16949 certification | Required |
| IPC 6012 Class 3 capability | Required |
| Minimum order quantity | < 100 for proto, < 500 for production |
| Lead time | < 2 weeks prototype, < 6 weeks production |
| Quality track record | > 99% yield, CPK > 1.33 |
| Communication | English-language support |

## Testing

| Test | Stage | Coverage |
|------|-------|----------|
| AOI | Post-reflow | All solder joints |
| Flying Probe | Post-assembly | All nets (opens/shorts) |
| ICT | Final test | Component values, power rails |
| Functional | Final test | Full ECU functionality |
| Burn-in | Final | 24h at 85°C |
| EMC | Qualification | CISPR 25, ISO 11452 |
| Environmental | Qualification | ISO 16750 |

## References

- IPC-A-610: Acceptability of Electronic Assemblies
- IPC-6012: Qualification of PCBs
- IATF 16949: Quality Management System
- ISO 16750: Environmental Testing
