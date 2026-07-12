# COMPLIANCE_MATRIX.md — Automotive Standards Compliance

> **Designer:** Lead Hardware Design Engineer
> **Date:** 2026-07-01
> **Purpose:** Map every applicable automotive standard to design implementation.
> **Status:** V1 Prototype — pre-compliance guidance. Production will require formal testing.

---

## 1. Standards Coverage

| Standard | Title | Scope | Status |
|----------|-------|-------|--------|
| ISO 16750-2 | Road vehicles — Environmental conditions (Electrical loads) | Power input, load dump, transients | ✅ Designed |
| ISO 7637-2 | Road vehicles — Electrical disturbances (Conducted transients) | Transients on supply + I/O lines | ✅ Designed |
| ISO 26262 | Road vehicles — Functional safety | System-level safety integrity | ⚠️ Preliminary |
| CISPR 25 | Vehicles — Radio disturbance characteristics | Radiated + conducted emissions | ✅ Guided |
| IEC 61000-4-2 | EMC — Electrostatic discharge immunity | ESD on connectors | ✅ Designed |
| IPC-2221 | Generic standard on printed board design | PCB design rules | ✅ Guided |
| IPC-7351 | Generic requirements for SMD land pattern | Footprint design | ✅ Following |
| IPC-A-610 | Acceptability of electronic assemblies | Assembly quality | 📋 Production |
| IPC-6012 | Qualification of rigid printed boards | PCB fabrication quality | 📋 Production |
| IATF 16949 | Automotive quality management | Manufacturing process | 📋 Future |
| ISO/SAE 21434 | Road vehicles — Cybersecurity engineering | Secure boot, firmware signing | ⚠️ Future |

---

## 2. Detailed Compliance

### ISO 16750-2 — Electrical Loads

| Clause | Requirement | Implementation | Status |
|--------|-------------|---------------|--------|
| §4.2 | Supply voltage range 6–36V | Buck converter 3–60V input range. P-MOSFET reverse protection. | ✅ |
| §4.3 | Overvoltage 18V (12V system) for 60 min | All components rated ≥ 25V. Buck survives 18V indefinitely. | ✅ |
| §4.4 | Superimposed alternating voltage 2Vpp, 50Hz–20kHz | Input filter: 47µF electrolytic + 10µF ceramic. Buck PSRR > 60dB. | ✅ |
| §4.5 | Slow decrease/increase of supply voltage | Brown-out detect at 2.7V. Safe state before shutdown. | ✅ |
| §4.6 | Discontinuities in supply (voltage dips) | Hold-up: 100µF on 5V rail gives ~5ms hold-up at 500mA. Reset on dip below 6V. | ✅ |
| §4.7 | Short circuit protection | Fuse on input. Current limit on every output driver. | ✅ |
| §4.8 | Load dump (12V: 87V/400ms, 24V: 174V/350ms) | SMCJ33A TVS clamps to 53V. 60V-rated buck survives. | 🟡 Verify TVS energy rating at max alt current |
| §5.x | Reverse voltage (-14V/60s) | P-MOSFET ideal diode blocks. No reverse current path. | ✅ |
| §7.x | Open circuit tests | All inputs have pull-up/pull-down. All outputs tolerate open load. | ✅ |
| §8.x | Short circuit tests | Fused input. Current-limited outputs. Diagnostic feedback to MCU. | ✅ |

### ISO 7637-2 — Conducted Transients

| Pulse | Description | Implementation | Status |
|-------|-------------|---------------|--------|
| 1 | Inductive load disconnect (−100V, 2ms) | TVS clamps to −0.7V (forward biased). Input cap absorbs energy. | ✅ |
| 2a | Inductive load disconnect on parallel device (+50V, 50µs) | TVS clamps to 53V. Buck survives. | ✅ |
| 2b | DC motor acting as generator (+10V, 0.5s) | Buck input range to 60V. No action needed. | ✅ |
| 3a/3b | Switching transients (−150V/+100V, 100ns) | TVS + input filter. Ferrite bead on input. | ✅ |
| 4 | Starter motor cranking (6V dip, 15ms) | Hold-up capacitors maintain MCU operation through dip. | ⚠️ Verify hold-up time at max load |
| 5a | Load dump (87V/400ms) | TVS SMCJ33A + 60V buck. | 🟡 Verify TVS pulse rating |

### CISPR 25 — Radiated/Conducted Emissions

