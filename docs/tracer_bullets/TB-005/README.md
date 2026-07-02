# TB-005 — USB Transport

> **Status:** ⬚ NEXT — Capability delivery
> **Prerequisite:** TB-004 (RusEFIProtocolAdapter)
> **Architecture:** ADR-0010 (Transport Abstraction)
> **Policy:** Architecture frozen — no redesign without ADR

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

## Completion Criteria

- [ ] Demo Gate passes
- [ ] QA approves
- [ ] CAPABILITY_MATRIX.md updated (#6 USB detection → ✅)
- [ ] SESSION_HANDOFF.md generated
- [ ] Git committed
- [ ] GitHub pushed
