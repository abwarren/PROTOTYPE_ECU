-- ============================================================================
-- 7100CPT ECU Platform — SA Vehicle Database Schema
-- Target: PostgreSQL 16
-- Purpose: Store vehicle reference data for tuning profiles, calibration
--          presets, and vehicle identification
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Vehicle Makes (Manufacturers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    country     VARCHAR(60),
    website     VARCHAR(255),
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. Body Styles
-- ============================================================================
CREATE TABLE IF NOT EXISTS body_styles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(60) NOT NULL UNIQUE,   -- e.g. Hatchback, Sedan, Bakkie, SUV
    category    VARCHAR(30)                     -- Passenger, Commercial, Off-road
);

-- ============================================================================
-- 3. Fuel Types
-- ============================================================================
CREATE TABLE IF NOT EXISTS fuel_types (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(30) NOT NULL UNIQUE,   -- Petrol, Diesel, Electric, Hybrid
    short_code  VARCHAR(5)                      -- P, D, E, H
);

-- ============================================================================
-- 4. Transmission Types
-- ============================================================================
CREATE TABLE IF NOT EXISTS transmission_types (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(40) NOT NULL UNIQUE,   -- 5MT, 6MT, 6AT, 8AT, CVT, DCT
    type_class  VARCHAR(20)                     -- Manual, Automatic, CVT, DCT
);

-- ============================================================================
-- 5. Drive Types
-- ============================================================================
CREATE TABLE IF NOT EXISTS drive_types (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(20) NOT NULL UNIQUE,   -- 4x2, 4x4, AWD, RWD, FWD
    description VARCHAR(100)
);

-- ============================================================================
-- 6. Vehicle Models
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_models (
    id              SERIAL PRIMARY KEY,
    make_id         INTEGER NOT NULL REFERENCES vehicle_makes(id),
    name            VARCHAR(120) NOT NULL,       -- e.g. "Hilux", "Polo Vivo", "Ranger"
    body_style_id   INTEGER REFERENCES body_styles(id),
    generation      VARCHAR(60),                 -- e.g. "8th Gen", "B590"
    year_introduced INTEGER,
    year_discontinued INTEGER,
    is_active       BOOLEAN DEFAULT true,
    UNIQUE(make_id, name, generation)
);

-- ============================================================================
-- 7. Engine Configurations
-- ============================================================================
CREATE TABLE IF NOT EXISTS engine_configs (
    id              SERIAL PRIMARY KEY,
    model_id        INTEGER NOT NULL REFERENCES vehicle_models(id),
    engine_code     VARCHAR(30),                 -- e.g. "2TR-FE", "EA211", "GD6"
    displacement_cc INTEGER,                     -- e.g. 2694 for 2.7L
    cylinders       INTEGER,
    fuel_type_id    INTEGER REFERENCES fuel_types(id),
    induction       VARCHAR(20) DEFAULT 'NA',    -- NA, Turbo, Supercharged, Twin-Turbo
    power_kw        INTEGER,                     -- OEM rated power in kW
    torque_nm       INTEGER,                     -- OEM rated torque in Nm
    compression_ratio DECIMAL(4,2),
    is_common_tune  BOOLEAN DEFAULT false,       -- flagged as frequently tuned
    UNIQUE(model_id, engine_code)
);

-- ============================================================================
-- 8. Model Variants (trim levels)
-- ============================================================================
CREATE TABLE IF NOT EXISTS model_variants (
    id                  SERIAL PRIMARY KEY,
    model_id            INTEGER NOT NULL REFERENCES vehicle_models(id),
    engine_config_id    INTEGER REFERENCES engine_configs(id),
    transmission_id     INTEGER REFERENCES transmission_types(id),
    drive_type_id       INTEGER REFERENCES drive_types(id),
    variant_name        VARCHAR(120),             -- e.g. "Raider X 4x4 AT", "Comfortline DSG"
    year_start          INTEGER,
    year_end            INTEGER,
    curb_weight_kg      INTEGER,
    stock_vin_pattern   VARCHAR(30),              -- VIN prefix pattern for identification
    UNIQUE(model_id, variant_name, year_start)
);

