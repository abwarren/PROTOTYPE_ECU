# ⚠️ Risk Register

> **Last updated:** 2026-06-30
> **Owner:** Management
> **Review cadence:** Weekly

---

## Active Risks

| ID | Risk | Category | Likelihood | Impact | Score | Owner | Mitigation | Status |
|----|------|----------|------------|--------|-------|-------|------------|--------|
| R-01 | GPL firmware license limits commercial distribution | Legal | High | Critical | **18** | Engineering | Progressive module replacement; modular architecture | 🔴 Active |
| R-02 | Missing ARM GCC build toolchain | Engineering | Medium | High | **12** | Engineering | Install and verify next sprint | 🟡 Active |
| R-03 | Market adoption slower than projected | Business | Medium | High | **12** | Product | Low entry price; freemium software | 🟡 Active |
| R-04 | Competitor modernizes UI | Competitive | Medium | High | **12** | Product | Cloud/mobile/AI create broader moat | 🟡 Monitoring |
| R-05 | Key engineer departure | People | Low | Critical | **10** | Management | DDD policy ensures knowledge is documented | 🟡 Active |
| R-06 | Hardware supply chain delays | Operations | Medium | Medium | **9** | Ops | Multiple supplier relationships | 🟡 Planning |
| R-07 | Component obsolescence | Engineering | Low | High | **8** | Engineering | HAL abstraction for MCU independence | 🟢 Monitoring |
| R-08 | Cloud security breach | Security | Low | Critical | **8** | Engineering | mTLS, encryption, regular audits | 🟢 Active |
| R-09 | rusEFI upstream breakage | Engineering | Low | Medium | **5** | Engineering | Fork is isolated; upstream changes optional | 🟢 Monitoring |
| R-10 | Regulatory compliance cost | Legal | Low | High | **6** | Management | Planned for Phase 4; V1 is off-road use | 🟢 Planning |

## Risk Scoring

| Likelihood | 1 (Rare) | 2 (Unlikely) | 3 (Possible) | 4 (Likely) | 5 (Almost Certain) |
|------------|----------|--------------|--------------|------------|---------------------|
| **5 (Critical)** | 5 | 10 | 15 | 20 | 25 |
| **4 (High)** | 4 | 8 | 12 | 16 | 20 |
| **3 (Medium)** | 3 | 6 | 9 | 12 | 15 |
| **2 (Low)** | 2 | 4 | 6 | 8 | 10 |
| **1 (Negligible)** | 1 | 2 | 3 | 4 | 5 |

**Score = Likelihood × Impact**

| Score | Action |
|-------|--------|
| 15-25 | 🔴 Immediate action required |
| 8-14 | 🟡 Active monitoring with mitigation plan |
| 1-7 | 🟢 Routine monitoring |

## Risk Trend

| Week | Total Risks | 🔴 Critical | 🟡 Active | 🟢 Monitoring |
|------|-------------|-------------|-----------|---------------|
| 2026-06-30 | 10 | 1 | 5 | 4 |
