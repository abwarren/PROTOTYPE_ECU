# 🏎️ Prototype ECU Platform

> **Welcome to the company digital headquarters.**
> Everything about the ECU platform — engineering, management, investors, workshop, and manufacturing — lives in this repository.

---

## 📖 Read These First

| Order | Document | Why |
|-------|----------|-----|
| 1 | **[MASTER_DIRECTIVE.md](./MASTER_DIRECTIVE.md)** | The specification contract — read this first above all |
| 2 | **[TRACER_BULLETS.md](./TRACER_BULLETS.md)** | Mandatory tracer bullet development methodology |
| 3 | **[CONTEXT_LIFECYCLE.md](./CONTEXT_LIFECYCLE.md)** | Mandatory session lifecycle policy |
| 4 | **[README.md](./README.md)** | Company homepage — directory navigation portal |
| 5 | **[REPOSITORY_MANIFEST.md](./REPOSITORY_MANIFEST.md)** | Repository inventory and directory map |
| 6 | **[11_Documentation/PROJECT_STATUS.md](./11_Documentation/PROJECT_STATUS.md)** | Current progress across all subsystems |
| 7 | **[11_Documentation/ROADMAP.md](./11_Documentation/ROADMAP.md)** | 6-phase development strategy through 2029 |
| 8 | **[SESSION.md](./SESSION.md)** | Current sprint status — what's being worked on now |
| 9 | **[docs/handoffs/](./docs/handoffs/)** | Session handoff archive — latest session state |
| 10 | **[11_Documentation/management/Current_Sprint.md](./11_Documentation/management/Current_Sprint.md)** | Sprint backlog, burndown, and blockers |
| 11 | **[11_Documentation/TECH_DEBT.md](./11_Documentation/TECH_DEBT.md)** | Known technical debt and module replacement roadmap |
| 12 | **[01_Architecture/](./01_Architecture/)** | System architecture documentation (10 files) |
| 13 | **[17_Decisions/](./17_Decisions/)** | Architecture Decision Records — why we chose what we did |

**Only after reading these 13 documents should you start coding.**

---

## 🚀 Quick Start (Engineering)

```bash
# Prerequisites
export PATH="/home/wa/tools/gcc-12/bin:/home/wa/tools/java/bin:/home/wa/tools/7zip:/home/wa/tools/mtools/usr/bin:/usr/sbin:$PATH"
export JAVA_HOME="/home/wa/tools/java"

# Build firmware for STM32F407 Discovery board
cd firmware/upstream
make firmware f407-discovery -j$(nproc)

# Output: firmware/upstream/firmware/build/rusefi.elf, rusefi.bin, rusefi.hex
```

See [11_Documentation/BUILD.md](./11_Documentation/BUILD.md) for full build instructions.

---

## 📋 Policies

- **Context Lifecycle:** Every session is ephemeral — `CONTEXT_LIFECYCLE.md` and `MASTER_DIRECTIVE.md` §3
- **DDD Policy:** All work is incomplete until documented. See [11_Documentation/CONTRIBUTING.md](./11_Documentation/CONTRIBUTING.md)
- **Quality Gate:** Run `./scripts/ddd-check.sh` before marking any task complete
- **Handoff Mandatory:** No session ends without `docs/handoffs/SESSION_NNN.md` — see `MASTER_DIRECTIVE.md` §3.7
- **ADR First:** Architecture changes require an ADR before implementation

---

## 📂 Directory Structure

```
01_Architecture/          System architecture, design docs (10 files)
02_Hardware/              Hardware design docs (PCB, enclosure)
03_PCB/                   PCB layouts, Gerber files, stackups
04_Firmware/              ECU firmware source (submodule) + module docs
05_Software/              Desktop Studio application + docs
06_Cloud/                 Cloud platform and services
07_Manufacturing/         Assembly guides, BOM specs, suppliers
08_Testing/               Test plans, procedures, fixtures
09_Compliance/            Standards, certifications, reports
10_Market_Research/       Competitive analysis, market data (20+ categories)
11_Documentation/         Knowledge base — all 5 audiences
12_BOM/                   Bill of materials
13_Datasheets/            Component datasheets
14_Diagrams/              Architecture and flow diagrams
15_Suppliers/             Supplier contacts and qualifications
16_Quality_Audits/        Audit reports, quality scores
17_Decisions/             ADRs + decision log (5 records)
18_Roadmap/               Roadmaps, milestones, sprint plans
```

Every decision, design, roadmap, and report originates here.
