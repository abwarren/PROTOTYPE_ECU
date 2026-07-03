# DECISION_LOG.md — Significant Engineering Decisions

> **Policy:** Every decision that changes architecture, process, or product
>   direction is recorded here. This avoids digging through commits to
>   understand why something changed.
> **Last updated:** 2026-07-03

---

## Decision Records

### D-001: Architecture Freeze

- **Date:** 2026-07-03
- **Decision:** Freeze 7100CPT software architecture at current baseline
- **Architecture:**
  ```
  7100CPT Studio → EcuService → EcuProtocol (interface) ← RusEFIProtocolAdapter → UsbTransport → rusEFI
  ```
- **Reason:** Architecture has reached sufficient maturity. Continued redesign
  delays capability delivery. The project must transition from designing
  frameworks to building verified product capabilities.
- **Impact:**
  - All future architectural changes require ADR + Engineering Review + QA
  - Development effort shifts to delivering TB-005 through TB-016
  - Architecture is treated as a public API — stable, documented, versioned
- **Alternatives considered:** Continue iterating architecture. Rejected —
  each redesign iteration costs a full development cycle with no user-facing
  progress.
- **Approved by:** Engineering + QA

---

### D-002: Capability Delivery Phase

- **Date:** 2026-07-03
- **Decision:** Transition from architecture design to capability delivery
- **Reason:** 5 tracer bullets complete (TB-001 through TB-004, TB-HW-001).
  Architecture, governance, QA process, and documentation discipline are all
  mature. Remaining work is implementation, not design.
- **Impact:**
  - CAPABILITY_MATRIX.md becomes the primary progress metric
  - Demo Gates mandatory from TB-005 onward
  - Progress measured by verified capabilities (C0-C4), not documents written
  - Every TB must leave 7 artifacts: code, test, docs, matrix update, evidence,
    handoff, commit
- **Approved by:** Engineering + QA

---

### D-003: 7100CPT Branding

- **Date:** 2026-07-03
- **Decision:** Transition from "Prototype" codename to "7100CPT" product name
- **Reason:** Project has progressed beyond prototype phase. Commercial product
  identity needed for manufacturer engagement, investor materials, and
  documentation consistency.
- **Impact:**
  - All active documents use "7100CPT Studio" / "7100CPT ECU" / "7100CPT Platform"
  - "Prototype" retained only in historical ADRs and git history
  - BRANDING.md created as single source of naming truth
- **Approved by:** Engineering + QA

---

### D-004: Reuse Matrix Phase 0 Gate

- **Date:** 2026-07-03
- **Decision:** No KiCad schematic work begins until REUSE_MATRIX.md is approved
- **Reason:** Prevent design drift from NXP S32K344 reference without conscious
  decisions. 41 circuit blocks traced to provenance — 37% reuse, 17% adapt,
  46% new design.
- **Impact:**
  - TB-HW-002 gated by Phase 0 approval
  - Injector/ignition driver IC selection deferred to DFM review
  - NXP reference-following policy in PROJECT_RULES.md §9
- **Approved by:** Engineering

---

### D-005: rusEFI as Firmware Baseline (Unmodified)

- **Date:** 2026-07-03 (reaffirmed)
- **Decision:** Keep rusEFI upstream fork unmodified. 7100CPT Studio
  communicates through adapter layer, not direct firmware dependency.
- **Reason:** rusEFI is a mature, proven engine management firmware. Modifying
  it creates merge conflicts with upstream. The adapter pattern (RusEFIProtocolAdapter)
  isolates firmware changes behind an interface.
- **Impact:**
  - Firmware can be switched (rusEFI → 7100CPT native) without Studio changes
  - Upstream fixes and improvements merge cleanly
  - Adapter is the ONLY class aware of rusEFI protocol details
- **Approved by:** Engineering + QA

---

## Template

```
### D-XXX: Decision Title

- **Date:** YYYY-MM-DD
- **Decision:** One sentence
- **Reason:** Why this decision was made
- **Impact:** What changes as a result
- **Alternatives considered:** What else was evaluated and why rejected
- **Approved by:** Who signed off
```
