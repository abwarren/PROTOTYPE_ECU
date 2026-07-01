# ARCHITECTURE_IMPROVEMENTS.md — Architecture, API, Plugin, Studio & Cloud Recommendations

> **Type:** EDR Companion — Architecture Domain
> **Governance:** Per ADR-0007 — proposals only, does not modify baseline

---

## 1. FreeRTOS vs ChibiOS Resolution

### Current State
- `01_Architecture/firmware-architecture.md` states: **FreeRTOS**, with "Future: AUTOSAR OS"
- The actual rusEFI codebase uses: **ChibiOS**
- TECH_DEBT.md D-007 states: "Scheduler is not preemptive RTOS" (referring to rusEFI's template-based scheduler on top of ChibiOS)
- The architecture document and the code disagree

### Risk
An engineer reading the architecture document will design for FreeRTOS APIs. The actual codebase uses ChibiOS APIs. This mismatch will cause integration failures when platform code is written.

### Recommendation

**Resolve to ChibiOS for V1-V3, migrate to FreeRTOS or AUTOSAR OS in Phase 5.**

Rationale:
- ChibiOS is already the running RTOS in rusEFI — switching now would require rewriting every driver
- ChibiOS has an AUTOSAR-like HAL that maps well to the eventual migration path
- FreeRTOS offers no advantage over ChibiOS for this use case (both are preemptive RTOSes)
- The architecture doc should reflect reality

### Migration
1. Update `01_Architecture/firmware-architecture.md`: replace "FreeRTOS" with "ChibiOS"
2. Update `01_Architecture/firmware-architecture.md`: add note "Future: AUTOSAR OS or FreeRTOS in Phase 5"
3. Update TECH_DEBT.md D-007: clarify that ChibiOS IS preemptive, the rusEFI *scheduler* on top of it is cooperative

### Priority: P0 (blocks correct specification)

---

## 2. Studio Technology Stack: Electron vs Tauri

### Current State
`01_Architecture/studio-architecture.md` specifies: Electron + React + TypeScript

### Assessment

| Metric | Electron | Tauri |
|--------|----------|-------|
| Binary size | ~250MB | ~10MB |
| Memory (idle) | ~150MB | ~30MB |
| Startup time | 3-8 seconds | <1 second |
| Cross-platform | ✅ Win/Mac/Linux | ✅ Win/Mac/Linux |
| Node.js native modules | ✅ SerialPort, SQLite | 🟡 Rust native |
| WebView engine | Chromium (bundled) | System WebView |
| Security | Larger attack surface | Smaller, sandboxed |
| Maturity | Very mature (Slack, VS Code, Discord) | Newer (v1.0 2023) |

### Recommendation

**ADOPT Tauri for V1.**

Rationale:
- A tuning application that takes 5 seconds to start and uses 150MB of RAM creates a poor first impression with tuners accustomed to lightweight native tools
- Tauri's Rust backend provides direct access to serial ports, file I/O, and USB without Node.js native module complexity
- The 25x smaller binary is significant for distribution (tuners download the app frequently for updates)
- The system WebView (Edge on Windows, WebKit on macOS/Linux) eliminates the Chromium security surface
- React + TypeScript UI layer is unchanged — the migration is backend-only

**Counter-argument:** Electron has SerialPort, SQLite, and USB libraries with years of production use. Tauri requires Rust equivalents. The migration cost is real.

**Mitigation:** Prototype the serial communication layer in Tauri before committing. If the Rust serial ecosystem is insufficient, fall back to Electron.

### Migration (if adopted)
1. ADR for Tauri adoption
2. Update `01_Architecture/studio-architecture.md`: replace Electron with Tauri
3. Prototype: Rust backend with serial port access + React frontend
4. Decision gate: if prototype fails, revert to Electron

### Priority: P1 (before Studio implementation begins)

---

## 3. Cloud Platform: AWS vs Self-Hosted

### Current State
`01_Architecture/cloud-architecture.md` specifies: AWS IoT Core / EMQX as alternatives, Kafka/Kinesis, TimescaleDB

### Assessment

The architecture lists both AWS services AND open-source equivalents (EMQX, Kafka) without choosing. This ambiguity means two different cloud architectures are being planned simultaneously.

### Recommendation

**Phase 1 (TB-001 to TB-003): Self-hosted stack on a single VPS.**

Rationale:
- TB-001 only needs Studio → ECU → DB → Dashboard — no cloud required yet
- TB-003 needs cloud ingestion but at prototype scale (1-10 vehicles)
- AWS IoT Core + Kinesis + TimescaleDB on AWS costs $500+/month before any customers
- A $40/month VPS running EMQX + TimescaleDB handles 10,000 vehicles

**Phase 4 (Production): Migrate to managed services.**

Rationale:
- Once at 100+ vehicles, managed services become cost-effective
- The migration path is clean: EMQX → AWS IoT Core, self-hosted TimescaleDB → TimescaleDB Cloud

### Architecture: Recommended V1 Stack

```
$40/month VPS (Hetzner / DigitalOcean)
├── EMQX (MQTT broker, free)
├── TimescaleDB (time-series, free)
├── Node.js/Express API (same codebase as later AWS deployment)
└── Nginx reverse proxy + Let's Encrypt
```

### Migration
1. Design cloud as "infrastructure-agnostic" — use Docker Compose for local dev, deployable to any Linux host
2. Define cloud provider abstraction: local Docker → VPS → AWS (progressive scaling)
3. Update `01_Architecture/cloud-architecture.md` with deployment tiers

### Priority: P1 (before Cloud implementation)

---

## 4. API Architecture: Protocol Specification Missing

### Current State
- Cloud API endpoints are defined (REST-style: `/api/vehicles`, `/api/telemetry`, etc.)
- No ECU-to-Studio protocol is specified
- No ECU-to-Cloud protocol is specified
- No Studio-to-Cloud protocol is specified
- The architecture mentions "Protocol" as a layer but doesn't define it

### Assessment

The single highest-risk interface in the entire platform is the ECU ↔ Studio protocol. It must carry:
- Real-time telemetry (RPM, AFR, temps, pressures) at 10-100Hz
- Calibration read/write (large binary blobs)
- Diagnostics (DTC read/clear)
- Firmware update (multi-MB binary transfer with integrity verification)

Without a defined protocol, the firmware team and Studio team will build incompatible interfaces.

### Recommendation

**Design the ECU Communication Protocol as a specification document BEFORE any implementation.**

Proposed design:

```
ECU ↔ Studio Protocol (over USB CDC / CAN / BLE)

Transport: Binary framed messages
Frame: [Magic 2B][Length 2B][Type 1B][Seq 1B][Payload N][CRC 2B]

Message Types:
  0x01  Telemetry Stream (periodic, high-frequency)
  0x02  Telemetry Request (on-demand parameter)
  0x10  Calibration Read (table read)
  0x11  Calibration Write (table write)
  0x20  DTC Read
  0x21  DTC Clear
  0x30  Firmware Info
  0x31  Firmware Block Write
  0x32  Firmware Verify
  0x40  ECU Identity
  0x41  ECU Reset
  0xFF  NACK (error response)

Telemetry Stream Format:
  [Timestamp 4B][Channel Count 1B]
  [Channel ID 1B][Value 4B] × N

Calibration Format:
  [Table ID 2B][Offset 4B][Length 2B][Data N]
```

### Benefits
- Single protocol for USB, CAN, and BLE transports
- CRC integrity on every frame
- Sequence numbers for reliable delivery
- Extensible message type space (256 types)
- Small enough to fit in ECU RAM alongside engine control

### Migration
1. Write `01_Architecture/protocol-architecture.md` with full specification
2. Implement reference parser in Rust (for Studio Tauri backend) and C (for firmware)
3. Include protocol test vectors for conformance testing

### Priority: P0 (blocks TB-001)

---

## 5. GPL / Proprietary Boundary (ADR-0008 Proposal)

### Current State
- ADR-0002 acknowledges GPL-3.0 constraint
- TECH_DEBT.md D-001 rates this P0 but assigns to Phase 5
- No interface boundary is defined
- 12 empty `firmware/platform/` directories imply platform code will be written soon

### Risk Analysis

GPL-3.0 is a "viral" license. Any code that links against GPL code must also be GPL. The rusEFI firmware is GPL-3.0. If platform code in `firmware/platform/` links against rusEFI symbols (which it must, to extend engine control), it becomes GPL.

The "proprietary algorithms on top" strategy only works if there is a clean-room boundary: IPC, separate process, or separate processor.

### Recommendation

**Three-Layer Architecture with GPL Boundary**

```
┌─────────────────────────────────────────┐
│  Layer 3: Proprietary Applications       │
│  (Studio, Cloud, Mobile, AI)            │
│  License: Commercial                    │
│  ↔ Communicates via defined API/Protocol │
├─────────────────────────────────────────┤
│  Layer 2: GPL Firmware (rusEFI fork)     │
│  License: GPL-3.0                       │
│  Contains: engine control algorithms     │
├─────────────────────────────────────────┤
│  Layer 1: Hardware + Bootloader          │
│  License: Mixed (bootloader may be MIT) │
└─────────────────────────────────────────┘
```

**Rule: No proprietary code links against GPL symbols.**

Proprietary extensions that need to influence engine behavior communicate via:
- Defined protocol messages (UDS-style service calls)
- Shared memory with well-defined, versioned interface structures
- Configurable hooks (Lua scripting in the GPL layer, triggered by proprietary logic)

The key insight: **Studio, Cloud, and Mobile are already cleanly separated** — they communicate via USB/CAN/WiFi protocols, not by linking. The risk is in `firmware/platform/`. If platform code links against rusEFI, it's GPL. If platform code communicates via a protocol boundary (even on the same processor), it can be proprietary.

### Migration
1. WRITE ADR-0008 with formal boundary specification
2. Define the exact IPC mechanism (message passing, shared memory, or multi-core)
3. Audit every planned `firmware/platform/` module for GPL contamination risk
4. Update TECH_DEBT.md D-001 with concrete boundary design

### Priority: P0 (blocks all firmware platform code)

---

## 6. Safety Architecture

### Current State
- No safety architecture document exists
- No fault analysis
- No fail-safe state specification
- No ASIL decomposition
- No watchdog hierarchy

### Recommendation

**WRITE `01_Architecture/safety-architecture.md` as P0 specification.**

Minimum contents:

1. **Fault Classes**
   - Class A: Sensor fault (plausibility check, substitute value)
   - Class B: Actuator fault (disable output, limp mode)
   - Class C: Processor fault (watchdog reset, safe state)
   - Class D: Power fault (brownout detection, orderly shutdown)

2. **Fail-Safe States**
   - Throttle: return to idle (spring return + H-bridge disable)
   - Ignition: cut spark (safe state = no spark)
   - Fuel: cut injectors (safe state = no fuel)
   - CAN: continue transmitting diagnostic messages even in fail-safe

3. **Watchdog Hierarchy**
   - External hardware watchdog (independent IC, 100ms timeout)
   - RTOS task watchdog (monitors critical tasks)
   - Software watchdog (application-level health checks)

4. **ASIL Decomposition (ISO 26262)**
   - Even for a prototype, classify each function by ASIL level
   - Throttle control: ASIL C/D
   - Fuel/Ignition: ASIL B
   - Telemetry: QM (no safety requirement)

5. **Verification Strategy**
   - Fault injection testing (simulated sensor failures)
   - Watchdog timeout testing
   - Fail-safe state transition testing

### Priority: P0 (before any engine-connected testing)

---

## 7. Plugin Architecture

### Current State
- Studio architecture mentions "Plugin System: User-created widgets via React components"
- No specification exists

### Recommendation

**Defer plugin architecture to Phase 3.**

Rationale: A plugin system is a platform feature that requires a stable API. Building it before the API stabilizes creates an maintenance burden. Focus TB-001 through TB-006 first.

When designed:
- Plugins should be Wasm-based (sandboxed, language-agnostic)
- Studio exposes a typed API surface
- Plugins cannot access raw hardware (security boundary)

### Priority: P2 (Phase 3+)

---

*Per ADR-0007, these are proposals. No baseline documents have been modified.*
