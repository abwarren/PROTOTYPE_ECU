# ADR-0001: White-Label Platform Architecture

## Status

Accepted

## Context

The ECU platform needs to support multiple product names, company names, and visual identities over its lifecycle. Initially it will be branded as "Prototype ECU" but the final commercial name is unknown. Hardcoding any product or company name would create significant rework when rebranding.

We considered:
1. **Hardcode a single name** — Simplest but creates rebranding cost
2. **Configuration file only** — Better but doesn't address firmware strings, USB IDs, etc.
3. **Brand abstraction layer** — A single `brand.json` consumed by all components at build/runtime

## Decision

Adopt a **white-label platform architecture** where:
- No product or company names are hardcoded in source code
- All branding is defined in a single `branding/brand.json` file
- The firmware uses `${PRODUCT_NAME}` and `${COMPANY_NAME}` placeholders resolved at compile time
- The desktop application loads branding dynamically at runtime
- The mobile app loads branding at build time via CI
- The cloud portal loads branding dynamically at runtime
- The internal codename for the platform is "ECU Platform Core" (engineering use only)

## Consequences

### Positive
- Zero source code changes needed to rebrand
- Multiple product lines can share the same codebase
- Enterprise customers can white-label the platform
- Consistent branding across all touchpoints
- Easy A/B testing of brand identities

### Negative
- Slightly more complex build process (branding injection step)
- Need to maintain duplicate brand assets for different products
- Runtime brand loading adds minor latency to desktop app startup

### Neutral
- Internal documentation always refers to the platform by its engineering codename
- The brand abstraction layer must be documented for integrators
