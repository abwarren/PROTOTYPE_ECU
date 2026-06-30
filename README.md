# 🏢 ECU Platform Core

**The digital headquarters for a next-generation automotive ECU platform.**

This repository is the single source of truth for the entire platform — engineering, management, investor relations, workshop operations, and manufacturing. Everything lives here.

---

## 🧭 Quick Navigation

```
👨‍💼 Management    → docs/management/   → "What's the status?"
👨‍💻 Engineering   → docs/engineering/  → "How do I build it?"
💼 Investors      → docs/investor/     → "Why should I invest?"
👨‍🔧 Workshop     → docs/workshop/     → "How do I install it?"
🏭 Manufacturing  → docs/manufacturing/ → "How do I make it?"
```

---

## 🚀 What We're Building

A **white-label, cloud-connected ECU platform** for the automotive performance market.

| Component | Description | Status |
|-----------|-------------|--------|
| **ECU Firmware** | Engine control based on proven rusEFI foundation | 🟡 In progress |
| **Prototype Studio** | Modern desktop tuning application | 🟡 Planning |
| **Cloud Platform** | Telemetry, OTA, fleet management | ⚪ Future |
| **Mobile App** | BLE diagnostics companion | ⚪ Future |
| **Custom Hardware** | Professional ECU PCB + enclosure | ⚪ Future |

See [Project Status](./PROJECT_STATUS.md) for detailed progress.

---

## 📋 Current State

| Metric | Value |
|--------|-------|
| **Phase** | Phase 1 — Foundation (Day 1) |
| **Overall Progress** | 18% ██████░░░░░░░░░░░░░░░░░░░ |
| **Documentation** | 68% ██████████████████░░░░░░ |
| **Firmware** | 22% ██████░░░░░░░░░░░░░░░░░ |
| **rusEFI Upstream** | Commit `8540e44` (June 30, 2026) |
| **Build Toolchain** | ARM GCC 10.3 ✅ — Java needed ❌ |

---

## 👨‍💼 For Management

| Document | What You'll Find |
|----------|------------------|
| [Executive Dashboard](./docs/management/Executive_Dashboard.md) | 📊 One-page progress, risks, blockers, next actions |
| [KPIs](./docs/management/KPIs.md) | 📈 Key metrics tracked weekly |
| [Risk Register](./docs/management/Risk_Register.md) | ⚠️ 10 tracked risks with mitigations |
| [Company Roadmap](./docs/management/Company_Roadmap.md) | 🗺️ 6-phase strategy through 2029 |
| [Current Sprint](./docs/management/Current_Sprint.md) | 🏃 Sprint backlog and burndown |
| [Budget](./docs/management/Budget.md) | 💰 Pre-seed budget allocation |

---

## 👨‍💻 For Engineers

| Resource | Location |
|----------|----------|
| Architecture overview | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Build instructions | [BUILD.md](./BUILD.md) |
| Engineering standards | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Architecture decisions | [ADR/](./ADR/) |
| Module documentation | [docs/firmware/](./docs/firmware/) |
| Tech debt tracker | [TECH_DEBT.md](./TECH_DEBT.md) |
| Onboarding guide | [docs/onboarding/new-engineer-guide.md](./docs/onboarding/new-engineer-guide.md) |
| Daily engineering logs | [docs/history/](./docs/history/) |
| Research corpus | [research/](./research/) |

---

## 💼 For Investors

**Start here:** [Executive Summary](./docs/investor/Executive_Summary.md)

| Document | Read Time |
|----------|-----------|
| [Problem](./docs/investor/Problem.md) — What market gap we're solving | 5 min |
| [Solution](./docs/investor/Solution.md) — Product and architecture | 10 min |
| [Market](./docs/investor/Market.md) — $2.5B TAM analysis | 10 min |
| [Business Model](./docs/investor/Business_Model.md) — Revenue streams | 5 min |
| [Competitive Advantages](./docs/investor/Competitive_Advantages.md) — Our moat | 5 min |
| [FAQ](./docs/investor/FAQ.md) — Common questions | 5 min |
| [Monthly Report](./docs/reports/Monthly_Report_Template.md) | — |

**Total investor reading time:** ~45 minutes

---

## 👨‍🔧 For Workshop Technicians

| Guide | What You'll Learn |
|-------|-------------------|
| [Installation Guide](./docs/workshop/Installation_Guide.md) | Step-by-step ECU install |
| [Tuning Guide](./docs/workshop/Tuning_Guide.md) | Complete tuning workflow |
| [Firmware Flash Guide](./docs/workshop/Firmware_Flash_Guide.md) | Flashing and recovery |
| [Technician Checklist](./docs/workshop/Technician_Checklist.md) | Pre/post-install checklist |
| [Vehicle Support Matrix](./docs/workshop/Vehicle_Support_Matrix.md) | Supported engines and patterns |

---

## 🏭 For Manufacturing Partners

| Document | Status |
|----------|--------|
| [Assembly Guide](./docs/manufacturing/assembly-guide.md) | 🔴 Populate when hardware designs are ready |
| [BOM Guide](./docs/manufacturing/bom-guide.md) | 🔴 Populate when hardware designs are ready |
| [Supplier List](./docs/manufacturing/supplier-list.md) | 🔴 Populate when hardware designs are ready |

---

## 🎯 Key Features

- **White-label from day one** — Rebrand via `branding/brand.json`, zero code changes
- **Proven firmware foundation** — Based on 10+ years of rusEFI development
- **Modern desktop application** — Prototype Studio with dark mode, animations, dockable widgets
- **Cloud-connected** — Telemetry, OTA updates, remote diagnostics, fleet management
- **AI-ready** — Reserved panel for future AI-assisted tuning
- **Plugin ecosystem** — Extensible via third-party plugins

---

## 📦 Repository Structure

```
├── branding/       # Brand assets (logos, icons, themes, fonts)
├── firmware/       # ECU firmware (upstream rusEFI fork)
│   ├── upstream/   # Unmodified rusEFI reference (commit 8540e44)
│   └── platform/   # Platform firmware modifications
├── studio/         # Desktop tuning application
├── cloud/          # Cloud platform services
├── mobile/         # Mobile companion app
├── hardware/       # PCB and enclosure designs
├── docs/           # Complete knowledge base (five audiences)
├── research/       # Technical research corpus
├── ADR/            # Architecture Decision Records
├── branding/       # Single-source brand configuration
├── scripts/        # Build and automation scripts
└── tests/          # Integration and system tests
```

---

## 🧭 How to Navigate

```
New here?  → docs/onboarding/new-engineer-guide.md
Building?  → BUILD.md + docs/engineering/
Investing? → docs/investor/Executive_Summary.md
Managing?  → docs/management/Executive_Dashboard.md
Installing?→ docs/workshop/Installation_Guide.md
```

---

## 📄 License

See [LICENSE_NOTES.md](./LICENSE_NOTES.md). The firmware is GPL-3.0 (upstream rusEFI);
the Studio, Cloud, and Mobile applications are proprietary.
