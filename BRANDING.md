# BRANDING.md — 7100CPT Product Identity

> **Version:** 2.0.0
> **Date:** 2026-07-03
> **Policy:** This document is the single source of truth for product naming.

---

## Product Identity

| Field | Value |
|-------|-------|
| **Commercial Product Name** | 7100CPT |
| **Product Family** | 7100CPT ECU, 7100CPT Studio, 7100CPT Cloud |
| **Development Codename** | Prototype (deprecated as of 2026-07-03) |
| **Company** | ECU Platform |

---

## Naming Convention

Use **7100CPT** for all current development:

| Context | Use | Example |
|---------|-----|---------|
| UI text | 7100CPT Studio | Window title, loading screen |
| Documentation | 7100CPT | README, architecture docs, tracer bullets |
| Code comments | 7100CPT | Module headers, architecture diagrams |
| API | 7100CPT | Service names, identifiers |
| Git | 7100CPT | Commit messages, branch names |
| Marketing | 7100CPT | Investor docs, website |

**"Prototype" is reserved for:**

- Historical ADRs (unchanged)
- Historical commit messages (unchanged)
- Git history (unchanged)
- References to the development phase ("during prototype development")

---

## Transition

The repository transitioned from "Prototype" to "7100CPT" on 2026-07-03.

All current documentation has been updated. Historical documents (ADRs,
release notes, investor reports) retain original "Prototype" references
as a record of the development timeline.

---

## Product Line

```
7100CPT Platform
 ├── 7100CPT ECU        — Hardware (NXP S32K344 based)
 ├── 7100CPT Studio     — Desktop tuning application
 ├── 7100CPT Cloud      — Cloud platform (future)
 └── 7100CPT Mobile     — Mobile companion (future)
```

---

## Software Architecture Identity

```
7100CPT Studio
        │
        ▼
EcuService
        │
        ▼
EcuProtocol (interface)
        ▲
        │
RusEFIProtocolAdapter
        │
        ▼
UsbTransport
        │
        ▼
rusEFI Firmware
```
