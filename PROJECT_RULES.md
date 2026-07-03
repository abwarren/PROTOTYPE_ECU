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

---

## 9. Hardware Design Policy

### 9.1 NXP S32K344 Reference-Following Mandate

All core MCU circuitry follows NXP S32K344 reference design guidance unless a
documented engineering reason to deviate exists.

**Reference sources (in priority order):**

1. NXP S32K344-EVB (S32K344EVB-Q257) — evaluation board schematics
2. NXP AN13537 — S32K3xx Hardware Design Guidelines
3. NXP S32K344 datasheet — electrical specifications, decoupling, layout
4. NXP application notes for specific peripherals (TJA1043, etc.)

**Policy:**

- Every circuit block MUST be traceable to a row in `docs/hardware/REUSE_MATRIX.md`
- Every deviation from an NXP reference design MUST appear in REUSE_MATRIX.md with:
  - Technical justification
  - Risk assessment
  - QA approval
- "New Design" blocks require peer design review before schematic capture
- "Adapt" blocks require documented rationale for the adaptation
- "Reuse" blocks require verification that the reference circuit is correctly
  transcribed — no silent modifications

### 9.2 REUSE_MATRIX.md Authority

`docs/hardware/REUSE_MATRIX.md` is the Phase 0 gate for all KiCad work. No
schematic capture begins until the Reuse Matrix is approved.

### 9.3 Hardware Change Process

1. Proposed change → document in DESIGN_REVIEW.md
2. Update REUSE_MATRIX.md if the change affects circuit provenance
3. Update affected domain specification in docs/hardware/
4. Peer review → QA approval
5. Implement in KiCad
6. ERC/DRC clean → commit

---

## 10. Implementation Policy

### 10.1 Do Not Rebuild Existing Functionality

Before implementing any feature, directive, or requirement:

1. Compare the directive against the current repository state.
2. Identify completed work.
3. Identify partially completed work.
4. Identify missing work.
5. Implement ONLY the missing work.
6. Update documentation to match reality.
7. Commit with descriptive message.
8. Push to GitHub.

**Engineering progress is measured by verified capability, not duplicated implementation.**

This prevents:
- Rebuilding interfaces that already exist
- Re-documenting architecture that is already documented
- Duplicating effort across sessions
- Inflated completion percentages that mislead future sessions

---

## 11. Capability Delivery Policy

### 11.1 Architecture Freeze

As of 2026-07-03, the 7100CPT software architecture is FROZEN:

```
7100CPT Studio → EcuService → EcuProtocol (interface) ← RusEFIProtocolAdapter → UsbTransport → rusEFI
```

No architectural changes without:
- Architecture Decision Record (ADR)
- Engineering Review
- QA Approval
- Documentation update

### 11.2 Demo Gates (Mandatory)

From TB-005 onward, no Tracer Bullet is complete without a verified demonstration.

Every implementation TB must include:
- **Demo Gate** — specific, observable criteria (e.g., "USB device detected in discover()")
- **Evidence** — console log, screenshot, protocol dump
- **QA sign-off** — explicit approval

A TB cannot advance to COMPLETE until its Demo Gate passes.

### 11.3 Capability Matrix

`CAPABILITY_MATRIX.md` is the single-page answer to "What can 7100CPT do today?"

Update it whenever a Tracer Bullet completes. Every capability must be backed
by evidence — a build log, screenshot, or QA sign-off.

Progress is measured by verified capabilities, not lines of code or documents written.

### 11.4 Tracer Bullet Completion — 7 Artifacts

Every completed Tracer Bullet MUST leave behind all seven artifacts.
A TB is not complete until every artifact exists.

| # | Artifact | Description |
|---|----------|-------------|
| 1 | **Working capability** | Code compiled, committed, functional |
| 2 | **Automated test** | Unit/integration test proving the capability works |
| 3 | **Documentation update** | TB README updated with results + architecture docs if changed |
| 4 | **Capability Matrix update** | CAPABILITY_MATRIX.md level advanced (C0→C1→C2→C3) |
| 5 | **QA evidence** | Demo log, screenshot, or protocol dump with QA approval |
| 6 | **Session handoff** | SESSION_HANDOFF.md generated for next session |
| 7 | **GitHub commit** | Committed, pushed, verified on remote |

No skipped artifacts. No partial completion.

---

## 12. Governance Documents (Core Repository Documents)

The following documents define how the project operates. Changes to these
require QA review:

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `MASTER_DIRECTIVE.md` | Specification contract — highest authority |
| `PROJECT_RULES.md` | Engineering rules, workflows, policies |
| `PROJECT_DASHBOARD.md` | First thing every agent opens — pulse, pipeline, risks |
| `ROADMAP.md` | 5-track development roadmap |
| `CAPABILITY_MATRIX.md` | Verified capabilities with evidence |
| `PROJECT_STATUS.md` | Detailed component-level progress |
| `DECISION_LOG.md` | Significant engineering decisions and rationale |
| `CURRENT_STATE.md` | Agent shared state — session startup |
| `BRANDING.md` | Product naming authority |
| `SESSION_HANDOFF.md` | Session-to-session continuity |

These are the governance layer. Everything else is supporting documentation,
research, or implementation.

---

## 13. Engineering KPIs

Tracked per sprint. Measured, not estimated.

| KPI | Target | Current |
|-----|--------|---------|
| Tracer Bullet success rate | >95% | 100% (5/5 complete) |
| TB Demo Gate pass rate | >90% | — (TB-005 onward) |
| Regression rate | <2% | — (no production code yet) |
| QA rejection rate | <10% | — (no TB submitted for QA yet) |
| Build success rate | >98% | 100% (f407-discovery) |
| Documentation coverage | 100% | 100% (all TBs documented) |
| Capability coverage | Increasing every sprint | 5 verified, 12 designed |
| Mean time to root cause | Decreasing | — |
| Mean time to recovery | Decreasing | — |

**KPIs are updated in PROJECT_DASHBOARD.md at the end of every sprint.**

---

## 14. Commit Policy

Every commit must achieve at least one of:

- **Increase capability** — advance a capability in CAPABILITY_MATRIX.md (C0→C1→C2→C3→C4)
- **Improve quality** — fix a bug, reduce technical debt, add a test, pass a QA gate
- **Reduce risk** — close a risk in RISK_REGISTER.md or resolve an ENGINEERING_DEBT.md item

If a commit does none of these, it probably should not be part of the current
sprint. Architecture documents, governance updates, and process changes are
complete as of 2026-07-03. Future work ships capabilities.

