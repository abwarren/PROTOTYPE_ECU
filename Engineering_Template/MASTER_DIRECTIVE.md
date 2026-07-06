# 🏛 MASTER_DIRECTIVE.md — The Specification Contract

> **Version:** 1.0.0
> **Status:** Active
> **Purpose:** This document is the single source of authority for the project. Everything below is the contract.
> **Rule:** No implementation deviates from the specifications referenced herein. No specification changes without updating this contract.
>
> **Engineering Philosophy:** The platform is developed as a production-grade system from day one, while delivering working MVPs through small, complete vertical slices.

---

## 1. The Contract

The project is built **specification-first**. Every subsystem has a written specification document that defines its architecture, interfaces, behavior, and constraints — before a single line of implementation code is written.

**Implementation starts only when all specifications are approved.**

**During implementation:**
- Code follows the specification exactly.
- If the specification is wrong, update the specification first, then update the code.
- If the specification is silent on a topic, the implementer does not invent. They file a gap report in `docs/qa/gap-reports/`.

**This is not bureaucracy. This is leverage.**
A clear specification lets a developer build an entire subsystem in one pass without back-and-forth, without hallucinated architecture, and without contradictions.

---

## 2. Engineering Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Code written ≠ Feature complete** | Writing code is the minimum. A feature is done when it works, is documented, and is verified. |
| 2 | **Code compiles ≠ System works** | Compilation is a syntax check. Integration, behavior, and performance must be verified independently. |
| 3 | **Architecture before implementation** | Design the system before building it. Architecture decisions must be documented and approved before coding begins. |
| 4 | **Small vertical slices** | Every session delivers one complete, working slice through the full stack. No half-built subsystems. |
| 5 | **Evidence over assumptions** | Every claim about performance, compatibility, or behavior requires documented evidence — benchmarks, test results, or measurements. |
| 6 | **QA is independent** | The person who writes the code never approves the code. Independent review is mandatory. |
| 7 | **Documentation evolves with implementation** | Docs are updated as code changes, not as an afterthought. |
| 8 | **GitHub is the single source of truth** | The repository is the permanent engineering record. Conversation history is temporary. |
| 9 | **Working demonstrations define progress** | A feature is not complete until it can be demonstrated working. |
| 10 | **Tracer bullets validate architecture** | Build complete end-to-end slices before extensive feature development. |
| 11 | **Every claim requires evidence** | If it can't be measured or demonstrated, it's an assumption, not a fact. |
| 12 | **No undocumented code** | Every public API, every module, every configuration surface must have documentation. |
| 13 | **No undocumented architecture decisions** | Every architectural choice must be recorded as an ADR with context, alternatives, and rationale. |

---

## 3. Project Governance — Context Management & Engineering Continuity

**This policy is MANDATORY.**

It applies to every engineering session, every AI agent, every engineer, and every subsystem.

There are no exceptions.

### 3.1 The Repository Is the Project

The Git repository is the engineering operating system. It contains:

- Architecture
- Research
- Source code
- Documentation
- Testing
- Investor Material
- Roadmaps
- Decision Records
- Project History

**Git is the permanent engineering record.** Conversation history is temporary. AI context is temporary. The repository is permanent.

### 3.2 Context Is Disposable

Conversation history must never become a dependency.

- No engineering work may rely upon remembering previous conversations.
- Every engineering decision must be recoverable from the repository.
- **If information is not documented or committed, it does not officially exist.**

No chat session is part of the project. The repository is the project. Every session should be considered ephemeral. If the chat disappeared tomorrow, development should continue without loss because everything necessary is already in Git.

### 3.3 Vertical Slicing

All engineering work shall be organized into complete vertical slices. Each vertical slice represents a complete engineering milestone.

**Examples:**
- Build System
- Dashboard UI
- Database Schema
- Communication Layer
- Authentication Module
- Deployment Pipeline

Each slice shall be capable of being:

1. Designed
2. Implemented
3. Tested
4. Documented
5. Committed
6. Pushed
7. Handed over

A vertical slice should leave the repository in a working state. Do not split a vertical slice across multiple sessions unless unavoidable.

### 3.4 Session Length

| Threshold | Tokens |
|-----------|--------|
| **Target** | 40,000–60,000 |
| **Soft limit** | 75,000–100,000 |

**Hard Rule:** Do not intentionally continue beyond the soft limit when a logical engineering milestone has been completed. Engineering quality is more important than conversation length.

### 3.5 Mandatory Session Termination

Every engineering session SHALL terminate when either:

- A logical milestone has been completed
- The context approaches the recommended limit

Do not continue indefinitely. Do not allow context degradation.

### 3.6 Mandatory Session Checklist

