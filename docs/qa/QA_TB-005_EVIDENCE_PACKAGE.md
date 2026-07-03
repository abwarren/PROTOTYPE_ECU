# QA Evidence Package — USB Serial Transport (TB-004, TB-005A, TB-005B)

**Date:** 2026-07-03
**QA Reviewer:** Agent (Hermes)
**Verdict:** 🟡 FAIL (Verification Incomplete)
**Ralph Loop Status:** Cannot exit — missing hardware and build environment

---

## Evidence Hierarchy Applied

Per engineering-discipline Evidence Hierarchy:

| Tier | Evidence Type | Weight | TB-004 | TB-005A | TB-005B |
|------|--------------|--------|--------|---------|---------|
| 1 | Runtime observation | Highest | ❌ | ❌ | ❌ |
| 2 | Logs | High | ❌ | ❌ | ❌ |
| 3 | API payloads | Medium | ❌ | ❌ | ❌ |
| 4 | Source code | Medium | ✅ | ✅ | ✅ |
| 5 | Assumptions | Lowest | — | — | — |

**All evidence is at Tier 4.** No Tier 1-3 evidence exists because:
1. No native Tauri binary can be produced (missing GTK dev headers, no sudo)
2. No Discovery board is connected via USB on this machine

---

## Architecture (Tier 4 — Source Code)

### Vertical Slice

```
React (App.tsx)
    ↓ EcuTransport interface
UsbTransport.ts (177 lines)
    ↓ invoke("list_ports", "open_port", ...)
Tauri IPC bridge
    ↓
serial.rs (395 lines) — 8 commands
    ↓ serialport crate
USB kernel driver
    ↓
Discovery Board (rusEFI F407 / S32K344)
```

### Interface Contract — EcuTransport (TypeScript)

```typescript
interface EcuTransport {
  listPorts(): Promise<SerialPort[]>;
  openPort(path: string, baudRate: number): Promise<void>;
  closePort(path: string): Promise<void>;
  sendFrame(path: string, data: Uint8Array): Promise<void>;
  receiveFrame(path: string, maxBytes: number, timeoutMs: number): Promise<Uint8Array>;
  isOpen(path: string): Promise<boolean>;
}
```

### Rust Commands (8 commands)

| Command | Purpose |
|---------|---------|
| `list_ports` | Enumerate USB serial devices |
| `open_port` | Open serial port with baud rate |
| `close_port` | Close and remove from managed set |
| `write_raw` | Write bytes to open port |
| `read_raw` | Read bytes with timeout |
| `is_open` | Check if port is in managed set |
| `get_port_info` | Get details for a specific port |
| `close_all_ports` | Cleanup on app exit |

### Protocol — RusEfiProtocol.ts (339 lines)

- CRC32 framing (ISO 3309 polynomial)
- Frame types: HELLO, HELLO_OK, SENSOR, CALIBRATION_PAGE, DTC
- Sequence numbering
- Timeout handling
- Reassembly of fragmented frames

---

## Build Evidence

### TypeScript — PASS ✅

```
Command:  npx tsc --noEmit
Exit:     0
Errors:   0
```

### Vite Build — PASS ✅

```
Build artifact:  studio/dist/index.html
Modified:        2026-07-03 08:01:45
Size:            463 bytes
JS bundle:       studio/dist/assets/index-BZhJUVvE.js
CSS:             studio/dist/assets/index-CjGBXqYE.css
```

### Rust Formatting — PASS ✅ (fixed 2026-07-03)

```
Command:  rustfmt --check src/serial.rs src/lib.rs src/main.rs
Exit:     0
```

Fixed two minor formatting issues (line-wrapping for flush() and format!() calls).

### Native Tauri Binary — BLOCKED ❌

```
Error:  Package gdk-3.0 was not found in the pkg-config search path.
        Package javascriptcoregtk-4.1 was not found.

Missing dev packages:
  libgtk-3-dev
  libwebkit2gtk-4.1-dev
  libsoup-3.0-dev
  libjavascriptcoregtk-4.1-dev
  libayatana-appindicator3-dev
  librsvg2-dev

Installed (runtime only):
  libwebkit2gtk-4.1-0       2.52.3
  libjavascriptcoregtk-4.1-0 2.52.3
  libjavascriptcoregtk-6.0-1 2.52.3

Environment:
  OS: Ubuntu 24.04
  sudo: NOT available (password required)
  flatpak: available (but cannot provide build headers)
```

---

## Hardware Verification — BLOCKED ❌

```
$ lsusb
Bus 003 Device 002: Primax Electronics HP 320M USB Optical Mouse
Bus 003 Device 003: Microdia Integrated_Webcam_FHD
Bus 003 Device 004: Broadcom Corp. 58200  (Bluetooth)

$ ls /dev/ttyUSB* /dev/ttyACM* /dev/serial/by-id/*
No such file or directory

Status: No Discovery board connected.
        No USB serial devices detected.
```

