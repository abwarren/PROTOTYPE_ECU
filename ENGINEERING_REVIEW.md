# ENGINEERING_REVIEW.md — Independent Engineering Assessment

> **Date:** 2026-07-03
> **Reviewer:** Principal Engineer
> **Branch:** feature/hardware-schematic-v1
> **Methodology:** Read-only inspection. Evidence from git and filesystem, not documentation claims.

---

## Executive Summary

The 7100CPT ECU Platform is a specification-rich, architecturally mature project at an early implementation stage. Governance is frozen, architecture is well-designed, and the engineering process is professional. The project's primary risk is not architectural but existential: it has produced 140+ documents against zero verified end-to-end capability. The gap between documentation confidence (~78%) and actual working software+hardware capability (~10%) is the central challenge.

**Repository Maturity Score: 42/100**

| Dimension | Score | Grade |
|-----------|-------|-------|
| Architecture & Design | 78/100 | B+ |
| Documentation & Governance | 82/100 | A- |
| Software Implementation | 28/100 | F |
| Hardware Implementation | 8/100 | F |
| Testing & Verification | 0/100 | F |
| Build & CI Pipeline | 52/100 | D- |
| Manufacturing Readiness | 5/100 | F |
| Commercial Readiness | 35/100 | F |

**The single most important sentence in this review:** The project has defined 9 MVP tracer bullets, completed 3 (all C0/C1 — designed, not verified on hardware), and has no integration tests, no QA sign-off on any TB, and no working end-to-end demonstration. The architecture is ready. The product is not.

---

## Architecture Assessment

### Strengths

1. **Three-layer communication architecture (ADR-0010, ADR-0012).** Transport (EcuTransport) → Protocol (EcuProtocol) → Service (EcuService) is well-defined with clean interfaces. The UI never touches USB/CAN directly. This is professional-grade architecture — correct dependency direction, mockable interfaces, extensible for future transports.

2. **Repository trait abstraction (ADR-0011).** CalibrationRepository, VehicleRepository, TelemetryRepository, SessionRepository are defined as traits before any concrete implementation. This ensures SQLite → PostgreSQL migration requires zero UI changes.

3. **Platform-Studio separation (ADR-0009).** The decision to treat Studio as the product and firmware as the invisible engine is strategically correct. rusEFI is a foundation, not a differentiator. The protocol adapter pattern isolates GPL firmware from proprietary Studio.

4. **BrandProvider pattern (ADR-0004).** Single source of truth for branding. UI components consume BrandProvider, never import brand assets directly. White-label ready.

5. **Two-Agent engineering model (ADR-0008).** Clear separation of Engineering Agent (delivers) and QA Agent (challenges). Governance frozen — this prevents process thrashing.

6. **Specification-first hardware design.** 16 design specification documents covering architecture, MCU selection, power, protection, CAN, USB, EMC, PCB, DFM, DFT, components, interface, compliance, and risks. This is a complete SDS that any professional PCB house can implement.

### Architecture Smells

1. **No capability matrix exists despite governance documents referencing it.** PROJECT_STATUS.md tracks progress informally but there is no CAPABILITY_MATRIX.md with evidence-backed C0-C4 levels. This makes it impossible to answer "what works today?" with objective evidence.

2. **MASTER_DIRECTIVE.md §5 is marked SUPERSEDED but §6 still lists 20-agent specification documents as pending.** The governance documentation carries contradictory models. The specification program is dead; the document should reflect reality or archive the references.

3. **REPOSITORY_MANIFEST.md claims 143 markdown documents and 18-directory structure but is stale.** It references Phase 0 Specification Campaign (superseded), 2 branches (there are more), and the 11-agent operational system (replaced by Two-Agent Model).

4. **QA_BACKLOG.md has 15 items still in "Open" section, 4 marked "Resolved" in their Status field but never moved to the Resolved section.** This is the "Resolved in text, Open in section" failure mode identified in the engineering-review skill. QA-001 (.gitmodules), QA-002 (CI branches), QA-008 (submodule artifacts), QA-010 (competing agent systems) all have Status: Resolved in their descriptions but sit under ## Open.

