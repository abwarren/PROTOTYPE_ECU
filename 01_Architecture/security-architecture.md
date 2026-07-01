# Security Architecture

## Overview

Defense-in-depth security architecture aligned with ISO/SAE 21434. All security features are brand-neutral and platform-internal.

## Security Domains

```
┌────────────────────────────────────────────────────────────┐
│                    Platform Security                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │  Device Sec  │  │  Comm Sec   │  │   Cloud Security   │  │
│  │             │  │             │  │                    │  │
│  │ • Secure    │  │ • mTLS      │  │ • OAuth 2.0       │  │
│  │   boot      │  │ • CAN SecOC │  │ • RBAC             │  │
│  │ • HSM keys  │  │ • TLS 1.3   │  │ • Audit logging    │  │
│  │ • Debug     │  │ • Encrypted │  │ • GDPR compliance  │  │
│  │   lockdown  │  │   firmware  │  │ • Pen testing      │  │
│  └─────────────┘  └─────────────┘  └────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Device Security

| Feature | Implementation |
|---------|---------------|
| HSM | NXP S32K3 HSM (EVITA Full) |
| Secure Boot | ECDSA chain of trust |
| Debug Port | Locked in production, fuses blown |
| Flash Readout | Protected via HSM access control |
| JTAG/SWD | Disabled after provisioning |
| Unique Identity | X.509 certificate per ECU |

## Communication Security

### CAN FD

- UDS SecurityAccess (seed/key) for all write operations
- Optional SecOC for critical CAN messages
- Unique session keys per power cycle

### USB

- Challenge-response authentication
- Time-limited tuning session tokens
- Sensitive operations require re-authentication

### BLE

- Secure pairing with 6-digit passkey
- Encrypted link (AES-CCM)
- Device whitelisting for known phones

### WiFi

- WPA3 for infrastructure mode
- TLS 1.3 for all HTTP connections
- Certificate-based device authentication

### Cloud

- mTLS with X.509 device certificates
- OAuth 2.0 with JWT for user sessions
- TLS 1.3 for all API traffic
- Rate limiting and DDoS protection

## Firmware Security

| Stage | Protection |
|-------|-----------|
| Development | Signed debug builds |
| Build | Reproducible builds with provenance |
| Distribution | Encrypted (AES-256), signed (ECDSA) |
| Storage | Encrypted at rest in cloud |
| Update | mTLS download, signature verified on-device |
| Deployment | Anti-rollback enforcement |

## Key Management

- **Root CA:** Offline HSM, multisig access
- **Device Certificates:** Issued during manufacturing
- **Code Signing:** ECDSA P-256 key pair, secured in HSM
- **Session Keys:** Ephemeral, per-connection

## Compliance

| Standard | Scope |
|----------|-------|
| ISO/SAE 21434 | Cybersecurity engineering |
| UN R155 | Type approval (if OEM supply) |
| GDPR | User data privacy |

## References

- ISO/SAE 21434: Road Vehicles — Cybersecurity Engineering
- UN Regulation No. 155
- NIST SP 800-175B: Guideline for Cryptographic Key Management
