# REPOSITORY_MANIFEST.md — Prototype ECU Platform

> Auto-generated: 2026-07-01
> Repository: [github.com/abwarren/PROTOTYPE_ECU](https://github.com/abwarren/PROTOTYPE_ECU)
> Foundation tag: `v0.1-foundation`

---

## Repository Purpose

The Prototype ECU Platform is an open-source engine control unit (ECU) built on a rusEFI fork. The platform covers firmware, desktop studio, cloud, mobile, hardware, PCB, and manufacturing — developed specification-first under a multi-agent engineering system.

---

## Quick Facts

| Metric | Value |
|--------|-------|
| **Repository URL** | https://github.com/abwarren/PROTOTYPE_ECU |
| **Current Version** | v0.1-foundation |
| **Current Milestone** | Phase 0 — Specification Campaign |
| **Last Updated** | 2026-07-01 |
| **Total Commits** | 18 |
| **Branches** | 2 (master, edr/architecture-review) |
| **GitHub Actions** | 1 workflow (DDD Quality Gate) |
| **Submodule** | rusefi/rusefi (GPL-3.0) |

---

## Directory Map

```
ECU_PLATFORM/
├── 01_Architecture/          System architecture (20 docs)
├── 02_Hardware/              Hardware specifications (2 docs)
├── 03_PCB/                   PCB design
├── 04_Firmware/              Firmware module docs (8 docs)
├── 05_Software/              Desktop studio docs (2 docs)
├── 06_Cloud/                 Cloud platform
├── 07_Manufacturing/         Manufacturing docs (3 docs)
├── 08_Testing/               Test plans
├── 09_Compliance/            Regulatory compliance
├── 10_Market_Research/       Competitive & technical research (32 docs)
├── 11_Documentation/         All project documentation (51 docs)
│   ├── engineering/          Agent system + brand strings
│   ├── history/              Daily engineering logs
│   ├── investor/             Investor materials (17+ docs)
│   ├── management/           Sprint & project management (8 docs)
│   ├── meetings/             Meeting notes
│   ├── onboarding/           New engineer guide
│   ├── reports/              Status reports
│   └── workshop/             Workshop guides (6 docs)
├── 12_BOM/                   Bill of materials
├── 13_Datasheets/            Component datasheets
├── 14_Diagrams/              Architecture diagrams
├── 15_Suppliers/             Supplier research
├── 16_Quality_Audits/        Quality audits, EDR reviews, gap reports (10 docs)
├── 17_Decisions/             Architecture Decision Records
├── 18_Roadmap/               Product roadmap
├── branding/                 Brand assets (logos, fonts, themes)
├── cloud/                    Cloud infrastructure
├── firmware/                 Custom firmware (platform layer)
│   ├── bootloader/
│   ├── can/
│   ├── config/
│   ├── diagnostics/
│   ├── drivers/
│   ├── fuel/
│   ├── ignition/
│   ├── logging/
│   ├── platform/
│   ├── scheduler/
│   ├── sensors/
│   ├── storage/
│   └── upstream/             → rusEFI fork (submodule)
├── hardware/                 Hardware design files
├── mobile/                   Mobile app
├── scripts/                  Build & validation scripts
│   ├── build-firmware.sh
│   └── ddd-check.sh
└── studio/                   Desktop tuning studio
```

---

## Document Inventory

| Category | Count |
|----------|-------|
| **Total Markdown Documents** | 143 |
| **Architecture Documents** (01_Architecture/) | 20 |
| **Architecture Decision Records** (17_Decisions/) | 7 |
| **Research Documents** (10_Market_Research/) | 32 |
| **Firmware Documents** (04_Firmware/) | 8 |
| **Hardware Documents** (02_Hardware/) | 2 |
| **Management Documents** (11_Documentation/management/) | 8 |
| **Investor Documents** (11_Documentation/investor/) | 17+ |
| **Quality Audit Documents** (16_Quality_Audits/) | 10 |
| **Diagrams** (14_Diagrams/) | 1 |
| **Root Documents** | 11 |

---

## Governance

| Document | Purpose |
|----------|---------|
| `MASTER_DIRECTIVE.md` | Specification contract — highest authority |
| `PROJECT_RULES.md` | Agent workflow, commit standards, GitHub deployment policy |
| `CODING_STANDARDS.md` | Code quality standards |
| `CURRENT_STATE.md` | Agent-shared state |
| `SESSION.md` | Session handoff & sprint status |
| `START_HERE.md` | Repository entry point |
| `README.md` | Project overview & navigation |
| `TODO.md` | Task priorities |
| `QA_ENGINEERING_REVIEW.md` | Independent QA architecture review |
| `TRACER_BULLETS.md` | Tracer bullet development methodology |
| `CONTEXT_LIFECYCLE.md` | Session lifecycle policy |
| `16_Quality_Audits/` | Quality audits, EDR reviews, gap reports |

---

## Current Status

**Phase 0 — Specification Campaign** is active. The 20-agent specification program is producing documentation before implementation resumes. Once all P0 specs are approved, the repository hands off to the 11-agent operational system for implementation.

Per ADR-0005 and ADR-0006, the repository was restructured into 18 directories for multi-agent R&D.

---

## Quality Gate

The DDD (Documentation-Driven Development) quality gate validates 33 documentation checks. Current status: **33/33 PASSING**.

Run locally:
```bash
bash scripts/ddd-check.sh --verbose
```

CI workflow: `.github/workflows/ddd-check.yml`
