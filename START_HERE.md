# 🏎️ Prototype ECU Platform

> **Welcome to the company digital headquarters.**
> Everything about the ECU platform — engineering, management, investors, workshop, and manufacturing — lives in this repository.

---

## 📖 Read These First

| Order | Document | Why |
|-------|----------|-----|
| 1 | **[README.md](./README.md)** | Company homepage — five-audience navigation portal |
| 2 | **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** | Current progress across all subsystems |
| 3 | **[ROADMAP.md](./ROADMAP.md)** | 6-phase development strategy through 2029 |
| 4 | **[SESSION.md](./SESSION.md)** | Current sprint status — what's being worked on now |
| 5 | **[docs/management/Current_Sprint.md](./docs/management/Current_Sprint.md)** | Sprint backlog, burndown, and blockers |
| 6 | **[TECH_DEBT.md](./TECH_DEBT.md)** | Known technical debt and module replacement roadmap |
| 7 | **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture overview |
| 8 | **[ADR/](./ADR/)** | Architecture Decision Records — why we chose what we did |

**Only after reading these 8 documents should you start coding.**

---

## 👥 Five Audiences

``` 
👨‍💼 Management    → docs/management/   → Dashboard, KPIs, Budget, Risks
👨‍💻 Engineering   → docs/engineering/  → Architecture, ADRs, module docs
💼 Investors      → docs/investor/     → Executive Summary, Market, Financials
👨‍🔧 Workshop     → docs/workshop/     → Installation, Tuning, Flash guides
🏭 Manufacturing  → docs/manufacturing/ → Assembly, BOM, Suppliers
```

---

## 🚀 Quick Start (Engineering)

```bash
# Prerequisites
export PATH="/home/wa/tools/gcc-12/bin:/home/wa/tools/java/bin:/home/wa/tools/7zip:/home/wa/tools/mtools/usr/bin:/usr/sbin:$PATH"
export JAVA_HOME="/home/wa/tools/java"

# Build firmware for STM32F407 Discovery board
cd firmware/upstream
make firmware f407-discovery -j$(nproc)

# Output: firmware/build/rusefi.elf, rusefi.bin, rusefi.hex
```

See [BUILD.md](./BUILD.md) for full build instructions.

---

## 📋 Policies

- **DDD Policy:** All work is incomplete until documented. See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Quality Gate:** Run `./scripts/ddd-check.sh` before marking any task complete
- **ADR First:** Architecture changes require an ADR before implementation

---

## 🏢 Repository as Company HQ

This repository is more than source code. It's the single source of truth for:

- **🧠 Engineering** — Source code, architecture, technical decisions
- **📈 Management** — Progress tracking, KPIs, risk register, budget
- **💰 Investor Relations** — Pitch deck, financial model, monthly reports
- **🔧 Workshop Operations** — Installation guides, tuning workflows, checklists
- **🏭 Manufacturing** — Assembly guides, BOM specifications, supplier lists

Every decision, design, roadmap, and report originates here.
