# ADR-0011: Repository Trait Interfaces — Database Abstraction

## Status

Accepted

## Context

The platform will store data across multiple backends over its lifecycle:

- SQLite (local, offline — TB-002 onwards)
- PostgreSQL (cloud, multi-tenant — TB-006 onwards)
- File system (calibration exports)
- Cloud object storage (firmware images, logs)

If the UI accesses these backends directly, switching storage requires rewriting data access code. This is the same coupling problem that ADR-0010 solves for transports — but applied to storage.

The QA review identified this: "Create interfaces now. Don't wait for cloud."

## Decision

Define **Repository trait interfaces** for every data domain. The UI depends on traits, not concrete backends.

### Repository Traits

```rust
/// Calibration storage — versioned tune files
pub trait CalibrationRepository: Send + Sync {
    async fn save(&self, cal: &Calibration) -> Result<CalibrationId, RepoError>;
    async fn load(&self, id: CalibrationId) -> Result<Calibration, RepoError>;
    async fn list_for_vehicle(&self, vehicle_id: VehicleId) -> Result<Vec<CalibrationSummary>, RepoError>;
    async fn list_versions(&self, cal_id: CalibrationId) -> Result<Vec<CalibrationVersion>, RepoError>;
}

/// Vehicle registry
pub trait VehicleRepository: Send + Sync {
    async fn register(&self, vehicle: &Vehicle) -> Result<VehicleId, RepoError>;
    async fn find_by_ecu(&self, ecu_serial: &str) -> Result<Option<Vehicle>, RepoError>;
    async fn list_all(&self) -> Result<Vec<VehicleSummary>, RepoError>;
}

/// Firmware image store
pub trait FirmwareRepository: Send + Sync {
    async fn store_image(&self, image: &FirmwareImage) -> Result<FirmwareId, RepoError>;
    async fn get_latest(&self, platform: &str) -> Result<Option<FirmwareImage>, RepoError>;
    async fn verify_checksum(&self, id: FirmwareId) -> Result<bool, RepoError>;
}

/// Telemetry time-series storage
pub trait TelemetryRepository: Send + Sync {
    async fn write_sample(&self, sample: &TelemetrySample) -> Result<(), RepoError>;
    async fn query_range(&self, vehicle: VehicleId, from: Timestamp, to: Timestamp,
                         channels: &[ChannelId]) -> Result<Vec<TelemetrySample>, RepoError>;
    async fn latest(&self, vehicle: VehicleId) -> Result<HashMap<ChannelId, f64>, RepoError>;
}

/// Session and workshop data
pub trait SessionRepository: Send + Sync {
    async fn create_session(&self, session: &TuningSession) -> Result<SessionId, RepoError>;
    async fn close_session(&self, id: SessionId, report: &SessionReport) -> Result<(), RepoError>;
    async fn session_history(&self, vehicle: VehicleId) -> Result<Vec<SessionSummary>, RepoError>;
}
```

### V1 Implementations

- `SqliteCalibrationRepo` — SQLite backend (local, offline)
- `SqliteVehicleRepo` — SQLite backend (local, offline)
- `SqliteSessionRepo` — SQLite backend (local, offline)
- `NullTelemetryRepo` — no-op (telemetry requires cloud)

### V2+ Implementations (when cloud is built)

- `PostgresCalibrationRepo` — same trait, different backend
- `PostgresVehicleRepo` — same trait, different backend
- `TimescaleTelemetryRepo` — same trait, time-series optimized
- `S3FirmwareRepo` — same trait, object storage

### Benefits

- UI code depends on `CalibrationRepository`, not on SQLite or PostgreSQL
- Offline/online: swap backends at startup based on connectivity
- Testable: mock repositories for unit tests without any database
- Cloud migration: zero UI changes when moving from SQLite to PostgreSQL
- The database schema (DATABASE_RECOMMENDATIONS.md) maps directly to these traits

## Consequences

### Positive
- Storage backend is an implementation detail, not an architectural constraint
- Mock repositories enable fast unit tests
- SQLite → PostgreSQL migration requires only a new trait implementation
- Multi-backend: local SQLite for offline, cloud PostgreSQL for sync

### Negative
- Trait definitions add upfront code before any storage is implemented
- Some overhead in defining domain types (Calibration, Vehicle, etc.)

### Mitigations
- Start with minimal traits (save, load, list)
- Domain types are derived from the database schema in DATABASE_RECOMMENDATIONS.md
- Traits expand as features require — don't over-engineer unused methods

## Priority

P1 — before TB-006 (database operations). The traits should exist before any storage code is written.