5. **Dual notation hazard.** DESIGN_PACKAGE.md specifies 34-pin AMPSEAL connector. RISK_REGISTER.md references 42-pin Deutsch DTM. This is a contradiction in the specification — both cannot be true. The 34-pin appears to be the authoritative source (frozen in INTERFACE_SPECIFICATION.md) but the risk register was not updated.

6. **12 empty firmware directories.** firmware/bootloader/, can/, config/, diagnostics/, drivers/, fuel/, ignition/, logging/, platform/, scheduler/, sensors/, storage/ are all empty directories. QA-011 flagged this and it remains Open. These imply an architecture that doesn't exist.

---

## Capability Review

### What Works (Verified by Evidence)

| Capability | Level | Evidence |
|-----------|-------|----------|
| rusEFI firmware builds for f407-discovery | C1 | Binary exists (727KB), committed build pipeline |
| Studio frontend builds (Vite) | C1 | dist/ committed, 31 modules, 508ms |
| Studio loads brand.json at runtime | C1 | BrandProvider fetches and parses brand.json |
| DDD quality gate passes | C1 | scripts/ddd-check.sh — 33/33 |

### What Exists but Is Not Verified

| Capability | Status | Reality |
|-----------|--------|---------|
| Studio connects to ECU (TB-003) | Claimed "C2" in PROJECT_STATUS.md | No USB transport implementation exists. EcuTransport is an interface. No concrete implementation of discover(), connect(), sendFrame(). |
| Communication layer (TB-003) | Claimed "100%" in PROJECT_STATUS.md | 100% of interfaces defined, 0% of implementations. EcuProtocol passes transport as a parameter — correct design, zero code behind it. |
| Application Core (TB-002A) | Engineered | 7 service interfaces (Logger, ConfigManager, Workspace, NotificationService, TelemetryService, UpdateManager, LicenseService). All are interfaces only. No implementations. |

### What Is Genuinely Missing

1. No concrete USB transport implementation (UsbTransport class implementing EcuTransport)
2. No concrete rusEFI protocol implementation (RusEfiProtocol class implementing EcuProtocol)
3. No concrete service implementations (ConsoleLogger, JsonConfigManager, SqliteWorkspace)
4. No integration between Studio and firmware
5. No automated tests (despite "testable" being a mandatory tracer bullet criterion)
6. No CI beyond documentation checks
7. No installer / packaging pipeline
8. KiCad schematic has zero circuit components placed — 12 empty sheets

---

## Hardware Reality Check

The documentation describes TB-HW-002 as "in progress" with "project skeleton created." The filesystem evidence:

| Artifact | Documentation Claim | Actual State |
|----------|-------------------|--------------|
| 12 hierarchical sheets | "Created" | Exist — are empty title blocks (29 lines each, zero symbols) |
| Root sheet | Has sub-sheet symbols | 13 hierarchical sheet symbol instances — correct, no circuits |
| Symbol library | 7100CPT.kicad_sym created | Exists — empty (no custom symbols defined) |
| Footprint library | 7100CPT.pretty/ created | Directory exists — empty (no custom footprints) |
| PCB layout (.kicad_pcb) | Not started | Does not exist |
| BOM | Referenced in docs | Does not exist |
| Gerbers | Referenced in docs | Do not exist |
| STEP enclosure | Referenced in docs | Does not exist (enclosure.md has text description) |
| Pick-and-place | Referenced in docs | Does not exist |
| Manufacturing package | Referenced in docs | Does not exist |

**Hardware status: 0% circuit design complete.** The skeleton is correct — sheet hierarchy matches the specification — but every circuit remains to be designed. The claimed "10% KiCad progress" reflects file structure only, not circuit capture.

---

## Technical Debt

### Critical (Blocks Progress)

| ID | Item | Impact |
|----|------|--------|
| D-001 | rusEFI submodule is 30+ commits behind upstream | Build compatibility risk if upstream API changes |
| D-002 | No test framework exists | Cannot verify any TB — violates mandatory completion criteria |
| D-003 | QA_BACKLOG.md has stale items | 4 items "Resolved" but still listed as Open |
| D-004 | Zero circuit components in KiCad | Hardware implementation has not started |

### High (Will Block Next Phase)

