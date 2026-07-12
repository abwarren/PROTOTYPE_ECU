# 🏗️ Project Name

> **Welcome to the company digital headquarters.**
> Everything about the project — engineering, management, investors, and operations — lives in this repository.

---

## 📖 Read These First

| Order | Document | Why |
|-------|----------|-----|
| 1 | **[MASTER_DIRECTIVE.md](./MASTER_DIRECTIVE.md)** | The specification contract — read this first above all |
| 2 | **[PROJECT_BOOTSTRAP_CHECKLIST.md](./PROJECT_BOOTSTRAP_CHECKLIST.md)** | Complete this checklist before writing any code |
| 3 | **[TRACER_BULLETS.md](./TRACER_BULLETS.md)** | Mandatory tracer bullet development methodology |
| 4 | **[CONTEXT_LIFECYCLE.md](./CONTEXT_LIFECYCLE.md)** | Mandatory session lifecycle policy |
| 5 | **[README.md](./README.md)** | Project homepage — directory navigation portal |
| 6 | **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** | Current progress across all subsystems |
| 7 | **[ROADMAP.md](./ROADMAP.md)** | Development strategy and milestones |
| 8 | **[SESSION.md](./SESSION.md)** | Current session status — what's being worked on now |
| 9 | **[docs/sessions/](./docs/sessions/)** | Session handoff archive — latest session state |
| 10 | **[TECH_DEBT.md](./TECH_DEBT.md)** | Known technical debt |
| 11 | **[docs/architecture/](./docs/architecture/)** | System architecture documentation |
| 12 | **[docs/adr/](./docs/adr/)** | Architecture Decision Records — why we chose what we did |

**Only after reading these documents should you start coding.**

---

## 📋 Policies

- **Context Lifecycle:** Every session is ephemeral — see `CONTEXT_LIFECYCLE.md` and `MASTER_DIRECTIVE.md` §3
- **DDD Policy:** All work is incomplete until documented. See `CONTRIBUTING.md`
- **Quality Gate:** Run `scripts/ddd-check.sh` before marking any task complete
- **Handoff Mandatory:** No session ends without `docs/sessions/SESSION_NNN.md` — see `MASTER_DIRECTIVE.md` §3.7
- **ADR First:** Architecture changes require an ADR before implementation

---

## 📂 Directory Structure

```
docs/
    architecture/         System architecture documentation
    research/             Technical research and analysis
    tracer_bullets/       Tracer bullet evidence and documentation
    qa/                   Quality assurance backlog and reviews
    adr/                  Architecture Decision Records
    sessions/             Session handoff archive
    investor/             Investor-facing documentation
    manufacturing/        Manufacturing guides (if applicable)
    release/              Release notes and deployment docs
src/                      Source code
tests/                    Test suite
scripts/                  Build and validation scripts
tools/                    Development tools and utilities
.github/                  GitHub workflows and templates
```

Every decision, design, roadmap, and report originates here.

---

## 🚀 Getting Started

See [START_HERE.md](./START_HERE.md) for the development setup guide.
See [PROJECT_BOOTSTRAP_CHECKLIST.md](./PROJECT_BOOTSTRAP_CHECKLIST.md) if this is a new project.
