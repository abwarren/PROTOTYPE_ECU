# PCB Design for Automotive ECUs — Research

## Overview

Automotive ECU PCB design requires extreme reliability, thermal management, EMI control, and compliance with automotive standards.

## Top 10 Sources

| # | Source | URL | Focus |
|---|--------|-----|-------|
| 1 | IPC-6012E | ipc.org | Automotive class qualification |
| 2 | IPC-2152 | ipc.org | Current capacity design |
| 3 | Sierra Circuits Blog | protoexpress.com/blog | EMI/EMC mitigation |
| 4 | Altium Resources | resources.altium.com | Layout standards |
| 5 | Aivon Technical Blog | aivon.com | Power electronics |
| 6 | Monolithic Power Systems | monolithicpower.com | CISPR 25 design |
| 7 | Texas Instruments AN | ti.com | Mixed-signal layout |
| 8 | NXP AN (various) | nxp.com | Automotive reference designs |
| 9 | STM32 AN (various) | st.com | MCU PCB guidelines |
| 10 | Eurocircuits DFM | eurocircuits.com | Manufacturing rules |

## Key Design Rules

### Layer Stackup

| Layers | Stackup | Use Case |
|--------|---------|----------|
| 4-layer | SIG-GND-PWR-SIG | Simple ECUs |
| 6-layer | SIG-GND-SIG-PWR-GND-SIG | Standard ECUs |
| 8-layer | SIG-GND-SIG-PWR-PWR-GND-SIG-SIG | Complex ECUs |

### Material Selection

| Material | Tg | Use Case |
|----------|-----|----------|
| Standard FR4 | 130-140°C | Not suitable for automotive |
| High-Tg FR4 | 170-180°C | Standard automotive |
| Polyimide | 250°C+ | High-temp / under-hood |
| Rogers/High-speed | Varies | RF / high-speed signals |

### Copper Weights

| Weight | Thickness | Use |
|--------|-----------|-----|
| 1 oz | 35 µm | Signal layers |
| 2 oz | 70 µm | Power distribution |
| 3 oz | 105 µm | High-current drivers |
| 4+ oz | 140+ µm | Injector/ignition stages |

### Thermal Management

- **Thermal vias:** Array of 0.2-0.3mm vias under power components
- **Copper pours:** Maximum copper for heat spreading
- **Thermal relief:** On through-hole pads for soldering

### EMI/EMC Guidelines

1. Continuous ground plane (never split)
2. Signal-to-ground via spacing < λ/20
3. Differential pairs for CAN (100-120Ω impedance)
4. LC/π filters at connector entry
5. Guard rings around sensitive analog
6. Separate analog/digital ground regions
7. Minimize loop area for all high-current paths

### High-Current Routing (Injectors)

1. Trace width per IPC-2152 (not IPC-2221 which is outdated)
2. Kelvin connections for current sensing
3. Snubber networks close to MOSFET drain
4. Separate power ground return path

### High-Voltage Routing (Ignition)

1. Creepage: ≥ 6.4mm for 400V (reduced by coating)
2. Clearance: ≥ 6.4mm for 400V
3. Avoid sharp corners on HV traces
4. Slot/isolate HV regions

## Manufacturing Rules

| Feature | Typical Spec |
|---------|-------------|
| Min trace/space | 4/4 mil (production), 5/5 mil (reliable) |
| Min via | 0.2mm drill, 0.35mm pad |
| Min annular ring | 0.05mm (Class 2), 0.1mm (Class 3) |
| Solder mask | LPI green (standard) |
| Surface finish | ENIG (production), HASL (prototype) |

## TEN8 Applicability

- **Target:** 6-layer stackup with High-Tg FR4
- **Weight:** 1oz signal, 2oz power, 3oz driver
- **Standards:** IPC-6012 Class 3
- **EMI:** Full CISPR 25 compliance design
- **Prototype:** PCBWay or JLCPCB 4-6 layer
- **Production:** IATF 16949 certified manufacturer

## References

- IPC-6012E Automotive Addendum
- IPC-2152 Current Capacity
- CISPR 25 EMI Standard
- See individual subfolders for detailed analysis