| Band | Frequency | Limit (Class 3) | Design Measure |
|------|----------|-----------------|----------------|
| LW | 150 kHz–300 kHz | 66–56 dBµV/m | Shielded inductor in buck converter |
| MW | 530 kHz–2 MHz | 56–50 dBµV/m | 400 kHz switching freq — avoid AM band |
| SW | 5.9 MHz–6.2 MHz | 46 dBµV/m | Ferrite beads on I/O lines |
| FM | 76 MHz–108 MHz | 36 dBµV/m | CM chokes on CAN. Shielded inductors. |
| TV | 180 MHz–220 MHz | 36 dBµV/m | Ground plane integrity. No slots. |
| UHF | 380 MHz–1 GHz | 42 dBµV/m | Small loop area on switching nodes. Snubbers. |

**Key Design Measures:**
- 6-layer PCB with continuous ground plane (Layer 2)
- Buck converter switching frequency > 300 kHz (above AM band)
- All switching nodes — minimum loop area, snubber if needed
- CAN bus: CM choke + split termination
- USB: routed as 90Ω differential pair
- Enclosure: aluminum — natural EMI shield (requires gasket at seams)

### IEC 61000-4-2 — ESD

| Level | Voltage (Contact) | Voltage (Air) | Test Points | Protection |
|-------|--------------------|---------------|-------------|------------|
| 1 | ±2 kV | ±2 kV | — | Baseline |
| 2 | ±4 kV | ±4 kV | All connectors | TVS + clamp diodes |
| 3 | ±6 kV | ±8 kV | USB, CAN, diag | Dedicated ESD devices |
| 4 | ±8 kV | ±15 kV | USB (customer-facing) | TPD2EUSB30 on USB D+/D- |

### ISO 26262 — Functional Safety

| ASIL | Function | Goal | Status |
|------|----------|------|--------|
| QM | Telemetry, logging, firmware update | No safety goal | ✅ |
| ASIL B | Fuel control, ignition control | Prevent unintended acceleration | ⚠️ Preliminary |
| ASIL C | Electronic throttle control | Prevent unintended acceleration, loss of throttle control | ⚠️ Preliminary |
| ASIL D | — | Not targeted for V1 | 📋 Future |

**S32K344 Capability:** ASIL-D hardware. Dual-core lockstep provides hardware fault detection. Software must implement safety mechanisms per ISO 26262 Part 6.

**For V1 Prototype:** No formal ISO 26262 certification. Design follows safety architecture principles (watchdog, dual TPS, fail-safe outputs). Formal safety case deferred to V2 production.

---

## 3. Manufacturing Standards

### IPC-2221 — PCB Design

| Requirement | Implementation |
|-------------|---------------|
| Conductor spacing | 0.15 mm minimum (inner layers), 0.2 mm minimum (outer) for 12V |
| Creepage for 12V | 0.4 mm minimum (uncoated) |
| Creepage for 48V (CAN transient) | 0.8 mm minimum |
| Annular ring | 0.1 mm minimum (IPC Class 3) |
| Thermal relief | All pads connected to plane with 4-spoke thermal relief |
| Test points | 1.0 mm diameter pads on bottom layer for flying probe |

### IPC-7351 — Land Patterns

- All footprints follow IPC-7351B density level B (nominal)
- Courtyard: 0.25 mm clearance for automated assembly
- Paste mask: 1:1 scale (no reduction)
- Solder mask: 0.1 mm expansion from pad

### IATF 16949 — Manufacturing Quality (Future)

For production:
- PPAP (Production Part Approval Process) Level 3
- FMEA (Design + Process)
- SPC (Statistical Process Control) on critical dimensions
- MSA (Measurement System Analysis) for test equipment
- Supplier quality agreements for all AEC-Q components

---

## 4. Open Risks

| # | Risk | Severity | Mitigation | Status |
|---|------|----------|------------|--------|
| C-001 | Load dump TVS energy rating not validated | Medium | Verify SMCJ33A can handle 100A alternator load dump. May need larger package (5.0SMDJ). | 🟡 Open |
| C-002 | CISPR 25 conducted emissions not pre-tested | Medium | Pre-compliance scan at EMC lab before PCB fab. Budget $2K. | 🟡 Open |
| C-003 | No formal ISO 26262 safety case | High | Not required for V1 prototype. Design follows safety principles. Formal case before production. | 📋 Deferred |
| C-004 | ISO 7637-2 pulse 4 (cranking) hold-up time | Medium | Verify hold-up caps maintain 5V/3.3V through 15ms dip at max load. | 🟡 Open |
| C-005 | IPC-6012 Class 3 requires 100% electrical test | Low | Standard for all PCB fabrication. Specify in Gerber notes. | ✅ |
| C-006 | Aluminum enclosure EMI gasket required | Medium | Gasket between PCB ground and enclosure at connector areas. Specify in mechanical design. | 🟡 Open |
