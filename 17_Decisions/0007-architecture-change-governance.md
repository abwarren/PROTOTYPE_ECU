# ADR-0007: Architecture Change Governance — EDR Review Process

## Status

Proposed

## Context

The project has an established architecture (6 ADRs, 20+ architecture documents, MASTER_DIRECTIVE.md) and an active engineering process. As the project scales, architectural changes will be proposed by multiple agents, engineers, and review processes (QA Engineering Review, Engineering Design Review, etc.).

Without a governance process for architectural change, there is a risk that:
- Review recommendations are applied directly to source documents without traceability
- Conflicting changes are merged without coordination
- The rationale for architectural decisions is lost
- Documents diverge from each other
- Baseline architecture becomes a moving target

## Decision

Adopt an **Architecture Change Governance** process:

1. **Existing documents are the immutable baseline.** They are not modified during reviews or audit sessions.

2. **All proposed changes are first written as ADRs or design review documents.** These live as new files on a feature branch and are reviewed before merging.

3. **Once reviewed and accepted, changes are merged into the target documents** (MASTER_DIRECTIVE.md, ARCHITECTURE.md, subsystem docs, etc.) in a separate, traceable commit.

4. **Every architectural change has a documented history** — why it was proposed, what was considered, and why it was accepted or rejected.

### Review Document Types

| Type | Purpose | Naming |
|------|---------|--------|
| **ADR** | Architecture Decision Record — a specific architectural choice | `17_Decisions/NNNN-title.md` |
| **EDR** | Engineering Design Review — comprehensive review with recommendations | `16_Quality_Audits/EDR-YYYY-MM-DD-title.md` |
| **QAR** | QA Engineering Review — independent audit with findings | `16_Quality_Audits/QAR-YYYY-MM-DD.md` |

### Process Flow

```
Review/Audit Session
    │
    ├──→ Produce review documents (ADRs, EDRs, QARs)
    │    on a feature branch. No existing files modified.
    │
    ├──→ Open PR with review documents.
    │
    ├──→ Review phase:
    │    ├── Agent 01 (Architecture) reviews for system impact
    │    ├── Agent 19 (QA) reviews for completeness
    │    ├── Agent 00 (Program Manager) approves or rejects
    │    │
    │    ├── ACCEPTED → Merge review documents
    │    │    └──→ Implementation PR: apply changes to baseline docs
    │    │
    │    └── REJECTED → Close PR with rationale recorded
    │         └──→ Review document remains as rejected ADR (historical)
    │
    └──→ Implementation PR (if accepted):
         ├── Update MASTER_DIRECTIVE.md
         ├── Update affected subsystem docs
         ├── Update cross-references
         └── Commit with reference to source ADR/EDR
```

### Key Rule

**Review documents NEVER directly overwrite baseline documents.**

The review proposes. The PR approves. A separate commit implements.

This preserves:
- The baseline as a stable reference point
- A complete history of why every change was made
- The ability to revert architectural decisions independently

## Consequences

### Positive
- Complete audit trail for all architectural changes
- Baseline architecture remains stable during review
- Multiple reviewers can evaluate changes without collision
- Changes can be accepted/rejected independently
- Historical rejected proposals are preserved for future reference

### Negative
- Two-phase process (review → implement) is slower than direct edits
- Requires disciplined PR workflow for documentation changes
- Cross-reference updates must be coordinated

### Neutral
- This process applies to documentation architecture, not source code
- Source code changes follow the existing agent workflow (PROJECT_RULES.md)
- The process scales with project complexity — lightweight for small changes, thorough for architectural overhauls
