# ENGINEERING_REVIEW.md — 7100CPT Platform Independent Audit

> **Review Date:** 2026-07-03
> **Reviewer:** Principal Engineer (Independent Audit)
> **Scope:** Full repository audit — architecture, governance, code, docs, CI/CD, QA
> **Methodology:** Evidence-based. Every finding traceable to a specific file, commit, or runtime output.
> **Governance:** This is a review document. It proposes — it does not modify baseline documents. Changes accepted through separate PR per ADR-0007.

---

## 1. Executive Summary

The 7100CPT ECU Platform repository demonstrates **strong governance discipline and clean architecture** for a project transitioning from design to delivery. The frozen 3-layer architecture (Service → Protocol → Transport) is well-designed with proper separation of concerns via TypeScript interfaces. The Tracer Bullet methodology, C0-C4 capability tracking, and 7-artifact completion rule create a solid engineering framework.

**The primary gap is the complete absence of automated testing.** 1,452 lines of TypeScript and Rust source code with zero test files — no unit tests, no integration tests, no end-to-end tests. Three engineering debt items (ED-020, ED-021, ED-022) acknowledge this but remain open with no scheduled resolution. Every code change requires manual regression testing against hardware the team may not yet have.

**The secondary concern is QA backlogs not reflecting reality.** The QA_BACKLOG.md shows 15 items as "Open" but at least 4 (QA-016 through QA-019) are described as "Resolved" in their own finding text. This mismatch between description and status section means future sessions will waste time re-investigating closed findings.

**Repository Maturity Score: 7/10**

Architecture and governance are mature. Quality assurance infrastructure is absent. The project is well-prepared to build capabilities but poorly prepared to verify them.

---

## 2. Repository Maturity Score

| Category | Score | Rationale |
|----------|-------|-----------|
| Architecture | 8/10 | Clean 3-layer design, well-defined interfaces, frozen appropriately |
| Governance | 9/10 | Exceptionally thorough: ADRs, QA loop, handoff protocol, Capability Matrix |
| Code Quality | 6/10 | Clean TypeScript and Rust, but App.tsx couples to concrete UsbTransport |
| Testing | 1/10 | Zero automated tests. Not a single test file exists. |
| Documentation | 8/10 | Comprehensive (214 docs), but some stale references (README phase, QA_BACKLOG) |
| CI/CD | 3/10 | Pipeline YAML exists but never triggered. DDD check runs on PR but no build CI. |
| Build Pipeline | 7/10 | Firmware builds verified. Studio frontend builds. Native Tauri build blocked on deps. |
| Operational Readiness | 5/10 | Good for design phase, insufficient for capability verification |

**Overall: 7/10**

---

## 3. Architecture Assessment

### 3.1 Frozen Architecture (D-001)

The architecture is correctly frozen at:

```
7100CPT Studio → EcuService → EcuProtocol (interface) ← RusEFIProtocolAdapter → UsbTransport → rusEFI
```

This is a well-layered design. Evidence from source code confirms it is implemented as documented.

### 3.2 Layer-by-Layer Assessment

#### Transport Layer (ADR-0010) — STRONG

- `EcuTransport` interface: 6 methods (discover, connect, disconnect, sendFrame, heartbeat, onStateChange)
- Concrete: `UsbTransport.ts` (155 lines) — clean implementation wrapping Tauri serial commands
- Rust backend (`lib.rs`, 155 lines): 5 Tauri commands, proper state management with Mutex<HashMap>
- **Evidence:** Source at `studio/core/transport/EcuTransport.ts`, `studio/core/transport/UsbTransport.ts`, `studio/src-tauri/src/lib.rs`

#### Protocol Layer (ADR-0012) — STRONG

- `EcuProtocol` interface: 7 methods (handshake, readSensors, readCalibration, writeCalibration, readDTCs, clearDTCs, sendCommand)
- Concrete: `RusEFIProtocolAdapter.ts` (239 lines) — knows rusEFI TS protocol framing, CRC stub, 7 command IDs documented
- Protocol framing documented: cmd + len16 + reserved + payload + CRC32
- **Evidence:** Source at `studio/core/transport/EcuProtocol.ts`, `studio/adapters/RusEFIProtocolAdapter.ts`

