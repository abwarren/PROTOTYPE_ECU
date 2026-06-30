# 📚 Knowledge Base

> **The repository is the single source of truth for the entire platform.**
> Organized by audience — find what you need in seconds.

---

## 👨‍💼 Management

*For project leads, founders, and decision makers.*

| Document | Purpose |
|----------|---------|
| [Executive Dashboard](management/Executive_Dashboard.md) | 📊 Single-page overview — progress, risks, blockers, next actions |
| [KPIs](management/KPIs.md) | 📈 Key performance indicators tracked weekly |
| [Risk Register](management/Risk_Register.md) | ⚠️ Active risks with scores, owners, and mitigations |
| [Company Roadmap](management/Company_Roadmap.md) | 🗺️ 6-phase company strategy (2026-2029) |
| [Milestones](management/../ROADMAP.md) | 🎯 Key dates and deliverables |
| [Current Sprint](management/Current_Sprint.md) | 🏃 Sprint backlog, burndown, and blockers |
| [Deliverables](management/Deliverables.md) | 📦 Complete deliverable tracking by phase |
| [Dependencies](management/Dependencies.md) | 🔗 Cross-team dependency graph |
| [Budget](management/Budget.md) | 💰 Budget tracking and runway |
| [PROJECT_STATUS.md](../PROJECT_STATUS.md) | Overall completion by subsystem |
| [DECISIONS.md](../DECISIONS.md) | Architecture decision index |

## 👨‍💻 Engineering

*For engineers building the platform.*

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](../ARCHITECTURE.md) | System architecture overview |
| [BUILD.md](../BUILD.md) | Build instructions and toolchain |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | DDD policy, coding standards, PR process |
| [ADR](../../ADR/) | Architecture Decision Records |

### Architecture Docs

| Document | Purpose |
|----------|---------|
| [Firmware Architecture](firmware-architecture.md) | Firmware layer architecture |
| [Studio Architecture](studio-architecture.md) | Desktop application architecture |
| [Cloud Architecture](cloud-architecture.md) | Cloud platform architecture |
| [Mobile Architecture](mobile-architecture.md) | Mobile application architecture |
| [Hardware Architecture](hardware-architecture.md) | Hardware PCB and enclosure architecture |
| [Bootloader Architecture](bootloader-architecture.md) | Bootloader and update architecture |
| [Security Architecture](security-architecture.md) | Security and compliance architecture |
| [Protocol Architecture](protocol-architecture.md) | Communication protocol design |
| [rusEFI Audit](rusefi-architecture-audit.md) | Architecture audit of all 16 firmware modules |

### Module Documentation

| Module | Doc |
|--------|-----|
| Fuel | [firmware/fuel.md](firmware/fuel.md) |
| Ignition | [firmware/ignition.md](firmware/ignition.md) |
| Trigger Decoder | [firmware/trigger.md](firmware/trigger.md) |
| Sensors | [firmware/sensors.md](firmware/sensors.md) |
| CAN Bus | [firmware/can.md](firmware/can.md) |
| Diagnostics | [firmware/diagnostics.md](firmware/diagnostics.md) |
| Bootloader | [firmware/bootloader.md](firmware/bootloader.md) |
| PCB Hardware | [hardware/pcb.md](hardware/pcb.md) |
| Enclosure | [hardware/enclosure.md](hardware/enclosure.md) |
| Dashboard | [studio/dashboard.md](studio/dashboard.md) |
| Calibration | [studio/calibration.md](studio/calibration.md) |

### Reference

| Document | Purpose |
|----------|---------|
| [CHANGELOG.md](../CHANGELOG.md) | All changes logged |
| [TECH_DEBT.md](../TECH_DEBT.md) | Technical debt tracking |
| [BASELINE.md](../BASELINE.md) | Repository state at DDD adoption |
| [Daily Logs](history/) | Daily engineering logs |
| [Onboarding](onboarding/new-engineer-guide.md) | New engineer onboarding guide |

