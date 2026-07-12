// Core service interfaces — application foundation
// See ADR-0010 (Transport), ADR-0011 (Repositories), ADR-0009 (Platform Strategy)

// ---- Logging ----
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  data?: unknown;
}

export interface Logger {
  log(entry: Omit<LogEntry, "timestamp">): void;
  trace(module: string, message: string, data?: unknown): void;
  debug(module: string, message: string, data?: unknown): void;
  info(module: string, message: string, data?: unknown): void;
  warn(module: string, message: string, data?: unknown): void;
  error(module: string, message: string, data?: unknown): void;
  getRecent(limit?: number): LogEntry[];
}

// ---- Configuration ----
export interface AppConfig {
  studio: {
    theme: "dark" | "light";
    language: string;
    dataDir: string;
  };
  ecu: {
    defaultTransport: "usb" | "can" | "ble";
    autoConnect: boolean;
    heartbeatIntervalMs: number;
  };
  logging: {
    level: LogLevel;
    maxEntries: number;
    persistToDisk: boolean;
  };
}

export interface ConfigManager {
  load(): Promise<AppConfig>;
  save(config: Partial<AppConfig>): Promise<void>;
  get<K extends keyof AppConfig>(key: K): AppConfig[K];
  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): Promise<void>;
  reset(): Promise<void>;
}

// ---- Workspace ----
export interface VehicleSummary {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  ecuSerial: string;
  lastConnected: number;
}

export interface Project {
  id: string;
  name: string;
  vehicleId: string;
  created: number;
  modified: number;
  calibrations: string[];
}

export interface Workspace {
  getRecentVehicles(): Promise<VehicleSummary[]>;
  getProjects(vehicleId: string): Promise<Project[]>;
  createProject(vehicleId: string, name: string): Promise<Project>;
  openProject(id: string): Promise<Project>;
  getCurrentProject(): Project | null;
}

// ---- Notifications ----
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  dismissed: boolean;
}

export interface NotificationService {
  notify(type: NotificationType, title: string, message: string): void;
  dismiss(id: string): void;
  getAll(): Notification[];
  getActive(): Notification[];
  onNotification(handler: (n: Notification) => void): () => void;
}

// ---- Telemetry (stub) ----
export interface TelemetrySample {
  channel: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface TelemetryService {
  onSample(handler: (sample: TelemetrySample) => void): () => void;
  getLatest(): Map<string, TelemetrySample>;
  isStreaming(): boolean;
}

// ---- Update Manager (stub) ----
export interface FirmwareVersion {
  version: string;
  platform: string;
  releaseDate: string;
  changelog: string;
}

export interface UpdateManager {
  checkForUpdates(): Promise<FirmwareVersion | null>;
  downloadUpdate(version: FirmwareVersion): Promise<Uint8Array>;
  getCurrentVersion(): string;
  onUpdateAvailable(handler: (v: FirmwareVersion) => void): () => void;
}

// ---- License Manager (stub) ----
export type LicenseTier = "community" | "professional" | "workshop" | "enterprise";

export interface LicenseInfo {
  tier: LicenseTier;
  validUntil: number;
  features: string[];
  workshopId?: string;
}

export interface LicenseService {
  getLicense(): Promise<LicenseInfo>;
  hasFeature(feature: string): boolean;
  getTier(): LicenseTier;
  onLicenseChange(handler: (info: LicenseInfo) => void): () => void;
}
