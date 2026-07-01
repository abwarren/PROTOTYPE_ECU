# PROJECT_RULES.md — Project Governance

> **Purpose:** Standardized workflows, agent coordination, and governance rules.
> **Every agent must read this before making changes.**
> **Governance:** See `MASTER_DIRECTIVE.md` §3 for mandatory context lifecycle policy and `CONTEXT_LIFECYCLE.md` for standalone reference.

---

## 1. Agent Workflow (START → END)

Every agent follows this exact workflow:

```
START
 1. Pull latest changes
    git fetch --all
    git pull --rebase

 2. Read project documentation
    MASTER_DIRECTIVE.md → START_HERE.md → README.md → CURRENT_STATE.md → ROADMAP.md → DECISIONS.md → docs/handoffs/

 3. Read files related to assigned area

 4. Check for changes made by other agents
    git log --oneline -10

 5. Do assigned work only

 6. Run validation/tests
    bash scripts/ddd-check.sh --ci

 7. Commit and push per the GitHub Deployment Policy (see §7)

 8. Update documentation

 9. End-of-session per §7.4
END
```

## 2. Shared Project Files (Every Agent Reads)

| File | Purpose |
|------|---------|
| `MASTER_DIRECTIVE.md` | The specification contract — highest authority |
| `README.md` | Project overview and navigation |
| `CURRENT_STATE.md` | Current project status |
| `ROADMAP.md` | `11_Documentation/ROADMAP.md` — Development roadmap |
| `DECISIONS.md` | `17_Decisions/DECISIONS.md` — Decision index |
| `PROJECT_RULES.md` | This file — governance and workflows |
| `CODING_STANDARDS.md` | Coding standards and conventions |
| `ARCHITECTURE.md` | `11_Documentation/ARCHITECTURE.md` — System architecture overview |
| `CHANGELOG.md` | `11_Documentation/CHANGELOG.md` — Change log |
| `TODO.md` | Task tracking and priorities |

## 3. Agent Locking (File Ownership)

Each agent owns specific directories. **Only Agent 0 (QA) has universal write access.**
No agent may modify files outside its assigned area without a request filed in `16_Quality_Audits/requests/`.

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
3. Read `MASTER_DIRECTIVE.md`, `CONTEXT_LIFECYCLE.md`, `CURRENT_STATE.md`, `ROADMAP.md`, `DECISIONS.md`, `docs/handoffs/`
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

---

## 7. GitHub Deployment Policy

### 7.1 Repository

The Prototype ECU GitHub repository is the authoritative source of the project.

All completed work must be committed and pushed to the correct GitHub repository.

No completed work may remain only in the local workspace.

| Property | Value |
|----------|-------|
| **Repository Owner** | `abwarren` |
| **Repository** | `PROTOTYPE_ECU` |
| **Remote** | `git@github.com:abwarren/PROTOTYPE_ECU.git` |
| **Rule** | Do not change the remote unless explicitly instructed. |

### 7.2 Authentication

Use the existing Git credentials and environment configuration already configured on the development machine.

- Do not print, expose, log, or modify any secrets.
- Do not display API keys, tokens, SSH keys, or environment variables.
- If authentication fails, report the failure and the required remediation without exposing secret values.

### 7.3 Failure Policy

If GitHub synchronization fails:

1. **STOP.**
2. Do not continue development until the repository synchronization issue has been resolved.
3. Explain the reason for the failure.
4. Do not expose credentials while troubleshooting.

### 7.4 End-of-Session Protocol

Before ending any session, every agent must:

1. Verify `git status` to review all changes
2. Stage all approved changes
3. Create logical, descriptive commits (per §6 standards)
4. Push to the configured GitHub remote
5. Verify the push completed successfully
6. Verify the latest commit exists on GitHub
7. Report:
   - Repository
   - Branch
   - Commit SHA
   - Commit Message
   - Files Changed
   - Push Status

### 7.5 Project Rule

> **GitHub is the permanent engineering record for the Prototype ECU project.**
>
> Every completed milestone must be represented by a verified commit on GitHub.

This gives every agent clear instructions to use existing authentication while protecting credentials. GitHub synchronization is a required part of the workflow without ever exposing or embedding secrets in the repository or documentation.

---

## 8. Agent Listing

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
