-- ============================================================================
-- SA Vehicle Seed Data — Top Selling Vehicles in South Africa
-- ============================================================================
BEGIN;

-- ============================================================================
-- Vehicle Makes
-- ============================================================================
INSERT INTO vehicle_makes (name, country, website) VALUES
    ('Toyota', 'Japan', 'https://www.toyota.co.za'),
    ('Volkswagen', 'Germany', 'https://www.vw.co.za'),
    ('Ford', 'USA', 'https://www.ford.co.za'),
    ('Suzuki', 'Japan', 'https://www.suzuki.co.za'),
    ('Hyundai', 'South Korea', 'https://www.hyundai.co.za'),
    ('Isuzu', 'Japan', 'https://www.isuzu.co.za'),
    ('Nissan', 'Japan', 'https://www.nissan.co.za'),
    ('Chery', 'China', 'https://www.chery.co.za'),
    ('Haval / GWM', 'China', 'https://www.haval.co.za'),
    ('Renault', 'France', 'https://www.renault.co.za'),
    ('Kia', 'South Korea', 'https://www.kia.co.za'),
    ('BMW', 'Germany', 'https://www.bmw.co.za'),
    ('Mercedes-Benz', 'Germany', 'https://www.mercedes-benz.co.za'),
    ('Mazda', 'Japan', 'https://www.mazda.co.za'),
    ('Mahindra', 'India', 'https://www.mahindra.co.za'),
    ('Mitsubishi', 'Japan', 'https://www.mitsubishi-motors.co.za'),
    ('Honda', 'Japan', 'https://www.honda.co.za'),
    ('Volvo', 'Sweden', 'https://www.volvo.co.za'),
    ('Chevrolet', 'USA', 'https://www.chevrolet.co.za'),
    ('Fiat', 'Italy', 'https://www.fiat.co.za'),
    ('Tata', 'India', 'https://www.tata.co.za'),
    ('Audi', 'Germany', 'https://www.audi.co.za'),
    ('Mini', 'UK', 'https://www.mini.co.za'),
    ('Subaru', 'Japan', 'https://www.subaru.co.za'),
    ('Jaguar', 'UK', 'https://www.jaguar.co.za'),
    ('Land Rover', 'UK', 'https://www.landrover.co.za'),
    ('Peugeot', 'France', 'https://www.peugeot.co.za'),
    ('Opel', 'Germany', 'https://www.opel.co.za');

-- ============================================================================
-- TOYOTA MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (1, 'Hilux', 4, '8th Gen (N300)', 2016, true),
    (1, 'Corolla Cross', 5, '1st Gen', 2021, true),
    (1, 'Corolla Quest', 2, 'E17x Series', 2019, true),
    (1, 'Fortuner', 4, '2nd Gen (S500)', 2015, true),
    (1, 'RAV4', 4, '5th Gen (XA50)', 2019, true),
    (1, 'Land Cruiser 300', 4, 'J300', 2021, true),
    (1, 'Land Cruiser 79', 4, '70 Series', 2007, true),
    (1, 'Starlet', 1, 'Gen 4 (local)', 2020, true),
    (1, 'Vitz', 1, '4th Gen', 2012, false),
    (1, 'Etios', 2, '1st Gen', 2012, false),
    (1, 'Camry', 2, 'XV70', 2018, true),
    (1, 'Hiace', 7, 'H200', 2005, true),
    (1, 'Quantum', 7, 'Leyland', 2005, true),
    (1, 'Urban Cruiser', 5, '1st Gen', 2021, true);

-- Hilux engines
INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm, is_common_tune)
VALUES
    (1, '2GD-FTV', 2393, 4, 2, 'Turbo', 110, 400, true),
    (1, '1GD-FTV', 2755, 4, 2, 'Turbo', 130, 420, true),
    (1, '2TR-FE', 2694, 4, 1, 'NA', 122, 245, false),
    (1, '1KD-FTV', 2982, 4, 2, 'Turbo', 126, 343, false),
    (1, 'GR-S 1GD-FTV', 2755, 4, 2, 'Twin-Turbo', 165, 500, true);