| ID | Item | Impact |
|----|------|--------|
| D-005 | No protocol wire format specification | TB-003 cannot implement transport |
| D-006 | No database schema | TB-006/007 blocked |
| D-007 | 12 empty firmware directories | Implies architecture that doesn't exist |
| D-008 | GPL license boundary not defined | Legal risk for commercial distribution |
| D-009 | No safety architecture | Product controls engine without documented fail-safe analysis |

### Medium (Process Quality)

| ID | Item | Impact |
|----|------|--------|
| D-010 | REPOSITORY_MANIFEST.md stale | Misleading for new engineers |
| D-011 | Connector pin count contradiction | 34-pin AMPSEAL vs 42-pin Deutsch — unclear which is authoritative |
| D-012 | No ENGINEERING_DEBT.md at root | Debt tracked in TECH_DEBT.md only (firmware-focused) |
| D-013 | MASTER_DIRECTIVE.md §5 SUPERSEDED but §6 references it | Documentation inconsistency |

---

## Risks — Top 10

| # | Risk | Probability | Impact | 
|---|------|------------|--------|
| 1 | Project produces documentation indefinitely without shipping code | High | Existential |
| 2 | No integration verified — all components tested in isolation only | Certain | Technical |
| 3 | rusEFI protocol incompatible with designed protocol layer | Medium | High |
| 4 | S32K344 lead time (26+ weeks) delays hardware validation | Medium | High |
| 5 | No test framework means no regression protection | Certain | Medium |
| 6 | Upstream rusEFI diverges beyond mergeability | Low | High |
| 7 | GPL legal risk not assessed — could block commercial launch | Medium | High |
| 8 | No hardware target exists — all firmware development on Discovery board | Certain | Medium |
| 9 | Single engineer bus-factor | High | Medium |
| 10 | Architecture designed for scale with zero users | Medium | Low |

---

## Recommended Priorities

### P0 — Do First (Next 2 Sessions)

1. **Build a test framework.** Tests are mandatory per TRACER_BULLETS.md §5. Without tests, no TB can meet its own completion criteria. Scaffold: Jest + React Testing Library for Studio, Google Test for firmware adapter.

2. **Implement UsbTransport (concrete class for EcuTransport interface).** The interface exists. Make it real. Discover USB devices, connect, send raw frames — even if the protocol doesn't understand the response yet.

3. **Define the wire protocol specification.** Frame format, CRC algorithm, handshake sequence, error codes. This unblocks TB-003. Write it as a markdown spec, not as code — both firmware adapter and Studio implement from the same spec.

4. **Fix QA_BACKLOG.md staleness.** Move QA-001, QA-002, QA-008, QA-010 from Open → Resolved. This is a 5-minute fix that restores the backlog's credibility.

### P1 — Next Sprint

5. **Implement RusEfiProtocol (concrete class for EcuProtocol interface).** Handshake, readSensors, readCalibration, writeCalibration. Implement the protocol spec from P0 item 3.

6. **Wire end-to-end: Studio → UsbTransport → RusEfiProtocol → ECU.** TB-003 demo gate: discover, connect, handshake, ECU identity displayed in Studio.

7. **Populate KiCad schematic.** Place components on power sheet and MCU sheet first (these are prerequisite for all others). Use NXP reference designs from REUSE_MATRIX.

8. **Sync rusEFI submodule to current upstream.** Resolve the GCC 12 build fix via build script (as documented in repository-audit skill). Keep submodule at pristine upstream commit.

### P2 — This Month

9. **Create CAPABILITY_MATRIX.md with C0-C4 levels.** Every capability backed by evidence. This becomes the single-page answer to "what works?"

10. **Implement concrete services for Application Core.** ConsoleLogger, JsonConfigManager, SqliteWorkspace. The interfaces exist. Make them real.

11. **Define database schema.** Required by TB-006 and TB-007. SQLite for V1, but defined through the Repository trait interfaces (ADR-0011).

12. **Define GPL/proprietary boundary.** Formalize in an ADR. This is a legal prerequisite for commercial distribution.

### P3 — Before Hardware Fab

13. **Complete KiCad schematic capture.** All 12 sheets populated, ERC clean. This is 80% of the hardware development effort and the gate before PCB layout.

14. **Resolve connector specification.** Freeze on 34-pin AMPSEAL or 42-pin Deutsch. Update all documents to match.

15. **Write safety architecture document.** What happens when the ECU crashes? What are the fail-safe states? Required before any vehicle testing.

---

