# 📋 Bill of Materials Guide

> **Audience:** Procurement, supply chain, assembly house
> **Status:** 🔴 Placeholder — populate when hardware design is finalized

---

## Overview

This document defines the structure, format, and procurement specifications for the ECU bill of materials (BOM). The BOM is the authoritative list of all components required to manufacture one ECU.

**When hardware design is complete, populate the following sections with actual MPNs and sourcing data.**

---

## 1. BOM Format

The BOM is maintained as a CSV file in the hardware repository:

```
hardware/pcb/bom/EPC-BASE-01_BOM.csv
```

### Column Format

| Column | Description | Required |
|--------|-------------|----------|
| **Item #** | Sequential BOM line number | ✅ |
| **Reference** | PCB reference designator (e.g., R1, C2, U3) | ✅ |
| **Qty** | Quantity per board | ✅ |
| **Value** | Component value (e.g., 10k, 100nF, 3.3V) | ✅ |
| **Package** | Footprint (e.g., 0603, SOIC-8, SOT-23) | ✅ |
| **MPN** | Manufacturer part number | ✅ |
| **Manufacturer** | Component manufacturer name | ✅ |
| **Distributor** | Preferred distributor | ✅ |
| **Distributor SKU** | Distributor stock-keeping unit | ✅ |
| **Lead Time** | Typical lead time (weeks) | ✅ |
| **Unit Cost** | Cost per unit at target volume | ✅ |
| **Notes** | Any special considerations | Optional |

## 2. Component Categories

### 2.1 Active Components

| Category | Examples | Sources | Status |
|----------|----------|---------|--------|
| **MCU** | STM32H743 / NXP S32K3 | DigiKey, Mouser, Arrow | ❌ Pending |
| **CAN transceiver** | TJA1040, SN65HVD23x | — | ❌ Pending |
| **Voltage regulators** | 5V, 3.3V, 1.2V | — | ❌ Pending |
| **Injector drivers** | Peak & hold IC | — | ❌ Pending |
| **Ignition IGBTs** | Smart coil drivers | — | ❌ Pending |
| **ETC H-bridge** | Motor driver IC | — | ❌ Pending |
| **Wideband controller** | CJ125, CB131 | — | ❌ Pending |
| **BLE module** | nRF52840 or similar | — | ❌ Pending |

### 2.2 Passive Components

| Category | Examples | Sourcing Priority |
|----------|----------|-------------------|
| **Resistors** | 0402/0603 thick film | Multi-source |
| **Capacitors** | MLCC, electrolytic, tantalum | Multi-source |
| **Inductors** | Power inductors, ferrite beads | Multi-source |

### 2.3 Connectors

| Component | MPN | Distributor | Lead Time |
|-----------|-----|-------------|-----------|
| **Main harness connector** | Deutsch DTM06-42SA | TE / Mouser | — |
| **CAN connector** | Deutsch DTM04-4PA | TE / Mouser | — |
| **USB-C connector** | — | — | — |
| **FAKRA antenna** | — | — | — |

### 2.4 Mechanical

| Component | Specification | Status |
|-----------|---------------|--------|
| **Enclosure** | Aluminum die cast (ADC12) | ❌ Pending |
| **Thermal pads** | — | ❌ Pending |
| **Mounting brackets** | — | ❌ Pending |
| **Screws** | M3/M4 stainless steel | ❌ Pending |

## 3. Volume Pricing Targets

| Volume | Target per-unit BOM cost | Notes |
|--------|--------------------------|-------|
| **100** | — | Prototype quantities, full retail |
| **1,000** | — | Negotiated with distributors |
| **10,000** | — | Direct from manufacturer |

## 4. Preferred Distributors

| Distributor | Account | Lead Time | Notes |
|-------------|---------|-----------|-------|
| **DigiKey** | — | 1-2 days | Bread-and-butter components |
| **Mouser** | — | 1-2 days | Bread-and-butter components |
| **Arrow** | — | Varies | Volume pricing, direct MFG |
| **LCSC** | — | 1-2 weeks | Low-cost passive components |
| **TE Connectivity** | — | 8-12 weeks | Connectors direct |

## 5. Obsolescence Management

| Strategy | Description |
|----------|-------------|
| **Multi-source** | Prefer components with 2+ sources |
| **Drop-in replacements** | Document alternatives for each critical part |
| **Last-time buy** | Plan for EOL notifications |
| **Stock buffer** | Maintain 3-month buffer for critical components |

## 6. Revision History

| Revision | Date | Changes | Author |
|----------|------|---------|--------|
| 0.1 | — | Initial placeholder | — |
