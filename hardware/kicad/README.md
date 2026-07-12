# 7100CPT ECU — KiCad Project

## Quick Start

```bash
# Open in KiCad 8.0+
kicad-cli pcb open project/ECU.kicad_pro

# Run ERC
kicad-cli sch erc project/ECU.kicad_sch

# Export BOM
kicad-cli sch export python-bom project/ECU.kicad_sch
```

## Project Structure

```
hardware/kicad/
├── DESIGN_PACKAGE.md          ← YOU ARE HERE — hardware delivery index
├── .gitignore
├── project/
│   ├── ECU.kicad_pro          Project file
│   ├── ECU.kicad_sch          Root schematic (12 sheet symbols)
│   ├── 00_Cover.kicad_sch     Revision history, block diagram
│   ├── 01_Power.kicad_sch     Power architecture
│   ├── 02_MCU_Debug_Memory.kicad_sch   S32K344 core
│   ├── 03_CAN.kicad_sch       CAN FD ×4
│   ├── 04_USB.kicad_sch       USB-C interface
│   ├── 05_Inputs_WBO2.kicad_sch        Analog + WBO2
│   ├── 06_Injectors.kicad_sch P&H injector drivers ×8
│   ├── 07_Ignition.kicad_sch  IGBT gate drive ×6
│   ├── 08_Outputs.kicad_sch   ETC, boost, relays, tach
│   ├── 09_Protection.kicad_sch Watchdog, safe state, ESD
│   ├── 10_Connectors.kicad_sch 34-pin + CAN + USB + debug
│   ├── 11_Programming.kicad_sch Boot, SWD, LEDs, test points
│   ├── sym-lib-table          Symbol library config
│   ├── fp-lib-table           Footprint library config
│   ├── fabrication/           Gerbers, drill files (generated)
│   ├── manufacturing/         BOM, PnP, assembly (generated)
│   ├── assembly/              Assembly notes (generated)
│   ├── bom/                   BOM CSV exports (generated)
│   ├── documentation/         Schematic PDF exports (generated)
│   └── 3d/                    STEP models (placeholders)
├── symbols/
│   └── 7100CPT.kicad_sym      Custom symbols
└── footprints/
    └── 7100CPT.pretty/        Custom footprints
        └── README.md          Required footprints list
```

## Design References

All circuit decisions are traceable:

- `../../docs/hardware/REUSE_MATRIX.md` — 41 blocks, NXP reference provenance
- `../../docs/hardware/COMPONENT_SELECTION.md` — Critical BOM with alternates
- `../../docs/hardware/INTERFACE_SPECIFICATION.md` — 34-pin frozen pinout
- `../../docs/hardware/DESIGN_ASSUMPTIONS.md` — 15-20 explicit assumptions

## Status

- **Phase:** 0 Approved (2026-07-03)
- **Schematic:** Skeleton created, components not placed
- **PCB Layout:** Not started
- **ERC:** Not yet run (no components)
- **Next:** Populate sheets with components per REUSE_MATRIX.md

## License

Hardware design: Proprietary (7100CPT Platform)
Firmware: GPL-3.0 (rusEFI upstream)
