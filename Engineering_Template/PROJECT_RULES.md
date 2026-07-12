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
    MASTER_DIRECTIVE.md → START_HERE.md → README.md → CURRENT_STATE.md →
    ROADMAP.md → docs/adr/README.md → docs/sessions/

 3. Read files related to assigned area

 4. Check for changes made by other agents
    git log --oneline -10

 5. Do assigned work only

 6. Run validation/tests
    bash scripts/ddd-check.sh --ci

 7. Commit and push per the Git workflow (see §5)

 8. Update documentation

 9. End-of-session per §5.4
END
```

## 2. Shared Project Files (Every Agent Reads)

| File | Purpose |
|------|---------|
| `MASTER_DIRECTIVE.md` | The specification contract — highest authority |
| `README.md` | Project overview and navigation |
| `CURRENT_STATE.md` | Current project status |
| `PROJECT_STATUS.md` | Detailed per-component status |
| `ROADMAP.md` | Development roadmap |
| `PROJECT_RULES.md` | This file — governance and workflows |
| `CODING_STANDARDS.md` | Coding standards and conventions |
| `CHANGELOG.md` | Change log |
| `TECH_DEBT.md` | Known technical debt |
| `TRACER_BULLETS.md` | Tracer bullet methodology |

## 3. Engineering Model

The project uses a **Two-Agent Engineering Model**:

### Engineering Agent (Principal Engineer)
Owns all delivery. Produces complete vertical slices — designed, implemented, documented, tested, committed, pushed, and handed over. Never approves its own work.

### QA Agent (Independent Reviewer)
Never writes production features unless specifically tasked. Reviews every vertical slice independently against documented standards. Owns `docs/qa/QA_BACKLOG.md`. Stateless — reviews from evidence, not memory.

### Review Loop
```
Engineering Agent → vertical slice → feature branch
    │
    ▼
QA Agent → independent review → docs/qa/QA_BACKLOG.md entries
    │
    ▼
Engineering Agent → addresses findings
    │
    ▼
QA Agent → re-reviews → approves
    │
    ▼
Merge to main → SESSION_HANDOFF
```

### Engineering Principle
Neither agent owns the truth. The repository owns the truth. No architectural change without: technical justification, trade-off analysis, risk assessment, migration plan, QA approval, updated documentation, and an ADR.

## 4. Branch Strategy

Feature branches per vertical slice. Branch naming: `feature/vertical-slice-name`.

```
main
├── feature/project-initialization
├── feature/tb-001-first-tracer-bullet
└── ...
```

**Process:**
1. Engineering Agent creates feature branch from main
2. Implements one vertical slice
3. QA Agent reviews
4. Findings addressed
5. QA approves → merge to main
6. Feature branch deleted after merge

## 5. Git Workflow

### 5.1 Process

```
Feature Branch
    ↓
Implementation
    ↓
Documentation
    ↓
QA
    ↓
Evidence
    ↓
Pull Request
    ↓
Merge
    ↓
Release
```

Direct commits to main are prohibited.

### 5.2 Commit Standards

All commits must:
- Have a descriptive message (not "fix" or "update")
- Reference affected areas (e.g., `[core]`, `[docs]`, `[build]`)
- Mention ADR or issue number when applicable
- Pass quality check before pushing

### 5.3 Failure Policy

If remote synchronization fails:

1. **STOP.**
2. Do not continue development until the synchronization issue has been resolved.
3. Explain the reason for the failure.
4. Do not expose credentials while troubleshooting.

### 5.4 End-of-Session Protocol

Before ending any session, every agent must:

1. Verify `git status` to review all changes
2. Stage all approved changes
3. Create logical, descriptive commits (per §5.2 standards)
4. Push to the configured remote
5. Verify the push completed successfully
6. Verify the latest commit exists on remote
7. Report:
   - Repository
   - Branch
   - Commit SHA
   - Commit Message
   - Files Changed
   - Push Status

### 5.5 Project Rule

> **Git is the permanent engineering record.**
>
> Every completed milestone must be represented by a verified commit in the repository.

## 6. Definition of Done

A vertical slice is complete only when:

| Gate | Criteria |
|------|----------|
| ✅ Feature | Works as specified |
| ✅ Documentation | Updated (MASTER_DIRECTIVE, PROJECT_STATUS, SESSION, CHANGELOG, architecture) |
| ✅ QA Review | Complete, findings in QA_BACKLOG |
| ✅ QA Resolution | Findings resolved or formally accepted |
| ✅ Tests | Executed where applicable |
| ✅ Repository | Committed, pushed, verified |
| ✅ Handoff | SESSION_HANDOFF generated |
