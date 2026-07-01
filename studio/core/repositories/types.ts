// Repository trait interfaces — ADR-0011
// UI depends on these traits, not on SQLite/PostgreSQL directly.

// ---- Domain Types ----
export interface CalibrationId { readonly __brand: "CalibrationId"; value: string; }
export interface VehicleId { readonly __brand: "VehicleId"; value: string; }
export interface SessionId { readonly __brand: "SessionId"; value: string; }
export interface FirmwareId { readonly __brand: "FirmwareId"; value: string; }

export interface Calibration {
  id: CalibrationId;
  vehicleId: VehicleId;
  name: string;
  description: string;
  version: number;
  data: Record<string, unknown>;    // JSONB — table data
  engineType?: string;
  fuelType?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CalibrationSummary {
  id: CalibrationId;
  name: string;
  version: number;
  updatedAt: number;
}

export interface Vehicle {
  id: VehicleId;
  workshopId?: string;
  manufacturer: string;
  model: string;
  year?: number;
  vin?: string;
  engineCode?: string;
  ecuSerial: string;
  firmwareVersion?: string;
}

export interface TuningSession {
  id: SessionId;
  vehicleId: VehicleId;
  calibrationId: CalibrationId;
  notes: string;
  startedAt: number;
  endedAt?: number;
}

export interface SessionReport {
  changes: number;
  beforeAfter?: Record<string, { before: number; after: number }>;
  notes: string;
}

export interface TelemetryChannel {
  channel: string;
  unit: string;
}

export interface TelemetryDataPoint {
  channel: string;
  value: number;
  timestamp: number;
}

// ---- Repository Traits ----
export interface CalibrationRepository {
  save(cal: Omit<Calibration, "id" | "createdAt" | "updatedAt">): Promise<Calibration>;
  load(id: CalibrationId): Promise<Calibration>;
  listForVehicle(vehicleId: VehicleId): Promise<CalibrationSummary[]>;
}

export interface VehicleRepository {
  register(vehicle: Omit<Vehicle, "id">): Promise<Vehicle>;
  findByEcu(ecuSerial: string): Promise<Vehicle | null>;
  listAll(): Promise<Vehicle[]>;
}

export interface SessionRepository {
  create(vehicleId: VehicleId, calId: CalibrationId): Promise<TuningSession>;
  close(id: SessionId, report: SessionReport): Promise<void>;
  history(vehicleId: VehicleId): Promise<TuningSession[]>;
}

export interface TelemetryRepository {
  write(sample: TelemetryDataPoint): Promise<void>;
  queryRange(
    vehicleId: VehicleId,
    from: number,
    to: number,
    channels: string[]
  ): Promise<TelemetryDataPoint[]>;
  latest(vehicleId: VehicleId): Promise<Map<string, number>>;
}

export interface FirmwareRepository {
  getLatest(platform: string): Promise<{ version: string; url: string; sha256: string } | null>;
}
