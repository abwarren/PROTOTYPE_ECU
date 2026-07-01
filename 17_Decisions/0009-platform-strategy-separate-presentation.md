# ADR-0009: Platform Strategy — Separate Presentation from Platform

## Status

Proposed

## Context

ADR-0002 established rusEFI as the firmware foundation. ADR-0003 established Studio as the V1 differentiator. This ADR formalizes the *architectural principle* that makes both strategies work together: a compatibility layer that isolates the application from the firmware internals.

The engineering question is not "should we replace rusEFI?" — it's "how do we build Studio so that the firmware underneath is an implementation detail?"

## Decision

Adopt a **Platform-Presentation Separation** architecture.

### Core Principle

The firmware is not the differentiator. The differentiators are:

- 🎨 Prototype Studio (desktop application)
- 🤖 AI tuning
- ☁️ Cloud platform
- 📱 Mobile app
- 📊 Analytics
- 🛠️ Workshop workflow
- 🚗 Vehicle database
- ⚙️ Calibration database
- 📈 Professional dashboards

The firmware is the invisible engine. The user never sees rusEFI.

### Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   Prototype Studio                         │
│                                                            │
│  Completely custom UI                                     │
│  New workflow                                              │
│  New branding                                              │
│  New dashboards                                            │
│  AI integration                                            │
│  Database                                                  │
│  Cloud sync                                                │
└───────────────────────────┬────────────────────────────────┘
                            │
                    Prototype Firmware Interface
                    (compatibility layer — same protocol)
                            │
┌───────────────────────────▼────────────────────────────────┐
│            Modified rusEFI Firmware                        │
│                                                            │
│  Minimal changes only:                                     │
│    Custom branding (compile-time injection)                │
│    Custom build configuration                              │
│    Future extension points                                 │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
               Prototype ECU Hardware (custom PCB)
```

### What Stays (Untouched — Mature, Battle-Tested)

These rusEFI components are not modified. Replacing them early adds risk without adding customer value:

- CAN communication
- Flashing protocol
- Trigger decoding
- Fuel algorithms
- Ignition algorithms
- Sensor drivers
- Scheduler
- RTOS / low-level hardware abstraction

### What Changes (Minimal — Branding + Extension Points)

- Branding strings: replaced at compile time via `branding/brand.json`
- Build system: custom configuration for Prototype ECU hardware
- Extension hooks: well-defined points where proprietary code can plug in

### The Prototype Firmware Interface

Studio communicates through a **Prototype Firmware Interface** — not directly with rusEFI internals. This is a compatibility layer that:

1. Defines the protocol between Studio and firmware (see ADR-0007 Architecture Improvements §4)
2. Isolates the application from firmware implementation details
3. Enables future firmware replacement without Studio redesign

If the underlying firmware changes (rusEFI → custom), Prototype Studio does not need a major redesign. Only the compatibility layer adapts.

### Repository Layout

```
firmware/
├── upstream/
│   └── rusefi/              # Pristine rusEFI fork (GPL-3.0)
│
├── prototype/
│   ├── protocol/            # Prototype Firmware Interface (protocol spec + parsers)
│   ├── features/            # Proprietary extensions (if any, behind IPC boundary)
│   ├── branding/            # Compile-time brand injection scripts
│   ├── patches/             # Minimal patches to upstream (documented, tracked)
│   └── integrations/        # CAN, USB, BLE configuration for Prototype hardware
│
└── build/                   # Custom Makefiles that pull upstream + prototype
```

### Long-Term Roadmap

| Phase | Studio | Firmware | Hardware |
|-------|--------|----------|----------|
| **Phase 1 (MVP)** | Custom Studio, rusEFI firmware, prototype PCB | Minimal changes (branding, build) | Prototype PCB |
| **Phase 2** | Studio + Cloud + Mobile | Modified firmware (extension points) | Production hardware |
| **Phase 3** | Studio + AI + Workshop | Gradual proprietary firmware where it makes business sense | V2 hardware |

The firmware gradually becomes proprietary where it creates business value — but Studio never breaks because it speaks the Prototype Firmware Interface, not rusEFI internals.

### Cloud as Enhancement, Not Dependency

Studio operates fully offline. All core functions (dashboard, tuning, datalogging, diagnostics) work without internet. Cloud sync is an enhancement:

- Offline: full functionality, local SQLite storage
- Online: sync to cloud, fleet management, remote diagnostics
- Transition: seamless — no feature degrades when offline

This is critical for workshop environments (racetracks, dyno facilities) where internet is unreliable.

### User Experience Principle

Prototype Studio should look nothing like rusEFI's current interface. Every major tuning platform has a distinct interface:

- MoTeC M1 Tune
- Haltech NSP
- Link PCLink
- ECUMaster

Prototype Studio is a new entry in this category — not a reskinned rusEFI console.

```
┌─────────────────────────────────────────────┐
│ Prototype Studio                            │
├─────────────────────────────────────────────┤
│ 🚗 Garage                                   │
│ 📡 Connect ECU                              │
│ 📊 Live Dashboard                           │
│ 🔥 Engine (Fuel, Ignition, Boost, Idle)     │
│ 📈 Live Charts                              │
│ 🧠 AI Assistant                             │
│ 🗂️ Vehicle Library                          │
│ 📋 Diagnostics                              │
│ ⚙️ Firmware                                 │
│ ☁️ Cloud                                    │
└─────────────────────────────────────────────┘
```

No rusEFI branding. No rusEFI visual style. A completely different user experience.

### Branding Isolation

The word "rusEFI" never appears in any customer-facing surface. Internally, the relationship is documented in ADR-0002 and FORK_METADATA.md. Externally, the product is Prototype ECU — full stop.

## Consequences

### Positive
- Fastest path to a demonstrable product (don't rewrite firmware)
- Lowest risk (proven engine control algorithms)
- Clear differentiation (modern Studio, not firmware features)
- Future-proof (compatibility layer enables gradual firmware replacement)
- Offline-first (workshop-ready from day one)
- Investor-friendly (visible product, not roadmap promises)

### Negative
- GPL-3.0 constraint on firmware remains until Phase 5 replacement
- Compatibility layer adds abstraction overhead
- rusEFI bugs are inherited until fixed or rewritten
- Some enthusiasts may recognize the rusEFI lineage

### Mitigations
- GPL boundary: Studio, Cloud, Mobile, AI are cleanly separated (communicate via protocol, not linking)
- Compatibility layer: thin abstraction — protocol parsing only, no business logic
- Upstream bugs: track in TECH_DEBT.md, fix in patches/ directory
- Branding: complete isolation — no rusEFI strings, logos, or visual patterns

## Relationship to Existing Decisions

This ADR **extends**:
- ADR-0002 (rusEFI as firmware foundation) — adds the architectural isolation layer
- ADR-0003 (Studio as V1 differentiator) — formalizes HOW Studio achieves differentiation
- ADR-0001 (White-label architecture) — ensures rusEFI branding is completely invisible

This ADR **informs**:
- TRACER_BULLETS.md (TB-001 through TB-006) — defines the Studio/firmware boundary
- DATABASE_RECOMMENDATIONS.md — offline-first with cloud sync

## Priority

**P0** — this is the product strategy that shapes every engineering decision from this point forward.
