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

## 3. Engineering Model

Per ADR-0008, the project uses a **Two-Agent Engineering Model**:

### Engineering Agent (Principal Engineer)
Owns all delivery. Produces complete vertical slices — designed, implemented, documented, tested, committed, pushed, and handed over. Never approves its own work.

### QA Agent (Independent Reviewer)
Never writes production features unless specifically tasked. Reviews every vertical slice independently against documented standards. Owns `qa/QA_BACKLOG.md`. Stateless — reviews from evidence, not memory.

### Review Loop
```
Engineering Agent → vertical slice → feature branch
    │
    ▼
QA Agent → independent review → qa/QA_BACKLOG.md entries
    │
    ▼
Engineering Agent → addresses findings
    │
    ▼
QA Agent → re-reviews → approves
    │
    ▼
Merge to master → SESSION_HANDOFF
```

### Engineering Principle (from MASTER_DIRECTIVE §3.16)
Neither agent owns the truth. The repository owns the truth. No architectural change without: technical justification, trade-off analysis, risk assessment, migration plan, QA approval, updated documentation, and an ADR.

## 4. Branch Strategy

Feature branches per vertical slice. Branch naming: `feature/vertical-slice-name`.

```
master
├── feature/repo-housekeeping
├── feature/tb-001-live-rpm
├── feature/tb-002-calibration-write
└── ...
```

**Process:**
1. Engineering Agent creates feature branch from master
2. Implements one vertical slice
3. QA Agent reviews
4. Findings addressed
5. QA approves → merge to master
6. Feature branch deleted after merge

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

## 8. Definition of Done

A vertical slice is complete only when:

| Gate | Criteria |
|------|----------|
| ✅ Feature | Works as specified |
| ✅ Documentation | Updated (MASTER_DIRECTIVE, PROJECT_STATUS, SESSION, CHANGELOG, architecture) |
| ✅ QA Review | Complete, findings in QA_BACKLOG |
| ✅ QA Resolution | Findings resolved or formally accepted |
| ✅ Tests | Executed where applicable |
| ✅ GitHub | Committed, pushed, verified |
| ✅ Handoff | SESSION_HANDOFF generated |
