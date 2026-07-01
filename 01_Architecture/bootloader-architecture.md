# Bootloader Architecture

## Overview

Secure, reliable bootloader supporting A/B dual-bank updates with OTA capability.

## Architecture

```
┌──────────────┐
│    ROM        │◀── Immutable, factory-programmed
│  Primary BL   │
└──────┬───────┘
       │
┌──────▼───────┐
│  Protected    │◀── Write-protected after initialization
│  Secondary BL │
└──────┬───────┘
       │
┌──────▼──────────────────────────────────┐
│         Application Flash                │
│  ┌──────────────┐  ┌──────────────┐      │
│  │   Bank A     │  │   Bank B     │      │
│  │  (Active)    │  │  (Inactive)  │      │
│  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────┘
```

## Boot Flow

1. **Power-On** — ROM executes, verifies primary bootloader signature
2. **Primary BL** — Initializes hardware, verifies secondary BL signature
3. **Secondary BL** — Checks application availability and validity
4. **Application** — Boots to active bank (A or B)
5. **Update Request** — If update pending, enter bootloader via watchdog reset

## Security Features

| Feature | Implementation |
|---------|---------------|
| Secure Boot | Chain of trust: ROM → BL → App |
| Signature | ECDSA P-256 on firmware images |
| Encryption | AES-256-GCM for firmware confidentiality |
| Anti-Rollback | Monotonic counter in HSM |
| Authentication | UDS SecurityAccess (0x27) |

## Update Protocol

Using UDS over CAN FD:

| Step | UDS Service | Action |
|------|-------------|--------|
| 1 | 0x10 0x03 | Enter programming session |
| 2 | 0x27 0x01/0x02 | Security access (seed/key) |
| 3 | 0x31 0xFF00 | Erase target bank |
| 4 | 0x34 | Request download (size + CRC) |
| 5 | 0x36 (blocks) | Transfer data |
| 6 | 0x37 | Transfer complete |
| 7 | 0x31 0xFF01 | Verify image signature |
| 8 | 0x11 0x01 | Reset ECU to new image |

## Recovery

- **On failure:** Boot to last known-good bank
- **Brick recovery:** USB DFU mode (via dedicated button or pin)
- **UART debug:** Fallback serial interface for unbricking

## Implementation

- Primary bootloader in protected flash sector
- Secondary bootloader handles all update logic
- Dual-bank 2MB flash (1MB per bank)
- External SPI flash for configuration backup

## References

- ISO 14229 (UDS Services)
- NXP: S32K3 Secure Boot Application Note
- Infineon: AURIX Bootloader Concepts
