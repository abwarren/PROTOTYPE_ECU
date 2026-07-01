# Development Roadmap

> **DDD Policy:** Every completed task requires documentation updates. See [Definition of Done](./CONTRIBUTING.md).

---

## Phase 1: Foundation ✅ (In Progress)

**Target:** rusEFI fork compiles, branded, documented.

| Task | Status | Docs | Notes |
|------|--------|------|-------|
| Repository structure | ✅ Complete | ✅ | White-label layout |
| Brand abstraction layer | ✅ Complete | ✅ | `branding/brand.json` |
| Root documentation | ✅ Complete | ✅ | 10 documents |
| Research corpus | ✅ Complete | ✅ | Migrated to `research/` |
| Architecture documentation | ✅ Complete | ✅ | 9 neutral docs |
| rusEFI fork | ✅ Complete | ✅ | Commit `8540e44` |
| Architecture audit | ✅ Complete | ✅ | 16 modules verified |
| ADR records | ✅ Complete | ✅ | 4 records |
| DDD policy | ✅ Complete | ✅ | Engineering standard |
| Firmware build | ✅ Complete | ✅ | ARM GCC 12.3, Java 11; f407-discovery builds |
| Brand separation | ❌ Not Started | ⏳ | Trace all rusEFI strings |
| Firmware identity | ❌ Not Started | ⏳ | Versioning, board IDs |
| Configuration profiles | ❌ Not Started | ⏳ | NA, Turbo, etc. |

## Phase 2: Studio v1

**Target:** Modern desktop application with dashboard, calibration, datalogging.

| Task | Status | Docs | Notes |
|------|--------|------|-------|
| Studio scaffold | ❌ | ⏳ | Electron + React + TypeScript |
| Dashboard with live gauges | ❌ | ⏳ | Drag-and-drop widgets |
| Dark mode UI | ❌ | ⏳ | Brand theme from brand.json |
| USB CDC communication | ❌ | ⏳ | Protocol implementation |
| Basic calibration | ❌ | ⏳ | Fuel/ignition table editors |
| Datalogging and export | ❌ | ⏳ | Binary + CSV/MLV |
| Firmware update | ❌ | ⏳ | Via Studio UI |
| Installer packages | ❌ | ⏳ | Windows, macOS, Linux |

## Phase 3: Cloud & Mobile

**Target:** Telemetry, OTA, mobile diagnostics.

| Task | Status | Docs | Notes |
|------|--------|------|-------|
| Cloud scaffold | ❌ | ⏳ | API + auth + device mgmt |
| Telemetry ingestion | ❌ | ⏳ | MQTT + time-series DB |
| OTA infrastructure | ❌ | ⏳ | A/B updates |
| Mobile app | ❌ | ⏳ | BLE diagnostics |

## Phase 4: Production Readiness

**Target:** Hardware prototype, testing, manufacturing.

| Task | Status | Docs | Notes |
|------|--------|------|-------|
| Hardware prototype | ❌ | ⏳ | PCB + enclosure |
| Manufacturing package | ❌ | ⏳ | Gerber, BOM, assembly |
| EMC testing | ❌ | ⏳ | CISPR 25 |
| Functional safety | ❌ | ⏳ | ISO 26262 analysis |

## Phase 5: Proprietary Evolution

**Target:** Independent firmware, AI-assisted tuning, plugin ecosystem.

| Task | Status | Docs | Notes |
|------|--------|------|-------|
| Proprietary algorithms | ❌ | ⏳ | Replace upstream modules |
| Custom RTOS/AUTOSAR | ❌ | ⏳ | Phase 5 |
| AI tuning assistant | ❌ | ⏳ | Reserved panel in Studio |
| Plugin ecosystem | ❌ | ⏳ | Third-party extensions |

---

## Versioning

The platform uses the version string from `branding/brand.json`. Releases follow:

- **Major:** Breaking changes (incompatible protocol, new hardware rev)
- **Minor:** New features (new tuning capability, cloud feature)
- **Patch:** Bug fixes, stability improvements

Version format: `${PRODUCT_SHORT_NAME}-${MAJOR}.${MINOR}.${PATCH}`