#### Service Layer — STRONG

- `EcuService` (72 lines): business logic facade, never touches Transport directly
- Proper dependency injection: constructor takes `EcuProtocol` + `EcuTransport`
- **Evidence:** Source at `studio/core/services/EcuService.ts`

#### UI Layer — ADEQUATE WITH CONCERN

- `App.tsx` (230 lines): functional, state-driven, clean
- **Concern:** App.tsx creates singleton instances directly (line 15-17):

```typescript
const transport = new UsbTransport();
const adapter = new RusEFIProtocolAdapter();
const ecu = new EcuService(adapter, transport);
```

This hard-codes UsbTransport — switching to CAN or mock transport requires editing App.tsx. The DI is correct in EcuService constructor but the wiring at top-level App couples the UI to concrete implementations.

#### Repository Traits (ADR-0011) — DESIGNED, NOT IMPLEMENTED

Five repository interfaces defined at `studio/core/repositories/types.ts`: CalibrationRepository, VehicleRepository, FirmwareRepository, TelemetryRepository, SessionRepository. All remain unimplemented. This is appropriate for current phase — interfaces are defined per the pattern, concrete implementations can follow when TB-013/014 (Calibration DB) begin.

### 3.3 Dependency Direction — CORRECT

Dependencies flow UI → Service → Protocol Interface ← Adapter → Transport Interface ← Concrete Transport → Tauri → Serial Port. No upward dependencies. Service depends on interfaces, not concretions. Protocol layer is decoupled from transport layer.

### 3.4 Naming Consistency — GOOD

`EcuProtocol`, `EcuTransport`, `EcuService`, `EcuIdentity`, `EcuDevice`, `RusEFIProtocolAdapter`, `UsbTransport` — consistent prefix pattern. Minor inconsistency: `CalTable` vs `Calibration` (abbreviated in data type, full in service methods).

---

## 4. Strengths

### 4.1 Governance Infrastructure (Exceptional)

- 12 ADRs with full rationale, alternatives considered, and approval records
- Two-Agent model with clear Engineer/QA boundaries
- 7-artifact TB completion rule prevents "code written = done" drift
- C0-C4 capability levels with mandatory evidence gates
- Session handoff protocol with chronological index
- Architecture freeze with change governance

### 4.2 Specification-First Engineering

- Hardware: 16 documents, Phase 0 Reuse Matrix (41 blocks with provenance)
- Firmware: rusEFI upstream unmodified, adapter pattern isolates dependency
- Studio: 3-layer architecture designed before implementation
- Decision log with 5 records documenting rationale

### 4.3 Tracer Bullet Methodology

- 13 MVP + 6 long-term tracer bullets defined
- TB-005 A/B split correctly separates implementation (C1) from verification (C2/C3)
- Dependency graph shows parallelizable workstreams

### 4.4 Hardware Design Discipline

- NXP reference-following mandate with REUSE_MATRIX.md
- 34-pin consolidated interface frozen
- Phase 0 gate prevents schematic work without approved design baseline

### 4.5 Code Quality (What Exists)

- Clean TypeScript with proper interfaces
- Rust backend follows idiomatic patterns
- No lint errors
- CSS module approach for styling
- BrandProvider for branding separation

---

## 5. Weaknesses

### 5.1 Zero Automated Tests (CRITICAL)

| Debt ID | Finding | Impact |
|---------|---------|--------|
| ED-020 | No Studio tests (TypeScript) | Every UI change is manual regression |
| ED-021 | No firmware build tests | Cannot verify build produces correct binary |
| ED-022 | No integration tests | Cannot verify Studio ↔ ECU communication without hardware |

Not a single `*.test.ts`, `*.spec.ts`, or `*.test.rs` file exists outside node_modules. The project has 1,452 lines of source code with 0 test lines. The 7-artifact completion rule (PROJECT_RULES §11.4) requires "Automated test" as artifact #2, yet TB-001 through TB-005A have all been marked complete without any test files.