Before ending EVERY session:

1. Complete current engineering slice
2. Run relevant verification
3. Run relevant tests
4. Update documentation
5. Update diagrams
6. Update `PROJECT_STATUS.md`
7. Update `ROADMAP.md`
8. Update `CHANGELOG.md`
9. Update `SESSION.md`
10. Update DECISIONS.md if necessary
11. Commit
12. Push
13. Verify remote
14. Generate `docs/sessions/SESSION_NNN.md`

**No session is complete until every applicable item has been completed.**

### 3.7 Session Handoff

Every session MUST generate `docs/sessions/SESSION_NNN.md`.

The handoff must include:

| Field | Description |
|-------|-------------|
| Session Number | Sequential session ID |
| Date | Session date |
| Current Sprint | Active sprint |
| Current Milestone | Active milestone |
| Completed Vertical Slice(s) | What was finished |
| Files Added | New files created |
| Files Modified | Existing files changed |
| Architecture Decisions | ADRs created or updated |
| Open Issues | Known problems |
| Technical Debt | Deliberate shortcuts |
| Known Risks | What could go wrong |
| Blockers | What is blocking progress |
| Pending Research | Questions needing answers |
| Recommended Next Slice | What to do next |
| Repository Status | Branch, commit SHA, remote verification |
| Estimated Remaining Work | Effort remaining on current workstream |
| Lessons Learned | Engineering notes |

### 3.8 Session Index

Maintain `docs/sessions/README.md` containing:

| Session | Date | Milestone | Commit SHA | Engineer / Agent | Status | Next Task |

This becomes the historical engineering timeline.

### 3.9 Session Startup

Every new session MUST begin by reading:

1. `START_HERE.md`
2. `MASTER_DIRECTIVE.md`
3. `README.md`
4. `PROJECT_STATUS.md`
5. `ROADMAP.md`
6. `CURRENT_STATE.md`
7. `SESSION.md`
8. Latest session handoff (from `docs/sessions/`)
9. `TECH_DEBT.md`
10. Relevant ADRs
11. Relevant subsystem documentation

Only then may engineering begin.

### 3.10 No Chat Dependencies

Assume every session begins with zero memory.

The repository must contain everything required to continue development. No engineer should ever need access to previous conversations.

### 3.11 Engineering Continuity

Any new engineer or AI agent should be capable of:

1. Cloning the repository
2. Reading the documentation
3. Understanding the architecture
4. Understanding the current sprint
5. Understanding technical debt
6. Understanding open risks
7. Continuing development

**Within one working session.**

### 3.12 Success Criteria

The repository shall become a complete engineering knowledge base. The repository must be sufficient for:

- Software Engineering
- Firmware Engineering
- Hardware Engineering
- Manufacturing
- Testing
- Deployment
- Operations
- Investor Reporting
- Customer Support
- Future AI Engineering

**No project knowledge should be permanently stored in conversation history. All enduring knowledge belongs in the repository.**

### 3.13 Mandatory Compliance

This policy is mandatory. Every AI agent. Every engineering session. Every sprint. Every milestone. Every release.

Failure to comply is considered an incomplete engineering task. **No feature may be considered COMPLETE until this policy has been satisfied.**

### 3.14 Handoff Directory Structure

```
docs/
└── sessions/
    ├── README.md              # Chronological index
    ├── SESSION_001.md         # First session
    ├── SESSION_002.md         # Second session
    └── ...
```

The session directory is the chronological engineering log — navigable by both humans and AI agents.

### 3.15 Tracer Bullet Development

The project shall follow a **Tracer Bullet** development methodology. Tracer bullets validate complete end-to-end workflows early by exercising the entire stack from user interaction to final output.

**Tracer bullets are mandatory.** Every major subsystem must receive a tracer bullet before extensive feature development begins. Tracer bullets become automated regression tests that must continue to pass for the life of the project.

**Principles:**
- Cross multiple subsystems (minimum 3)
- Be deployable — produce a working artifact, not a mock
- Be testable — include automated verification
- Be documented
- Be committed and pushed
- Produce measurable, demonstrable value

**Completion criteria:** A tracer bullet is complete when architecture is validated, integration is proven, documentation is updated, tests pass, work is committed and pushed, and the session handoff is updated.

**Tracer bullets vs. vertical slices:** Tracer bullets are the *first* vertical slice through a subsystem's full stack — they prove the architecture works end-to-end. Subsequent vertical slices add depth and features within the validated architecture.

Full methodology: `TRACER_BULLETS.md`

### 3.16 Engineering Principle — Authority & Review

**Neither agent owns the truth. The repository owns the truth.**

Architecture evolves only through documented proposals, independent review, and accepted decisions.