-- Corolla Cross engines
INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm)
VALUES
    (2, '2ZR-FE', 1798, 4, 1, 'NA', 103, 170),
    (2, '2ZR-FXE (Hybrid)', 1798, 4, 4, 'NA', 72, 142);

-- ============================================================================
-- VOLKSWAGEN MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (2, 'Polo Vivo', 1, '5th Gen (local)', 2018, true),
    (2, 'Polo', 1, '6th Gen', 2018, true),
    (2, 'T-Cross', 5, '1st Gen', 2019, true),
    (2, 'Tiguan', 4, '2nd Gen', 2016, true),
    (2, 'Golf 8', 1, '8th Gen (Mk8)', 2020, true),
    (2, 'Amarok', 4, '2nd Gen', 2023, true),
    (2, 'Touran', 7, '1st Gen', 2010, true);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm, is_common_tune)
VALUES
    -- Polo Vivo 1.4
    ((SELECT id FROM vehicle_models WHERE name='Polo Vivo' AND make_id=2), 'CC', 1394, 4, 1, 'NA', 63, 130, false),
    -- Polo Vivo 1.6
    ((SELECT id FROM vehicle_models WHERE name='Polo Vivo' AND make_id=2), 'CF', 1598, 4, 1, 'NA', 77, 153, false),
    -- Polo 1.0 TSI
    ((SELECT id FROM vehicle_models WHERE name='Polo' AND make_id=2), 'EA211 DKR', 999, 3, 1, 'Turbo', 70, 175, true),
    -- Polo GTI 2.0 TSI
    ((SELECT id FROM vehicle_models WHERE name='Polo' AND make_id=2), 'EA888 CZ', 1984, 4, 1, 'Turbo', 147, 320, true),
    -- T-Cross 1.0 TSI
    ((SELECT id FROM vehicle_models WHERE name='T-Cross' AND make_id=2), 'EA211 DKRF', 999, 3, 1, 'Turbo', 70, 175, false),
    -- Tiguan 1.4 TSI
    ((SELECT id FROM vehicle_models WHERE name='Tiguan' AND make_id=2), 'EA211 CZDA', 1395, 4, 1, 'Turbo', 110, 250, true),
    -- Tiguan 2.0 TDI
    ((SELECT id FROM vehicle_models WHERE name='Tiguan' AND make_id=2), 'EA288 DFGA', 1968, 4, 2, 'Turbo', 110, 340, true),
    -- Amarok 3.0 V6 TDI
    ((SELECT id FROM vehicle_models WHERE name='Amarok' AND make_id=2), 'EA897', 2967, 6, 2, 'Twin-Turbo', 190, 580, true);

-- ============================================================================
-- FORD MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (3, 'Ranger', 4, 'T6.2 / P703', 2022, true),
    (3, 'Everest', 4, 'U704', 2023, true),
    (3, 'EcoSport', 5, '1st Gen', 2013, false);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm, is_common_tune)
VALUES
    ((SELECT id FROM vehicle_models WHERE name='Ranger' AND make_id=3), '2.0L SZ', 1996, 4, 2, 'Turbo', 125, 405, true),
    ((SELECT id FROM vehicle_models WHERE name='Ranger' AND make_id=3), '2.0L Bi-Turbo', 1996, 4, 2, 'Twin-Turbo', 154, 500, true),
    ((SELECT id FROM vehicle_models WHERE name='Ranger' AND make_id=3), '3.0L V6', 2993, 6, 2, 'Twin-Turbo', 184, 600, true),
    ((SELECT id FROM vehicle_models WHERE name='Ranger' AND make_id=3), '2.3L EcoBoost', 2261, 4, 1, 'Turbo', 205, 445, true);

