# Contributing

## Engineering Policy: Documentation-Driven Development (DDD)

This project follows **Documentation-Driven Development**. Documentation is part of the product. Code without documentation is considered incomplete.

### Definition of Done

A task is ONLY complete when ALL of the following are true:

- [ ] Code implemented
- [ ] Code reviewed
- [ ] Builds successfully
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Architecture updated
- [ ] ADR created (if required)
- [ ] Changelog updated
- [ ] Project Status updated
- [ ] Daily Engineering Log written
- [ ] Technical Debt recorded
- [ ] Diagrams updated (if architecture changed)

If any item is missing, the task remains **IN PROGRESS**.

### Automatic Documentation Requirements

Every completed task MUST update:
- `README.md`
- `PROJECT_STATUS.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `TECH_DEBT.md`
- `DECISIONS.md`
- `docs/history/YYYY-MM-DD.md`

If architecture changed:
- `ARCHITECTURE.md`
- Relevant `docs/<component>/` module docs
- Component/sequence/state diagrams in `docs/diagrams/`

### New Module Policy

Every new module requires its own documentation in `docs/<component>/<module>.md`, containing:
- Purpose
- Responsibilities
- Inputs
- Outputs
- Dependencies
- Source Files
- Build Dependencies
- Known Limitations
- Future Improvements
- Replacement Strategy

### Git Policy: Single Source of Truth

Git is the single source of truth for the entire platform. Everything must live inside the repository:

- Firmware source code
- Desktop Studio application
- Cloud platform
- Mobile application
- Hardware designs (PCB, schematics, KiCad projects)
- Bootloader
- Manufacturing files
- Testing specifications and results
- Documentation (all of it)
- Architecture diagrams
- ADRs
- Roadmaps
- Daily engineering logs
- Technical debt records
- Release notes
- Meeting notes
- Research

Nothing should exist only in someone's head or on a local computer. If it's important to the project, it goes in Git.

### Branch Strategy

```
main/               # Protected, release-ready only
develop/            # Integration branch
feature/*           # Individual features
docs/*              # Documentation-only changes
hardware/*          # Hardware subsystem changes
firmware/*          # Firmware subsystem changes
studio/*            # Desktop application changes
cloud/*             # Cloud platform changes
mobile/*            # Mobile application changes
```

### Branch Protection Rules

- `main` — protected. Requires PR review, passing CI, and documentation checklist completion.
- `develop` — integration branch. All feature branches merge here.
- Feature branches must be deleted after merge.

## Pull Request Policy

Every pull request must pass the following checks. A PR may be rejected if any item is missing:

- Documentation updated
- Architecture documents updated (if architecture changed)
- CHANGELOG.md updated
- Tests included (if applicable)
- ADR created (if architectural decision)
- PROJECT_STATUS.md updated
- Technical debt reviewed

### PR Review Requirements

1. All documentation checklist items must be checked
2. Build must succeed with no warnings
3. Tests must pass
4. ADR must be linked if architecture changed
5. At least one reviewer must approve

### PR Template

A pull request template is provided at `.github/PULL_REQUEST_TEMPLATE.md`. It includes the full documentation checklist and must be used for all PRs.

## Adopted ADRs

See `ADR/` directory for all records. Every architectural decision creates an ADR.

## Architecture Decisions

Every significant architectural decision must be documented as an **Architecture Decision Record (ADR)** in the `ADR/` directory.

```
ADR/
├── 0001-white-label-platform-architecture.md
├── 0002-rusefi-fork-strategy.md
├── 0003-v1-ui-strategy.md
├── 0004-brand-manager-pattern.md
└── ...
```

### ADR Template

```markdown
# ADR-NNN: Title

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Context

What is the issue motivating this decision?

## Decision

What is the change being made?

## Consequences

Why this is the right decision and what trade-offs are accepted.
```

## Coding Standards

### Firmware (C++)

- Follow existing code style in the module being modified
- No hardcoded values or magic numbers — use named constants
- Every function must have a single responsibility
- Document public APIs with comments
- Complex algorithms (CAN, fuel, timing, interrupts, scheduler, safety) MUST include explanatory comments

### Studio (TypeScript/React)

- TypeScript strict mode
- Functional components with hooks
- Zustand for state management
- CSS modules or styled-components for styling

### General

- No product or company names hardcoded in source code
- All branding references must go through `branding/brand.json`
- Every change to upstream rusEFI must be documented
- Tests must pass before merging

## Commit Policy

Use conventional commits:

```
feat:    New feature
fix:     Bug fix
docs:    Documentation changes
refactor:Code restructuring
test:    Test changes
perf:    Performance improvement
ci:      CI/CD changes
build:   Build system changes
```

Documentation commits are first-class commits.

## Pull Request Process

1. Create a branch from `develop`
2. Make changes with clear commit messages
3. Reference upstream rusEFI commits where applicable
4. Ensure build succeeds with no warnings
5. Update all required documentation (per DDD policy)
6. Create or update ADR for architectural changes
7. Create or update daily engineering log

## Quality Gate

Before marking ANY task complete, verify:

- [ ] Documentation updated
- [ ] Links valid
- [ ] Diagrams updated
- [ ] ADR created
- [ ] Status updated
- [ ] Changelog updated
- [ ] History updated
- [ ] Technical debt reviewed

If any checkbox fails, the task is **NOT** complete.

## Upstream Changes

When modifying firmware that originates from rusEFI:

1. Note the upstream commit hash in the commit message
2. If the change should be contributed upstream, note that separately
3. Keep a `firmware/upstream/` reference of the original for diff purposes