-- ============================================================================
-- 9. Tuning Profiles (pre-configured calibration targets)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tuning_profiles (
    id                  SERIAL PRIMARY KEY,
    variant_id          INTEGER NOT NULL REFERENCES model_variants(id),
    profile_name        VARCHAR(120),             -- e.g. "Stage 1 (93 Octane)", "Stage 2"
    target_power_kw     INTEGER,
    target_torque_nm    INTEGER,
    octane_rating       SMALLINT DEFAULT 95,
    has_dpf_delete      BOOLEAN DEFAULT false,
    has_egr_delete      BOOLEAN DEFAULT false,
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. Common Issues / Known Faults per model
-- ============================================================================
CREATE TABLE IF NOT EXISTS known_issues (
    id              SERIAL PRIMARY KEY,
    model_id        INTEGER NOT NULL REFERENCES vehicle_models(id),
    issue_category  VARCHAR(60),                 -- Fuel, Ignition, Emissions, Electrical
    description     TEXT NOT NULL,
    symptom_dtc     VARCHAR(20),                 -- Common DTC code
    fix_notes       TEXT,
    severity        VARCHAR(20),                 -- Low, Medium, High, Critical
    is_common       BOOLEAN DEFAULT false
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX idx_models_make ON vehicle_models(make_id);
CREATE INDEX idx_models_body ON vehicle_models(body_style_id);
CREATE INDEX idx_engine_model ON engine_configs(model_id);
CREATE INDEX idx_variant_model ON model_variants(model_id);
CREATE INDEX idx_tuning_variant ON tuning_profiles(variant_id);
CREATE INDEX idx_issues_model ON known_issues(model_id);

-- ============================================================================
-- Seed Data: Body Styles
-- ============================================================================
INSERT INTO body_styles (name, category) VALUES
    ('Hatchback', 'Passenger'),
    ('Sedan', 'Passenger'),
    ('Bakkie / Pickup', 'Commercial'),
    ('SUV', 'Off-road'),
    ('Crossover', 'Passenger'),
    ('Coupe', 'Passenger'),
    ('Station Wagon', 'Passenger'),
    ('MPV / Minivan', 'Passenger'),
    ('Double Cab', 'Commercial'),
    ('Single Cab', 'Commercial'),
    ('Ext Cab / King Cab', 'Commercial');

-- ============================================================================
-- Seed Data: Fuel Types
-- ============================================================================
INSERT INTO fuel_types (name, short_code) VALUES
    ('Petrol', 'P'),
    ('Diesel', 'D'),
    ('Electric', 'E'),
    ('Hybrid Petrol', 'H'),
    ('Plug-in Hybrid', 'PH');

-- ============================================================================
-- Seed Data: Transmission Types
-- ============================================================================
INSERT INTO transmission_types (name, type_class) VALUES
    ('5-Speed Manual', 'Manual'),
    ('6-Speed Manual', 'Manual'),
    ('5-Speed Automatic', 'Automatic'),
    ('6-Speed Automatic', 'Automatic'),
    ('8-Speed Automatic', 'Automatic'),
    ('10-Speed Automatic', 'Automatic'),
    ('CVT', 'CVT'),
    ('7-Speed DSG', 'DCT'),
    ('6-Speed DSG', 'DCT'),
    ('4-Speed Automatic', 'Automatic'),
    ('9-Speed Automatic', 'Automatic');

-- ============================================================================
-- Seed Data: Drive Types
-- ============================================================================
INSERT INTO drive_types (name, description) VALUES
    ('FWD', 'Front Wheel Drive'),
    ('RWD', 'Rear Wheel Drive'),
    ('4x2', 'Two-wheel drive (bakkie)'),
    ('4x4', 'Four-wheel drive (part-time)'),
    ('AWD', 'All Wheel Drive (full-time)'),
    ('4x4 Low', 'Four-wheel drive with low range');

COMMIT;
