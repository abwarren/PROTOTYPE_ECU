# COMMERCIAL_READINESS_REVIEW.md — Business, Market & Investor Assessment

> **Type:** EDR Companion — Commercial Domain
> **Governance:** Per ADR-0007 — proposals only

---

## 1. Current State

The project has excellent commercial groundwork:
- 32 market research documents covering 20+ competitor categories
- 17+ investor documents including executive summary, pitch assets, diagrams
- White-label architecture (ADR-0001) enabling multi-brand deployment
- Clear product vision: open-source ECU with premium Studio and Cloud

But the gap between documentation and product is vast. An investor would classify this as pre-seed research.

---

## 2. Market Position

### 2.1 Competitive Landscape

| Tier | Examples | Price | Market |
|------|----------|-------|--------|
| Premium OEM | Bosch Motorsport, MoTeC, Life Racing | $3,000–$15,000 | Professional racing |
| Mid-Range | Haltech, Link ECU, AEM | $1,000–$3,000 | Serious enthusiasts, small shops |
| Budget/DIY | MegaSquirt, Speeduino, rusEFI | $200–$800 | Hobbyists, learners |
| **Prototype ECU target** | **New category** | **$500–$1,200** | **Professional tuners who want modern tooling** |

### 2.2 Differentiation Strategy (ADR-0003)

The decision to differentiate on Studio (desktop application) rather than firmware is strategically sound for V1. However, the market already has excellent tuning software:
- TunerStudio (MegaSquirt ecosystem) — functional but dated UI
- Haltech ESP — modern but hardware-locked
- Link ECU G4+ PCLink — functional but Windows-only

The Prototype ECU's differentiator must be specific and deliverable:
1. **Cross-platform** (Windows, macOS, Linux) — eliminates the "Windows laptop in the garage" requirement
2. **Cloud-connected by default** — no manual log file management
3. **AI-assisted tuning panel** (Phase 5) — genuine innovation, not just modern UI
4. **Plugin ecosystem** — third-party developers can extend the platform

### 2.3 Missing: Pricing Model

No pricing model exists. Recommended:

| Tier | Price | Features |
|------|-------|----------|
| **Community** | Free | Basic Studio, local only, community support |
| **Professional** | $29/month | Cloud sync, telemetry, OTA, priority support |
| **Workshop** | $99/month | Multi-vehicle, multi-technician, customer CRM, reporting |
| **Enterprise/White-label** | Custom | Custom branding, dedicated cloud, API access, SLAs |

This follows the successful model of other developer/engineering tools (GitHub, Linear, Supabase).

---

## 3. Revenue Model

### 3.1 Revenue Streams

| Stream | Phase | Revenue Potential | Margin |
|--------|-------|-------------------|--------|
| Studio subscriptions (Professional/Workshop) | Phase 2 | $30–100/month per user | 90% |
| Cloud telemetry & storage | Phase 3 | Bundled with subscription | 70% |
| ECU hardware sales | Phase 4 | $500–$1,200 per unit | 40-60% |
| White-label licensing (OEM) | Phase 5 | $50K–$500K/year per OEM | 95% |
| AI tuning credits | Phase 5 | Pay-per-use | 95% |
| Workshop training/certification | Phase 4 | $500–$2,000 per course | 80% |

### 3.2 Path to Revenue

**Year 1 (now–2027):** No revenue. Specification + prototype development.
**Year 2 (2027–2028):** First paying Professional users. Target: 100 users × $29/month = $34,800 ARR.
**Year 3 (2028–2029):** Hardware sales begin. Target: 500 ECU units + 200 Workshop subscriptions = $300K ARR.
**Year 4 (2029–2030):** First OEM white-label deal. Target: $1M+ ARR.

This timeline assumes full-time engineering. Part-time or AI-assisted development extends each phase proportionally.

---

## 4. Regulatory Pathway

### 4.1 Required Certifications

| Certification | Scope | Timeline | Cost |
|---------------|-------|----------|------|
| CE (Europe) | All electronic products | 3–6 months | $5K–$15K |
| FCC (USA) | Intentional radiators (BLE/WiFi) | 2–4 months | $3K–$10K |
| CISPR 25 | Automotive EMC | 3–6 months | $10K–$30K |
| ISO 26262 | Functional safety (if ASIL-rated) | 12–24 months | $50K–$200K |
| RoHS | Hazardous substances | Self-declaration | $1K |

**Total regulatory budget: $70K–$255K over 2 years.**

### 4.2 Strategy

Phase 1-3 (prototype): No certifications needed (research/development exemption).
Phase 4 (production): CE, FCC, CISPR 25 required before sale.
Phase 5 (OEM): ISO 26262 if supplying to vehicle manufacturers.

**Recommendation:** Begin pre-compliance EMC testing during Phase 3 (prototype validation) to identify issues early. A pre-compliance scan costs ~$2K and can prevent $20K+ of re-spins.

---

## 5. Manufacturing Readiness

### Current State
- 3 manufacturing docs
- No supplier agreements
- No prototype run
- No BOM with pricing
- No assembly process

### Path to First Prototype

1. **BOM and schematic** (Hardware Agent 06) — 4–6 weeks
2. **PCB layout** (PCB Agent 07) — 3–4 weeks
3. **PCB fabrication** (JLCPCB, PCBWay) — 2 weeks, $200–500 for 5 boards
4. **Component sourcing** (Digi-Key, Mouser) — 2 weeks, $300–800
5. **Assembly** (manual or small-batch service) — 1 week, $200–500
6. **Bring-up and testing** — 2 weeks

**First prototype timeline: 14–19 weeks. First prototype cost: $700–$1,800.**

This is achievable with one hardware engineer and a modest budget.

---

## 6. Investor Readiness

### Strengths
- Clear market positioning
- Comprehensive competitor research
- Professional documentation
- White-label architecture enables multiple revenue models

### Gaps
- No working prototype to demonstrate
- No customer validation (nobody has used the product)
- No team (currently solo)
- No revenue model documentation
- No financial projections
- No regulatory timeline
- No intellectual property (patents, trademarks)

### Recommendation

The project is not investor-ready. It needs:
1. Working prototype (TB-001 complete)
2. 5–10 beta testers providing feedback
3. Revenue model documentation
4. Financial projections (3-year)

Estimate: 12–18 months to investor-ready from current state.

---

## 7. Intellectual Property Strategy

### Current
- No patents filed
- No trademarks registered
- GPL-3.0 firmware limits proprietary claims on engine control code
- Studio, Cloud, Mobile, and AI are cleanly separated (not subject to GPL)

### Recommendation

1. **Trademark:** Register the product name when finalized — $300 per class
2. **Patents:** File provisional patents on:
   - AI-assisted tuning methodology (if novel)
   - Cloud/ECU synchronization protocol (if novel)
3. **Trade secrets:** Proprietary calibration algorithms, AI training data, cloud architecture
4. **Open source:** Keep firmware GPL (community trust), keep Studio source-available (not GPL — prevents competitors from rebranding)

---

*Per ADR-0007, this is a proposal. Revenue model and regulatory pathway should be formalized by Agent 17 (Business) and Agent 13 (Investor Relations).*
