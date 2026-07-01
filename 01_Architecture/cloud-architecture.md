# Cloud Platform Architecture

## Overview

The cloud platform provides telemetry, fleet management, remote diagnostics, and OTA updates for connected ECUs. All branding is loaded from `branding/brand.json`.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Cloud Platform                          │
│                                                          │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────┐   │
│  │   MQTT   │   │   Stream     │   │   Time-Series   │   │
│  │  Broker  │──▶│  Processor   │──▶│   Database      │   │
│  └──────────┘   └──────────────┘   └────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │               REST API Layer                       │   │
│  │  Fleet Mgmt | Telemetry | OTA | User Mgmt         │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │               Web Application                      │   │
│  │  Fleet Dashboard | Analytics | Admin              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Branding Integration

The cloud portal reads branding from `branding/brand.json`:

```javascript
// Portal loads branding at startup
const brandConfig = await fetch('branding/brand.json');
document.title = brandConfig.cloud.portal_name;
setLogo(brandConfig.cloud.portal_logo);
setPrimaryColor(brandConfig.cloud.portal_primary_color);
```

## Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|----------|
| **IoT Broker** | AWS IoT Core / EMQX | Managed MQTT with X.509 auth |
| **Streaming** | Apache Kafka / Kinesis | High-throughput telemetry |
| **Database** | TimescaleDB | PostgreSQL + time-series |
| **Cache** | Redis | Session cache, real-time data |
| **API** | Node.js/Express + TypeScript | Rapid development |
| **Frontend** | React + TypeScript | Modern dashboard |
| **Auth** | OAuth 2.0 + JWT | User authentication |
| **Device Auth** | mTLS (X.509 certificates) | Device identity |

## API Endpoints

### Fleet Management

- `GET /api/vehicles` — List vehicles
- `GET /api/vehicles/:id` — Vehicle details
- `POST /api/vehicles` — Register vehicle
- `PUT /api/vehicles/:id` — Update vehicle

### Telemetry

- `GET /api/vehicles/:id/telemetry` — Latest telemetry
- `GET /api/vehicles/:id/telemetry/history?from=&to=` — Historical data
- `GET /api/vehicles/:id/telemetry/:parameter` — Specific parameter

### Diagnostics

- `GET /api/vehicles/:id/dtcs` — Current DTCs
- `POST /api/vehicles/:id/diagnostics` — Request remote diagnostic
- `GET /api/vehicles/:id/logs` — Remote log data

### OTA

- `POST /api/firmware` — Upload firmware image
- `GET /api/firmware` — List firmware versions
- `POST /api/updates` — Create update campaign
- `PUT /api/updates/:id/rollout` — Manage staged rollout
- `GET /api/vehicles/:id/updates` — Update status

### User & Auth

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `PUT /api/users/:id` — Update profile

## OTA Update Flow

1. Admin uploads signed firmware image
2. OTA campaign created with target vehicles
3. ECU checks for updates via MQTT topic
4. ECU downloads delta update
5. ECU verifies signature (ECDSA)
6. ECU writes to inactive A/B partition
7. ECU boots to new partition
8. ECU reports success or rolls back

## Security

- **mTLS:** All device-to-cloud connections
- **OAuth 2.0:** User authentication
- **Firmware Signing:** ECDSA P-256 signatures
- **Firmware Encryption:** AES-256 encrypt at rest
- **Data Privacy:** GDPR-compliant data handling

## References

- AWS IoT for Automotive
- TimescaleDB Documentation
- MQTT v5.0 Specification
- OAuth 2.0 Framework
