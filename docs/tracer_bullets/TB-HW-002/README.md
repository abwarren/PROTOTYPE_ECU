# TB-HW-002 — KiCad Schematic Capture

> **Status:** ⬚ Pending (blocked by Phase 0 — REUSE_MATRIX.md approval)
> **Prerequisite:** TB-HW-001 (System Engineering Specification) + Phase 0 gate
> **Input:** docs/hardware/*.md (16 specification documents + REUSE_MATRIX.md)
> **Gate:** REUSE_MATRIX.md approved → TB-HW-002 starts

---

## Phase 0 Gate — Do Not Proceed Without

Before any KiCad work, these must be complete:

- [x] REUSE_MATRIX.md created — 41 blocks, source traced, risk assessed
- [ ] REUSE_MATRIX.md approved — all rows signed off (Engineering + Peer + QA)
- [x] INTERFACE_SPECIFICATION.md reconciled to 34-pin
- [x] 12-sheet hierarchical structure defined
- [ ] S32K344 reference-following policy in PROJECT_RULES.md
- [ ] All existing docs/hardware/*.md verified against REUSE_MATRIX.md

**Policy:** No KiCad schematic work begins until Phase 0 is approved. This
prevents design drift from NXP reference without conscious decisions.

---

## Objective

Create a complete, reviewable KiCad hierarchical schematic from the TB-HW-001
engineering specification and Phase 0 REUSE_MATRIX.md.

## Scope

### Deliverables

- [ ] `hardware/kicad/project/ECU.kicad_pro` — KiCad project file
- [ ] `hardware/kicad/project/ECU.kicad_sch` — Root schematic with 12 hierarchical sheets
- [ ] ERC report — clean (0 errors, 0 warnings)
- [ ] Netlist (IPC-356 format)
- [ ] Schematic PDF (archived in evidence/)

### Hierarchical Sheets (12)

| Sheet | Contents | Reference Doc | Reuse |
|-------|----------|---------------|-------|
| 00_Cover | Revision history, block diagram, design notes, REUSE_MATRIX.md reference | SYSTEM_ARCHITECTURE.md, REUSE_MATRIX.md | — |
| 01_Power | Reverse polarity, TVS, buck (6-36V→5V), LDO (5V→3.3V), VREF 5.0V, power sequencing, reset | POWER_ARCHITECTURE.md | Blocks P1-P7 |
| 02_MCU | S32K344 core, clock (40MHz + 32.768kHz), boot config, decoupling, debug header (SWD) | MCU_SELECTION.md | Blocks C1-C8 |
| 03_CAN | CAN FD ×4 (TJA1043), CM chokes, split termination | CAN_DESIGN.md | Blocks COM1-COM4 |
| 04_USB | USB-C device, TPD2EUSB30 ESD, CC resistors, Ethernet PHY footprint (unpop) | USB_DESIGN.md | Blocks COM5-COM8 |
| 05_Inputs | Analog inputs (TPS, MAP, CLT, IAT, fuel press), WBO2 (CJ125), knock, protection | PROTECTION_CIRCUITS.md, INTERFACE_SPECIFICATION.md | Blocks S1-S5 |
| 06_Injectors | Injector ×8 (TLE8888 peak & hold), current sense, diagnostic SPI | PROTECTION_CIRCUITS.md | Block O1 |
| 07_Ignition | Ignition ×6 (IGBT gate drive), overcurrent protection | PROTECTION_CIRCUITS.md | Block O2 |
| 08_Outputs | ETC H-bridge (DRV8873 ×2), boost solenoid, relay drivers (×2 low-side), tach output | PROTECTION_CIRCUITS.md | Blocks O3-O6 |
| 09_Protection | Watchdog (TPS3850), safe-state FET, ESD, fuse, overcurrent | PROTECTION_CIRCUITS.md | Blocks PR1-PR4 |
| 10_Connectors | 34-pin main, CAN (×2), USB-C, debug header, expansion header | INTERFACE_SPECIFICATION.md | Blocks M1-M3 |
| 11_Programming | Boot config, programming header, status LEDs, test points | MCU_SELECTION.md | Blocks C6-C7 |

### What Changed From V1 (9 Sheets)

- 02_MCU absorbs Debug and Memory (too thin as standalone sheets)
- 04_USB absorbs Ethernet PHY footprint (unpopulated, belongs near USB)
- 05_Inputs absorbs WBO2 (they share the same analog front-end topology)
- 06_Injectors and 07_Ignition split from Outputs (high-risk custom blocks deserve dedicated sheets)
- 08_Outputs consolidates remaining low-power outputs
- 09_Protection is its own sheet (safety-critical, must be reviewable in isolation)
- 10_Connectors covers all external interfaces in one place
- 11_Programming covers LEDs, test points, boot config — items used during manufacturing

### Schematic Rules

1. **Every component has a documented purpose** — traceable to TB-HW-001 and REUSE_MATRIX.md row
2. **No floating nets** — every pin connected or explicitly marked NC
3. **Power flags on all power nets** — ERC requires this
4. **No duplicate references** — unique designator per component
5. **All hierarchical labels connected** — sheet-to-sheet consistency
6. **ERC clean before commit** — 0 errors, 0 warnings

### Schematic Treated as Code

- KiCad files are text (S-expression format) — git diff works
- .kicad_sch files committed to repository
- .kicad_pro committed to repository
- Symbol libraries: project-local (`hardware/kicad/symbols/`)
- Footprint libraries: project-local (`hardware/kicad/footprints/`)
- `.gitignore`: *.bak, *-backups, *.zip, fp-info-cache

### Before Schematic Is Complete

- [ ] ERC passes (0 errors, 0 warnings)
- [ ] No floating power pins
- [ ] Net classes defined (Default, Power, CAN, USB, High-Current)
- [ ] CAN differential pairs defined (120Ω)
- [ ] USB differential pair defined (90Ω)
- [ ] MCU decoupling reviewed per datasheet (REUSE_MATRIX.md C2)
- [ ] Crystal placement reviewed (guard ring, no traces underneath — per AN13537)
- [ ] Boot mode verified (BOOT_CFG0/1 tied correctly)
- [ ] Debug connector verified (SWDIO, SWCLK, RESET, VTref, GND)
- [ ] All connectors have pinout labels matching INTERFACE_SPECIFICATION.md (34-pin rev)
- [ ] Every "New Design" and "Adapt" block in REUSE_MATRIX.md has been peer-reviewed

---

## QA Gates

| Gate | Criteria |
|------|----------|
| Phase 0 Approved | REUSE_MATRIX.md fully signed off |
| ERC Clean | 0 errors, 0 warnings |
| Hierarchical Integrity | All sheets connected, no orphan labels |
| Power Tree Verified | Every rail documented, no back-feeding |
| Component Traceability | Every component traceable to REUSE_MATRIX.md row |
| NXP Reference Compliance | No deviation from NXP reference without REUSE_MATRIX.md entry |
| Documentation Sync | Schematic matches INTERFACE_SPECIFICATION.md (34-pin) |
| Git Committed | All .kicad_sch, .kicad_pro, symbol/footprint libs committed |
