# 🏛 MASTER_DIRECTIVE.md — The Specification Contract

> **Version:** 1.3.0  
> **Status:** Active  
> **Purpose:** This document is the single source of authority for the 7100CPT Platform. Everything below is the contract.  
> **Rule:** No implementation deviates from the specifications referenced herein. No specification changes without updating this contract.
>
> **Engineering Philosophy:** 7100CPT is developed as a production-grade platform from day one, while delivering working MVPs through small, complete vertical slices.
>
> **Phase:** Architecture Frozen → Capability Delivery (2026-07-03)

---

## 1. The Contract

The ECU Platform is built **specification-first**. Every subsystem has a written specification document that defines its architecture, interfaces, behavior, and constraints — before a single line of implementation code is written.

**Implementation starts only when all specifications are approved.**

**During implementation:**
- Code follows the specification exactly.
- If the specification is wrong, update the specification first, then update the code.
- If the specification is silent on a topic, the implementer does not invent. They file a gap report in `16_Quality_Audits/requests/`.

**This is not bureaucracy. This is leverage.**  
A clear specification lets a coding model build an entire subsystem in one pass without back-and-forth, without hallucinated architecture, and without contradictions.

---

## 2. Relationship to the Existing Agent System

This repository has two agent systems that coexist:

| System | Purpose | Defined In | Agents |
|--------|---------|------------|--------|
| **Specification Program** (this document) | Produce specification documents before implementation starts | `MASTER_DIRECTIVE.md` (here) | 00–19 |
| **Operational Agent System** | Govern day-to-day development, research, and coding work | `PROJECT_RULES.md`, `11_Documentation/engineering/agent-system.md` | 0–11 (original) |

**How they work together:**

1. **During Phase 0 (Specification),** the 20-agent program is active. Each agent produces documentation for its assigned domain. The 11-agent operational system is dormant during this phase.
2. **Once all P0 specs are approved**, the 20-agent program is complete. The repository hands off to the 11-agent operational system for implementation.
3. **During implementation**, the 11-agent system (`PROJECT_RULES.md`) governs coding, research, testing, and quality. Specification updates follow the change process in §9 of this document, filed through `16_Quality_Audits/requests/`.

In short: **the 20-agent program builds the spec; the 11-agent system builds the product.**

---

## 3. Project Governance — Context Management & Engineering Continuity

**This policy is MANDATORY.**

It applies to every engineering session, every AI agent, every engineer, and every subsystem.

There are no exceptions.

### 3.1 The Repository Is the Project

The Git repository is the company's engineering operating system. It contains:

- Architecture
- Research
- Firmware
- Desktop Studio
- Cloud Platform
- Mobile Platform
- Hardware
- PCB
- Manufacturing
- Testing
- Documentation
- Investor Material
- Workshop Documentation
- Engineering Standards
- Roadmaps
- Decision Records
- Project History

**GitHub is the permanent engineering record.** Conversation history is temporary. AI context is temporary. The repository is permanent.

### 3.2 Context Is Disposable

AI conversation history must never become a dependency.

- No engineering work may rely upon remembering previous conversations.
- Every engineering decision must be recoverable from the repository.
- **If information is not documented or committed, it does not officially exist.**

No chat session is part of the project. The repository is the project. Every session should be considered ephemeral. If the chat disappeared tomorrow, development should continue without loss because everything necessary is already in Git.

### 3.3 Vertical Slicing

All engineering work shall be organised into complete vertical slices. Each vertical slice represents a complete engineering milestone.

**Examples:**
- Firmware Build System
- Desktop Dashboard
- Database Architecture
- CAN Layer
- Hardware Architecture
- PCB Layout
- Investor Documentation
- Workshop Installer
- Cloud Authentication
- Manufacturing Research

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
8. Update `CURRENT_SPRINT.md`
9. Update `CHANGELOG.md`
10. Update `SESSION.md`
11. Update `REPOSITORY_MANIFEST.md`
12. Update ADRs if necessary
13. Commit
14. Push
15. Verify GitHub
16. Generate `docs/handoffs/SESSION_NNN.md`

**No session is complete until every applicable item has been completed.**

### 3.7 Session Handoff

Every session MUST generate `docs/handoffs/SESSION_NNN.md`.

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
| Recommended Next Agent | Which agent should pick up |
| Repository Status | Branch, commit SHA, GitHub verification |
| Estimated Remaining Work | Effort remaining on current workstream |
| Lessons Learned | Engineering notes |

### 3.8 Session Index

