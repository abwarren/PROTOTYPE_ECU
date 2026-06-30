# Cloud Platform — Research

## Overview

The TEN8 cloud platform provides telemetry collection, fleet management, remote diagnostics, and OTA updates.

## Architecture

ECU (MQTT) → IoT Broker → Stream Processing → Database → API → Dashboard

## Platform Options

| Platform | IoT Service | Strengths |
|----------|-------------|-----------|
| **AWS** | IoT Core, FleetWise | Broadest service set, automotive-specific |
| **Azure** | IoT Hub | Enterprise integration, Dynamics |
| **HiveMQ** | Standalone MQTT | Full MQTT 5.0, no vendor lock-in |
| **EMQX** | Standalone MQTT | High performance, MQTT 5.0 |

## Data Pipeline

| Stage | Technology | Purpose |
|-------|-----------|---------|
| Edge | ECU firmware | Data acquisition, pre-processing |
| Ingestion | MQTT broker | Receive telemetry |
| Stream | Kafka / Kinesis | Real-time processing |
| Storage | TimescaleDB / InfluxDB | Time-series data |
| Analytics | Lambda / Kinesis Analytics | Fleet analysis |
| API | REST / GraphQL | Application access |
| Dashboard | Web app | User interface |

## Key Services

- **Authentication:** OAuth 2.0 + JWT for users, mTLS for devices
- **Fleet Management:** Vehicle registry, grouping, permissions
- **Telemetry:** Real-time and historical data
- **Remote Diagnostics:** On-demand diagnostic requests
- **OTA Updates:** Campaign management, staged rollouts
- **Remote Logging:** Asynchronous log collection

## TEN8 Cloud

- AWS IoT Core (or self-hosted EMQX)
- TimescaleDB for telemetry storage
- React-based fleet dashboard
- OTA with A/B partition updates
- ISO 21434 aligned security

## References

- AWS IoT for Automotive: aws.amazon.com/iot
- Azure Connected Fleet Reference Architecture
- HiveMQ MQTT Platform: hivemq.com
- EMQX MQTT Broker: emqx.io
