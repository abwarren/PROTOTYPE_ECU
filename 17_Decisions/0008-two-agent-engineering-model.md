# ADR-0008: Two-Agent Engineering Model — Principal Engineer + Independent QA

## Status

Proposed

## Context

The project currently defines two overlapping multi-agent frameworks:
- **20-Agent Specification Program** (MASTER_DIRECTIVE.md §5): 20 agents producing specs
- **11-Agent Operational System** (PROJECT_RULES.md §8): 11 agents doing development

The EDR (Session 002) identified this as a process risk (D-022) and recommended merging into a single 15-agent framework. However, further analysis reveals that for a project at this stage — pre-implementation, single developer — any multi-agent model exceeding 2 agents introduces coordination overhead disproportionate to the engineering output.

Real engineering organizations do not have 20 architects producing specifications before a single engineer writes code. They have one principal engineer who designs and builds, and one independent reviewer who challenges the work. Specialists are introduced when the system grows large enough to require them.

## Decision

Adopt a **Two-Agent Engineering Model**:

### Engineering Agent (Principal Engineer)

One agent owns all delivery. Responsibilities:

- Firmware
- Desktop Studio
- Cloud Platform
- Mobile
- Hardware
- PCB
- Database
- Architecture
- Documentation
- Git workflow
- Vertical slicing
- Tracer bullets
- Repository management

The Engineering Agent produces complete vertical slices — designed, implemented, documented, tested, committed, pushed, and handed over. It operates as a Principal Engineer would: owning the full stack, making architectural decisions, and delivering working artifacts.

### QA Agent (Independent Reviewer)

A separate agent that never writes production features. It performs independent review of every vertical slice. Responsibilities:

- Architecture review
- Regression review
- Documentation review
- Commercial viability review
- Security review
- Repository health review
- Technical debt identification
- Risk assessment

The QA Agent is **stateless** — it never assumes the Engineering Agent is correct. Every review starts by reading the repository fresh: MASTER_DIRECTIVE.md, the latest SESSION_HANDOFF, the current feature branch, and the Git diff for that slice. It reviews based on evidence, not memory.

### Mandatory Workflow

```
Repository
    │
    ▼
Engineering Agent
    │ Creates vertical slice
    │ Documents
    │ Commits
    │ Pushes feature branch
    ▼
QA Agent
    │ Independent review
    │ Scores: Architecture, Maintainability, Scalability,
    │         Documentation, Repository, Database, Firmware,
    │         UI/UX, Testing, Commercial Readiness
    │ Identifies: Top 10 risks, Top 10 improvements,
    │             Regressions, Technical debt, Documentation gaps
    ▼
Changes requested
    │
    ▼
Engineering Agent
    │ Addresses findings
    │ Pushes updates
    ▼
QA Agent
    │ Re-reviews
    │ Approves
    ▼
Merge to master
    │
    ▼
SESSION_HANDOFF
    │
    ▼
Next session
```

### Session Lifecycle

Every session:

1. START
2. Read repository (MASTER_DIRECTIVE, SESSION_HANDOFF, relevant docs)
3. Implement ONE vertical slice (one logical milestone)
4. Update documentation
5. Commit
6. Push feature branch
7. QA Review
8. Address findings
9. Push
10. Generate SESSION_HANDOFF
11. END

### Vertical Slice Rule

Every session: ONE logical milestone, ONE Git push, ONE QA review, ONE handoff. Never mix unrelated work.

### QA Scoring

| Area | Score |
|------|-------|
| Architecture | /100 |
| Maintainability | /100 |
| Scalability | /100 |
| Documentation | /100 |
| Repository | /100 |
| Database | /100 |
| Firmware | /100 |
| UI/UX | /100 |
| Testing | /100 |
| Commercial Readiness | /100 |

### QA Output

Every review produces:
- Top 10 risks
- Top 10 improvements
- Identified regressions
- Technical debt
- Documentation gaps

## Consequences

### Positive
- Eliminates coordination overhead of 31 agents (20 spec + 11 ops)
- Single architectural vision — no conflicting decisions
- Consistent documentation style
- No duplicate work or merge conflicts
- QA is truly independent — reviews from evidence, not prior context
- Matches how experienced engineering organizations actually operate
- Scales naturally: add domain specialist reviewers (hardware, security) when needed

### Negative
- Single point of delivery — if the Engineering Agent is unavailable, no progress
- QA Agent must review across all domains (broad knowledge required)
- No parallel workstreams (but parallel agents can be added when the codebase supports it)

### Mitigations
- The repository is the permanent record — any qualified engineer can resume from SESSION_HANDOFF
- QA Agent reviews against documented standards (MASTER_DIRECTIVE, CODING_STANDARDS), not intuition
- When the system reaches sufficient complexity (Level 4+), specialist agents can be introduced for specific domains
- The model scales: add a Hardware Reviewer, Security Reviewer, or Cloud Reviewer as dedicated QA specialists

## Relationship to Existing Architecture

This ADR **replaces**:
- MASTER_DIRECTIVE.md §5 (20-Agent Specification Program)
- PROJECT_RULES.md §3 (Agent Locking / File Ownership)
- PROJECT_RULES.md §4 (Branch Strategy — per-agent branches)
- PROJECT_RULES.md §8 (11-Agent Operational System)

This ADR **preserves**:
- MASTER_DIRECTIVE.md §3 (Context Lifecycle Policy)
- MASTER_DIRECTIVE.md §3.15 (Tracer Bullet Development)
- MASTER_DIRECTIVE.md §4 (Repository Maturity Model)
- PROJECT_RULES.md §6 (Commit Standards)
- PROJECT_RULES.md §7 (GitHub Deployment Policy)
- TRACER_BULLETS.md (all 6 tracer bullets)
- CONTEXT_LIFECYCLE.md (session lifecycle)
- ADR-0007 (Architecture Change Governance)

## Future Scaling

When the codebase reaches a complexity that exceeds one agent's capacity (estimated: Level 4 — Prototype Implementation, 50K+ lines of code), specialist agents can be introduced:

```
Engineering Agent (Principal)
    ├── Firmware Specialist (when firmware > 20K LOC)
    ├── Hardware Specialist (when PCB design begins)
    ├── Cloud Specialist (when cloud infrastructure begins)
    └── Mobile Specialist (when mobile app begins)
```

Each specialist operates under the same model: owns a domain, produces vertical slices, submits to QA review. The Principal Engineer coordinates across domains.

Until then, one engineer. One reviewer. Complete vertical slices. Consistent architecture.
