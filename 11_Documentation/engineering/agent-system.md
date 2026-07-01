# 🏗 Multi-Agent Research & Development System

> **Purpose:** Structured pipeline for parallel research, design, quality assurance, and documentation.
> **Status:** Active
> **Last updated:** 2026-07-01

---

## System Overview

```
Research Agents  →  Documentation Agent  →  Quality Agent  →  Architecture Review  →  Implementation  →  Validation
       │                    │                     │
       ▼                    ▼                     ▼
   11 agents           File creation           Gate checks
   5 domains           Markdown                Score 0-100
```

Each deliverable passes through a **Quality Gate** (Agent 0) before acceptance. Minimum score: **90/100**.

---

## Agent Definitions

### 🏗 Agent 0 — Chief Architect / Quality Assurance (QA)

**Mission:** Maintain technical quality, consistency, and architecture across the project.

**Responsibilities:**
- Review every agent's work
- Detect merge conflicts, duplicate work, contradictory documentation
- Verify technical claims and sources
- Verify project structure and folder organization
- Ensure commits follow standards
- Reject low-quality changes; flag stale branches
- Review pull requests before merge
- Check manufacturability, BOMs, pin mappings, PCB layouts
- Review firmware architecture
- Ensure ISO terminology is correct
- Maintain `CHANGELOG.md`, `DECISIONS.md`, `ROADMAP.md`

**Deliverables:**
- Weekly audit report
- Quality score (0-100)
- Missing information report
- Risk register updates
- Architecture review
- Technical debt report

---

### 🤖 Agent 1 — Hardware Research

**Focus:** Automotive ECU hardware

**Research targets:**
- Open-source ECUs: rusEFI, Speeduino, MegaSquirt
- Commercial architectures: Haltech, MoTeC, Bosch, Continental, Denso
- Schematics, block diagrams, MCU choices
- CAN topology, power supplies, sensor interfaces

**Owns:** `02_Hardware/`, `10_Market_Research/`

---

### ⚡ Agent 2 — Electronics Design

**Responsibilities:**
- Schematic design
- PCB stackups
- Automotive power input (reverse polarity protection, ESD, TVS, filtering)
- Sensor interfaces
- Injector drivers, ignition drivers
- H-bridges
- ADC conditioning

**Owns:** `03_PCB/`

---

### 💻 Agent 3 — Firmware

**Focus:** ECU firmware architecture

**Research targets:**
- rusEFI firmware architecture
- FreeRTOS integration
- Bootloaders and OTA updates
- CAN stack, USB, diagnostics

**Owns:** `04_Firmware/`, `firmware/`

---

### 🌐 Agent 4 — Software & Cloud

**Focus:** Desktop software, web dashboard, cloud platform, mobile app

**Research targets:**
- TunerStudio alternatives
- Web-based ECU tuning
- Telemetry systems
- MQTT protocol
- OTA infrastructure
- AWS cloud architecture

**Owns:** `05_Software/`, `06_Cloud/`, `studio/`, `cloud/`

---

### 🚗 Agent 5 — Automotive Systems

**Focus:** Engine management fundamentals

**Research domains:**
- Crank/cam trigger systems
- Fuel injection strategies
- Ignition control
- Variable valve timing (VVT)
- Drive-by-wire (DBW)
- Lambda/oxygen sensing
- Knock detection
- Boost control

**Owns:** `10_Market_Research/` (engine management topics)

---

### 🏭 Agent 6 — Manufacturing

**Focus:** Production and supply chain

**Research targets:**
- Chinese suppliers (PCB assembly, injection molding, aluminum housings)
- Wire harnesses and connectors
- Manufacturing costs, MOQ, lead times

**Owns:** `07_Manufacturing/`, `15_Suppliers/`

---

### 🔬 Agent 7 — Testing & Validation

**Focus:** Quality assurance and validation

**Research domains:**
- Bench testing procedures
- Hardware-in-the-loop (HIL) testing
- EMI/EMC testing
- Temperature and vibration testing
- Waterproofing (IP ratings)
- Vehicle validation
- Fault injection testing

**Owns:** `08_Testing/`

---

### 📜 Agent 8 — Compliance

**Focus:** Regulatory standards and certification

**Standards to research:**
- ISO 26262 (Functional safety)
- CISPR 25 (EMC — automotive)
- ISO 7637 (Electrical disturbances)
- AEC-Q100 (Component qualification)
- IATF 16949 (Quality management)
- CE, FCC, RoHS, REACH, E-mark

**Owns:** `09_Compliance/`

---

### 📈 Agent 9 — Market & Competitive Intelligence

**Focus:** Competitive analysis and market positioning

**Competitors to analyze:**
- Haltech, MoTeC, Link ECU
- ECUMaster, MaxxECU
- FuelTech, Emtron

**Owns:** `10_Market_Research/`

---

### 📂 Agent 10 — Documentation & Knowledge Base

**Focus:** Information architecture and knowledge management

**Responsibilities:**
- Documentation creation and maintenance
- Markdown formatting and consistency
- Diagram creation and maintenance
- Architecture documentation
- BOM database
- Meeting notes and decision logs
- Changelog maintenance
- Folder organization

**Owns:** `11_Documentation/`, `14_Diagrams/`, `12_BOM/`, `13_Datasheets/`

