# CAN_DESIGN.md — CAN FD Bus Interface Design

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Reference:** ISO 11898-2 (CAN), ISO 11898-1 (CAN FD), CISPR 25

---

## 1. Interface Requirements

| Parameter | Value |
|-----------|-------|
| Standard | CAN FD (ISO 11898-1:2015) |
| Channels | 4 (2 vehicle bus + 1 diagnostic + 1 spare) |
| Data rate | Up to 8 Mbps (CAN FD), 1 Mbps (CAN 2.0) |
| Bus termination | Split (60Ω || 60Ω + capacitor to GND) |
| Common mode filtering | CM choke on each channel |
| ESD protection | Integrated in transceiver or external |
| Galvanic isolation | Not required for 12V vehicle (common ground) |

---

## 2. Transceiver Selection

### Primary: TJA1043TK (NXP) — CAN FD, 5 Mbps

| Parameter | Value |
|-----------|-------|
| Part | TJA1043TK/1Y |
| Package | HVSON-14 (4.5 × 3 mm) |
| Supply | 5V ± 5% (VCC), 5-28V (VIO) |
| Data rate | Up to 5 Mbps (CAN FD) |
| Bus fault protection | ±58V |
| ESD | ±8 kV (IEC 61000-4-2) |
| Wake-up | Remote wake via CAN bus pattern |
| Standby current | < 5 µA |
| Automotive qualification | AEC-Q100 Grade 1 |

### Alternative: TJA1463 (NXP) — CAN FD SIC, 8 Mbps

For V2 — Signal Improvement Capability (SIC) transceiver. Better signal quality at 8 Mbps data rates. Not needed for V1 prototype.

---

## 3. Channel Configuration

### CAN0 — Primary Vehicle Bus (Powertrain CAN)

```
S32K344
  CAN0_TX (PTB0) ──→ TJA1043 TXD
  CAN0_RX (PTB1) ←── TJA1043 RXD
  GPIO             ──→ TJA1043 STB (standby control)
  GPIO             ←── TJA1043 ERR (error flag)

TJA1043
  CANH ── CM Choke ── 60Ω ──┬── CAN Bus Connector (CAN_H)
  CANL ── CM Choke ── 60Ω ──┬── CAN Bus Connector (CAN_L)
                              │
                         4.7nF (split termination)
                              │
                             GND
```

- **Bit rate:** 1 Mbps CAN 2.0 (primary), 2 Mbps CAN FD (future)
- **Termination:** Split termination (60Ω each to GND via 4.7 nF). Reduces common-mode emissions.
- **CM Choke:** ACT45B-510-2P-TL003 (TDK) or DLW43SH510XK2L (Murata)
  - 51 µH common mode inductance
  - 300 mA rated current
  - 100V insulation
- **ESD:** Integrated in TJA1043 (±8 kV). External PESD2CAN if additional margin required.

### CAN1 — Secondary Vehicle Bus (Body/Chassis CAN)

Identical to CAN0. Uses CAN1 on S32K344 (PTC8/PTC9).

### CAN2 — Diagnostic Connector (OBD-II or Custom)

```
S32K344
  CAN2_TX (PTE4) ──→ TJA1043 TXD
  CAN2_RX (PTE5) ←── TJA1043 RXD

TJA1043
  CANH ── CM Choke ── 60Ω ──┬── 4-pin Deutsch DTM (diag port)
  CANL ── CM Choke ── 60Ω ──┘
```

- **Termination:** Not installed on PCB. External 120Ω terminator provided at diagnostic tool end.
- **Use:** Workshop diagnostics, firmware update, scan tool connection.

### CAN3 — Spare / Future Expansion

Unpopulated by default. Pads for transceiver + CM choke provided. Routing to spare 4-pin connector.

---

## 4. Bus Topology

```
                    ECU (This Design)
                    ┌──────────────────┐
                    │  CAN0 (Powertrain)│
                    │  CAN1 (Body)      │
                    │  CAN2 (Diag)      │
                    │  CAN3 (Spare)     │
                    └──┬───┬───┬───────┘
                       │   │   │
              CAN0 ────┤   │   └──── CAN2 (OBD-II port)
              CAN1 ────────┘
```

**CAN0 and CAN1** connect to vehicle harness via sealed Deutsch connectors.
**CAN2** connects to a diagnostic port (under dash or in engine bay).
**CAN3** reserves pins for future CAN bus (e.g., CAN-to-BLE bridge module).

---

## 5. EMC Design Guidelines

### Radiated Emissions (CISPR 25)

| Measure | Implementation |
|---------|---------------|
| CM choke on each CAN channel | ACT45B-510-2P-TL003 |
| Split termination (60Ω || 60Ω + 4.7nF) | Reduces common-mode current |
| CAN traces as 120Ω differential pair | 5 mil trace, 5 mil spacing (standard for 1.6mm FR4) |
| No stubs on CAN bus | Transceiver placed within 20 mm of connector |
| Ground plane under CAN traces | Continuous reference plane |
| Ferrite bead on transceiver VCC | 600 Ω at 100 MHz |

### Conducted Emissions

| Measure | Implementation |
|---------|---------------|
| Decoupling at transceiver | 100 nF + 10 µF at VCC pin |
| CAN bus filter capacitors | 100 pF to GND on CANH/CANL (near connector) |

---

## 6. Component Selection

| Component | Part Number | Qty (per 4 channels) | Package |
|-----------|------------|---------------------|---------|
| CAN Transceiver | TJA1043TK/1Y | 4 | HVSON-14 |
| CM Choke | ACT45B-510-2P-TL003 | 4 | 1812 SMD |
| Split Termination R | 60Ω, 1%, 0805 | 8 | 0805 |
| Split Termination C | 4.7nF, 50V, X7R | 4 | 0603 |
| VCC Decoupling | 100nF, 50V, X7R | 4 | 0603 |
| VCC Bulk | 10µF, 25V, X7R | 4 | 0805 |
| Bus Filter Cap | 100pF, 50V, NP0 | 8 | 0402 |
| Connector (primary) | Deutsch DTM 4-pin male | 2 | Panel mount |
| Connector (diagnostic) | Deutsch DTM 4-pin female | 1 | Panel mount |

---

## 7. DFM Notes

- CAN transceivers in HVSON-14: exposed pad must be soldered to ground plane for thermal + EMC
- CM chokes in 1812: heavy components — place on bottom layer to avoid tombstoning during reflow
- Split termination resistors: place close to transceiver, not close to connector
- Connector pins: gold-plated — specify 0.5 µm minimum gold thickness for automotive
- CAN traces: impedance-controlled 120Ω differential pair. Verify with PCB manufacturer's stackup calculator.

---

## 8. DFT Notes

- CAN loopback test: transceiver supports loopback mode via STB pin
- Production test: CAN0 → CAN1 external loopback cable. MCU sends on CAN0, verifies receive on CAN1.
- CAN bus termination: verify 60Ω resistance between CANH and CANL with multimeter (power off)
