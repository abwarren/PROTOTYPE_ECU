# USB_DESIGN.md — USB-C Interface Design

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Reference:** USB 2.0 Specification, USB Type-C Specification R2.0

---

## 1. Interface Requirements

| Parameter | Value |
|-----------|-------|
| Standard | USB 2.0 Full Speed (12 Mbps) |
| Connector | USB-C receptacle (16-pin, vertical or mid-mount) |
| Role | Device only (ECU appears as USB CDC ACM to host PC) |
| Power | Self-powered (no VBUS power draw) |
| ESD | IEC 61000-4-2 ±8 kV contact, ±15 kV air |

---

## 2. Connector Pinout

### USB-C Receptacle (Device-Only Wiring)

| Pin | USB-C Signal | Connection | Notes |
|-----|-------------|------------|-------|
| A1 | GND | GND plane | |
| A4 | VBUS | No connect (self-powered) | Pull 5.1k to GND on CC to indicate no power needed |
| A5 | CC1 | 5.1kΩ to GND | Identifies as UFP (device). Enables VBUS from host. |
| A6 | D+ | USB_DP → S32K344 USB0_DP | 22 Ω series |
| A7 | D- | USB_DM → S32K344 USB0_DM | 22 Ω series |
| A8 | SBU1 | No connect | |
| A9 | VBUS | No connect (self-powered) | |
| A12 | GND | GND plane | |
| B1 | GND | GND plane | |
| B4 | VBUS | No connect | |
| B5 | CC2 | 5.1kΩ to GND | Second CC pin (for flipped cable) |
| B6 | D+ | Same USB_DP | Shorted to A6 at connector |
| B7 | D- | Same USB_DM | Shorted to A7 at connector |
| B8 | SBU2 | No connect | |
| B9 | VBUS | No connect | |
| B12 | GND | GND plane | |

**Key decision:** Both CC1 and CC2 must have 5.1kΩ pulldown resistors. This identifies the ECU as a USB device (UFP) to any host, regardless of cable orientation.

---

## 3. ESD Protection

### Device: TPD2EUSB30DRTR

| Parameter | Value |
|-----------|-------|
| Channels | 2 (D+, D-) |
| Working voltage | 5.5V |
| Breakdown voltage | 6.0V min |
| Clamping voltage | 8V at 1A (IEC 61000-4-2 level 4) |
| Capacitance | 0.05 pF (does not degrade USB 2.0 signals) |
| Package | SOT-23 (3-pin) |

**Placement:** As close as possible to the USB-C connector (< 10 mm). D+ and D- traces route through the ESD device before connecting to the MCU.

```
USB-C Connector
    │
    ├── D+ ──┬── TPD2EUSB30 (pin 1) ──┬── 22Ω ── S32K344 USB0_DP
    │        │                        │
    ├── D- ──┼── TPD2EUSB30 (pin 2) ──┼── 22Ω ── S32K344 USB0_DM
    │        │                        │
    │   GND ─┴── TPD2EUSB30 (pin 3)
    │
    ├── CC1 ── 5.1kΩ ─── GND
    ├── CC2 ── 5.1kΩ ─── GND
    │
    └── Shield ── 1MΩ || 100nF ─── GND (AC-coupled chassis)
```

---

## 4. Series Termination

- **22 Ω series resistors** on D+ and D- match USB 2.0 FS impedance (45 Ω ± 10% driver + 22 Ω = ~45 Ω)
- Place resistors within 10 mm of MCU pins
- Resistors: 0402, 1%, thin-film for minimal parasitic inductance

---

## 5. VBUS Monitoring (Optional)

While self-powered, monitoring VBUS tells the MCU when a host is connected:

```
USB-C VBUS ── 100kΩ ──┬── 100kΩ ── GND
                       │
                       ├── GPIO (3.3V-tolerant, detects VBUS presence)
                       │
                       └── 100nF to GND (debounce)
```

- Divider ratio: 100k/(100k+100k) = 0.5. VBUS = 5V → GPIO sees 2.5V (safe for 3.3V tolerant pin).
- MCU software uses VBUS detect to enable USB peripheral.

---

## 6. Component Selection

| Component | Part Number | Qty | Package |
|-----------|------------|-----|---------|
| USB-C Connector | Molex 105450-0101 or JAE DX07S016JA1 | 1 | Mid-mount SMT |
| ESD Protection | TPD2EUSB30DRTR | 1 | SOT-23 |
| CC Resistors | 5.1kΩ, 1%, 0402 | 2 | 0402 |
| Series Resistors | 22Ω, 1%, 0402 | 2 | 0402 |
| VBUS Divider | 100kΩ, 1%, 0402 | 2 | 0402 |

---

## 7. DFM Notes

- USB-C connector requires precise placement (0.15 mm tolerance) for reliable mating
- Mid-mount connector protrudes through enclosure wall — requires gasket for IP67
- Solder fillet inspection critical — USB connectors are high-stress mechanical joints
- Consider conformal coating after assembly for moisture protection
- Test point pads on D+/D- for differential probe during EMC pre-compliance

---

## 8. DFT Notes

- Boundary scan not available on USB pins
- Functional test: connect to host PC, verify CDC ACM enumeration
- Production test fixture: USB-C plug with loopback test points
