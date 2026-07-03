# TB-005 — USB Transport

> **Status:** ⬚ NEXT — C0 Designed (advancing to C1)
> **Prerequisite:** TB-004 (RusEFIProtocolAdapter — architecture frozen)
> **Architecture:** ADR-0010 (Transport Abstraction)
> **Policy:** Architecture frozen. No redesign. Demo Gate mandatory. 7 artifacts required.

---

## Objective

Implement a working USB transport layer that detects, connects to, and
communicates with a rusEFI ECU over USB CDC. Produce a verifiable
demonstration.

---

## Scope

### Implementation

- [ ] `studio/core/transport/UsbTransport.ts` — implements EcuTransport
- [ ] USB device enumeration (WebUSB or Tauri serial plugin)
- [ ] Connect to ECU by device path
- [ ] Heartbeat / keepalive
- [ ] Disconnect with cleanup
- [ ] Error handling: device unplugged, timeout, retry
- [ ] Connection state machine integration

### Transport Contract (from EcuTransport)

| Method | Implementation |
|--------|----------------|
| `discover()` | Enumerate USB CDC devices, return EcuDevice[] |
| `connect(device)` | Open USB port, return Connection with state tracking |
| `disconnect(conn)` | Close port, release resources |
| `sendFrame(conn, frame)` | Send raw bytes over USB, await response |
| `heartbeat(conn)` | Ping device, return true if alive |
| `onStateChange(handler)` | Register state callback, return unsubscribe fn |

### State Machine

```
DISCONNECTED → DISCOVERING → CONNECTING → CONNECTED
                     ↑             ↓           ↓
                     └── ERROR ←── ERROR ←── ERROR
```

---

## Demo Gate (MANDATORY)

This TB is NOT complete until:

- [ ] USB device detected in discover()
- [ ] Connect succeeds (open port, configure baud/parity)
- [ ] Send heartbeat → ECU responds
- [ ] Disconnect succeeds (port released)
- [ ] Reconnect after disconnect (state machine reset)

### Evidence Required

| Evidence | Format |
|----------|--------|
| Console log | Terminal output showing discover/connect/heartbeat/disconnect |
| Screenshot | Studio UI showing connected ECU |
| QA sign-off | One-line approval from QA agent |

---

## QA Checklist

| Gate | Criteria |
|------|----------|
| EcuTransport implemented | All 6 interface methods working |
| Device enumeration | Returns real device list (not mock) |
| Send/receive | Round-trip bytes verified |
| Heartbeat | Responds within timeout |
| Disconnect | Clean teardown, no resource leak |
| Reconnect | Works after disconnect without restart |
| Error handling | Device unplugged → ERROR state, not crash |
| TypeScript compiles | No errors |
| Git committed | All .ts files committed |

---

## Completion Criteria (7 Artifacts — PROJECT_RULES §11.4)

- [ ] Artifact 1: Working capability — `UsbTransport.ts` compiled, committed, functional
- [ ] Artifact 2: Automated test — unit test proving discover/connect/heartbeat/disconnect
- [ ] Artifact 3: Documentation — TB-005 README updated with results, architecture docs if changed
- [ ] Artifact 4: Capability Matrix — CAPABILITY_MATRIX.md #6 USB transport advanced to C2
- [ ] Artifact 5: QA evidence — console log, screenshot, QA sign-off
- [ ] Artifact 6: Session handoff — SESSION_HANDOFF.md generated
- [ ] Artifact 7: GitHub commit — committed, pushed, verified on remote
