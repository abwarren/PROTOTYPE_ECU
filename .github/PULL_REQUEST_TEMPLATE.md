# Pull Request

> **Policy:** Documentation-Driven Development (DDD) — documentation is a first-class deliverable.
> This PR may be rejected if required documentation is missing.

---

## Description

<!-- Briefly describe what this PR accomplishes -->

## Type of Change

- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] docs: Documentation only
- [ ] refactor: Code restructuring (no behavior change)
- [ ] test: Test changes
- [ ] perf: Performance improvement
- [ ] ci: CI/CD changes
- [ ] build: Build system changes
- [ ] hardware: Hardware revision

## Related ADR

<!-- If architecture changed, link the ADR number -->
- ADR-NNN: <!-- ADR title -->

## Documentation Checklist (Required)

<!-- All items must be checked before this PR can be merged -->

### Required Documentation Updates
- [ ] `README.md` updated (if project-level changes)
- [ ] `PROJECT_STATUS.md` updated
- [ ] `CHANGELOG.md` updated (Added/Changed/Fixed/Removed/Deprecated/Security)
- [ ] `TECH_DEBT.md` reviewed and updated (every shortcut, TODO, workaround recorded)
- [ ] `ROADMAP.md` updated (if milestones affected)
- [ ] `docs/history/YYYY-MM-DD.md` created/updated

### Architecture Changes
- [ ] `ARCHITECTURE.md` updated (if architecture changed)
- [ ] ADR created (if architectural decision)
- [ ] Diagrams updated (component, sequence, directory, communication, boot flow, etc.)

### Module Documentation (if applicable)
<!-- Check all that apply -->
- [ ] `docs/firmware/` updated
- [ ] `docs/studio/` updated
- [ ] `docs/cloud/` updated
- [ ] `docs/hardware/` updated
- [ ] `docs/bootloader/` updated
- [ ] `docs/protocol/` updated
- [ ] `docs/api/` updated
- [ ] `docs/manufacturing/` updated
- [ ] `docs/testing/` updated

### Module Documentation Requirements
For each changed module, verify documentation includes:
- [ ] Purpose
- [ ] Responsibilities
- [ ] Inputs / Outputs
- [ ] Dependencies
- [ ] Source Files
- [ ] Known Issues
- [ ] Future Improvements
- [ ] Replacement Strategy

## Build & Test Verification

- [ ] Builds successfully (all targets)
- [ ] Tests pass
- [ ] No new warnings

## Technical Debt

<!-- If this PR introduces any shortcut, TODO, workaround, or known issue,
     it must be recorded in TECH_DEBT.md -->

- [ ] No new technical debt introduced
- [ ] New debt recorded in `TECH_DEBT.md` (item D-NNN)

## Quality Gate

<!-- If any checkbox below fails, this PR is NOT complete -->

- [ ] Documentation updated
- [ ] Links valid
- [ ] Diagrams updated
- [ ] ADR created (if required)
- [ ] Status updated
- [ ] Changelog updated
- [ ] History updated
- [ ] Technical debt reviewed

---

**By submitting this PR, I confirm that documentation is part of the product
and all required documentation has been updated.**