**Impact:** When TB-005B requires verification against real hardware, there is no way to validate that changes to UsbTransport or RusEFIProtocolAdapter don't break existing behavior. The CI pipeline (TB-CI-001) will run TypeScript checks but cannot run test suites because none exist.

### 5.2 QA_BACKLOG Staleness

The QA_BACKLOG.md has 15 items all in the "Open" section. Actual status by evidence:

| Item | Backlog Status | Actual Status | Evidence |
|------|---------------|---------------|----------|
| QA-001 | Open | Resolved | .gitmodules fixed in `55e750d` |
| QA-002 | Open | Resolved | CI triggers master in `6cb1487` |
| QA-010 | Open | Resolved | ADR-0008 accepted, 20-agent marked SUPERSEDED |
| QA-013 | Open | Resolved | Tauri adopted, Electron abandoned |
| QA-016 | Open → "Resolved" in text | Resolved | ADR-0010 implemented |
| QA-017 | Open → "Resolved" in text | Resolved | ADR-0011 defined |
| QA-018 | Open → "Resolved" in text | Resolved | TB-002A completed |

At minimum 7 of 15 items are resolved but not moved. **This is a governance failure — the backlog is supposed to track findings from identification through resolution, but it's being used as a write-only log.** Future sessions will re-investigate resolved findings.

### 5.3 Documentation-to-Code Ratio (Doc-Heavy)

214 markdown documents for 1,452 lines of source code. Roughly 7:1 doc-to-code ratio by file count. While documentation discipline is valuable, the MASTER_DIRECTIVE itself lists 10+ subsystem specifications as "To Be Produced" that may never be needed at current project scale. Several specification documents reference capabilities (Mobile, Cloud, Manufacturing) that won't be built for years.

### 5.4 Stale Document References

| Document | Stale Reference | Reality |
|----------|----------------|---------|
| README.md | "Phase 1 — Foundation" | Phase is now "Engineering Execution" |
| MASTER_DIRECTIVE §10 | "Phase 0 — Specification: In Progress" | Architecture frozen, capability delivery phase |
| QA_BACKLOG header | "Session: 002, Branch: edr/architecture-review" | Current branch: feature/tb-004 |
| PROJECT_DASHBOARD "Next Action" | "Implement UsbTransport" | TB-005A already implemented (C1) |

### 5.5 App.tsx Coupling

The singleton instantiation at the top of App.tsx couples the UI module to concrete UsbTransport. This contradicts the architecture's own design principle ("UI never touches Transport directly"). While App.tsx does use `ecu.connect()` through EcuService for the handshake path, it directly calls `transport.discover()`, `transport.connect()`, and `transport.disconnect()` for device management.

**Evidence:** App.tsx lines 15, 51, 64, 82 — all direct transport calls.

---

## 6. Risks

### Top 10 Risks (Impact × Probability)

| # | Risk | Severity | Evidence |
|---|------|----------|----------|
| R-001 | S32K344 lead time > 26 weeks | 🔴 Critical | PROJECT_DASHBOARD, RISK_REGISTER |
| R-002 | No test infrastructure — every change risks regression | 🔴 Critical | Zero test files exist |
| R-003 | QA_BACKLOG staleness causes wasted investigation time | 🟠 High | 7/15 items stale |
| R-004 | rusEFI divergence (33 commits behind upstream) | 🟠 High | `git log HEAD...origin/master` |
| R-005 | TB-005B blocked on native build dependencies | 🟠 High | Linux: GTK headers; Windows: need CI |
| R-006 | Buck converter thermal marginal at 85°C | 🟠 Medium | ED-016, RISK_REGISTER R-002 |
| R-007 | No hardware available for TB-005B verification | 🟠 Medium | TB-005 README blockers section |
| R-008 | Single developer bus factor | 🟡 Medium | All commits from one author |
| R-009 | CI never triggered — unknown if windows-build.yml works | 🟡 Medium | No GitHub Actions run history |
| R-010 | Injector driver IC selection deferred | 🟡 Medium | ED-015 gates TB-HW-002 |

---

## 7. Technical Debt

### Summary

```
Open:           12
Accepted:        2  (conformal coating, single LDO — accepted for prototype)
Resolved:        0
───────────────────
Total:          14
```