Maintain `docs/handoffs/README.md` containing:

| Session | Date | Milestone | Commit SHA | Engineer / Agent | Status | Next Session |

This becomes the historical engineering timeline.

### 3.9 Session Startup

Every new session MUST begin by reading:

1. `START_HERE.md`
2. `MASTER_DIRECTIVE.md`
3. `README.md`
4. `PROJECT_STATUS.md`
5. `CURRENT_SPRINT.md`
6. `ROADMAP.md`
7. `ARCHITECTURE.md`
8. `SESSION.md`
9. Latest `SESSION_HANDOFF.md` (from `docs/handoffs/`)
10. `TECH_DEBT.md`
11. Relevant ADRs
12. Relevant subsystem documentation

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

The Prototype ECU repository shall become a complete engineering knowledge base. The repository must be sufficient for:

- Software Engineering
- Firmware Engineering
- Hardware Engineering
- Manufacturing
- Testing
- Deployment
- Operations
- Investor Reporting
- Workshop Deployment
- Customer Support
- Future AI Engineering

**No project knowledge should be permanently stored in conversation history. All enduring knowledge belongs in the repository.**

### 3.13 Mandatory Compliance

This policy is mandatory. Every AI agent. Every engineering session. Every sprint. Every milestone. Every release.

Failure to comply is considered an incomplete engineering task. **No feature may be considered COMPLETE until this policy has been satisfied.**

### 3.14 Handoff Directory Structure

```
docs/
└── handoffs/
    ├── README.md          # Chronological index
    ├── SESSION_001.md     # First session
    ├── SESSION_002.md     # Second session
    └── ...
```

The handoff directory is the chronological engineering log — navigable by both humans and AI agents.

### 3.15 Tracer Bullet Development

Prototype ECU shall follow a **Tracer Bullet** development methodology. Tracer bullets validate complete end-to-end workflows early by exercising the entire stack from user interaction to final output.

**Tracer bullets are mandatory.** Every major subsystem must receive a tracer bullet before extensive feature development begins. Tracer bullets become automated regression tests that must continue to pass for the life of the project.

**Principles:**
- Cross multiple subsystems (minimum 3)
- Be deployable — produce a working artifact, not a mock
- Be testable — include automated verification
- Be documented
- Be committed and pushed to GitHub
- Produce measurable, demonstrable value

**Defined Tracer Bullets (see `TRACER_BULLETS.md` for full detail):**

| # | Name | Validates | Priority |
|---|------|-----------|----------|
| TB-001 | Live RPM Pipeline | Studio, Firmware, CAN, Database, Cloud, Logging, UI | P0 |
| TB-002 | Calibration Write Pipeline | Studio, Firmware, Calibration Protocol, Version Control, Cloud | P0 |
| TB-003 | Live Telemetry Pipeline | Firmware, Cellular/WiFi, Cloud, Mobile, Workshop Dashboard | P1 |
| TB-004 | Firmware Update Pipeline | OTA, Bootloader, Firmware, Checksum, Version Management | P1 |
| TB-005 | Vehicle Setup Pipeline | Studio, Calibration Engine, ECU Communication, Vehicle DB | P2 |
| TB-006 | Customer & Workshop Pipeline | Cloud, Customer Management, Workshop Portal, Reporting | P2 |

**Completion criteria:** A tracer bullet is complete when architecture is validated, integration is proven, documentation is updated, tests pass, work is committed and pushed to GitHub, and SESSION_HANDOFF is updated.

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

QA reviews produce a living backlog in `qa/QA_BACKLOG.md`. Every finding is tracked from identification through resolution. No finding is buried in chat or one-off reports.

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

The repository matures through defined levels. Agent 00 (Program Manager) updates the current maturity level at the end of every session. This provides a consistent measure of project evolution and keeps every session aligned with the long-term roadmap.

### 4.1 Maturity Levels

| Level | Name | Criteria | Status |
|-------|------|----------|--------|
| **1** | Basic Documentation | README, project structure, initial governance | ✅ Complete |
| **2** | Architecture Complete | System architecture documented, ADRs established, directory structure finalized | ✅ Complete |
| **3** | Specifications Complete | All subsystem specifications written, reviewed, and approved per §5 standard | 🔄 In Progress |
| **4** | Prototype Implementation | Working prototype of core subsystems (firmware, studio, CAN) | ⬚ Future |
| **5** | Production-Ready | Hardware manufactured, firmware validated, compliance certified | ⬚ Future |
| **6** | Commercial Platform | Customer deployments, workshop network, revenue operations | ⬚ Future |

