# New Engineer Onboarding Guide

Welcome to the ECU Platform Core engineering team. This guide will help you understand the platform, set up your development environment, and make your first contribution.

---

## Quick Start

```bash
# Clone the repository
git clone <repository-url> && cd <repository-name>

# Read the documentation
cat README.md
cat ARCHITECTURE.md
cat BUILD.md

# Explore the codebase
ls -la firmware/upstream/
ls -la docs/
ls -la branding/
```

## Platform Overview

The ECU Platform Core is a white-label ECU platform. The platform engineering name is "ECU Platform Core" — the customer-facing brand is configured in `branding/brand.json`.

```
┌─────────────────────────────────────┐
│          Customer                   │
│  Sees: <brand.product_name>         │
├─────────────────────────────────────┤
│          Brand Layer                │
│  branding/brand.json                │
├─────────────────────────────────────┤
│      Platform Components            │
│  Firmware │ Studio │ Cloud │ Mobile │
└─────────────────────────────────────┘
```

## Key Concepts

### Documentation-Driven Development (DDD)

Documentation is part of the product. A task is never complete until all documentation is updated. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the Definition of Done.

### Brand Abstraction

No product or company names are hardcoded in source code. All branding comes from `branding/brand.json`. To rebrand, edit this single file and rebuild.

### White-Label Architecture

The firmware, desktop app, cloud services, and mobile app are all brand-neutral. The same codebase can ship as any brand without source code changes.

## Repository Map

| Directory | Purpose | First Doc to Read |
|-----------|---------|-------------------|
| `firmware/upstream/` | rusEFI fork (GPL-3.0) | `firmware/upstream/FORK_METADATA.md` |
| `firmware/platform/` | Platform firmware modifications | `docs/firmware/` |
| `studio/` | Desktop application | `docs/studio-architecture.md` |
| `cloud/` | Cloud platform | `docs/cloud-architecture.md` |
| `mobile/` | Mobile app | `docs/mobile-architecture.md` |
| `hardware/` | PCB and enclosure | `docs/hardware-architecture.md` |
| `branding/` | Brand configuration | `branding/brand.json` |
| `docs/` | All documentation | `docs/README.md` |
| `research/` | Technical research | `research/README.md` |
| `ADR/` | Architecture decisions | All `.md` files |

## Development Workflow

1. **Understand** — Read the relevant documentation first
2. **Plan** — Create or update ADR if architecture changes
3. **Implement** — Follow coding standards in CONTRIBUTING.md
4. **Document** — Update all required documentation
5. **Verify** — Build, test, review
6. **Commit** — Use conventional commit format

## First Tasks

If you're looking for where to start:

1. Read the architecture documents in `docs/`
2. Set up the build environment (see BUILD.md)
3. Build the firmware from `firmware/upstream/`
4. Trace the brand strings in the firmware
5. Create a small module documentation improvement

## Communication

- Architecture decisions: Add ADR to `ADR/`
- Questions: Create a GitHub issue
- Bugs: Log in issue tracker + update TECH_DEBT.md

## Key People & Resources

| Resource | Location |
|----------|----------|
| Architecture docs | `docs/` |
| Build instructions | `BUILD.md` |
| Contributing guide | `CONTRIBUTING.md` |
| Technical debt | `TECH_DEBT.md` |
| Project status | `PROJECT_STATUS.md` |
| Engineering log | `docs/history/` |
