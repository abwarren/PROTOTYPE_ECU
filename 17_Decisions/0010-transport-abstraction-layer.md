# ADR-0010: Transport Abstraction Layer

## Status

Accepted

## Context

TB-003 was originally defined as "Studio connects to ECU via USB CDC." However, the platform will support multiple communication transports over its lifetime:

- USB CDC (prototype, desktop tuning)
- CAN / CAN-FD (vehicle integration)
- BLE (mobile diagnostics)
- WiFi (workshop network)
- Ethernet (dyno cell)
- Cloud relay (remote diagnostics)

If Studio communicates directly with USB, adding a new transport requires rewriting the communication logic for every UI component that touches ECU data.

The QA review identified this as a regression risk: coupling the UI to a specific transport creates expensive rework when transports are added.

## Decision

Introduce a **Transport Abstraction Layer** between Studio and firmware.

```
Prototype Studio (UI)
        │
        ▼
  Communication Service (business logic)
        │
        ▼
  Transport Interface (trait)
        │
 ┌──────┼──────────┬──────────┐
 │      │          │          │
USB    CAN      Ethernet    BLE
 │      │          │          │
 └──────┴──────────┴──────────┘
        │
        ▼
     Firmware
```

### Transport Interface

```rust
/// Transport abstraction — all ECU communication goes through this trait
pub trait EcuTransport: Send + Sync {
    /// Discover available ECUs
    async fn discover(&self) -> Result<Vec<EcuDevice>, TransportError>;

    /// Connect to a specific ECU
    async fn connect(&self, device: &EcuDevice) -> Result<Connection, TransportError>;

    /// Disconnect
    async fn disconnect(&self, connection: &Connection) -> Result<(), TransportError>;

    /// Send raw frame, receive response
    async fn send_frame(&self, conn: &Connection, frame: &[u8]) -> Result<Vec<u8>, TransportError>;

    /// Check connection health
    async fn heartbeat(&self, conn: &Connection) -> Result<bool, TransportError>;
}
```

### V1 Implementation

Only USB CDC is implemented. CAN, Ethernet, BLE are stubs that return "not implemented." The abstraction is real — adding a new transport means implementing the trait, not rewriting the UI.

### Benefits

- UI never knows which transport is active
- Adding CAN/Ethernet/BLE is a new trait implementation, not a rewrite
- Transport can be swapped at runtime (USB at the bench, WiFi in the workshop)
- Testable: mock transport for unit tests without hardware
- Cloud relay: remote ECU appears as just another transport

### Relationship to ADR-0009

ADR-0009 defines the Prototype Firmware Interface as the protocol layer. This ADR defines the transport layer beneath it. Together they form:

```
Studio UI
  ↓
Communication Service (business logic)
  ↓
Prototype Firmware Interface (protocol frames — ADR-0009)
  ↓
Transport Abstraction (this ADR — ADR-0010)
  ↓
USB | CAN | BLE | Ethernet | Cloud Relay
```

## Consequences

### Positive
- Zero UI changes needed to add new transports
- Mock transport enables testing without hardware
- Clean separation of protocol (what) from transport (how)
- Future-proof: cloud relay, CAN-FD, BLE all plug into same interface

### Negative
- One extra abstraction layer (thin — the trait is 6 methods)
- Slightly more code for the initial USB-only implementation

### Mitigations
- The trait is deliberately minimal (discover, connect, send, heartbeat, disconnect)
- USB implementation is the reference — other transports follow the same pattern
- The abstraction pays for itself on the second transport

## Priority

P0 — blocks TB-003 implementation. Must be in place before any Studio-firmware communication.