---

### 📋 Agent 11 — Project Manager / Coordinator

**Mission:** Track dependencies, assign work, update roadmap, ensure correct sequencing.

**Responsibilities:**
- Track dependencies between agents
- Assign work to agents based on priority and dependency order
- Update roadmap and milestone progress
- Ensure tasks are completed in the correct order
- Maintain `CURRENT_STATE.md`, `TODO.md`, `PROJECT_RULES.md`
- Produce session handoffs

**Does NOT perform research or coding.** Focuses purely on coordination.

**Owns:** Any (coordination only, no direct file modifications)

---

## Workflow

### Agent Execution (START → END)

```
START
 1. Pull latest changes
    git fetch --all
    git pull --rebase

 2. Read shared project files
    README.md → CURRENT_STATE.md → ROADMAP.md → DECISIONS.md

 3. Read files related to assigned area

 4. Check recent changes by other agents
    git log --oneline -10

 5. Do assigned work only
    (Do not modify files outside owned area)

 6. Run validation
    bash scripts/ddd-check.sh --ci

 7. Update documentation

 8. Commit with descriptive message

 9. Push changes
END
```

### System Pipeline

```
Step 1: Research Agents (1-9)
        │
        ▼
Step 2: Documentation Agent (10)
        │  Consolidates findings into structured docs
        ▼
Step 3: Quality Agent (0)
        │  Reviews, scores, identifies gaps
        ▼
Step 4: Architecture Review
        │  Agent 0 + stakeholder review
        ▼
Step 5: Implementation
        │  Engineering agents execute
        ▼
Step 6: Validation
        │  Agent 7 + Agent 0 sign-off
```

---

## Agent Locking (File Ownership)

Each agent owns specific directories. **Only Agent 0 (QA) has universal write access.**
No agent may modify files outside its assigned area without creating a request in `16_Quality_Audits/requests/`.

| Agent | Owns |
|-------|------|
| Agent 0 (QA) | Any folder (review only) |
| Agent 1 (Hardware Research) | `02_Hardware/`, `10_Market_Research/` |
| Agent 2 (Electronics Design) | `03_PCB/` |
| Agent 3 (Firmware) | `04_Firmware/`, `firmware/` |
| Agent 4 (Software & Cloud) | `05_Software/`, `06_Cloud/`, `studio/`, `cloud/` |
| Agent 5 (Automotive Systems) | `10_Market_Research/` (engine topics) |
| Agent 6 (Manufacturing) | `07_Manufacturing/`, `15_Suppliers/` |
| Agent 7 (Testing & Validation) | `08_Testing/` |
| Agent 8 (Compliance) | `09_Compliance/` |
| Agent 9 (Market Intelligence) | `10_Market_Research/` |
| Agent 10 (Documentation & KB) | `11_Documentation/`, `14_Diagrams/`, `12_BOM/`, `13_Datasheets/` |
| Agent 11 (Project Manager) | Any (coordination only) |

---

## Branch Strategy

```
main
├── hardware       (Agent 1, 2)
├── pcb            (Agent 2)
├── firmware       (Agent 3)
├── software       (Agent 4)
├── cloud          (Agent 4)
├── manufacturing  (Agent 6)
├── testing        (Agent 7)
├── compliance     (Agent 8)
├── market-research (Agent 1, 5, 9)
├── documentation  (Agent 10)
└── quality        (Agent 0)
```

Each agent works on its own branch, regularly rebases from `main`, and Agent 0 reviews and merges into `main`.

---

## Quality Gate Checklist

Every deliverable must pass these checks (used by Agent 0):

| # | Check | Pass Criteria | Weight |
|---|-------|---------------|--------|
| 1 | 📚 Sources | At least 5 high-quality sources cited | 15 |
| 2 | 🔁 Duplicate detection | No duplicate research or files | 10 |
| 3 | 🧠 Technical accuracy | Claims verified against datasheets or standards | 20 |
| 4 | 📝 Documentation | Complete, clear, and versioned | 15 |
| 5 | 🏭 Manufacturability | DFM/DFT considerations documented | 10 |
| 6 | 🔌 Hardware | Schematics and interfaces reviewed | 10 |
| 7 | 💻 Firmware | Architecture and APIs consistent | 10 |
| 8 | ⚖️ Compliance | Relevant standards identified | 10 |
| 9 | 📦 Organization | Correct folder placement and naming | 5 |
| 10 | ⭐ Overall | Minimum 90/100 before acceptance | — |

---

## Shared Project Files

Every agent reads these files before starting work:

| File | Location | Purpose |
|------|----------|---------|
| `README.md` | Root | Project overview |
| `CURRENT_STATE.md` | Root | Current project status |
| `ROADMAP.md` | `11_Documentation/ROADMAP.md` | Development roadmap |
| `DECISIONS.md` | `17_Decisions/DECISIONS.md` | Decision index |
| `PROJECT_RULES.md` | Root | Governance and workflows |
| `CODING_STANDARDS.md` | Root | Coding standards |
| `ARCHITECTURE.md` | `11_Documentation/ARCHITECTURE.md` | System architecture overview |
| `CHANGELOG.md` | `11_Documentation/CHANGELOG.md` | Change log |
| `TODO.md` | Root | Task priorities |
