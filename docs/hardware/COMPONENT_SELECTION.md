# COMPONENT_SELECTION.md — Critical Component BOM

> **Date:** 2026-07-01
> **Status:** Preliminary BOM — pricing and availability to be confirmed

---

## 1. Component Selection Principles

1. **Automotive-grade preferred** — AEC-Q100 (IC), AEC-Q200 (passive)
2. **Industrial temp range minimum** — −40°C to +85°C (125°C for engine bay)
3. **Long lifecycle** — no NRND (Not Recommended for New Design) parts
4. **Multi-source where possible** — avoid single-supplier dependency
5. **Hand-solderable packages** — 0402 minimum, QFP/QFN, no BGA for V1

---

## 2. Critical Components

### MCU

| Parameter | Value |
|-----------|-------|
| Part | NXP S32K344EHT1VPBST (or equivalent) |
| Package | HLQFP176, exposed pad |
| Temp | −40°C to +125°C (AEC-Q100 Grade 1) |
| Lead time | 26+ weeks (check availability) |
| Alt #1 | S32K342 (lower spec — 1 MB Flash, 256 KB SRAM) |
| Alt #2 | STM32H743 (industrial, for prototype only) |

### Power

| Function | Part | Package | Temp | Notes |
|----------|------|---------|------|-------|
| Buck Converter | LMR33630ADDAR | SOIC-8 EP | −40°C to +125°C | 3A, 36V max. Alt: TPS54560. |
| LDO 3.3V | TPS7A1633DGNR | HVSSOP-8 EP | −40°C to +125°C | 100 mA. Alt: TPS7A47 (1A). |
| VREF 5.0V | REF5050IDGKT | VSSOP-8 | −40°C to +125°C | 0.05%, 3 ppm/°C |
| P-MOSFET (Rev Pol) | IPD90P04P4L-04 | DPAK | −55°C to +175°C | 40V, 90A, 4.5 mΩ |
| TVS Primary | SMCJ33A | SMC | −55°C to +150°C | 1500W peak |

### Communications

| Function | Part | Package | Notes |
|----------|------|---------|-------|
| CAN Transceiver | TJA1043TK/1Y | HVSON-14 | CAN FD 5 Mbps, ±58V fault |
| USB ESD | TPD2EUSB30DRTR | SOT-23-3 | 0.05 pF, ±8 kV |
| CM Choke (CAN) | ACT45B-510-2P-TL003 | 1812 | 51 µH, 300 mA |
| USB-C Connector | Molex 105450-0101 | SMT mid-mount | 16-pin |

### Input Conditioning

| Function | Part | Package | Notes |
|----------|------|---------|-------|
| WBO2 Controller | CJ125 (Bosch) | SSOP-24 | Lambda sensor interface IC |
| Knock Amplifier | TLE2072CDR | SOIC-8 | Dual op-amp, low noise |
| Clamp Diode | BAV99 | SOT-23 | Dual series diode |
| ESD Diode (CAN ext) | PESD2CAN | SOT-23 | Optional — transceiver has internal |

### Output Drivers

| Function | Part | Package | Notes |
|----------|------|---------|-------|
| Injector Driver | TLE8888-2QK | LQFP-64 EP | 8-ch peak & hold, SPI diag |
| IGBT (Ignition) | ISL9V3040S3ST | DPAK | 400V, 17A, logic-level gate |
| ETC H-Bridge | DRV8873HPWPR | HTSSOP-24 | 3.5A, integrated current sense |
| Low-Side Switch | TLE8110ED | DSO-36 | 10-ch, SPI control |
| High-Side Switch | BTS4140N | SOT-223 | 1-ch, 200 mA (tach) |

### Protection & Monitoring

| Function | Part | Package | Notes |
|----------|------|---------|-------|
| External Watchdog | TPS3850G33DRCR | VSON-10 | Window watchdog, 1.6–2.6s |
| eFuse (USB VBUS) | TPS25200DRVT | WSON-6 | 5V, 2.5A, auto-retry |
| Fuse (Battery) | 30A ATO blade | Through-hole | Field-replaceable |

### Memory (Optional)

| Function | Part | Package | Notes |
|----------|------|---------|-------|
| FRAM | MB85RS256BPNF-G-JNERE1 | SOP-8 | 256 Kb, SPI, 10^10 writes |
| External Flash | S25FL256SAGMFI001 | SOIC-16 | 256 Mb, SPI (if needed) |

---

## 3. Passive Components

| Type | Series | Package | Temp | Notes |
|------|--------|---------|------|-------|
| Ceramic Cap (X7R) | Murata GRM / TDK CGA | 0402–1206 | −55°C to +125°C | Automotive series preferred |
| Ceramic Cap (NP0/C0G) | Murata GCM | 0402–0603 | −55°C to +125°C | For timing, RF circuits |
| Tantalum Cap | AVX TPS / Kemet T494 | Various | −55°C to +125°C | Bulk decoupling |
| Electrolytic Cap | Panasonic FK / Nichicon UHE | Radial SMD | −55°C to +105°C | Input bulk |
| Resistor (Thin Film) | Panasonic ERA / Susumu RG | 0402–0805 | −55°C to +155°C | 0.1% for precision dividers |
| Resistor (Thick Film) | Yageo AC / Vishay CRCW | 0402–1206 | −55°C to +155°C | General purpose |
| Inductor | Coilcraft XAL / XEL | SMD | −40°C to +125°C | Shielded power inductors |
| Ferrite Bead | TDK MMZ / Murata BLM | 0402–0805 | −55°C to +125°C | 600 Ω at 100 MHz |
| Crystal 40 MHz | NDK NX5032GA | 5.0×3.2 mm | −40°C to +125°C | 12 pF load |

---

## 4. Supplier Notes

- **Digi-Key / Mouser:** Primary for prototype quantities
- **NXP:** S32K344 — order samples early, lead times long
- **TI:** LMR33630, TPS7A16, DRV8873 — good availability
- **TDK / Murata:** Passives — always multi-source, never single supplier
- **TE Connectivity:** Deutsch connectors — standard automotive, good availability

---

## 5. Component Risks

| Part | Risk | Mitigation |
|------|------|------------|
| S32K344 | Lead time 26+ weeks | Order now. Keep STM32H7 footprint as backup. |
| TLE8888 | Single-source (Infineon/NXP) | Alternative: discrete peak-hold driver |
| CJ125 | Bosch — limited distributors | Stock 10+ units at prototype order |
| ACT45B | TDK — possible EOL | Murata DLW43SH as alternative |
