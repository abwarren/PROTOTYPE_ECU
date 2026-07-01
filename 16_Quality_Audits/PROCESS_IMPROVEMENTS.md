# PROCESS_IMPROVEMENTS.md — Engineering Workflow & Governance Recommendations

> **Type:** EDR Companion — Process Domain
> **Governance:** Per ADR-0007 — proposals only

---

## 1. Core Finding: Process Is Excellent But Doesn't Scale Down

The project's engineering process (MASTER_DIRECTIVE.md §3, PROJECT_RULES.md, CONTEXT_LIFECYCLE.md, TRACER_BULLETS.md) is genuinely well-designed. It would serve a 50-person team well. At 18 commits and zero lines of custom code, it's disproportionate.

The fix is not to remove process — it's to make process scale with project maturity.

---

## 2. Recommendation: Process Scaling per Maturity Level

### Proposed: Tiered Governance

| Level | Process Weight | What's Required |
|-------|---------------|-----------------|
| **L1-L2** (Documentation/Architecture) | Lightweight | Session checklist (commit, push, handoff), DDD gate, ADRs |
| **L3-L4** (Specs/Prototype) | Moderate | Full session checklist, tracer bullet verification, CI gate |
| **L5-L6** (Production/Commercial) | Full | Agent locking, branch-per-agent, QA approval gates, compliance docs |

### Rationale

At L2 (current state), the project needs:
- ✅ Session handoffs (to preserve context)
- ✅ DDD quality gate (to maintain documentation quality)
- ✅ ADRs (for architectural decisions)
- ✅ Commit + push (for safety)
- ❌ Agent locking (one developer — no collision risk)
- ❌ Branch-per-agent (one branch — master)
- ❌ QA approval gates (no reviewer available)
- ❌ 20-agent specification program overhead (produce the specs with fewer agents)

These should activate as the team grows, not before.

---

## 3. Recommendation: Adopt Two-Agent Model (ADR-0008)

### Current State

Two competing multi-agent frameworks (20-agent + 11-agent). The EDR initially proposed merging to 15 agents, but further analysis reveals that ANY multi-agent model exceeding 2 agents is disproportionate for the current project scale.

### Recommendation

**ADR-0008: Two-Agent Engineering Model**

- **Engineering Agent (Principal Engineer):** Owns all delivery — firmware, studio, cloud, hardware, documentation, architecture, vertical slicing, tracer bullets. One agent builds everything.
- **QA Agent (Independent Reviewer):** Never writes production features. Reviews every vertical slice independently — architecture, regressions, documentation, commercial viability. Reviews from evidence, not memory.

### Rationale

Real engineering organizations do not have 20 architects producing specifications before one engineer writes code. They have one principal engineer who designs and builds, and one independent reviewer who challenges the work. This model:

- Eliminates coordination overhead (no agent conflicts, no duplicate work)
- Produces consistent architecture (single vision, not 20 compromises)
- Maintains quality (independent QA, evidence-based review)
- Scales naturally (add domain specialists when complexity demands it)

### Migration

1. Accept ADR-0008
2. Update MASTER_DIRECTIVE.md §5: replace 20-agent program with two-agent model
3. Update PROJECT_RULES.md: remove agent locking, branch-per-agent, agent listing
4. Update PROCESS_IMPROVEMENTS.md: reflect two-agent workflow

The 15-agent merger proposed in the EDR was a step in the right direction. ADR-0008 is the final destination.

---

## 4. Recommendation: Tracer Bullet Sequencing

### Current State
6 tracer bullets defined with execution order. But TB-001 prerequisites list "Firmware builds, Studio scaffold, USB/CAN communication" — none of which exist.

### Problem
The tracer bullet methodology is correct but the prerequisites aren't broken down into achievable first steps. "Firmware builds" for TB-001 can be the existing rusEFI build — no custom code needed. "Studio scaffold" can be a single-file HTML page reading serial data. The tracer bullet should be achievable in one session, not blocked by months of infrastructure work.

### Recommendation

**Define TB-001 Minimum Viable Implementation:**

```
TB-001-MVP:
  ✅ Firmware: rusEFI build with simulator outputting RPM over TCP
  ✅ Studio:    Single HTML file with WebSocket client showing RPM gauge
  ✅ Protocol:  JSON over WebSocket (simulator → browser)
  ✅ Result:    RPM value displayed on screen in < 4 hours
```

This proves the architecture without building the entire stack. Once TB-001-MVP works:
- Replace simulator with real firmware on development board
- Replace WebSocket with USB CDC
- Replace HTML page with Electron/Tauri shell
- Add SQLite logging
- Add cloud upload

Each step is a vertical slice. Each step produces a working artifact.

---

## 5. Recommendation: Startup Checklist Simplification

### Current State
MASTER_DIRECTIVE.md §3.9 requires reading 12 documents before starting.

### Recommendation

**Two-tier startup: Quick-start (returning agent) vs Full-start (new agent).**

**Quick-start (returning agent, same sprint):**
1. `git pull`
2. `SESSION.md` (check current state)
3. Latest `docs/handoffs/SESSION_NNN.md` (check what changed)
4. Relevant subsystem doc

**Full-start (new agent or new sprint):**
1. `START_HERE.md` (reading guide)
2. `MASTER_DIRECTIVE.md`
3. `SESSION.md`
4. Latest `docs/handoffs/SESSION_NNN.md`
5. Relevant subsystem docs and ADRs

This reduces the friction for returning agents while ensuring new agents get full context.

---

## 6. Recommendation: Session Numbering

### Current State
Sessions are numbered sequentially (SESSION_001, SESSION_002) but the index is ahead of reality — SESSION_002 and SESSION_003 are pre-populated as "Pending."

### Recommendation

Only document sessions that have actually occurred. Remove placeholder entries. The index becomes an accurate historical log, not a planning tool.

---

## 7. Recommendation: ADR Date Correction

### Current State
ADRs 0001-0004 are dated `2024-06-30`. The repository was created 2026-06-30. This is a 2-year discrepancy.

### Recommendation

Either:
- Correct dates to 2026-06-30 (if these decisions were made during the initial project setup)
- Add a note explaining that these decisions predate the git repository (if they were made in 2024 and later committed)

Incorrect dates undermine the credibility of the ADR system as a historical record.

---

*Per ADR-0007, these are proposals. No baseline documents have been modified.*