---

## Tracer Bullet Status

| TB | Name | Status | Evidence Tier | Blocker |
|----|------|--------|---------------|---------|
| TB-001 | Firmware builds | ✅ C3 (historic) | Tier 1 (historic build log) | — |
| TB-002 | Studio launches | ✅ C3 (historic) | Tier 1 (historic screenshot) | — |
| TB-002A | Application core | ✅ C2 | Tier 4 (source) | — |
| TB-003 | Comm architecture | ✅ C0 | Tier 4 (source) | — |
| TB-004 | Protocol adapter | ⚠ C1 | Tier 4 only | Needs Tier 1 (hardware) |
| TB-005A | USB transport (impl) | ⚠ C1 | Tier 4 only | Needs Tier 1 (hardware) |
| TB-005B | USB transport (verify) | ❌ C0 | None | Blocked: GTK + hardware |
| TB-CI-001 | Windows CI | ⚠ C0 | Tier 4 (YAML exists) | Needs GitHub runner |
| TB-006 | ECU Discovery | ❌ C0 | None | Depends on TB-005B |
| TB-007 | Handshake | ❌ C0 | None | Depends on TB-005B |

---

## What TB-005B Verification Would Look Like

With a native binary and Discovery board:

```
React: invoke("list_ports")
    ↓
Rust: serialport::available_ports()
    ↓
Returns: [{path: "/dev/ttyACM0", vid: 0x0483, pid: 0x5740, serial: "STLink..."}]
    ↓
React: invoke("open_port", "/dev/ttyACM0", 115200)
    ↓
Rust: serialport::new(path, 115200).open()
    ↓
React: invoke("is_open", "/dev/ttyACM0") → true
    ↓
React: transport.sendFrame(path, HELLO frame)
    ↓
Rust: serial write "S" → port.write_all()
    ↓
ECU: rusEFI responds with signature
    ↓
Rust: serial read → port.read()
    ↓
React: receives "rusEFI F407 2026.05.01"
    ↓
RusEfiProtocol: parses, CRC verifies
    ↓
UI displays: Board = rusEFI F407, Firmware = 2026.05.01
```

---

## Path to Resolution

### Blocker 1: GTK Development Headers

**Option A (Linux machine with sudo):**
```bash
sudo apt install libgtk-3-dev libwebkit2gtk-4.1-dev libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev
cd studio && npm run tauri build
```

**Option B (Windows CI — already created):**
- Workflow: `.github/workflows/windows-build.yml`
- Trigger: merge to master, or manual dispatch
- Produces: `7100CPT-Studio-0.1.0-Setup.exe`

### Blocker 2: Discovery Board Hardware

Required:
- STM32F407 Discovery board or S32K344 eval board
- USB cable
- rusEFI firmware pre-flashed

Connect board → run native binary → execute tracer bullets sequentially.

### Recommended Path

1. Merge `feature/tb-004-rusefi-protocol-adapter` to master
2. Windows CI builds and uploads `.exe`
3. Transfer `.exe` to a Windows machine with a Discovery board
4. Execute TB-005B through TB-007 verification
5. Update CAPABILITY_MATRIX.md with runtime evidence

---

## Ralph Loop Exit Criteria

To exit the Ralph Loop:

```
Implementation ✅ (done)
    ↓
QA ← WE ARE HERE
    ↓
Evidence ❌ (missing)
    ↓
PASS ❌ (cannot certify)
```

Required before PASS:
- [ ] Native binary builds (Linux or Windows)
- [ ] USB enumeration observed
- [ ] Port open observed
- [ ] S handshake observed (rusEFI signature received)
- [ ] CRC verified
- [ ] At least one sensor read
- [ ] Evidence package updated with screenshots/logs

---

## Final Verdict

| Category | Result |
|----------|--------|
| Architecture | ✅ PASS |
| Code Structure | ✅ PASS |
| Build (TypeScript) | ✅ PASS |
| Build (Vite) | ✅ PASS |
| Build (Rust fmt) | ✅ PASS (fixed) |
| Build (Native) | ❌ BLOCKED — missing GTK headers |
| Runtime Vertical Slice | ❌ Not proven |
| Tracer Bullets | ❌ Not proven |
| Hardware Validation | ❌ Not performed |
| **Ralph Loop** | **❌ Cannot exit** |

**QA Verdict: FAIL (Verification Incomplete)**

The implementation is a Release Candidate. Code quality is not the issue.
The only remaining work is runtime proof — hardware communication with a Discovery board.
No code changes are needed. The CI pipeline already exists to produce the native binary.
