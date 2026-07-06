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
| **Remote is backup** | Every commit is pushed immediately |
| **Documentation is knowledge** | Written docs, not chat context, carry understanding forward |
| **Context is disposable** | Any session can end at any time without jeopardizing the project |
| **Handoff is mandatory** | No session ends without a SESSION_HANDOFF.md |

This project is expected to span thousands of engineering hours. No single session should attempt to contain the entire project.

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

- Build System
- Dashboard UI
- Database Schema
- Authentication Module
- API Gateway
- Deployment Pipeline
- Documentation

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
5. Update `CHANGELOG.md`
6. Update `SESSION.md`
7. Commit
8. Push
9. Verify remote
10. Create `docs/sessions/SESSION_NNN.md`

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
| **Repository Status** | Branch, commit SHA, remote verification |
| **Estimated Remaining Work** | Effort remaining on current workstream |
| **Lessons Learned** | Engineering notes |

---

## 6. New Session Startup

Every new session starts from the repository. Never rely on previous chat history.

### Startup Reading Order

1. `START_HERE.md`
2. `MASTER_DIRECTIVE.md`
3. `PROJECT_STATUS.md`
4. `ROADMAP.md`
5. `CURRENT_STATE.md`
6. `SESSION.md`
7. Latest session handoff (from `docs/sessions/`)
8. `TECH_DEBT.md`
9. Relevant subsystem documentation

Confirm understanding before beginning new work.

---

## 7. Handoff Directory Structure

```
docs/
└── sessions/
    ├── README.md              # Chronological index
    ├── SESSION_001.md         # First session
    ├── SESSION_002.md         # Second session
    └── ...
```

The `docs/sessions/README.md` is a simple index listing:

| Session | Date | Milestone Completed | Commit SHA | Next Recommended Task |

This creates a chronological engineering log navigable by both humans and AI agents.

---

## 8. Success Criteria

A successful handoff means that a completely new session can:

1. Clone the repository
2. Read the documentation
3. Understand the current state
4. Resume development

**Without access to any previous conversation.**

---

## 9. Governance

This document is subordinate to `MASTER_DIRECTIVE.md`. In case of conflict, `MASTER_DIRECTIVE.md` takes precedence.
