# 🏛 MASTER_DIRECTIVE.md — The Specification Contract

> **Version:** 1.0.0  
> **Status:** Active  
> **Purpose:** This document is the single source of authority for the ECU Platform. Everything below is the contract.  
> **Rule:** No implementation deviates from the specifications referenced herein. No specification changes without updating this contract.

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
3. **During implementation**, the 11-agent system (`PROJECT_RULES.md`) governs coding, research, testing, and quality. Specification updates follow the change process in §7 of this document, filed through `16_Quality_Audits/requests/`.

In short: **the 20-agent program builds the spec; the 11-agent system builds the product.**

---

## 3. The 20-Agent Specification Program

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

## 4. The Specification Documents

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

## 5. The Specification Standard

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

## 6. Document Hierarchy

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

## 7. Change Process

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

## 8. Current State

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

## 9. Quick Reference

| Key File | Purpose |
|----------|---------|
| `MASTER_DIRECTIVE.md` | This file -- the specification contract |
| `CURRENT_STATE.md` | Daily project pulse (root) |
| `11_Documentation/PROJECT_STATUS.md` | Detailed per-component status |
| `11_Documentation/management/Current_Sprint.md` | Sprint backlog and blockers |
| `SESSION.md` | Session-level handoff state |
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
