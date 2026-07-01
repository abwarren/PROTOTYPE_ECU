# DATABASE_RECOMMENDATIONS.md — Complete Database Schema Design

> **Type:** EDR Companion — Database Domain
> **Governance:** Per ADR-0007 — proposals only

---

## 1. Current State

The database is referenced in 6 tracer bullets, 4 architecture documents, and the cloud API specification. Zero schema design exists. The requirements are scattered across documents.

## 2. Requirements Gathering

From the existing documentation, the database must support:

| Domain | Source | Entities |
|--------|--------|----------|
| Vehicles | TB-005, CLOUD API | Vehicle, Engine, Manufacturer |
| Calibrations | TB-002, TB-005 | Calibration, Table, Version |
| Customers | TB-006 | Customer, Workshop |
| Telemetry | TB-001, TB-003 | Time-series sensor data |
| Firmware | TB-004 | Firmware image, Update campaign |
| Users | CLOUD API | User, Role, Session |
| Diagnostics | CLOUD API | DTC, Freeze frame |
| Workshops | TB-006 | Workshop, Technician |

## 3. Recommended Schema

### 3.1 Technology Choices

| Environment | Database | Rationale |
|-------------|----------|-----------|
| **Cloud** | PostgreSQL 16 + TimescaleDB extension | Relational core + time-series telemetry |
| **Edge (ECU)** | Flash-based key-value | Wear-leveled, CRC-protected config storage |
| **Desktop (Studio)** | SQLite | Local caching, offline mode |
| **Mobile** | SQLite via Hive/Isar | Offline diagnostics |

### 3.2 Core Schema (PostgreSQL)

```sql
-- ============================================================
-- MULTI-TENANCY
-- ============================================================
CREATE TABLE workshops (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,        -- URL-safe identifier
    contact_email   TEXT,
    contact_phone   TEXT,
    address_line1   TEXT,
    city            TEXT,
    country         TEXT,
    timezone        TEXT DEFAULT 'UTC',
    subscription_tier TEXT DEFAULT 'free',      -- free, pro, enterprise
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workshops_slug ON workshops(slug);

-- ============================================================
-- USERS & RBAC
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id     UUID REFERENCES workshops(id),
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    display_name    TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'tuner', -- admin, owner, tuner, viewer
    is_active       BOOLEAN DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_workshop ON users(workshop_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- MANUFACTURERS
-- ============================================================
CREATE TABLE manufacturers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,
    country         TEXT,
    website         TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- VEHICLES
-- ============================================================
CREATE TABLE vehicles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id     UUID NOT NULL REFERENCES workshops(id),
    manufacturer_id UUID REFERENCES manufacturers(id),
    model           TEXT NOT NULL,
    year            INTEGER,
    vin             TEXT UNIQUE,
    engine_code     TEXT,
    license_plate   TEXT,
    ecu_serial      TEXT UNIQUE,               -- Unique per physical ECU
    firmware_version TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vehicles_workshop ON vehicles(workshop_id);
CREATE INDEX idx_vehicles_ecu ON vehicles(ecu_serial);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);

-- ============================================================
-- CALIBRATIONS
-- ============================================================
CREATE TABLE calibrations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id),
    workshop_id     UUID NOT NULL REFERENCES workshops(id),
    created_by      UUID NOT NULL REFERENCES users(id),
    name            TEXT NOT NULL,              -- Human-readable name (e.g., "Street Tune v3")
    description     TEXT,
    version         INTEGER NOT NULL DEFAULT 1,
    -- Calibration data stored as structured JSONB (tables, maps, scalars)
    data            JSONB NOT NULL,
    -- Metadata for search/filtering
    engine_type     TEXT,                       -- NA, Turbo, Supercharged
    fuel_type       TEXT,                       -- Petrol, E85, Diesel
    target_power_kw REAL,
    is_active       BOOLEAN DEFAULT false,      -- Currently flashed to ECU
    is_archived     BOOLEAN DEFAULT false,
    -- Audit
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_calibrations_vehicle ON calibrations(vehicle_id);
CREATE INDEX idx_calibrations_workshop ON calibrations(workshop_id);
CREATE INDEX idx_calibrations_version ON calibrations(vehicle_id, version DESC);
-- GIN index for JSONB queries
CREATE INDEX idx_calibrations_data ON calibrations USING GIN (data);

-- ============================================================
-- CALIBRATION TABLES (individual 2D/3D maps)
-- ============================================================
CREATE TABLE calibration_tables (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calibration_id  UUID NOT NULL REFERENCES calibrations(id) ON DELETE CASCADE,
    table_type      TEXT NOT NULL,              -- fuel_ve, ignition, afr_target, etc.
    table_name      TEXT NOT NULL,              -- Human-readable label
    axis_x_label    TEXT,                       -- "RPM"
    axis_y_label    TEXT,                       -- "Load (kPa)"
    axis_x_values   REAL[] NOT NULL,            -- Array of X breakpoints
    axis_y_values   REAL[] NOT NULL,            -- Array of Y breakpoints
    data            REAL[][] NOT NULL,          -- 2D array of Z values
    -- Audit
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cal_tables_cal ON calibration_tables(calibration_id);
CREATE INDEX idx_cal_tables_type ON calibration_tables(calibration_id, table_type);

-- ============================================================
-- FIRMWARE IMAGES
-- ============================================================
CREATE TABLE firmware_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version         TEXT NOT NULL UNIQUE,       -- Semantic version string
    platform        TEXT NOT NULL,              -- MCU target (stm32f407, stm32h743, etc.)
    file_path       TEXT NOT NULL,              -- S3/GCS path to binary
    file_size_bytes BIGINT,
    sha256          TEXT NOT NULL,              -- Integrity hash
    signature       TEXT,                       -- ECDSA signature
    release_notes   TEXT,
    is_prerelease   BOOLEAN DEFAULT false,
    min_hardware_rev TEXT,                      -- Minimum hardware revision
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_firmware_version ON firmware_images(version);
CREATE INDEX idx_firmware_platform ON firmware_images(platform);

-- ============================================================
-- OTA UPDATE CAMPAIGNS
-- ============================================================
CREATE TABLE update_campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firmware_id     UUID NOT NULL REFERENCES firmware_images(id),
    name            TEXT NOT NULL,
    status          TEXT DEFAULT 'draft',       -- draft, staged, rolling_out, complete, cancelled
    rollout_percent INTEGER DEFAULT 10,         -- Percentage of fleet to update
    target_vehicles JSONB,                      -- Filter criteria (platform, region, etc.)
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- VEHICLE UPDATE STATUS
-- ============================================================
CREATE TABLE vehicle_updates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id),
    campaign_id     UUID NOT NULL REFERENCES update_campaigns(id),
    status          TEXT DEFAULT 'pending',     -- pending, downloading, verifying, installing, success, failed, rolled_back
    error_message   TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vehicle_updates_status ON vehicle_updates(vehicle_id, status);

-- ============================================================
-- DIAGNOSTIC TROUBLE CODES
-- ============================================================
CREATE TABLE dtcs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id),
    code            TEXT NOT NULL,              -- e.g., "P0301"
    description     TEXT,
    status          TEXT,                       -- active, pending, historic
    severity        TEXT DEFAULT 'warning',     -- warning, critical, safety
    freeze_frame    JSONB,                      -- Snapshot of sensor values at DTC trigger
    occurred_at     TIMESTAMPTZ NOT NULL,
    cleared_at      TIMESTAMPTZ,
    cleared_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dtcs_vehicle ON dtcs(vehicle_id);
CREATE INDEX idx_dtcs_active ON dtcs(vehicle_id) WHERE cleared_at IS NULL;

-- ============================================================
-- CUSTOMERS (Workshop CRM)
-- ============================================================
CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id     UUID NOT NULL REFERENCES workshops(id),
    name            TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customers_workshop ON customers(workshop_id);

-- Many-to-many: customers own vehicles
CREATE TABLE customer_vehicles (
    customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    PRIMARY KEY (customer_id, vehicle_id)
);
```

