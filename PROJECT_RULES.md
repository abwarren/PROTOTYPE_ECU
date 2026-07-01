# PROJECT_RULES.md — Project Governance

> **Purpose:** Standardized workflows, agent coordination, and governance rules.
> **Every agent must read this before making changes.**

---

## 1. Agent Workflow (START → END)

Every agent follows this exact workflow:

```
START
 1. Pull latest changes
    git fetch --all
    git pull --rebase

 2. Read project documentation
    README.md → CURRENT_STATE.md → ROADMAP.md → DECISIONS.md

 3. Read files related to assigned area

 4. Check for changes made by other agents
    git log --oneline -10

 5. Do assigned work only

 6. Run validation/tests
    bash scripts/ddd-check.sh --ci

 7. Update documentation

 8. Commit with descriptive message

 9. Push changes
END
```

## 2. Shared Project Files (Every Agent Reads)

| File | Purpose |
|------|---------|
| `README.md` | Project overview and navigation |
| `CURRENT_STATE.md` | Current project status |
| `ROADMAP.md` | `11_Documentation/ROADMAP.md` — Development roadmap |
| `DECISIONS.md` | `17_Decisions/DECISIONS.md` — Decision index |
| `PROJECT_RULES.md` | This file — governance and workflows |
| `CODING_STANDARDS.md` | Coding standards and conventions |
| `ARCHITECTURE.md` | `01_Architecture/` — System architecture |
| `CHANGELOG.md` | `11_Documentation/CHANGELOG.md` — Change log |
| `TODO.md` | Task tracking and priorities |

## 3. Agent Locking (File Ownership)

Each agent owns specific directories. No agent may modify files outside its assigned area without a request.

| Agent | Owns |
|-------|------|
| Agent 0 — Chief Architect/QA | Any folder (review only) |
| Agent 1 — Hardware Research | `02_Hardware/`, `10_Market_Research/` |
| Agent 2 — Electronics Design | `03_PCB/` |
| Agent 3 — Firmware | `04_Firmware/`, `firmware/` |
| Agent 4 — Software & Cloud | `05_Software/`, `06_Cloud/`, `studio/`, `cloud/` |
| Agent 5 — Automotive Systems | `10_Market_Research/` (engine management) |
| Agent 6 — Manufacturing | `07_Manufacturing/`, `15_Suppliers/` |
| Agent 7 — Testing & Validation | `08_Testing/` |
| Agent 8 — Compliance | `09_Compliance/` |
| Agent 9 — Market Intelligence | `10_Market_Research/` |
| Agent 10 — Documentation & KB | `11_Documentation/`, `14_Diagrams/`, `12_BOM/`, `13_Datasheets/` |
| Agent 11 — Project Manager | Any (coordination only, no code changes) |

**Rule:** If an agent needs to edit another agent's area, it creates a request in `16_Quality_Audits/requests/` rather than making the change directly.

## 4. Branch Strategy

Instead of all agents committing to `main`, each agent works on its own feature branch:

```
main
├── hardware       (Agent 1, 2)
├── pcb            (Agent 2)
├── firmware       (Agent 3)
├── software       (Agent 4)
├── cloud          (Agent 4)
├── manufacturing  (Agent 6)
├── testing        (Agent 7)
├── compliance     (Agent 8)
├── market-research (Agent 1, 5, 9)
├── documentation  (Agent 10)
└── quality        (Agent 0)
```

**Process:**
1. Each agent works on its own branch
2. Regularly rebase from `main`
3. Agent 0 (QA) reviews and merges completed work into `main`
4. Only Agent 11 (PM) can authorize merges without QA review

## 5. Session Startup Protocol

Every agent begins with:

1. `git fetch --all`
2. `git pull --rebase`
3. Read `CURRENT_STATE.md`, `ROADMAP.md`, `DECISIONS.md`
4. Check recent commits: `git log --oneline -10`
5. Determine what has changed since its last run
6. Continue only with assigned tasks
7. Update documentation before committing
8. Push changes and summarize what was completed

## 6. Commit Standards

All commits must:
- Have a descriptive message (not "fix" or "update")
- Reference affected areas (e.g., `[firmware]`, `[docs]`)
- Mention ADR or issue number when applicable
- Pass `scripts/ddd-check.sh --ci` before pushing

## 7. Agent Listing

| # | Name | Focus |
|---|------|-------|
| 0 | Chief Architect / QA | Quality, architecture, reviews |
| 1 | Hardware Research | ECU hardware, schematics, MCUs |
| 2 | Electronics Design | PCB, power, sensors, drivers |
| 3 | Firmware | ECU firmware, FreeRTOS, CAN |
| 4 | Software & Cloud | Studio, cloud, mobile |
| 5 | Automotive Systems | Engine management subsystems |
| 6 | Manufacturing | Supply chain, assembly, BOM |
| 7 | Testing & Validation | Bench, HIL, EMC, vehicle |
| 8 | Compliance | ISO, CISPR, AEC, certifications |
| 9 | Market Intelligence | Competitor analysis, pricing |
| 10 | Documentation & KB | Knowledge base, diagrams |
| 11 | Project Manager | Coordination, dependencies, roadmap |
