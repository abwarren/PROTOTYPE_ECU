# Bootloader — Research

## Overview

The bootloader is the most security-critical component of the ECU. It must support secure firmware updates with fallback recovery.

## Architecture

### Primary Bootloader

- Stored in ROM or protected flash sector
- Hardware initialization (clock, memory, basic IO)
- Integrity check of secondary bootloader
- Cryptographic verification

### Secondary Bootloader

- Handles UDS diagnostic communication
- Manages firmware image transfer
- Performs signature verification
- Updates application flash

### A/B (Dual-Bank) Update

| Bank A | Bank B |
|--------|--------|
| Current firmware | New firmware download |
| Active | Inactive during download |
| Fallback | Swapped to active after verification |

## Key Features

- **Secure boot:** Chain of trust from ROM → bootloader → application
- **Signature verification:** ECDSA P-256 or RSA 2048
- **Encryption:** AES-256 for firmware confidentiality
- **Anti-rollback:** Monotonic counter prevents downgrade attacks
- **Recovery:** Fallback to known-good image on failure

## Protocols

- **UDS on CAN FD:** Reprogramming via diagnostic session
- **DoIP:** Diagnostics over IP for Ethernet-connected ECUs
- **XCP:** For calibration data updates

## TEN8 Bootloader

- Primary + secondary architecture
- A/B partition scheme
- ECDSA signature verification
- AES-256 encrypted firmware images
- UDS on CAN FD for reprogramming
- USB DFU fallback for brick recovery

## References

- ISO 14229-1: UDS
- ISO 15765-2: DoCAN
- NXP: S32K3 Secure Boot Application Note
- Vector: HSM Firmware for ECUs
