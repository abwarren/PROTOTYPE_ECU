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

### Changed

#### Build & Toolchain
- Firmware build toolchain verified and installed: ARM GCC 12.3.Rel1, Java 11.0.23 (Temurin), 7-Zip 23.01, mtools 4.0.43
- `firmware/upstream/firmware/Makefile`: Added `-Wno-error=shadow` for GCC 12.x compatibility
- `scripts/build-firmware.sh`: Created, reviewed, and fixed (JAVA_HOME export, ARM GCC auto-detection, diagnostic messaging)
- `-Werror=shadow` fix committed inside firmware/upstream submodule (commit `7abb688`)

#### Repository Structure
- Git repository initialized at root (`361f3a4`)
- `firmware/upstream` configured as git submodule (commit `8540e44`)
- `.gitignore` created with build output and toolchain exclusions
- `.github/workflows/ddd-check.yml`: GitHub Actions DDD quality gate CI
- **Restructured into 18 numbered directories:** `01_Architecture/` through `18_Roadmap/`
- All documentation migrated from flat `docs/` layout into organized numbered directories
- Legacy directories cleaned up (`research/`, `01_Research/`, `10_Documentation/` removed)
- Landing pages created in key directories (`01_Architecture/`, `04_Firmware/`, `17_Decisions/`, `11_Documentation/`)
- `START_HERE.md`: Repository entry point created
- `SESSION.md`: Session handoff document created

#### Governance & Agent System
- **Multi-agent R&D system documented** at `11_Documentation/engineering/agent-system.md`
  - 11 specialized agents with roles and directory ownership
  - Standardized START→END agent workflow
  - Agent locking (file ownership per agent)
  - Branch strategy (feature branches per agent)
  - Quality gate checklist (10 checks, 90/100 minimum)
- `PROJECT_RULES.md`: Added (governance, workflow, locking, branch strategy)
- `CODING_STANDARDS.md`: Added (language-specific coding conventions)
- `CURRENT_STATE.md`: Added (shared project state for all agents)
- `TODO.md`: Added (task tracking)

#### DDD Quality Gate
- `scripts/ddd-check.sh`: Updated from 36 to 40 checks
- Validates all 18 directories are populated
- New shared files (CURRENT_STATE.md, PROJECT_RULES.md, CODING_STANDARDS.md, TODO.md) now checked

### Fixed

- **D-009:** Build toolchain fully installed — ARM GCC 12.3, Java 11, 7-Zip, mtools all working
- `-Werror=shadow` with GCC 12+ on rusEFI source code — suppressed until code is refactored
- Investor docs (16 files) restored from git history after cleanup
- Management docs restored and migrated to `11_Documentation/management/`

### Upcoming

- [ ] Firmware brand separation (replace all rusEFI customer-facing strings)
- [ ] Firmware identity system (versioning, board IDs, device IDs)
- [ ] Configuration profiles (NA, Turbo, Supercharged, Motorcycle)
- [ ] Studio scaffold (Electron + React + TypeScript)