### Highest Priority Debt

| ID | Title | Blocks | Effort |
|----|-------|--------|--------|
| ED-015 | Driver IC selection | TB-HW-002 schematic capture | Large |
| ED-016 | Buck thermal redesign | TB-HW-002 schematic capture | Large |
| ED-020 | No automated tests | ALL future TB verification | Medium |
| ED-022 | No integration test framework | TB-005B and beyond | Large |
| ED-004 | No CI/CD pipeline for Studio | TB-005B verification (if local build blocked) | Medium |

### Debt Not Yet In Register (Found During This Review)

- **ED-NEW-1:** QA_BACKLOG status tracking broken — resolved items not moved to Resolved section
- **ED-NEW-2:** App.tsx singleton coupling to UsbTransport contradicts architecture principle
- **ED-NEW-3:** MASTER_DIRECTIVE contains stale phase/section content (20-agent listing, Phase 0 status)
- **ED-NEW-4:** README phase references stale
- **ED-NEW-5:** rusEFI 33 commits behind upstream — no sync since fork

---

## 8. Capability Review

### Current Capability Distribution

```
Software Capabilities (19)
  C4 Production:   0
  C3 QA Verified:   3  (Firmware build, Studio launch, Studio launch QA)
  C2 Demonstrated:  1  (Application core)
  C1 Implemented:   2  (Protocol adapter, USB transport impl)
  C0 Designed:     13  (Comm arch through Cloud sync)

Hardware Capabilities (6)
  C3 QA Verified:   2  (System design spec, Reuse matrix)
  C2 Demonstrated:  1  (Interface spec)
  C0 Designed:       3  (Schematic, PCB, Manufacturing package)
```

### Key Metric

**Capabilities at C2 or above (demonstrated + verified): 7 of 25**

This is the single most useful metric per the engineering-review skill. 7 capabilities have been demonstrated or QA verified. The remaining 18 are at C1 (code written) or C0 (designed only).

### Next Capability to Advance

**TB-005B: USB Transport C0 → C2**
- Prerequisite: Native binary + hardware
- Blocked by: Linux build dependencies OR CI pipeline run

---

## 9. CI/CD Assessment

### Current State

| Pipeline | File | Status |
|----------|------|--------|
| DDD Quality Gate | `.github/workflows/ddd-check.yml` | Exists — triggers on PR, push to master |
| Windows Build | `.github/workflows/windows-build.yml` | Exists — NEVER TRIGGERED |

The Windows build pipeline (TB-CI-001) is well-structured:
- Checkout → Node 20 → Rust → Tauri CLI → tsc check → Vite build → Tauri NSIS → artifact upload → smoke test
- 13 steps, all correctly ordered
- Caching configured for cargo and npm

**But it has never been pushed to trigger.** The workflow triggers on push to master and pull_request to master. The current branch (`feature/tb-004-rusefi-protocol-adapter`) would not trigger it. To verify the pipeline works, a push to master (or opening a PR to master) is needed.

---

## 10. Recommended Priorities

### High Impact (Do First)

| # | Recommendation | Effort | Impact |
|---|---------------|--------|--------|
| H1 | **Fix QA_BACKLOG staleness.** Move QA-001, QA-002, QA-010, QA-013, QA-016-019 to Resolved section. Update statuses to reflect reality. | 5 min | Prevents wasted future investigation |
| H2 | **Trigger TB-CI-001.** Push to master or open PR to verify Windows Build pipeline works. This unblocks TB-005B verification path. | 15 min | Capability multiplier — enables binary verification without local build deps |
| H3 | **Sync rusEFI upstream.** 33 commits behind. Documented sync procedure exists (`04_Firmware/UPSTREAM_SYNC.md`). Execute it before divergence widens. | 30 min | Prevents merge debt accumulation |
| H4 | **Implement test framework scaffold.** Create at minimum a Jest/Vitest config for Studio. Add one trivial test to prove the pipeline. This addresses ED-020 and QA-014 simultaneously. | 2 hrs | Closes 3 debt items, enables future TB test artifacts |
| H5 | **Resolve App.tsx coupling.** Wrap transport/adapter/service creation in a factory or composition root. App.tsx should receive pre-built EcuService, not construct the chain. | 30 min | Aligns code with documented architecture principle |

