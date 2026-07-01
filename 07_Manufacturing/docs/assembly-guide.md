# 🔧 Assembly Guide

> **Audience:** PCB assembly house (PCBA) technicians and quality engineers
> **Status:** 🔴 Placeholder — populate when hardware design is finalized
> **Hardware revision:** EPC-BASE-01 (prototype)

---

## Overview

This document specifies the assembly process for the ECU printed circuit board assembly (PCBA). It is intended for contract manufacturers (CM) and internal production teams.

**When hardware design is complete, populate the following sections.**

---

## 1. PCB Specifications

| Parameter | Value | Status |
|-----------|-------|--------|
| **Board revision** | — | ❌ Pending |
| **Layers** | 6-layer | ✅ Specified |
| **Material** | High-Tg FR4 (Tg > 170°C) | ✅ Specified |
| **Copper weight** | 1oz signal / 2oz power / 3oz driver | ✅ Specified |
| **Surface finish** | ENIG or HASL | ❌ Pending |
| **PCB thickness** | 1.6mm | ❌ Pending |
| **Standards** | IPC-6012 Class 3 | ✅ Specified |

## 2. Bill of Materials Reference

See [BOM Guide](./bom-guide.md) for the complete bill of materials.

## 3. Assembly Process

### 3.1 Solder Paste Stencil

| Parameter | Value |
|-----------|-------|
| **Stencil thickness** | — |
| **Stencil type** | Laser-cut stainless steel |
| **Apertures** | — |

### 3.2 Component Placement

| Step | Process | Equipment |
|------|---------|-----------|
| 1 | Solder paste printing | — |
| 2 | Top-side SMT placement | Pick-and-place machine |
| 3 | Reflow soldering | Convection reflow oven |
| 4 | Bottom-side SMT (if applicable) | — |
| 5 | Through-hole assembly | Manual or selective solder |
| 6 | Connector soldering | Manual or wave solder |
| 7 | Conformal coating (optional) | — |

### 3.3 Reflow Profile

| Zone | Temperature | Duration |
|------|-------------|----------|
| **Preheat** | — | — |
| **Soak** | — | — |
| **Reflow** | — | — |
| **Cooling** | — | — |

> **Note:** Reflow profile depends on solder paste specification. To be finalized with CM.

## 4. Inspection Criteria

| Inspection | Method | Standard | Acceptance |
|------------|--------|----------|------------|
| Solder paste inspection | SPI | IPC-7525 | — |
| Post-reflow AOI | Automated optical | IPC-A-610 Class 3 | — |
| X-ray (BGA/QFN) | X-ray inspection | IPC-7095 | — |
| Flying probe | Electrical test | IPC-9252 | — |
| Functional test | Custom test jig | — | — |

## 5. Test Points

| Test Point | Signal | Location | Usage |
|------------|--------|----------|-------|
| TP1 | VCC (+5V) | — | Power verification |
| TP2 | GND | — | Reference |
| TP3 | CAN_H | — | CAN bus |
| TP4 | CAN_L | — | CAN bus |
| TP5 | USB_D+ | — | USB |
| TP6 | USB_D- | — | USB |

> **Note:** Test point locations to be defined when PCB layout is complete.

## 6. Programming

| Step | Operation | Tool |
|------|-----------|------|
| 1 | Flash bootloader | — |
| 2 | Flash firmware | — |
| 3 | Program unique device ID | — |
| 4 | Calibration data | — |
| 5 | Final functional test | — |

## 7. Packaging

| Item | Specification |
|------|---------------|
| **ESD protection** | — |
| **Packaging type** | — |
| **Label** | — |
| **Quantity per box** | — |

## 8. Revision History

| Revision | Date | Changes | Author |
|----------|------|---------|--------|
| 0.1 | — | Initial placeholder | — |
