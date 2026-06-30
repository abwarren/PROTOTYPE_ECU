# Risks & Mitigations

> **Living document** — Updated with every milestone, reviewed monthly.

---

## Risk Matrix

| Risk | Likelihood | Impact | Risk Level | Mitigation |
|------|------------|--------|------------|------------|
| GPL license limits distribution | High | Critical | **RED** | Progressive module replacement; modular architecture allows per-module rewrite |
| Hardware supply chain delays | Medium | High | **AMBER** | Multiple supplier relationships; STM32 has multiple sources |
| Competitor modernizes UI | Medium | High | **AMBER** | Cloud, mobile, AI, and ecosystem create moat beyond UI |
| Low market adoption | Medium | High | **AMBER** | Low-cost entry point reduces customer risk; freemium software |
| Key engineer departure | Medium | Medium | **AMBER** | DDD policy means all knowledge is documented; no single point of failure |
| rusEFI upstream breakage | Low | Medium | **GREEN** | Fork is isolated; upstream changes are optional |
| Regulatory compliance | Low | High | **AMBER** | ISO 26262, CISPR 25, FCC — planned for Phase 4; V1 is off-road use |
| Cloud security breach | Low | Critical | **RED** | mTLS device auth, encryption at rest, regular audits |
| Component obsolescence | Medium | Medium | **AMBER** | MCU independence through HAL abstraction |

## Detailed Analysis

### 1. GPL License (Red — Critical)

**Risk:** The rusEFI firmware is GPL-3.0 licensed. Any modified firmware distributed as a binary must also be GPL-3.0 — meaning source code must be provided.

**Mitigation:**
- The desktop Studio and cloud platform are separate works (not derived from GPL code)
- The firmware is being progressively replaced module-by-module
- Phase 5 target: all engine control algorithms rewritten as proprietary
- In the interim, GPL compliance is strictly followed

### 2. Market Adoption (Amber — Medium)

**Risk:** The aftermarket ECU market is established with loyal customers. Convincing them to switch is difficult.

**Mitigation:**
- Price is 1/3 to 1/2 of premium competitors — low risk for customers to try
- Freemium software — no cost to evaluate
- Cloud and mobile features are genuine differentiators
- Modern UI is immediately visible — no deep evaluation needed to see the difference

### 3. Competition (Amber — Medium)

**Risk:** Existing competitors could modernize their software or lower prices.

**Mitigation:**
- Software modernization takes 2-3 years for established companies (legacy code, organizational inertia)
- White-label architecture means we can pivot to adjacent markets
- Cloud ecosystem creates switching costs that UI alone doesn't

## Risk Monitoring

| Risk | Owner | Review Cadence | Last Review |
|------|-------|----------------|-------------|
| GPL compliance | Engineering | Weekly | 2026-06-30 |
| Market adoption | Product | Monthly | — |
| Supply chain | Operations | Monthly | — |
| Competition | Product | Quarterly | — |
