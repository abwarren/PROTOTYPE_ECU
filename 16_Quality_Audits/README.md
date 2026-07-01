# Quality Audits & Engineering Reviews

> Directory for gap reports, QA reviews, engineering design reviews, and audit records.
> See ADR-0007 for the architecture change governance process.

---

## Active Reviews

| ID | Type | Date | Title | Status |
|----|------|------|-------|--------|
| QAR-2026-07-01 | QA Review | 2026-07-01 | [QA Engineering Review](../QA_ENGINEERING_REVIEW.md) | Filed |
| EDR-2026-07-01 | EDR | 2026-07-01 | [Engineering Design Review](EDR-2026-07-01.md) | Proposed |
| ADR-0007 | ADR | 2026-07-01 | [Architecture Change Governance](../17_Decisions/0007-architecture-change-governance.md) | Proposed |

## EDR Companion Documents

| Document | Domain |
|----------|--------|
| [ARCHITECTURE_IMPROVEMENTS.md](ARCHITECTURE_IMPROVEMENTS.md) | Architecture, API, Studio, Cloud, Safety |
| [REPOSITORY_IMPROVEMENTS.md](REPOSITORY_IMPROVEMENTS.md) | Repository, CI, Submodule |
| [DATABASE_RECOMMENDATIONS.md](DATABASE_RECOMMENDATIONS.md) | Database schema, edge strategy |
| [PROCESS_IMPROVEMENTS.md](PROCESS_IMPROVEMENTS.md) | Engineering workflow, governance |
| [COMMERCIAL_READINESS_REVIEW.md](COMMERCIAL_READINESS_REVIEW.md) | Business, market, investor |
| [TECHNICAL_DEBT_REGISTER.md](TECHNICAL_DEBT_REGISTER.md) | Expanded debt items D-013–D-034 |
| [REGRESSION_PREVENTION_PLAN.md](REGRESSION_PREVENTION_PLAN.md) | Regression guardrails |

---

## Gap Reports

Requests for specification gaps or cross-agent changes: `requests/`

---

## Approval Process

Per ADR-0007:
1. Reviews produce documents on feature branches (no baseline modification)
2. PR opened for review
3. Agent 01, Agent 19, Agent 00 review
4. Accepted → implementation PR updates baseline documents
5. Rejected → filed as historical record

---

*Last updated: 2026-07-01*
