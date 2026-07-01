# CONTEXT_LIFECYCLE.md — Session Context Lifecycle Policy

> **Version:** 1.0.0
> **Status:** Active
> **Purpose:** Define how engineering sessions are started, managed, and handed off.
> **Rule:** Every session must leave the repository in a state where another engineer or AI agent can continue immediately.

---

## 1. Engineering Philosophy

| Principle | Rule |
|-----------|------|
| **Repository is memory** | Git is the permanent engineering record |
| **GitHub is backup** | Every commit is pushed immediately |
| **Documentation is knowledge** | Written docs, not chat context, carry understanding forward |
| **Context is disposable** | Any session can end at any time without jeopardizing the project |
| **Handoff is mandatory** | No session ends without a SESSION_HANDOFF.md |

The Prototype ECU project is expected to span thousands of engineering hours. No single AI session should attempt to contain the entire project.

---

## 2. Vertical Slicing

Engineering work is divided into complete vertical slices. A vertical slice is self-contained and can be:

1. Designed
2. Implemented
3. Documented
4. Tested
5. Committed
6. Pushed
7. Handed over

### Example Vertical Slices

- Firmware Build System
- Desktop Dashboard
- Database Schema
- CAN Layer
- Ignition Module
- Workshop Installer
- Investor Documentation
- Manufacturing Research

**Rule:** Do not split a vertical slice across multiple sessions unless unavoidable.

---

## 3. Session Length

| Threshold | Tokens |
|-----------|--------|
| **Target** | 40,000–60,000 |
| **Soft limit** | 75,000–100,000 |
| **Hard rule** | Do not intentionally continue beyond the soft limit if a logical handoff can be created |

The objective is maintaining engineering quality, not maximizing conversation length.

---

## 4. Mandatory Handoff Protocol

At the completion of every vertical slice, or before reaching the session limit:

1. Complete the current logical milestone
2. Synchronize documentation
3. Update architecture if required
4. Update `PROJECT_STATUS.md`
5. Update `CURRENT_SPRINT.md`
6. Update `CHANGELOG.md`
7. Update `SESSION.md`
8. Update `REPOSITORY_MANIFEST.md` (if applicable)
9. Commit
10. Push to GitHub
11. Verify GitHub
12. Create `docs/handoffs/SESSION_NNN.md`

---

## 5. SESSION_HANDOFF.md Format

Every handoff document must include:

| Field | Description |
|-------|-------------|
| **Session Number** | Sequential session ID |
| **Date** | Session date |
| **Current Sprint** | Active sprint |
| **Current Milestone** | Active milestone |
| **Completed Vertical Slice(s)** | What was finished |
| **Files Added** | New files created |
| **Files Modified** | Existing files changed |
| **Architecture Decisions** | ADRs created or updated |
| **Open Issues** | Known problems |
| **Technical Debt** | Deliberate shortcuts |
| **Known Risks** | What could go wrong |
| **Pending Research** | Questions needing answers |
| **Recommended Next Slice** | What to do next |
| **Recommended Next Agent** | Which agent should pick up |
| **Repository Status** | Branch, commit SHA, GitHub verification |
| **Estimated Remaining Work** | Effort remaining on current workstream |

---

## 6. New Session Startup

Every new session starts from the repository. Never rely on previous chat history.

### Startup Reading Order

1. `START_HERE.md`
2. `MASTER_DIRECTIVE.md`
3. `PROJECT_STATUS.md`
4. `CURRENT_SPRINT.md`
5. `ROADMAP.md`
6. `ARCHITECTURE.md`
7. `SESSION_HANDOFF.md` (latest in `docs/handoffs/`)
8. `SESSION.md`
9. `TECH_DEBT.md`
10. Relevant subsystem documentation

Confirm understanding before beginning new work.

---

## 7. Handoff Directory Structure

```
docs/
└── handoffs/
    ├── README.md          # Chronological index
    ├── SESSION_001.md     # First session
    ├── SESSION_002.md     # Second session
    └── ...
```

The `docs/handoffs/README.md` is a simple index listing:

| Session | Date | Milestone Completed | Commit SHA | Next Recommended Task |

This creates a chronological engineering log navigable by both humans and AI agents.

---

## 8. Success Criteria

A successful handoff means that a completely new AI session can:

1. Clone the repository
2. Read the documentation
3. Understand the current state
4. Resume development

**Without access to any previous conversation.**

---

## 9. Governance

This document is subordinate to `MASTER_DIRECTIVE.md`. In case of conflict, `MASTER_DIRECTIVE.md` takes precedence.
