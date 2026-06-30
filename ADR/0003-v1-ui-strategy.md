# ADR-0003: V1 Differentiator is User Experience, Not Firmware

## Status

Accepted

## Context

With a rusEFI-based firmware, the underlying engine control algorithms will initially be identical to rusEFI. The platform needs to differentiate itself in the market while the firmware is progressively rewritten.

Market analysis shows that tuners spend 95% of their time in tuning software, not working with firmware. The perception of the platform is dominated by the desktop application experience.

## Decision

For Version 1, the primary differentiator is **Studio (the desktop application)**, not the firmware.

- Invest engineering effort in a premium, modern, cloud-connected desktop application
- Preserve firmware stability by keeping rusEFI's engine control logic unchanged
- Replace only customer-facing branding in the firmware (USB strings, version strings, etc.)
- Design the UI to look nothing like existing ECU software
- Reserve an AI panel in the layout for future AI-assisted tuning

## Consequences

### Positive
- Faster time to market (don't wait for firmware rewrite)
- Lower risk (proven firmware underneath)
- Higher perceived value (modern UI)
- Clear differentiation from other rusEFI-based products
- Investors can see the product working sooner

### Negative
- Firmware improvements are delayed
- Upstream firmware bugs remain until fixed or rewritten
- Some customers may know it's rusEFI-based and question the value

### Mitigations
- Brand separation ensures no visible rusEFI references
- Progressive firmware improvements begin in V2
- Cloud connectivity and mobile app add genuine new capabilities
