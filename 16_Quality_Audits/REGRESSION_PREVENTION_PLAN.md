# REGRESSION_PREVENTION_PLAN.md — Guardrails for Engineering Quality

> **Type:** EDR Companion — Quality Domain
> **Governance:** Per ADR-0007 — proposals only

---

## 1. Purpose

Prevent regressions in architecture, documentation, repository health, and engineering process as the project scales from 1 developer to multiple engineers and AI agents.

---

## 2. Current Regression Risks

### 2.1 Documentation Regressions

| Risk | Trigger | Impact | Prevention |
|------|---------|--------|------------|
| Cross-reference rot | File renamed or moved | Broken links in 143 .md docs | Automated link checker in DDD gate |
| Content divergence | MASTER_DIRECTIVE and CONTEXT_LIFECYCLE updated independently | Contradictory policies | Consolidate into single source |
| Stale status docs | PROJECT_STATUS.md not updated after sessions | Agents work from outdated state | Mandatory session checklist enforces update |
| Broken ADR chain | ADR not created before architecture change | Lost decision rationale | ADR-0007 enforcement |

### 2.2 Repository Regressions

| Risk | Trigger | Impact | Prevention |
|------|---------|--------|------------|
| .gitmodules breakage | Repository restructure | Cannot clone | DDD gate pre-push check for .gitmodules validity |
| CI silent failure | Branch rename without workflow update | Quality gate not enforced | CI status badge in README; alert on workflow failure |
| Submodule pollution | Build generates files in upstream dir | Generated files committed accidentally | .gitignore in submodule root |
| Lost submodule commits | Submodule re-cloned without pushing | GCC fix lost | Track submodule commits in project repo (commit hash pinned) |

### 2.3 Architecture Regressions

| Risk | Trigger | Impact | Prevention |
|------|---------|--------|------------|
| GPL contamination | Platform code links against rusEFI symbols | Entire codebase becomes GPL | Compile-time GPL boundary check (linker map audit) |
| Protocol divergence | Firmware and Studio implement protocol independently | Incompatible communication | Shared protocol specification + conformance test vectors |
| FreeRTOS/ChibiOS drift | New developers follow architecture doc (FreeRTOS) but code uses ChibiOS | Integration failures | Architecture doc reflects actual code |
| Safety degradation | Safety features removed during optimization | Unsafe ECU behavior | Safety regression test suite (fault injection) |

### 2.4 Process Regressions

| Risk | Trigger | Impact | Prevention |
|------|---------|--------|------------|
| Session handoff decay | Agents skip handoff steps under time pressure | Lost context between sessions | Automated check: last handoff date vs last commit date |
| DDD gate bypass | Agent skips `--ci` flag | Documentation decays silently | CI enforces DDD gate on push (once CI is fixed) |
| Agent system conflict | Phase 0→Phase 1 transition | Ownership fights over directories | Merged agent system eliminates conflict |
| Startup drift | New agents read different document set than policy requires | Inconsistent understanding | Automated startup checklist verification |

---

## 3. Prevention Mechanisms

### 3.1 Automated Guards (Implemented in CI)

| Guard | When | What It Checks |
|-------|------|----------------|
| DDD quality gate | Every push | 33 documentation checks |
| Link checker | Every push (proposed) | No broken internal .md links |
| .gitmodules validator | Every push (proposed) | URL is absolute, not relative |
| Submodule integrity | Every push (proposed) | Submodule commit matches .gitmodules |
| Protocol conformance | Every PR (future) | Reference implementation passes test vectors |

### 3.2 Manual Guards (Enforced by Process)

| Guard | When | Who |
|-------|------|-----|
| ADR before architecture change | Before any architecture doc modification | Agent 01 |
| GPL boundary audit | Before any firmware platform code commit | Agent 02 + Agent 19 |
| Safety review | Before any engine-connected testing | Agent 10 |
| Session handoff verification | End of every session | All agents |
| REPOSITORY_MANIFEST update | After directory structure changes | Agent 00 |

### 3.3 Detection Mechanisms (Monitoring)

| Mechanism | What It Detects |
|-----------|-----------------|
| CI status badge in README | Immediately visible if CI is broken |
| Handoff staleness check | Days since last handoff > session target |
| Cross-reference audit | Quarterly manual review of all .md links |
| Dependency freshness | Monthly check of upstream rusEFI for new commits |

---

## 4. Regression Response Protocol

When a regression is detected:

1. **STOP** current work on affected subsystem
2. **DOCUMENT** the regression in `16_Quality_Audits/regressions/YYYY-MM-DD-description.md`
3. **ASSESS** impact: what depends on the broken component?
4. **FIX** the regression with a focused commit
5. **ADD** a guard to prevent recurrence
6. **VERIFY** the guard works (intentionally trigger the condition)

---

## 5. Priority Regressions to Prevent Now

Based on current project state, the highest-impact regressions to prevent:

1. **GPL contamination** — most expensive to fix, must be prevented from first line of code
2. **Protocol divergence** — will waste weeks of integration effort, must be designed first
3. **Documentation rot** — already identified (D-023, D-024), fix before docs grow further
4. **CI silent failure** — D-017, the quality gate is our only automated guard
5. **Agent system conflict** — D-022, will cause confusion at Phase 0→Phase 1 transition

---

*Per ADR-0007, this is a proposal. Prevention mechanisms should be integrated into CI and process documents after review.*