The Engineering Agent delivers. The QA Agent challenges.

No architectural change shall be merged without:
- Technical justification
- Trade-off analysis
- Risk assessment
- Migration plan
- QA approval
- Updated documentation

Every accepted architectural change shall be recorded as an Architecture Decision Record (ADR).

Rejected proposals shall remain documented for future reference.

QA reviews produce a living backlog in `docs/qa/QA_BACKLOG.md`. Every finding is tracked from identification through resolution. No finding is buried in chat or one-off reports.

The review loop:

```
Engineering Agent → delivers vertical slice
        │
        ▼
QA Agent → independent review (stateless, evidence-based)
        │
        ▼
QA_BACKLOG.md → findings tracked, prioritized
        │
        ▼
Engineering Agent → addresses findings
        │
        ▼
QA Agent → re-reviews, approves or rejects
        │
        ▼
Merge → main remains stable
        │
        ▼
ADRs → permanent record of accepted decisions
```

---

## 4. Repository Maturity Model

The repository matures through defined levels. The current maturity level is updated at the end of every session. This provides a consistent measure of project evolution and keeps every session aligned with the long-term roadmap.

### 4.1 Maturity Levels

| Level | Name | Criteria |
|-------|------|----------|
| **1** | Basic Documentation | README, project structure, initial governance |
| **2** | Architecture Complete | System architecture documented, ADRs established, directory structure finalized |
| **3** | Specifications Complete | All subsystem specifications written, reviewed, and approved |
| **4** | Prototype Implementation | Working prototype of core subsystems |
| **5** | Production-Ready | Hardware/software manufactured, compliance certified |
| **6** | Commercial Platform | Customer deployments, revenue operations |

### 4.2 Level Transitions

A level is considered **complete** when all its criteria are met and the quality gate passes.

A level transition requires:
1. File a level completion report in `docs/release/`
2. QA validates all criteria
3. Architecture confirms no architectural regressions
4. This document is updated with the new level and date
5. A new tag is created: `v{major}.{minor}-L{level}` (e.g., `v0.2-L3`)

---

## 5. The Specification Standard

Every specification document must meet these criteria to be approved (enforced by QA):

| # | Criterion | Description |
|---|-----------|-------------|
| 1 | **Scope** | Clearly defines what is in and out of scope for the subsystem |
| 2 | **Interfaces** | All external APIs, protocols, and integration points are specified |
| 3 | **Constraints** | Performance, safety, regulatory, and cost constraints are documented |
| 4 | **Dependencies** | All dependencies on other subsystems are listed with interface versions |
| 5 | **Diagrams** | Architecture diagrams exist (C4 model or equivalent) |
| 6 | **Verification** | How compliance with the specification will be verified |
| 7 | **Sources** | Industry standards, reference materials, and prior art are cited |
| 8 | **Version** | Document has version number and changelog |

A specification is **approved** when QA scores it >= 90/100 against the above criteria.

---

## 6. Change Process

### For Specification Changes

1. The requesting agent/engineer files a change request in `docs/qa/gap-reports/`
2. System Architect reviews for system-wide impact
3. QA reviews for completeness
4. The specification is updated, version bumped, and changelog updated
5. All dependent implementation tasks are re-planned

### For Implementation Deviations

If during implementation the specification proves insufficient:

1. **Stop.** Do not implement around the gap.
2. **File a gap report** in `docs/qa/gap-reports/` describing what the specification lacks.
3. **The specification is updated** by the owning team member.
4. **Implementation resumes** against the updated specification.

---

## 7. Quick Reference

| Key File | Purpose |
|----------|---------|
| `MASTER_DIRECTIVE.md` | This file — the specification contract |
| `TRACER_BULLETS.md` | Tracer Bullet development methodology (mandatory) |
| `CONTEXT_LIFECYCLE.md` | Session lifecycle policy (mandatory governance) |
| `CURRENT_STATE.md` | Daily project pulse |
| `PROJECT_STATUS.md` | Detailed per-component status |
| `ROADMAP.md` | Development roadmap |
| `SESSION.md` | Current session state |
| `docs/sessions/` | Session handoff archive |
| `docs/qa/QA_BACKLOG.md` | Living architectural backlog (QA-owned) |
| `docs/qa/REVIEW_HISTORY.md` | Chronological QA review log |
| `PROJECT_RULES.md` | Agent governance and workflows |
| `CODING_STANDARDS.md` | Engineering standards |
| `docs/adr/` | Architecture Decision Records |
| `PROJECT_BOOTSTRAP_CHECKLIST.md` | New project startup checklist |

---

*This document is the contract. Everything below must be implemented as specified.*
