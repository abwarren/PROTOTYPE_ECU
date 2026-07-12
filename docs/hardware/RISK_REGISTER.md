# RISK_REGISTER.md — Hardware Design Risks

> **Date:** 2026-07-01
> **Design Phase:** Schematic Design

---

## Open Risks

| # | Risk | Probability | Impact | Mitigation | Owner |
|---|------|------------|--------|------------|-------|
| R-001 | S32K344 lead time > 26 weeks (automotive silicon shortage) | Medium | High | Order samples early. Keep STM32H743 backup design. | Hardware |
| R-002 | Buck converter thermal at 85°C ambient (Pd=1.5W, Tj=145°C) | Medium | High | Evaluate LMR33630 vs TI TPS54560. Add heatsink or external FETs for production. Acceptable for prototype. | Hardware |
| R-003 | EMC pre-compliance failures (CISPR 25 radiated) | Medium | Medium | Pre-compliance scan before PCB fab. Budget $2K. Design includes CM chokes, ferrites, ground plane. | Hardware |
| R-004 | TLE8888 injector driver availability | Medium | Medium | NXP part — same supply chain risk as MCU. Alternative: discrete peak-hold driver (LM1949 + FET). | Hardware |
| R-005 | USB-C connector mechanical stress (mid-mount, seals in IP67 enclosure) | Low | Medium | Select connector with through-hole mounting tabs for mechanical strength. Test with repeated insertion. | Mechanical |
| R-006 | CAN FD at 8 Mbps not working on V1 PCB (signal integrity) | Low | Low | V1 targets 1 Mbps CAN 2.0. CAN FD at higher rates is V2 feature. | Hardware |
| R-007 | S32K344 silicon errata blocking a required feature | Low | Medium | Review errata document before finalizing pin assignment. Verify eTPU and ADC errata do not affect engine control. | Hardware |
| R-008 | 42-pin Deutsch DTM connector pin count insufficient for future expansion | Low | Low | V1 uses ~35 pins. 7 spare. V2 can use larger connector (60-pin) or second connector. | Hardware |
| R-009 | Ethernet PHY not populated — V1 lacks cloud telemetry | High | Low | Ethernet is a V2 feature. V1 uses USB for tuning + CAN for vehicle. Acceptable for MVP. | Hardware |
| R-010 | Analog input noise coupling from nearby switching nodes | Medium | Medium | RC filters on all analog inputs. Guard traces around VREF. Keep analog traces away from buck inductor and switching node. | Hardware |

---

## Closed / Accepted Risks

| # | Risk | Disposition | Rationale |
|---|------|-------------|-----------|
| R-A01 | STM32H7 prototype vs S32K3 production — different pinouts, toolchains | Accepted | V1 prototype on STM32F407 Discovery (existing). Schematic designed for S32K344. Migration when hardware is fabbed. |
| R-A02 | No conformal coating on V1 prototype — moisture risk | Accepted | V1 is lab/dyno use only. Conformal coating added for V2 production. |
| R-A03 | Single LDO for 3.3V — single point of failure | Accepted | S32K344 has internal regulator backup. External watchdog covers LDO failure. Dual LDO added for ASIL-B production. |

---

## Risk Matrix

```
Impact
  High    │  R-001  R-002
          │
  Medium  │  R-004  R-003  R-005  R-010
          │
  Low     │  R-009  R-007  R-008  R-006
          │
          └──────────────────────────────────
              Low     Medium      High
                    Probability
```

---

*Updated per design phase. Review at schematic completion, PCB layout start, and prototype bring-up.*
