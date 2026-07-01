# ADR-0002: rusEFI as Firmware Foundation

## Status

Accepted

## Context

The firmware needs a proven, production-tested engine control implementation as its starting point. Building a complete ECU firmware from scratch would take years. The options considered were:

1. **Build from scratch** — Full control, no license constraints, but 3-5 year timeline
2. **Fork rusEFI** — Fastest path to working firmware, GPL constraints
3. **Fork Speeduino** — Simpler codebase, less capable
4. **License commercial reference** — Expensive, limited customization

## Decision

Fork **rusEFI** as the firmware foundation, with the following strategy:

- **Upstream reference**: Keep `firmware/upstream/` as a pristine copy of the original rusEFI at the fork point
- **Platform modifications**: All changes go in `firmware/platform/`
- **Brand separation**: Replace all customer-facing rusEFI branding with configurable brand strings
- **Module replacement**: Each module is classified for eventual replacement (see `TECH_DEBT.md`)
- **Upstream tracking**: Document upstream commits that get merged

## Consequences

### Positive
- Immediate access to mature engine control algorithms
- Active community for bug fixes and improvements
- Well-known trigger patterns and sensor support
- Existing CI and test infrastructure to build upon

### Negative
- GPL-3.0 license on firmware source (proprietary firmware requires full rewrite)
- Need to maintain fork divergence
- Some architectural patterns may not align with long-term vision
- Community contributions must go upstream first

### Mitigations
- Desktop app, cloud, mobile are separate works (not subject to GPL)
- Module classification roadmap for progressive replacement
- Proprietary algorithms can run on top of the GPL stack via well-defined interfaces
