# SA Vehicle Database — Schema & Reference Data

> **Database:** `sa_vehicles` on PostgreSQL 16 (localhost:5432)
> **App User:** `ecu_app` / `ecu7100cpt`
> **Created:** 2026-07-05
> **Purpose:** Reference vehicle data for ECU tuning profiles, vehicle identification, and calibration presets specific to the South African market.

---

## Database Structure

```
sa_vehicles
├── vehicle_makes           (28 rows)  — Manufacturers / brands
├── body_styles             (11 rows)  — Hatchback, Bakkie, SUV, etc.
├── fuel_types              (5 rows)   — Petrol, Diesel, Hybrid, EV, PHEV
├── transmission_types      (11 rows)  — 5MT, 6AT, 8AT, CVT, DSG, etc.
├── drive_types             (6 rows)   — FWD, RWD, 4x4, AWD, etc.
├── vehicle_models          (48 rows)  — Model names with generation info
├── engine_configs          (38 rows)  — Engine codes, displacement, power specs
├── model_variants          (0 rows)   — Trim levels / variants (ready for use)
├── tuning_profiles         (0 rows)   — Stage tuning targets (ready for use)
└── known_issues            (7 rows)   — Common SA vehicle faults
```

---

## Connection Details

```json
{
  "host": "localhost",
  "port": 5432,
  "database": "sa_vehicles",
  "user": "ecu_app",
  "password": "ecu7100cpt"
}
```

**Connection string:** `postgresql://ecu_app:ecu7100cpt@localhost:5432/sa_vehicles`

---

## Vehicle Coverage (Top SA Makes)

| Make | Models | Top Seller |
|------|--------|------------|
| Toyota | 14 | Hilux (8th Gen), Corolla Cross, Fortuner |
| Suzuki | 7 | Swift, Jimny, Vitara, Brezza |
| Volkswagen | 7 | Polo Vivo, Polo, T-Cross, Tiguan, Amarok |
| Hyundai | 5 | Grand i10, i20, Tucson, Creta |
| Chery | 4 | Tiggo 4 Pro, Tiggo 7 Pro, Tiggo 8 Pro, Omoda C5 |
| Nissan | 4 | NP200, Navara, Magnite, Qashqai |
| Ford | 3 | Ranger (P703), Everest, EcoSport |
| Haval/GWM | 2 | Jolion, H6 |
| Isuzu | 2 | D-Max, MU-X |
| + others | 12 | BMW, Mercedes, Mazda, Kia, Renault, etc. |

---

## Commonly Tuned Engines (14 flagged)

| Model | Engine | Stock Power | Induction | Notes |
|-------|--------|-------------|-----------|-------|
| Toyota Hilux | 2GD-FTV | 110kW / 400Nm | Turbo | Common SA diesel tune target |
| Toyota Hilux | 1GD-FTV | 130kW / 420Nm | Turbo | Stage 1: +30kW easy |
| Toyota Hilux GR-S | 1GD-FTV | 165kW / 500Nm | Twin-Turbo | Factory hot tune |
| VW Polo | EA211 1.0 TSI | 70kW / 175Nm | Turbo | Stage 1: +25kW |
| VW Polo GTI | EA888 2.0 TSI | 147kW / 320Nm | Turbo | Stage 1: +40kW |
| VW Tiguan | EA211 1.4 TSI | 110kW / 250Nm | Turbo | Popular crossover tune |
| VW Tiguan | EA288 2.0 TDI | 110kW / 340Nm | Turbo | Diesel torque monster |
| VW Amarok | EA897 V6 TDI | 190kW / 580Nm | Twin-Turbo | Stage 1: 210kW+ |
| Ford Ranger | 2.0L SZ | 125kW / 405Nm | Turbo | Single turbo diesel |
| Ford Ranger | 2.0L Bi-Turbo | 154kW / 500Nm | Twin-Turbo | Stage 1: +30kW |
| Ford Ranger | 3.0L V6 | 184kW / 600Nm | Twin-Turbo | Top of the range |
| Ford Ranger Raptor | 2.3L EcoBoost | 205kW / 445Nm | Turbo | Petrol performance |
| Isuzu D-Max | RZ4E-TC | 110kW / 350Nm | Turbo | 1.9L diesel |
| Isuzu D-Max | 4JJ3-TC | 140kW / 450Nm | Turbo | 3.0L diesel |

---

## Known Issues Tracked

| Vehicle | Issue | Severity |
|---------|-------|----------|
| Hilux 2GD-FTV | Diesel injector failure (SA bad diesel) | High |
| Hilux 2GD/1GD | DPF clogging (short trips) | Medium |
| VW Polo 1.0 TSI | Timing chain stretch/failure | Critical |
| Ford Ranger 2.0L | Turbo actuator failure | High |
| Isuzu D-Max | Injector copper seal blow-by | Medium |
| Nissan NP200 | Clutch slave cylinder failure (60K km) | Medium |

---

## SQL Files

| File | Size | Description |
|------|------|-------------|
| `sa_vehicle_schema.sql` | 8.9K | Full schema: 10 tables, indexes, seed data for reference tables |
| `sa_vehicle_seed.sql` | 14K | Seed data: 28 makes, 48 models, 38 engines, 7 known issues |

---

## Usage

### Query a vehicle by VIN pattern
```sql
SELECT vm.name AS make, vmo.name AS model, ec.engine_code, ec.power_kw
FROM model_variants mv
JOIN vehicle_models vmo ON vmo.id = mv.model_id
JOIN vehicle_makes vm ON vm.id = vmo.make_id
JOIN engine_configs ec ON ec.id = mv.engine_config_id
WHERE mv.stock_vin_pattern LIKE 'AHT%';
```

### Find tuning potential
```sql
SELECT vm.name, vmo.name, ec.engine_code, ec.power_kw, ec.torque_nm,
       ec.power_kw * 1.3 AS estimated_stage1_kw
FROM engine_configs ec
JOIN vehicle_models vmo ON vmo.id = ec.model_id
JOIN vehicle_makes vm ON vm.id = vmo.make_id
WHERE ec.is_common_tune = true
ORDER BY ec.power_kw DESC;
```

### View all known issues for a vehicle
```sql
SELECT ki.issue_category, ki.description, ki.severity, ki.symptom_dtc
FROM known_issues ki
JOIN vehicle_models vmo ON vmo.id = ki.model_id
JOIN vehicle_makes vm ON vm.id = vmo.make_id
WHERE vm.name = 'Toyota' AND vmo.name = 'Hilux';
```

---

## Integration with Studio

The SA Vehicle database is designed to power:
1. **Vehicle identification** — VIN-based lookup during ECU connect
2. **Tuning presets** — Pre-loaded calibration targets per model
3. **Diagnostic hints** — Known issue lookup by DTC or vehicle model
4. **Calibration validation** — Compare read values against OEM specs

To connect the Studio frontend to this database, use the `ecu_app` credentials
and the REST API layer on port `4000`.
