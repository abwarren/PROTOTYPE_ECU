# 🏭 Supplier List

> **Audience:** Procurement, supply chain management
> **Status:** 🔴 Placeholder — populate when hardware designs are finalized and sourcing begins
> **Last updated:** 2026-06-30

---

## Overview

This document lists all qualified suppliers for ECU manufacturing. Suppliers are categorized by capability and qualification status.

## Supplier Qualification Criteria

| Criteria | Requirement | Verification |
|----------|-------------|--------------|
| **IATF 16949** | Required for production | Certificate on file |
| **IPC 6012 Class 3** | Required for PCB | Capability statement |
| **ISO 9001** | Minimum for prototype | Certificate on file |
| **English support** | Required | Communication test |
| **MOQ < 100** | Prototype phase | RFQ response |
| **MOQ < 500** | Production phase | RFQ response |
| **Lead time < 2 weeks** | Prototype phase | RFQ response |
| **Yield > 99%** | Production phase | Quality data |

---

## PCB Fabrication

| Supplier | Location | Capability | Lead Time | Status |
|----------|----------|------------|-----------|--------|
| **JLCPCB** | China | 2-6 layer, HASL/ENIG | 3-5 days | ✅ Approved (prototype) |
| **PCBWay** | China | 2-10 layer, advanced | 5-7 days | ✅ Approved (prototype) |
| **Kinwong** | China | 4-20 layer, automotive | 2-3 weeks | 🟡 Under evaluation |
| — | — | — | — | 🔴 Need to qualify |

**PCB specs required:** 6 layers, High-Tg FR4, 1oz/2oz/3oz copper, IPC-6012 Class 3.

---

## PCBA Assembly

| Supplier | Location | Capability | Lead Time | Status |
|----------|----------|------------|-----------|--------|
| **JLCPCB (SMT)** | China | Basic SMT assembly | 5-7 days | ✅ Approved (prototype) |
| **PCBWay (SMT)** | China | Full SMT, THT, conformal | 7-10 days | ✅ Approved (prototype) |
| — | — | — | — | 🔴 Need to qualify for production |

**Assembly specs required:** SMT + THT, AOI, X-ray (BGA), conformal coating, functional test.

---

## Component Distributors

| Supplier | Focus | Payment Terms | Account | Status |
|----------|-------|---------------|---------|--------|
| **DigiKey** | Broad line, fast | Net 30 | ❌ Not set up | ✅ Priority |
| **Mouser** | Broad line, fast | Net 30 | ❌ Not set up | ✅ Priority |
| **Arrow** | Volume, direct MFG | Net 30 | ❌ Not set up | 🟡 Needed for production |
| **LCSC** | Low-cost passives | Prepaid | ❌ Not set up | 🟡 Secondary |
| **TE Connectivity** | Connectors | Net 30 | ❌ Not set up | 🟡 Contact for production |

---

## Enclosure Manufacturing

| Supplier | Location | Process | Lead Time | Status |
|----------|----------|---------|-----------|--------|
| **Protolabs** | USA/Global | CNC, 3D printing | 3-5 days | ✅ Approved (prototype) |
| — | — | Die casting | 4-6 weeks | 🔴 Need to qualify |

**Enclosure specs:** Aluminum die cast (ADC12), IP67, thermal pads.

---

## Testing & Certification

| Service | Provider | Status | Notes |
|---------|----------|--------|-------|
| **EMC pre-scan** | Local lab | 🔴 Not engaged | Required for CISPR 25 |
| **EMC full cert** | TÜV / Intertek | 🔴 Not engaged | Required for production |
| **Environmental testing** | — | 🔴 Not engaged | ISO 16750 |
| **Functional safety** | — | 🔴 Not engaged | ISO 26262 (Phase 4) |

---

## Contact Log

| Date | Supplier | Contact | Result |
|------|----------|---------|--------|
| — | — | — | — |

---

## Revision History

| Revision | Date | Changes | Author |
|----------|------|---------|--------|
| 0.1 | 2026-06-30 | Initial placeholder with structure | — |
