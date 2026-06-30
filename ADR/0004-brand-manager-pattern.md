# ADR-0004: BrandManager — Single Source of Truth for Branding

## Status

Accepted

## Context

Multiple components in the platform need access to branding information: firmware, desktop app, mobile app, cloud portal, installer, documentation, and website. Without a single source of truth, branding becomes duplicated and inconsistent.

## Decision

Implement a **BrandManager** pattern where:

1. **Single configuration file**: `branding/brand.json` contains all branding data
2. **Centralized schema**: All brandable strings are defined in one schema
3. **Component consumers**: Each component reads from the same file:
   - Firmware: Compile-time injection via build system
   - Studio (desktop): Runtime loading from local file
   - Mobile: Build-time injection via CI/CD
   - Cloud Portal: Runtime loading from API/config
   - Installer: Build-time asset packaging
   - Documentation: Template rendering with brand variables
4. **Variable substitution**: Strings use `${variable}` syntax resolved at consumption time

## BrandManager Interface

```json
{
  "brand": {
    "product_name": "...",
    "product_short_name": "...",
    "company_name": "...",
    ...
  },
  "firmware": { ... },
  "studio": { ... },
  "cloud": { ... },
  "mobile": { ... },
  "installer": { ... },
  "documentation": { ... },
  "theme": { "dark": { ... }, "light": { ... } }
}
```

## Consequences

### Positive
- Single change point for all branding
- Consistent across all components
- No code changes for rebranding
- Supports white-label and multi-product scenarios

### Negative
- Requires a branding injection step in every build pipeline
- Brand assets (logos, icons) must be maintained in one place
- Runtime loading means branding changes require restart (not rebuild)

### Neutral
- BrandManager is not a runtime service — it's a build/runtime configuration pattern
- Platform engineering name "ECU Platform Core" remains constant regardless of brand