## 💼 Investors

*For investors, board members, and strategic partners.*

**Start here:** [Executive Summary](investor/Executive_Summary.md) — read this first (5 minutes)

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [Executive Summary](investor/Executive_Summary.md) | One-page business overview | 5 min |
| [Vision](investor/Vision.md) | North star and long-term direction | 5 min |
| [Problem](investor/Problem.md) | Market problem and opportunity | 5 min |
| [Solution](investor/Solution.md) | Product and architecture overview | 10 min |
| [Market](investor/Market.md) | Market size, trends, competition | 10 min |
| [Features](investor/Features.md) | Feature set in value language | 5 min |
| [Benefits](investor/Benefits.md) | Customer benefits by segment | 5 min |
| [Competitive Advantages](investor/Competitive_Advantages.md) | Our moat | 5 min |
| [Business Model](investor/Business_Model.md) | Revenue streams and GTM | 5 min |
| [Financial Model](investor/Financial_Model.md) | Financial projections | 5 min |
| [Roadmap](investor/Roadmap.md) | 6-phase product roadmap | 5 min |
| [Progress](investor/Progress.md) | Current progress dashboard | 5 min |
| [Milestones](investor/Milestones.md) | Key milestones and dates | 5 min |
| [Architecture](investor/Architecture.md) | Plain-language architecture | 5 min |
| [Technology](investor/Technology.md) | Technology choices explained | 5 min |
| [Risks](investor/Risks.md) | Risk matrix and mitigations | 5 min |
| [FAQ](investor/FAQ.md) | Frequently asked questions | 5 min |

**Reports:** [Monthly Reports](reports/)

## 👨‍🔧 Workshop

*For technicians installing, tuning, and servicing ECUs.*

| Document | Purpose |
|----------|---------|
| [Installation Guide](workshop/Installation_Guide.md) | Step-by-step ECU installation |
| [Tuning Guide](workshop/Tuning_Guide.md) | Complete tuning workflow |
| [Vehicle Support Matrix](workshop/Vehicle_Support_Matrix.md) | Supported engines, triggers, sensors |
| [Firmware Flash Guide](workshop/Firmware_Flash_Guide.md) | Flashing and recovery procedures |
| [Technician Checklist](workshop/Technician_Checklist.md) | Standardized pre/post installation checklist |
| [Customer Workflow](workshop/Customer_Workflow.md) | End-to-end customer journey |

## 🏭 Manufacturing

*For production partners and manufacturing engineers.*

| Document | Purpose |
|----------|---------|
| [Manufacturing Architecture](manufacturing-architecture.md) | Overall manufacturing approach |
| PCB — *(coming soon)* | PCB assembly notes |
| Enclosure — *(coming soon)* | Enclosure manufacturing |
| BOM — *(coming soon)* | Bill of materials |

## 📋 Reports

| Frequency | Template |
|-----------|----------|
| Weekly | [Template](reports/Weekly_Report_Template.md) |
| Monthly | [Template](reports/Monthly_Report_Template.md) |
| Quarterly | [Template](reports/Quarterly_Report_Template.md) |

## 🔧 Reference

| Area | Location |
|------|----------|
| Branding configuration | [branding/brand.json](../branding/brand.json) |
| Pull request template | [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) |
| Meeting notes | [meetings/](meetings/) |
| Planning documents | [planning/](planning/) |
| Research corpus | [research/](../research/) |
| License information | [LICENSE_NOTES.md](../LICENSE_NOTES.md) |

---

## 🧭 How to Use This Knowledge Base

```
👨‍💼 Management → docs/management/    → "What's the status?"
👨‍💻 Engineering → docs/engineering/  → "How do I build it?"
💼 Investors     → docs/investor/     → "Why should I invest?"
👨‍🔧 Workshop    → docs/workshop/     → "How do I install it?"
🏭 Manufacturing → docs/manufacturing/ → "How do I make it?"
```

**Five audiences. One repository. Single source of truth.**