### 4.2 Current Maturity

| Metric | Value |
|--------|-------|
| **Current Level** | 2 — Architecture Complete |
| **Next Level** | 3 — Specifications Complete |
| **Progress to Level 3** | 40% (governance and system architecture established; subsystem specs pending) |
| **Last Updated** | 2026-07-01 |

### 4.3 Level Transitions

A level is considered **complete** when all its criteria are met and the repository passes the DDD quality gate (33/33).

A level transition requires:
1. Agent 00 files a level completion report in `11_Documentation/management/`
2. Agent 19 (QA) validates all criteria
3. Agent 01 (Architecture) confirms no architectural regressions
4. This document is updated with the new level and date
5. A new tag is created: `v{major}.{minor}-L{level}` (e.g., `v0.2-L3`)

---

## 5. The 20-Agent Specification Program [SUPERSEDED]

> **Status:** Superseded by ADR-0008 (Two-Agent Engineering Model). Retained for historical reference.
> **Current:** Engineering Agent (Principal Engineer) owns all delivery. QA Agent (Independent Reviewer) challenges all decisions.
> See PROJECT_RULES.md §3 for the current engineering model.

The following agents produce and own the specification documents. Each agent produces documentation, not code.

| Agent | Role | Owned Documents | Directory |
|-------|------|----------------|----------|
| **00** | Program Manager | `MASTER_DIRECTIVE.md`, `PROJECT_STATUS.md`, `SESSION.md`, `ROADMAP.md`, `Current_Sprint.md`, coordination, weekly reports | Root, `11_Documentation/management/`, `18_Roadmap/` |
| **01** | System Architecture | Overall architecture, component diagrams, data flow, deployment diagrams, module interactions, technology stack, future architecture | `01_Architecture/` |
| **02** | Firmware Research | rusEFI audit, MCU research (NXP S32K3xx, STM32), module replacement roadmap, firmware architecture, memory layout, build documentation | `04_Firmware/docs/`, `10_Market_Research/Automotive_MCU/` |
| **03** | Desktop Studio | UI/UX design, screens, workflows, plugin system spec, command palette, themes, dashboard concepts | `05_Software/docs/` |
| **04** | Cloud Platform | AWS architecture, APIs, authentication, OTA pipeline, licensing, telemetry, security architecture | `06_Cloud/`, `01_Architecture/cloud-architecture.md` |
| **05** | Mobile | Android & iOS architecture, workshop app spec, monitoring, notifications, wireframes | `01_Architecture/mobile-architecture.md` |
| **06** | Hardware | ECU architecture, block diagrams, MCU selection, connector research, sensor architecture, power architecture | `02_Hardware/docs/` |
| **07** | PCB | PCB standards, layer stack-up recommendations, DFM, DFT, EMC guidance, manufacturing constraints | `03_PCB/` |
| **08** | Manufacturing | Chinese partner research, BOM strategy, prototype manufacturing, quality systems, supply chain, assembly process | `07_Manufacturing/`, `15_Suppliers/` |
| **09** | Mechanical | ECU enclosure concepts, cooling, waterproofing, mounting, CNC specs, connector layout | `02_Hardware/docs/enclosure.md` |
| **10** | Testing | Test plans, bench tests, vehicle tests, regression plans, acceptance criteria, HIL specifications | `08_Testing/` |
| **11** | Security | Secure boot, firmware signing, encryption, authentication, license management, threat model | `01_Architecture/security-architecture.md` |
| **12** | Documentation | Owns every document — formatting, links, completeness, standards, diagrams. Quality gate for all docs. | `11_Documentation/`, `14_Diagrams/`, `12_BOM/`, `13_Datasheets/` |
| **13** | Investor Relations | Executive summary, pitch deck content, product roadmap, market opportunity, competitive analysis, business model, funding roadmap | `11_Documentation/investor/` |
| **14** | Workshop Operations | Installation manuals, technician guides, flashing procedures, recovery guides, service manuals | `11_Documentation/workshop/` |
| **15** | Research | Continuous monitoring of rusEFI, Speeduino, Haltech, Link ECU, MoTeC, NXP, Bosch, automotive trends. Weekly reports. | `10_Market_Research/` |
| **16** | Compliance | ISO 26262, IATF 16949, EMC, CE, FCC, RoHS, automotive requirements research | `09_Compliance/` |
| **17** | Business | Pricing models, licensing, dealer strategy, revenue model, partnerships, financial projections | `11_Documentation/management/` |
| **18** | Branding | Design language, logo concepts, UI branding, documentation branding, product naming, marketing guidelines | `branding/` |
| **19** | Quality Assurance | Reviews everything — documentation quality, consistency, missing information, cross-references, risks, standards compliance. Approves before completion. | `16_Quality_Audits/` |

