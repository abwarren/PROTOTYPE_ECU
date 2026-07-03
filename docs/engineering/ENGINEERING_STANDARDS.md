# ENGINEERING_STANDARDS.md — Single Reference for All Standards

> **Purpose:** One authoritative document instead of rules spread across multiple files.
> **Scope:** Every engineer, agent, and reviewer follows these standards.
> **Length:** Reference, not manual — links to detailed docs where they exist.

---

## 1. Git Workflow

- Feature branches from `master`: `feature/<name>`
- Commit messages: descriptive, area-tagged (`[studio]`, `[firmware]`, `[docs]`)
- Push after every logical milestone
- Squash only if requested by reviewer
- Never force-push to shared branches

---

## 2. Branch Naming

```
feature/tb-<NNN>-<description>     # Tracer Bullet work
feature/<description>               # General feature
fix/<description>                    # Bug fix
hotfix/<description>                 # Production fix
```

---

## 3. Commit Policy

Every commit must do at least one of (PROJECT_RULES.md §14):

- **Increase capability** — advance C0→C1→C2→C3→C4 in CAPABILITY_MATRIX.md
- **Improve quality** — fix a bug, reduce debt, add a test
- **Reduce risk** — close a risk or resolve an engineering debt item

---

## 4. ADR Requirements

Architecture Decision Records are required for:

- Architectural changes (architecture is FROZEN)
- New subsystem designs
- Protocol or interface changes
- Build system changes affecting multiple components

Format: `17_Decisions/<number>-<title>.md`. Template in DECISIONS.md.

---

## 5. Tracer Bullet Requirements (PROJECT_RULES.md §11)

Every implementation TB (TB-005 onward) must include:

- Demo Gate with specific, observable criteria
- Evidence (console log, screenshot, protocol dump)
- QA sign-off

Completion requires 7 artifacts (PROJECT_RULES.md §11.4):

| # | Artifact |
|---|----------|
| 1 | Working capability (code compiled, committed, functional) |
| 2 | Automated test |
| 3 | Documentation update |
| 4 | CAPABILITY_MATRIX.md level advanced |
| 5 | QA evidence |
| 6 | SESSION_HANDOFF.md generated |
| 7 | GitHub commit |

No TB is complete until all 7 artifacts exist.

---

## 6. QA Requirements

- Two-Agent Model (ADR-0008): Engineer delivers, QA reviews independently
- QA reviews from evidence, not memory
- All findings in `qa/QA_BACKLOG.md`
- Architecture changes require QA approval

---

## 7. Capability Levels (C0–C4)

| Level | Meaning | Gate |
|-------|---------|------|
| C0 | Designed | Architecture document, interface defined |
| C1 | Implemented | Code written, compiles, committed |
| C2 | Demonstrated | Demo Gate passed, evidence captured |
| C3 | QA Verified | Independent QA review approved |
| C4 | Production | Tested on target, docs complete |

Tracked in CAPABILITY_MATRIX.md. No skipped levels.

---

## 8. Coding Standards

- TypeScript: `studio/` follows standard TS conventions
- Rust: `studio/src-tauri/` follows standard Rust conventions
- C++: rusEFI upstream conventions (submodule, not ours to change)
- No lint errors on commit
- No commented-out code in production files

---

## 9. Documentation Standards

- Every subsystem has a specification document before implementation
- All TBs have a README in `docs/tracer_bullets/TB-<NNN>/`
- CAPABILITY_MATRIX.md updated on every TB completion
- DECISION_LOG.md updated for significant decisions
- SESSION_HANDOFF.md generated at end of every session

---

## 10. Definition of Done (PROJECT_RULES.md §8)

| Gate | Criteria |
|------|----------|
| Feature | Works as specified |
| Documentation | Updated (TB README, CAPABILITY_MATRIX, any affected specs) |
| QA Review | Complete, findings in QA_BACKLOG |
| QA Resolution | Findings resolved or formally accepted |
| Tests | Executed where applicable |
| GitHub | Committed, pushed, verified |

---

## 11. Core Documents (PROJECT_RULES.md §12)

Changes to these require QA review:

| Document | Purpose |
|----------|---------|
| MASTER_DIRECTIVE.md | Specification contract |
| PROJECT_RULES.md | Engineering rules |
| PROJECT_DASHBOARD.md | Pulse, pipeline, risks |
| CAPABILITY_MATRIX.md | What works today |
| DECISION_LOG.md | Why decisions were made |
| ENGINEERING_DEBT.md | Known debt |
| ENGINEERING_STANDARDS.md | This document |

---

## 12. Architecture Freeze

```
7100CPT Studio → EcuService → EcuProtocol ← RusEFIProtocolAdapter → UsbTransport → rusEFI
```

Frozen 2026-07-03. Changes require ADR + Engineering Review + QA.

---

## 13. Do Not Rebuild (PROJECT_RULES.md §10.1)

Before implementing any directive:

1. Compare directive against current repository state
2. Identify completed work, partial work, missing work
3. Implement ONLY the missing work
4. Update documentation to match reality

---

*This document consolidates standards from PROJECT_RULES.md, MASTER_DIRECTIVE.md, TRACER_BULLETS.md, CAPABILITY_MATRIX.md, and DECISION_LOG.md. When conflicts exist, the original document prevails.*