### Medium Impact

| # | Recommendation | Effort | Impact |
|---|---------------|--------|--------|
| M1 | **Add build-only CI check.** A simple workflow that runs `npx tsc --noEmit` and `npm run build` on every push to any branch. This catches regressions before they merge. | 20 min | Prevents broken builds on master |
| M2 | **Fix stale document references.** Update README phase, MASTER_DIRECTIVE §10, PROJECT_DASHBOARD next action. | 15 min | Prevents agent confusion on next session |
| M3 | **Clean MASTER_DIRECTIVE §5 (20-agent program).** The section is marked SUPERSEDED but retains 24 lines of agent listing. Trim to 3-line pointer to ADR-0008. | 10 min | Reduces reading load for new sessions |
| M4 | **Rename rusefi.bin → 7100cpt.bin** (ED-002). Low-effort, high-visibility. | 30 min | Professionalizes firmware output |
| M5 | **Add markdown link checker to DDD quality gate** (QA-012). 214 documents with cross-references — link rot is certain. | 1 hr | Prevents documentation drift |

### Low Impact

| # | Recommendation | Effort | Impact |
|---|---------------|--------|--------|
| L1 | **Fix app identifier namespace** (ED-006). Change `com.prototype-ecu.studio` → `com.7100cpt.studio` in tauri.conf.json. | 5 min | Branding consistency |
| L2 | **Automate session handoff** (ED-023). Add git hook or script that prompts for SESSION_HANDOFF.md before push. | 1 hr | Enforces mandatory governance |
| L3 | **Add CalTable → CalibrationTable consistency.** Either abbreviate all or none of the data type names. | 10 min | Naming hygiene |
| L4 | **Trim "To Be Produced" specifications.** MASTER_DIRECTIVE §6 lists 13 subsystem specs as required before implementation. At least 6 are for future phases (Cloud, Mobile, Manufacturing, Compliance, Business Model). Move to future-phase appendices. | 15 min | Reduces perceived unfinished work |

---

## 11. Quick Wins (Under 30 Minutes Total)

All five can be done in a single short session:

1. Fix QA_BACKLOG.md — move resolved items to correct sections (5 min)
2. Update PROJECT_DASHBOARD.md Next Action: "TB-005B: native binary + demo gate" (2 min)
3. Update README.md Phase: "Engineering Execution" (1 min)
4. Fix app identifier in tauri.conf.json (5 min)
5. Add triggers for feature branches to windows-build.yml so it runs on push to `feature/*` (5 min)

**Total: ~18 minutes.** This closes 3 stale document references, 1 branding inconsistency, and enables CI verification on the active branch.

---

## 12. Process Observations

### What Works Well

- **Tracer Bullet A/B split:** Separating implementation (C1) from verification (C2) prevents false completion claims. TB-005A correctly reports C1 — code compiles but not yet demonstrated.
- **Architecture freeze decision:** Correctly timed. Further architecture iteration would delay capability delivery without adding value.
- **Demo Gates:** The requirement for specific, observable criteria before TB completion is the right standard.
- **Reuse Matrix:** Hardware provenance tracking per circuit block prevents design drift.

### Process Gaps

- **QA_BACKLOG maintenance is not being enforced.** The backlog's value comes from accurate status tracking. Stale entries destroy that value.
- **7-artifact rule is being honored selectively.** Artifact #2 (automated test) has been skipped for every completed TB. Either enforce it or formally accept the skip in DECISION_LOG.
- **Session handoff index incomplete.** README shows Sessions 1-3 complete, Session 4 pending. But git log shows work beyond Session 3 (TB-003, TB-004, TB-005A). Handoffs for Sessions 4+ are missing.

---

## 13. Long-Term Recommendations

These are architectural or process improvements that aren't urgent but would improve engineering quality over time:

1. **Dependency injection container.** As the number of services grows, manual wiring in App.tsx becomes unmaintainable. A lightweight DI approach (service locator or composable factory) would keep the composition root clean.

