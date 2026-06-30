# Functional Safety — Research

## Overview

ISO 26262 defines functional safety for road vehicles. Compliance is expected for production automotive ECUs.

## ISO 26262 Overview

| Part | Focus |
|------|-------|
| Part 1 | Vocabulary |
| Part 2 | Management of functional safety |
| Part 3 | Concept phase |
| Part 4 | Product development: system level |
| Part 5 | Product development: hardware level |
| Part 6 | Product development: software level |
| Part 7 | Production and operation |
| Part 8 | Supporting processes |
| Part 9 | Automotive Safety Integrity Level (ASIL) |
| Part 10 | Guideline on ISO 26262 |
| Part 11 | Guidelines on application of semiconductor |
| Part 12 | Adaptation for motorcycles |

## ASIL Levels

| Level | Hazard Severity | Required Actions |
|-------|----------------|-----------------|
| **QM** | No safety risk | Standard quality management |
| **ASIL A** | Low | Moderate processes |
| **ASIL B** | Medium | Significant processes |
| **ASIL C** | High | Rigorous processes |
| **ASIL D** | Highest | Most rigorous (airbag, braking) |

## Safety Mechanisms

| Mechanism | Use |
|-----------|-----|
| Lockstep CPUs | Detect core failures |
| ECC Memory | Detect/correct memory errors |
| Windowed Watchdog | Detect software hangs |
| BIST (Power-on) | Detect hardware faults |
| Analog Loopback | Verify driver outputs |
| Redundant Sensors | Plausibility checking |
| Safe State | Emergency shutdown |

## Safety Lifecycle

1. **Hazard Analysis** — Identify hazards and define ASIL targets
2. **Safety Goals** — Top-level safety requirements
3. **Functional Safety Concept** — How safety is achieved
4. **Technical Safety Concept** — Implementation
5. **Hardware/Software** — Design with safety mechanisms
6. **Integration and Test** — Verify safety requirements
7. **FMEDA** — Quantify diagnostic coverage

## TEN8 Functional Safety

- **Target ASIL:** ASIL-B (appropriate for aftermarket ECU)
- **Safety Mechanisms:** Watchdog, ECC, voltage monitoring, sensor plausibility
- **Documentation:** Safety manual, FMEDA, safety case
- **Path:** Start with ASIL-B compliance, upgrade for higher-tier products

## References

- ISO 26262:2018 (Parts 1-12)
- NXP: Functional Safety for S32K3
- Infineon: AURIX Safety Manual
- SGS-TÜV: Functional Safety Training Materials
- Synopsys: ISO 26262 ASIL Guide
