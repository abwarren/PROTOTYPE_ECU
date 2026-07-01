# TB-003 — Communication Layer (Three-Layer Architecture)

> **Status:** Implementation Complete — Integration Pending
> **Date:** 2026-07-01
> **Branch:** feature/tb-003-transport-layer
> **Commit:** 776e8c9

---

## What Was Built

Three-layer communication architecture per ADR-0010, ADR-0012:

```
Studio UI (EcuConnectionPanel)
     │
EcuService              ← Business logic
     │
RusEFIProtocol          ← Binary frames, CRC-16, handshake
     │
UsbTransport            ← USB CDC via Tauri serialport (Rust)
     │
ECU Firmware
```

### Files (1,611 lines total)

| File | Layer | Lines | Purpose |
|------|-------|-------|---------|
| `studio/src-tauri/src/lib.rs` | Transport (Rust) | 167 | USB CDC serialport commands |
| `studio/core/transport/EcuTransport.ts` | Transport API | 51 | Transport trait definition |
| `studio/core/transport/UsbTransport.ts` | Transport Adapter | 132 | Wraps Tauri commands into trait |
| `studio/core/transport/EcuProtocol.ts` | Protocol API | 131 | Protocol + Service interfaces |
| `studio/core/transport/RusEFIProtocol.ts` | Protocol Impl | 237 | Binary frames, CRC-16, handshake |
| `studio/src/EcuConnection.tsx` | UI | 185 | Connection panel component |
| `studio/src/App.tsx` | UI | 49 | App shell with connection panel |
| `studio/src/styles.css` | UI | 414 | Dark theme + connection panel styles |

---

## Evidence

### Build Verification
- [x] Frontend builds: 39 modules, 541ms, 0 errors
- [x] Rust compiles: serialport + Tauri, no code errors
- [ ] Full Tauri native build: requires system GUI libraries (libgtk-3-dev, libpango) — headless server limitation

### Integration Verification
- [ ] Studio launches on desktop
- [ ] USB devices discovered
- [ ] ECU connects via USB CDC
- [ ] Handshake completes
- [ ] ECU identity displayed
- [ ] Disconnect works
- [ ] Reconnect works
- [ ] Error handling: timeout
- [ ] Error handling: unsupported firmware
- [ ] No crashes on repeated connect/disconnect
- [ ] No crashes on unplug during connection

---

## Known Limitations

1. **Tauri native build** requires `libgtk-3-dev`, `libpango1.0-dev` — not installed on headless server
2. **No hardware ECU** connected for integration testing
3. **Protocol not tested** against real rusEFI firmware
4. **Rust serialport** tested for compilation, not for runtime against physical device

These will be resolved when TB-003 is tested on a development machine with an ECU connected.

---

## QA Status

| Domain | Status |
|--------|--------|
| Architecture | 🟢 APPROVED |
| Implementation | 🟢 APPROVED |
| Verification | 🔴 NOT VERIFIED |
| Production Readiness | 🔴 NOT READY |
| **Overall** | **🟠 DO NOT MERGE** |

TB-003 is **implemented but unverified**. Merge is blocked pending successful end-to-end tracer bullet execution. Required evidence: screenshots of connected ECU, handshake log, identity display. See `qa-signoff.md` for the full checklist.