2. **Mock Transport for testing.** Implement a `MockTransport` that implements EcuTransport for integration testing Studio ↔ Protocol without hardware. This is already architected (the Transport trait supports it) but not built.

3. **Snapshot testing for UI.** When calibration tables and telemetry dashboards are built, visual regression tests via screenshot comparison would catch rendering bugs.

4. **Canonical error code registry.** Define error codes for Studio (ECU-XXX pattern from ENGINEERING_STANDARDS) and maintain them in a single file. Currently errors are string messages — no structured error handling.

5. **Multi-transport readiness.** The architecture supports CAN/BLE/Ethernet but the device enumeration in App.tsx assumes USB. A transport-agnostic device model would reduce future refactoring.

---

## 14. Review Sign-Off

| Section | Status | Notes |
|---------|--------|-------|
| Architecture | 🟢 APPROVED | Clean 3-layer design, correctly frozen |
| Implementation | 🟢 APPROVED WITH CONDITIONS | Code quality good; App.tsx coupling should be resolved |
| Governance | 🟡 APPROVED WITH CONDITIONS | QA_BACKLOG maintenance gap must be fixed |
| Documentation | 🟡 APPROVED WITH CONDITIONS | 4 stale references need updating |
| Testing | 🔴 NOT VERIFIED | Zero tests exist — critical gap |
| CI/CD | 🟡 APPROVED WITH CONDITIONS | Pipeline exists but never triggered |
| Overall | 🟡 APPROVED WITH CONDITIONS | Proceed with TB-005B after fixing Quick Wins |

---

## Appendix A: Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| `MASTER_DIRECTIVE.md` | 623 | Specification contract |
| `PROJECT_RULES.md` | 385 | Engineering governance |
| `PROJECT_DASHBOARD.md` | 135 | Project pulse |
| `CURRENT_STATE.md` | 75 | Agent shared state |
| `CAPABILITY_MATRIX.md` | 83 | Verified capabilities |
| `ROADMAP.md` (11_Documentation) | 122 | Development roadmap |
| `DECISION_LOG.md` | 108 | Engineering decisions |
| `ENGINEERING_DEBT.md` | 58 | Technical debt register |
| `ENGINEERING_STANDARDS.md` | 170 | Engineering standards |
| `README.md` | 83 | Project overview |
| `SESSION_003.md` | 139 | Session handoff |
| `QA_BACKLOG.md` | 213 | QA findings |
| `EcuTransport.ts` | 51 | Transport interface |
| `EcuProtocol.ts` | 104 | Protocol interface |
| `EcuService.ts` | 72 | Service layer |
| `UsbTransport.ts` | 155 | USB transport impl |
| `RusEFIProtocolAdapter.ts` | 239 | Protocol adapter |
| `App.tsx` | 230 | Main UI |
| `lib.rs` | 155 | Rust backend |
| `windows-build.yml` | 124 | CI pipeline |
| `ddd-check.yml` | 15 | Quality gate |
| `TB-005/README.md` | 85 | Current TB |
| `REUSE_MATRIX.md` | 186 | Hardware provenance |
| `INTERFACE_SPECIFICATION.md` | 178 | Pinout specification |
| `DECISIONS.md` | 22 | ADR index |

**Total: 3,610 lines across 26 core documents, plus source code review.**

---

## Appendix B: Evidence Summary

All findings in this report are traceable to specific files or git evidence:

- **Git log:** 20 commits on `feature/tb-004-rusefi-protocol-adapter`, pushed to origin
- **Submodule:** rusEFI at `7abb688`, 33 commits behind upstream `0c955db`
- **Source lines:** 1,452 TS/RS (excluding rusEFI, node_modules)
- **Test files:** 0 (zero)
- **Markdown docs:** 214 (excluding rusEFI, node_modules)
- **ADRs:** 12 accepted, all in `17_Decisions/`
- **QA backlog:** 15 items, 7 stale
- **Engineering debt:** 14 items, 12 open
- **CI pipelines:** 2 YAML files, 0 verified runs

---

*Review complete. This document proposes changes. It does not modify baseline documents. Per ADR-0007, accepted recommendations should be implemented in a separate PR with QA approval.*
