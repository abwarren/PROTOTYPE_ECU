# 🚗 Vehicle Support Matrix

> **Audience:** Workshop sales and technicians
> **Last updated:** 2026-06-30
> **Note:** This matrix will be populated as vehicles are tested.

---

## Supported Engine Types

| Engine Type | Support | Notes |
|-------------|---------|-------|
| 4-cylinder gasoline | ✅ Supported | Most common |
| 6-cylinder gasoline | ✅ Supported | |
| 8-cylinder gasoline | ✅ Supported | |
| Rotary (Wankel) | ✅ Supported | |
| 2-cylinder (boxer) | ✅ Supported | |
| 3-cylinder | ✅ Supported | |
| V10 / V12 | ⚠️ Limited | Channel-limited on base ECU |
| Diesel | ❌ Not supported | Phase 5+ |
| Electric drive | ❌ Not supported | Phase 5+ |

## Trigger Patterns

| Pattern | Support | Notes |
|---------|---------|-------|
| 60-2 | ✅ | Hall or VR |
| 36-1 | ✅ | Most common aftermarket |
| 36-2-2-2 | ✅ | VAG, BMW |
| 24-1 | ✅ | |
| 12-1 | ✅ | |
| 6-1 | ✅ | Motorcycle common |
| 4-1 | ✅ | Simple distributor |
| Nissan CAS | ✅ | 360/720 slot |
| Honda OEM | ✅ | Various |
| GM 7X/24X | ✅ | LS engines |
| Ford EDIS | ✅ | |
| Mitsubishi 4G63 | ✅ | |
| Subaru | ✅ | Various |
| Toyota | ✅ | Various |
| Custom | ✅ | User-configurable |

## Sensor Compatibility

| Sensor Type | Support | Notes |
|-------------|---------|-------|
| MAP (analog) | ✅ | 1-5 bar |
| MAP (digital) | ✅ | I²C/SPI |
| MAF | ✅ | Frequency or analog |
| TPS (analog) | ✅ | Single or dual track |
| Wideband O2 | ✅ | CAN (LSU 4.9, Bosch) |
| Narrowband O2 | ✅ | Switching type |
| Knock sensor | ✅ | Differential |
| Flex fuel | ✅ | Ethanol content |
| Oil pressure | ✅ | |
| Fuel pressure | ✅ | |
| EGT | ⚠️ Limited | Future expansion |

## Workshop Notes

- This matrix is updated as vehicles are tested and validated
- Base maps are available for common engine configurations
- Custom calibration required for non-standard setups
- Contact support for vehicle not listed