---

## 6. The Specification Documents

The end state of the documentation phase is a complete set of specification documents. Each document below is the **contract** for its subsystem.

### Required Specifications

```
Prototype ECU
├── [x] MASTER_DIRECTIVE.md               ← YOU ARE HERE
├── [ ] Firmware Specification             → 04_Firmware/specification.md
├── [ ] Hardware Specification             → 02_Hardware/specification.md
├── [ ] PCB Specification                  → 03_PCB/specification.md
├── [ ] Desktop Studio Specification       → 05_Software/specification.md
├── [ ] Mobile Specification               → 05_Software/mobile-specification.md
├── [ ] Cloud Specification                → 06_Cloud/specification.md
├── [ ] Manufacturing Specification        → 07_Manufacturing/specification.md
├── [ ] Testing Specification              → 08_Testing/specification.md
├── [ ] Compliance Specification           → 09_Compliance/specification.md
├── [ ] Branding Guide                    → branding/brand-guide.md
├── [ ] Investor Documentation             → 11_Documentation/investor/         (17 docs -- EXIST)
├── [ ] Workshop Documentation             → 11_Documentation/workshop/         (6 docs -- EXIST)
├── [ ] API Specification                  → 01_Architecture/protocol-architecture.md
├── [ ] UI Design System                   → branding/ui-design-system.md
├── [ ] Product Roadmap                    → 11_Documentation/ROADMAP.md        (EXIST)
├── [ ] Research Library                   → 10_Market_Research/                (20+ categories -- EXIST)
├── [ ] Engineering Standards              → CODING_STANDARDS.md, PROJECT_RULES.md (EXIST)
```

### Already Fulfilled Contracts

The following documents already exist and meet the specification standard:

| Specification | Location | Status |
|---------------|----------|--------|
| System Architecture (10 docs) | `01_Architecture/` | Complete |
| Decision Records (6 ADRs) | `17_Decisions/` | Complete |
| Firmware Module Docs (7) | `04_Firmware/docs/` | Complete |
| Engineering Knowledge Base | `11_Documentation/engineering/` | Complete |
| Governance Framework | `PROJECT_RULES.md`, `CODING_STANDARDS.md` | Complete |
| Brand Abstraction | `branding/brand.json` | Complete |
| Investor Package (17 docs) | `11_Documentation/investor/` | Complete |
| Workshop Docs (6) | `11_Documentation/workshop/` | Complete |
| Management Docs (9) | `11_Documentation/management/` | Complete |
| Research Corpus (20+ categories) | `10_Market_Research/` | Complete |
| Roadmap | `11_Documentation/ROADMAP.md` | Complete |
| Build Documentation | `11_Documentation/BUILD.md` | Complete |

### To Be Produced

The following specifications are required before the implementation phase can begin:

| Specification | Owner Agent | Priority | Status |
|---------------|-------------|----------|--------|
| Firmware Specification | Agent 02 | P0 | |
| Hardware Specification | Agent 06 | P0 | |
| PCB Specification | Agent 07 | P0 | |
| Desktop Studio Specification | Agent 03 | P0 | |
| Cloud Specification | Agent 04 | P1 | |
| Mobile Specification | Agent 05 | P1 | |
| Manufacturing Specification | Agent 08 | P1 | |
| Testing Specification | Agent 10 | P1 | |
| Compliance Specification | Agent 16 | P1 | |
| Branding Guide | Agent 18 | P1 | |
| UI Design System | Agent 18 | P1 | |
| API Specification | Agent 01 | P1 | |
| Business Model | Agent 17 | P2 | |

---

## 7. The Specification Standard

Every specification document must meet these criteria to be approved (enforced by Agent 19 -- Quality Assurance):

| # | Criterion | Description |
|---|-----------|-------------|
| 1 | **Scope** | Clearly defines what is in and out of scope for the subsystem |
| 2 | **Interfaces** | All external APIs, protocols, and connector types are specified |
| 3 | **Constraints** | Performance, safety, regulatory, and cost constraints are documented |
| 4 | **Dependencies** | All dependencies on other subsystems are listed with interface versions |
| 5 | **Diagrams** | Architecture diagrams exist (C4 model or equivalent) |
| 6 | **Verification** | How compliance with the specification will be verified |
| 7 | **Sources** | Industry standards, datasheets, and reference designs are cited |
| 8 | **Version** | Document has version number and changelog |

