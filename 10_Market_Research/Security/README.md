# Security — Research

## Overview

Automotive cybersecurity is governed by ISO/SAE 21434 and UN Regulation No. 155. Security must be designed in from the start.

## Key Standards

| Standard | Focus |
|----------|-------|
| ISO/SAE 21434 | Cybersecurity engineering lifecycle |
| UN R155 | Type approval for cybersecurity |
| ISO 26262 | Functional safety (security co-requirement) |
| EVITA | E-safety vehicle intrusion protection |
| SHE | Secure Hardware Extension |

## Security Architecture

### Hardware Security Module (HSM)

| Function | Description |
|----------|-------------|
| Key storage | Immutable root keys |
| Crypto acceleration | AES, ECC, RSA, ECDSA |
| Secure boot | Chain of trust verification |
| Secure storage | Protected NVRAM for secrets |
| True RNG | TRNG for cryptographic operations |

### Secure Communication

| Channel | Security |
|---------|----------|
| CAN bus | SecOC (Secure On-Board Communication) |
| Cloud (TLS) | mTLS with X.509 certificates |
| Tuning (USB/BLE) | Session authentication |
| OTA updates | Signed and encrypted firmware |

## Threat Model (Key Vectors)

1. **Unauthorized tuning** — Remapping, emissions defeat
2. **Firmware theft** — Reverse engineering
3. **Remote exploitation** — Cloud-to-vehicle attacks
4. **Physical access** — Debug port, flash readout

## TEN8 Security

- HSM-based secure boot
- Signed firmware updates with anti-rollback
- Encrypted communication (TLS/mTLS)
- Secured debug and programming access
- UN R155 / ISO 21434 compliance targeted

## References

- ISO/SAE 21434: Cybersecurity Engineering
- UN Regulation No. 155: Cybersecurity
- NXP: S32K3 HSM User Guide
- Vector: HSM and SecOC Implementation