-- ============================================================================
-- SUZUKI MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (4, 'Swift', 1, '4th Gen', 2018, true),
    (4, 'Jimny', 4, '4th Gen (JB74)', 2018, true),
    (4, 'Vitara', 4, '4th Gen', 2015, true),
    (4, 'Brezza', 5, '1st Gen', 2023, true),
    (4, 'Fronx', 5, '1st Gen', 2023, true),
    (4, 'Baleno', 1, '2nd Gen', 2022, true),
    (4, 'Ertiga', 7, '2nd Gen', 2019, true);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm)
VALUES
    ((SELECT id FROM vehicle_models WHERE name='Swift' AND make_id=4), 'K12M', 1197, 4, 1, 'NA', 61, 113),
    ((SELECT id FROM vehicle_models WHERE name='Swift' AND make_id=4), 'K14C Boosterjet', 1373, 4, 1, 'Turbo', 103, 210),
    ((SELECT id FROM vehicle_models WHERE name='Jimny' AND make_id=4), 'K15B', 1462, 4, 1, 'NA', 75, 130),
    ((SELECT id FROM vehicle_models WHERE name='Vitara' AND make_id=4), 'K14C', 1373, 4, 1, 'Turbo', 103, 220);

-- ============================================================================
-- ISUZU MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (6, 'D-Max', 4, '3rd Gen (RG)', 2020, true),
    (6, 'MU-X', 4, '2nd Gen', 2021, true);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm, is_common_tune)
VALUES
    ((SELECT id FROM vehicle_models WHERE name='D-Max' AND make_id=6), 'RZ4E-TC', 1898, 4, 2, 'Turbo', 110, 350, true),
    ((SELECT id FROM vehicle_models WHERE name='D-Max' AND make_id=6), '4JJ3-TC', 2999, 4, 2, 'Turbo', 140, 450, true);

-- ============================================================================
-- HYUNDAI MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (5, 'Grand i10', 1, '3rd Gen', 2020, true),
    (5, 'i20', 1, '3rd Gen (BC3)', 2020, true),
    (5, 'Tucson', 4, '4th Gen (NX4)', 2021, true),
    (5, 'Creta', 5, '1st Gen', 2021, true),
    (5, 'Bakkie/H-100', 9, 'Libero', 2000, true);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm)
VALUES
    ((SELECT id FROM vehicle_models WHERE name='Grand i10' AND make_id=5), 'Kappa II', 1197, 3, 1, 'NA', 61, 114),
    ((SELECT id FROM vehicle_models WHERE name='i20' AND make_id=5), 'Kappa 1.2', 1197, 4, 1, 'NA', 61, 115),
    ((SELECT id FROM vehicle_models WHERE name='i20' AND make_id=5), 'Gamma 1.0 T-GDI', 998, 3, 1, 'Turbo', 74, 172),
    ((SELECT id FROM vehicle_models WHERE name='Tucson' AND make_id=5), 'Smartstream 1.6T', 1598, 4, 1, 'Turbo', 110, 265),
    ((SELECT id FROM vehicle_models WHERE name='Creta' AND make_id=5), 'Kappa 1.5', 1497, 4, 1, 'NA', 85, 144);

-- ============================================================================
-- NISSAN MODELS
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (7, 'NP200', 10, '1st Gen', 2008, true),
    (7, 'Navara', 4, 'D23', 2015, true),
    (7, 'Magnite', 5, '1st Gen', 2021, true),
    (7, 'Qashqai', 5, '3rd Gen (J12)', 2021, true);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm)
VALUES
    ((SELECT id FROM vehicle_models WHERE name='NP200' AND make_id=7), 'K9K', 1461, 4, 2, 'Turbo', 62, 160),
    ((SELECT id FROM vehicle_models WHERE name='Navara' AND make_id=7), 'YS23DDT', 2298, 4, 2, 'Twin-Turbo', 140, 450),
    ((SELECT id FROM vehicle_models WHERE name='Qashqai' AND make_id=7), 'HR13DDT', 1332, 4, 1, 'Turbo', 116, 250);

