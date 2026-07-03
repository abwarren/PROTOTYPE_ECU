# TB-005A — USB Transport (Implementation)

> **Status:** ✅ C1 — Implemented (gates TB-005B verification)
> **Prerequisite:** TB-004 (RusEFIProtocolAdapter — architecture frozen)
> **Architecture:** ADR-0010 (Transport Abstraction)
> **Policy:** Architecture frozen. Demo Gate mandatory for C2. 7 artifacts required.

---

## Objective (Met)

Implement a concrete UsbTransport class that implements the EcuTransport
interface and connects the UI to real serial port I/O via Tauri.

---

## Scope (Delivered)

### Implementation

- [x] `studio/core/transport/UsbTransport.ts` — implements EcuTransport
- [x] USB device enumeration via Tauri `discover_ports` command
- [x] Connect by device path via Tauri `open_port` command
- [x] Disconnect with cleanup via Tauri `close_port` command
- [x] Send/receive frames via Tauri `write_port`/`read_port` commands
- [x] Heartbeat check via short read timeout
- [x] Connection state machine (DISCONNECTED→DISCOVERING→CONNECTING→CONNECTED→ERROR)
- [x] Error handling and listener pattern

### UI Integration

- [x] App.tsx wired to live UsbTransport (was static mockup)
- [x] Auto-scan USB devices on app load
- [x] Device list with connect buttons
- [x] Real-time connection state display
- [x] rusEFI handshake attempt on connect
- [x] Disconnect button with cleanup
- [x] Footer shows live connection state

### Rust Backend (existed, verified)

- [x] `discover_ports` — enumerates serial devices (filters for USB CDC)
- [x] `open_port` — opens serial port at 115200 baud
- [x] `close_port` — releases port resource
- [x] `write_port` — sends byte array
- [x] `read_port` — reads with configurable timeout

---

## Verification (C1 — Implementation)

| Check | Result |
|-------|--------|
| TypeScript compiles | ✅ 0 errors (`npx tsc --noEmit`) |
| Vite frontend build | ✅ 38 modules, 152KB JS bundle |
| Rust syntax | ✅ Formatted (`rustfmt`) |
| All interface methods implemented | ✅ 6/6 |
| State machine transitions | ✅ 5 states |
| UI wired to transport (not mock) | ✅ |

---

## Demo Gate (C2 — Blocked)

TB-005A is C1. TB-005B gates C2/C3:

- [ ] Native binary produced (Linux: `npm run tauri build`)
- [ ] Windows .msi produced (cross-compile or CI)
- [ ] USB device detected in discover()
- [ ] Connect succeeds
- [ ] Heartbeat succeeds
- [ ] Disconnect succeeds

**Blockers:**
- Linux native build requires: `libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev`
- Windows cross-compile requires: MinGW or MSVC cross-toolchain + `clang-cl`
- No sudo on this machine for package installation

**Recommended path:** GitHub Actions Windows runner producing `7100CPT-Setup.exe` per commit.

---

## Next

**TB-005B: USB Transport Verification** — Produce native binary, connect to real ECU, capture evidence, pass Demo Gate.
