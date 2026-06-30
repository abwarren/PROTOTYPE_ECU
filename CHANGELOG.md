# Changelog

All notable changes to the ECU Platform Core are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to the Documentation-Driven Development (DDD) policy.

## [Unreleased]

### Added

#### Repository & Structure
- `branding/` directory with BrandManager (`brand.json`, logos, icons, themes, colors, splash, fonts)
- `docs/` extended structure: firmware, studio, cloud, hardware, bootloader, protocol, manufacturing, testing, deployment, api, diagrams, decisions, history, investor, onboarding
- `ADR/` directory with 4 Architecture Decision Records
- `firmware/upstream/` — rusEFI fork (commit `8540e44142d837e991e89efc062f8be3feadde8c`)
- `firmware/platform/` — placeholder for platform firmware modifications
- `research/` corpus migrated from `01_Research/`
- `studio/`, `cloud/`, `mobile/`, `hardware/`, `sdk/`, `core/` directories

#### Documentation
- Root documents: `README.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `BUILD.md`
- Policy documents: `LICENSE_NOTES.md`, `CONTRIBUTING.md`, `DECISIONS.md`
- Tracking documents: `PROJECT_STATUS.md`, `TECH_DEBT.md`, `CHANGELOG.md`
- 9 architecture documents (brand-neutral)
- rusEFI Architecture Audit (16 modules with source-verified file paths)
- Daily Engineering Log (`docs/history/2026-06-30.md`)

#### Architecture Decisions
- `ADR/0001-white-label-platform-architecture.md`
- `ADR/0002-rusefi-fork-strategy.md`
- `ADR/0003-v1-ui-strategy.md`
- `ADR/0004-brand-manager-pattern.md`

#### Engineering Policy
- Documentation-Driven Development (DDD) policy adopted
- Definition of Done checklist implemented
- Quality gate requirements established

### Upcoming

- [ ] Firmware brand separation (replace all rusEFI customer-facing strings)
- [ ] Firmware build toolchain verification
- [ ] Firmware identity system (versioning, board IDs, device IDs)
- [ ] Configuration profiles (NA, Turbo, Supercharged, Motorcycle)
- [ ] Studio scaffold (Electron + React + TypeScript)