-- ============================================================================
-- CHERY & HAVAL MODELS (growing fast in SA)
-- ============================================================================
INSERT INTO vehicle_models (make_id, name, body_style_id, generation, year_introduced, is_active)
VALUES
    (8, 'Tiggo 4 Pro', 5, '1st Gen', 2023, true),
    (8, 'Tiggo 7 Pro', 5, '1st Gen', 2023, true),
    (8, 'Tiggo 8 Pro', 4, '1st Gen', 2023, true),
    (8, 'Omoda C5', 5, '1st Gen', 2023, true),
    (9, 'Haval Jolion', 5, '1st Gen', 2021, true),
    (9, 'Haval H6', 4, '3rd Gen', 2021, true);

INSERT INTO engine_configs (model_id, engine_code, displacement_cc, cylinders, fuel_type_id, induction, power_kw, torque_nm)
VALUES
    ((SELECT id FROM vehicle_models WHERE name='Tiggo 4 Pro' AND make_id=8), 'SQRE4T15C', 1498, 4, 1, 'Turbo', 108, 210),
    ((SELECT id FROM vehicle_models WHERE name='Tiggo 7 Pro' AND make_id=8), 'SQRE4T15C', 1498, 4, 1, 'Turbo', 108, 210),
    ((SELECT id FROM vehicle_models WHERE name='Tiggo 8 Pro' AND make_id=8), 'F4J16', 1598, 4, 1, 'Turbo', 136, 275),
    ((SELECT id FROM vehicle_models WHERE name='Haval Jolion' AND make_id=9), 'GW4G15K', 1497, 4, 1, 'Turbo', 105, 220),
    ((SELECT id FROM vehicle_models WHERE name='Haval H6' AND make_id=9), 'GW4N20', 1998, 4, 1, 'Turbo', 155, 325);

-- ============================================================================
-- Known Issues (common SA vehicle problems)
-- ============================================================================
INSERT INTO known_issues (model_id, issue_category, description, symptom_dtc, fix_notes, severity, is_common)
VALUES
    -- Hilux 2GD/1GD injector issues
    ((SELECT id FROM vehicle_models WHERE name='Hilux' AND make_id=1 AND generation='8th Gen (N300)'),
     'Fuel', 'Diesel injector failure on 2GD-FTV — common in SA bad diesel', 'P0087', 'Replace injectors with revised part number', 'High', true),
    -- Hilux DPF
    ((SELECT id FROM vehicle_models WHERE name='Hilux' AND make_id=1 AND generation='8th Gen (N300)'),
     'Emissions', 'DPF clogging on short-trip urban driving', 'P2463', 'Forced regeneration or DPF delete on off-road use', 'Medium', true),
    -- VW Polo 1.0 TSI timing chain
    ((SELECT id FROM vehicle_models WHERE name='Polo' AND make_id=2),
     'Engine Mechanical', 'Timing chain stretch / failure on EA211 1.0 TSI', 'P0016', 'Replace timing chain tensioner and guides', 'Critical', true),
    -- Ford Ranger 2.0 SZ turbo failure
    ((SELECT id FROM vehicle_models WHERE name='Ranger' AND make_id=3),
     'Engine Mechanical', 'Turbo actuator failure on 2.0L SZ single turbo', 'P0045', 'Replace turbo actuator or entire turbocharger', 'High', true),
    -- Suzuki Jimny gearbox
    ((SELECT id FROM vehicle_models WHERE name='Jimny' AND make_id=4),
     'Transmission', 'Gearbox whine noise on 5MT (JB74)', NULL, 'Replace gearbox oil with Redline MT-90, check synchros', 'Medium', false),
    -- Isuzu D-Max injector seals
    ((SELECT id FROM vehicle_models WHERE name='D-Max' AND make_id=6),
     'Fuel', 'Injector copper seal failure causing blow-by', NULL, 'Replace copper seals and tighten to spec', 'Medium', true),
    -- NP200 clutch
    ((SELECT id FROM vehicle_models WHERE name='NP200' AND make_id=7),
     'Transmission', 'Clutch slave cylinder failure — common at 60K km', NULL, 'Replace clutch slave cylinder, bleed system', 'Medium', true);

COMMIT;