## What Should NOT Be Changed

1. **Three-layer communication architecture.** Transport → Protocol → Service. This is correct.
2. **Repository trait pattern.** Interface-before-implementation for all data access. Correct.
3. **Two-Agent engineering model.** Engineering Agent delivers, QA Agent challenges. Correct and frozen.
4. **Tracer Bullet methodology.** Small vertical slices, each proven end-to-end. Correct approach.
5. **Specification-first hardware design.** The 16 hardware spec documents are professional-grade. Do not restart.
6. **rusEFI as firmware foundation.** Strategic decision validated by ADR-0002. Only change if real integration problems emerge.
7. **Governance freeze.** Process is established. More process is procrastination. Build.

---

## Quick Wins (Under 30 Minutes Total)

| # | Action | Time |
|---|--------|------|
| 1 | Move QA-001/002/008/010 from Open → Resolved in QA_BACKLOG.md | 5 min |
| 2 | Fix RISK_REGISTER.md R-008 (42-pin → 34-pin AMPSEAL) | 2 min |
| 3 | Update REPOSITORY_MANIFEST.md to reflect current state | 10 min |
| 4 | Add MASTER_DIRECTIVE.md §6 note that P0 specs are superseded by TB approach | 5 min |
| 5 | Update ENGINEERING_KPIS.md session 004 entry | 5 min |

---

## If I Joined This Project as Chief Engineer Today

### 90-Day Roadmap

**Week 1-2: Make something work end-to-end.**
- Implement UsbTransport (concrete)
- Implement RusEfiProtocol (concrete)  
- Connect Studio to Discovery board over USB CDC
- Demonstrate: ECU identity displayed in Studio
- This proves the architecture works. Until this happens, nothing else matters.

**Week 3-4: Add verification.**
- Test framework: Jest for Studio, Google Test for firmware adapter
- TB-003 demo gate evidence: USB detect, connect, handshake, identity
- Live RPM from ECU displayed in Studio (TB-004)
- Every TB from now on requires demo evidence before "complete"

**Week 5-8: Build the MVP.**
- Calibration read/write (TB-005)
- PostgreSQL persistence (TB-006, TB-007)
- Datalogging and session report (TB-008)
- Synchronize rusEFI submodule to latest upstream

**Week 9-12: Hardware gets real.**
- Complete KiCad schematic for all 12 sheets (TB-HW-002)
- ERC clean, design review, PCB layout begin (TB-HW-003)
- Build pipeline: CI produces a Linux AppImage or .deb
- Write GPL boundary ADR

**Month 4-6 (beyond 90 days):**
- PCB fabrication + assembly
- Hardware bring-up
- Port firmware adapter from Discovery to S32K344
- First vehicle bench test

### What I Would Stop Immediately

1. **Producing more specification documents.** 16 hardware specs, 12 ADRs, 140+ markdown files. The architecture is documented. Build.
2. **Updating governance documents.** Governance is frozen. Stop refining it.
3. **Writing documentation for subsystems that have no implementation.** Documentation without code is speculation.

### What I Would Start Immediately

1. Code that exercises the architecture end-to-end.
2. Tests that prove it works.
3. Evidence that replaces documentation claims.

---

## Engineering Debt Register

This review identifies 13 debt items (D-001 through D-013 above). A formal `ENGINEERING_DEBT.md` should be created at root level tracking these with assigned owners and target resolution dates. See `engineering-review` skill references for template.

---

## Conclusion

The 7100CPT ECU Platform has an unusually strong architecture and governance foundation for a project at this stage. The design decisions are sound. The interfaces are correct. The process is professional.

The project is now at a critical inflection point. 140+ documents, 12 ADRs, frozen governance — this is the maximum reasonable amount of process for a 3-session-old project. The architecture has been designed. The specifications have been written. The interfaces have been defined. The governance has been frozen.

The only thing left to do is build.

Every session from this point forward should produce verified capability, not more documentation. Measure progress in TB demo gates passed, not markdown files committed. The next commit that adds a specification document without corresponding implementation code should be questioned.

**Final verdict:** Architecture is ready. Product is not. Build TB-003 this session.

---

*Review completed 2026-07-03. Based on filesystem and git evidence, not documentation claims.*
*See QA_BACKLOG.md for findings to be tracked.*
