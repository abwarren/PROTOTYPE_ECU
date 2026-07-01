# 🔧 ECU Installation Guide

> **Audience:** Workshop technicians and experienced enthusiasts
> **Last updated:** 2026-06-30

---

## Safety

- Disconnect battery before any wiring work
- Use fused power connections
- Mount ECU away from heat sources and water
- Secure all wiring with automotive-grade connectors

## Step 1: Mount the ECU

1. Choose a mounting location:
   - **Cabin:** Under dashboard, passenger footwell, or glovebox
   - **Engine bay:** Only if IP67-rated enclosure is fitted
2. Mount with bracket (included) using M6 bolts
3. Ensure 50mm clearance around ECU for airflow
4. Route harness away from exhaust, sharp edges, and moving parts

## Step 2: Connect Power

| Wire | Connection | Fuse |
|------|------------|------|
| Battery +12V (Red) | Battery positive terminal | 30A |
| Ground (Black) | Battery negative terminal or chassis ground | — |
| Ignition (White) | Switched 12V (ignition/key-on) | 5A |

## Step 3: Connect Sensors

| Sensor | ECU Pin | Notes |
|--------|---------|-------|
| MAP sensor | Analog 1-5 | 3-bar or 4-bar typical |
| TPS | Analog 6-7 | Dual track for redundancy |
| CLT | Temp 1 | NTC thermistor |
| IAT | Temp 2 | NTC thermistor |
| Wideband O2 | CAN 1 | LSU 4.9 or compatible |
| Knock sensor | Knock 1-2 | Shielded cable required |

## Step 4: Connect Outputs

| Output | ECU Pin | Max Load |
|--------|---------|----------|
| Injectors 1-8 | Inj 1-8 | 4A per channel |
| Ignition 1-8 | Ign 1-8 | 8A per channel |
| Fuel pump relay | Low-side 1 | 3A |
| Cooling fan relay | Low-side 2 | 3A |
| Tachometer output | Tach | 500mA |

## Step 5: First Power-On

1. Verify all connections
2. Connect battery
3. Turn ignition ON (do not start)
4. Connect Studio via USB-C
5. Verify ECU power LED is illuminated
6. Run initial setup wizard in Studio

## Step 6: Initial Configuration

1. Select engine type and configuration
2. Set trigger pattern (crank/cam)
3. Set injector flow rate and type
4. Set ignition type (COP, wasted spark, distributor)
5. Perform base timing verification
6. Start engine and verify operation

## Specifications

| Parameter | Value |
|-----------|-------|
| Input voltage | 6-36V DC |
| Operating temp | -40°C to +125°C |
| Max injector current | 4A per channel |
| Max ignition current | 8A per channel |
| Connector type | Deutsch DTM (42-pin) |
