# TB-HW-004 — Manufacturing Release

> **Status:** ⬚ Pending (blocked by TB-HW-003)
> **Prerequisite:** TB-HW-003 (PCB Layout)

---

## Objective

Generate complete manufacturing package from TB-HW-003 PCB layout. Ready for PCB fabrication quote.

### Scope

- [ ] Gerber files (RS-274X, all layers)
- [ ] NC drill file (Excellon 2)
- [ ] IPC-356 netlist
- [ ] Pick & Place (CSV, centroid)
- [ ] BOM (CSV with manufacturer part numbers)
- [ ] Assembly drawings (PDF)
- [ ] PCB fabrication notes (per PCB_DESIGN_GUIDE.md §7)
- [ ] Panelization drawing (if production quantity > 5)

### QA Gates

| Gate | Criteria |
|------|----------|
| Gerber Review | All layers present, no errors in Gerber viewer |
| BOM Complete | Every component has MPN, footprint, quantity |
| Fab Notes | Included with Gerbers |
| Quote Ready | Package ready to send to PCBWay/JLCPCB |