### 3.3 Time-Series Telemetry (TimescaleDB Hypertable)

```sql
CREATE TABLE telemetry (
    time            TIMESTAMPTZ NOT NULL,
    vehicle_id      UUID NOT NULL,
    channel         TEXT NOT NULL,              -- rpm, map, tps, afr, coolant_temp, etc.
    value           DOUBLE PRECISION NOT NULL,
    unit            TEXT                        -- rpm, kPa, %, AFR, °C, etc.
);

-- Convert to hypertable (TimescaleDB)
SELECT create_hypertable('telemetry', 'time');

-- Compress after 7 days
SELECT add_compression_policy('telemetry', INTERVAL '7 days');

-- Retention: keep raw data 90 days, keep aggregates forever
SELECT add_retention_policy('telemetry', INTERVAL '90 days');
```

### 3.4 Telemetry Aggregates (Materialized Views for Dashboards)

```sql
-- 1-minute aggregates for dashboard display
CREATE MATERIALIZED VIEW telemetry_1m AS
SELECT
    time_bucket('1 minute', time) AS bucket,
    vehicle_id,
    channel,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value,
    COUNT(*) AS sample_count
FROM telemetry
GROUP BY bucket, vehicle_id, channel;

-- Refresh every 5 minutes
-- (Production: use continuous aggregates in TimescaleDB 2.x)
```

---

## 4. Data Access Patterns

| Query | Frequency | Optimization |
|-------|-----------|--------------|
| Latest telemetry for dashboard | 10Hz per vehicle | TimescaleDB hypertable + 1m aggregate |
| Historical telemetry (date range) | Occasional | Hypertable chunk pruning |
| Calibration read/write | Per tuning session | JSONB GIN index |
| Vehicle lookup by ECU serial | Per connection | UNIQUE index on ecu_serial |
| DTC list for vehicle | Per diagnostic session | Partial index (active only) |
| Workshop fleet overview | Per dashboard load | Index on workshop_id |

---

## 5. Offline / Edge Strategy

**Problem:** Tuners work at racetracks and dyno facilities — no internet.

**Solution:** Studio uses local SQLite as primary storage, syncs to cloud when connected.

```
Studio (SQLite) ──sync──▶ Cloud (PostgreSQL)
     │                        │
     │ (USB/CAN)              │ (MQTT/HTTP)
     ▼                        ▼
    ECU (Flash)         Mobile (SQLite)
```

**Sync conflict resolution:** Last-write-wins for calibrations (versioned, never destructive), merge for telemetry (append-only).

---

## 6. Migration Path

| Phase | Database | Data |
|-------|----------|------|
| **TB-001 (prototype)** | SQLite in Studio only | RPM stream, no cloud |
| **TB-002** | SQLite in Studio | Calibration tables local |
| **TB-003** | PostgreSQL + TimescaleDB on VPS | Telemetry, vehicles, users |
| **Phase 4 (production)** | Managed PostgreSQL (AWS RDS / Supabase) | Multi-tenant, production scale |

---

*Per ADR-0007, this is a proposal. The database schema should be formalized as a specification document in `06_Cloud/database-schema.md` before implementation.*