A specification is **approved** when Agent 19 scores it >= 90/100 against the above criteria.

---

## 8. Document Hierarchy

The diagram below shows how specification documents relate to each other. The MASTER_DIRECTIVE sits at the top; all subsystem specs flow from it.

```
                        MASTER_DIRECTIVE.md
                     (The Specification Contract)
                                |
          +---------------------+----------------------+
          |                     |                      |
          v                     v                      v
    01_Architecture/      04_Firmware/           02_Hardware/
    System Architecture   spec.md                spec.md
    + Data Flow           Firmware Spec          Hardware Spec
    + Deployment                                    |
    + Tech Stack                                     v
          |                                    03_PCB/spec.md
          v                                     PCB Spec
    17_Decisions/
    ADRs

          +---------------------+----------------------+
          |                     |                      |
          v                     v                      v
    05_Software/           06_Cloud/              07_Manufacturing/
    spec.md                spec.md                 spec.md
    (Studio Spec)          (Cloud Spec)            + 15_Suppliers/

          +---------------------+----------------------+
          |                     |                      |
          v                     v                      v
    08_Testing/            09_Compliance/          branding/
    spec.md                 spec.md                 brand-guide.md
                                                    ui-design-system.md

    Legend:
    [ ] = To be produced
    [x] = Exists
    --> = Depends on / references
```

---

## 9. Change Process

### For Specification Changes

1. The requesting agent files a change request in `16_Quality_Audits/requests/`
2. Agent 01 (System Architecture) reviews for system-wide impact
3. Agent 19 (QA) reviews for completeness
4. The specification is updated, version bumped, and changelog updated
5. All dependent implementation tasks are re-planned

### For Implementation Deviations

If during implementation the specification proves insufficient:

1. **Stop.** Do not implement around the gap.
2. **File a gap report** in `16_Quality_Audits/requests/` describing what the specification lacks.
3. **The specification is updated** by the owning agent.
4. **Implementation resumes** against the updated specification.

---

## 10. Current State

| Phase | Status |
|-------|--------|
| **Phase 0 -- Specification** | In Progress |
| Phase 1 -- Foundation | Complete |
| Phase 2 -- Studio V1 | Waiting on specification |
| Phase 3 -- Cloud & Mobile | Waiting on specification |
| Phase 4 -- Production Readiness | Waiting on specification |
| Phase 5 -- Proprietary Evolution | Future |

**Phase 0 starts now.** The specification documents listed in section 4 above must be produced and approved before implementation resumes.

See `CURRENT_STATE.md` (root) for the daily project pulse.
See `11_Documentation/PROJECT_STATUS.md` for detailed per-component status.
See `11_Documentation/ROADMAP.md` for the full development roadmap.

---

## 11. Quick Reference

| Key File | Purpose |
|----------|---------|
| `MASTER_DIRECTIVE.md` | This file -- the specification contract |
| `TRACER_BULLETS.md` | Tracer Bullet development methodology (mandatory) |
| `CONTEXT_LIFECYCLE.md` | Session lifecycle policy (mandatory governance) |
| `CURRENT_STATE.md` | Daily project pulse (root) |
| `REPOSITORY_MANIFEST.md` | Repository inventory and directory map |
| `11_Documentation/PROJECT_STATUS.md` | Detailed per-component status |
| `11_Documentation/management/Current_Sprint.md` | Sprint backlog and blockers |
| `SESSION.md` | Session-level handoff state |
| `docs/handoffs/` | Session handoff archive |
| `qa/QA_BACKLOG.md` | Living architectural backlog (QA-owned) |
| `qa/REVIEW_HISTORY.md` | Chronological QA review log |
| `PROJECT_RULES.md` | Agent governance and workflows |
| `CODING_STANDARDS.md` | Engineering standards |
| `11_Documentation/ARCHITECTURE.md` | System architecture overview |
| `17_Decisions/DECISIONS.md` | Architecture Decision Records |
| `11_Documentation/ROADMAP.md` | Development roadmap through 2029 |
| `branding/brand.json` | Single source of truth for branding |
| `16_Quality_Audits/` | Gap reports, QA reviews, approvals |
| `PROJECT_RULES.md#7-github-deployment-policy` | GitHub Deployment Policy — remote, auth, end-of-session protocol |

---

*This document is the contract. Everything below must be implemented as specified.*
