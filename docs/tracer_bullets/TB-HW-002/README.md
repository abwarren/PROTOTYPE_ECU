# TB-HW-002 — KiCad Schematic Capture

> **Status:** ⬚ Pending (blocked by TB-HW-001 complete)
> **Prerequisite:** TB-HW-001 (System Engineering Specification)
> **Input:** docs/hardware/*.md (16 specification documents)

---

## Objective

Create a complete, reviewable KiCad hierarchical schematic from the TB-HW-001 engineering specification.

## Scope

### Deliverables

- [ ] `hardware/ECU.kicad_pro` — KiCad project file
- [ ] `hardware/ECU.kicad_sch` — Root schematic with 10 hierarchical sheets
- [ ] ERC report — clean (0 errors, 0 warnings)
- [ ] Netlist (IPC-356 format)
- [ ] Schematic PDF (archived in evidence/)

### Hierarchical Sheets

| Sheet | Contents | Reference Doc |
|-------|----------|---------------|
| 00_Cover | Revision history, block diagram, design notes | SYSTEM_ARCHITECTURE.md |
| 01_Power | Reverse polarity, TVS, buck, LDO, VREF, sequencing, reset | POWER_ARCHITECTURE.md |
| 02_MCU | S32K344, clock, boot config, decoupling, debug header | MCU_SELECTION.md |
| 03_CAN | CAN FD ×4 (TJA1043), CM chokes, split termination | CAN_DESIGN.md |
| 04_USB | USB-C device, TPD2EUSB30 ESD, CC resistors | USB_DESIGN.md |
| 05_Inputs | Analog inputs, WBO2 (CJ125), knock, protection | PROTECTION_CIRCUITS.md |
| 06_Outputs | Injectors (TLE8888), ignition (IGBT), ETC (DRV8873), relays | PROTECTION_CIRCUITS.md |
| 07_Protection | Watchdog (TPS3850), safe-state FET, ESD, fuses | PROTECTION_CIRCUITS.md |
| 08_Memory | External Flash/FRAM (optional), EEPROM | MCU_SELECTION.md |
| 09_Connectors | 42-pin main, CAN (×3), USB-C, debug header | INTERFACE_SPECIFICATION.md |

### Schematic Rules

1. **Every component has a documented purpose** — traceable to TB-HW-001
2. **No floating nets** — every pin connected or explicitly marked NC
3. **Power flags on all power nets** — ERC requires this
4. **No duplicate references** — unique designator per component
5. **All hierarchical labels connected** — sheet-to-sheet consistency
6. **ERC clean before commit** — 0 errors, 0 warnings

### Schematic Treated as Code

- KiCad files are text (S-expression format) — git diff works
- .kicad_sch files committed to repository
- .kicad_pro committed to repository
- Symbol libraries: project-local, not global
- Footprint libraries: project-local, not global
- `.gitignore`: *.bak, *-backups, *.zip, fp-info-cache

### Before Schematic Is Complete

- [ ] ERC passes (0 errors, 0 warnings)
- [ ] No floating power pins
- [ ] Net classes defined (Default, Power, CAN, USB, High-Current)
- [ ] CAN differential pairs defined (120Ω)
- [ ] USB differential pair defined (90Ω)
- [ ] MCU decoupling reviewed per datasheet
- [ ] Crystal placement reviewed (guard ring, no traces underneath)
- [ ] Boot mode verified (BOOT_CFG0/1 tied correctly)
- [ ] Debug connector verified (SWDIO, SWCLK, RESET, VTref, GND)
- [ ] All connectors have pinout labels matching INTERFACE_SPECIFICATION.md

---

## QA Gates

| Gate | Criteria |
|------|----------|
| ERC Clean | 0 errors, 0 warnings |
| Hierarchical Integrity | All sheets connected, no orphan labels |
| Power Tree Verified | Every rail documented, no back-feeding |
| Component Traceability | Every component traceable to TB-HW-001 rationale |
| Documentation Sync | Schematic matches specification docs |
| Git Committed | All .kicad_sch, .kicad_pro, symbol/footprint libs committed |
