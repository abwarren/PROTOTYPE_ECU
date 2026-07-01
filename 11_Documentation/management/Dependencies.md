# 🔗 Dependencies

> **Last updated:** 2026-06-30
> Tracks cross-team and cross-component dependencies.

---

## Critical Path Dependencies

| # | Depends On | Blocks | Description | Status |
|---|-----------|--------|-------------|--------|
| DEP-01 | ARM GCC toolchain | Firmware build | Cannot compile firmware without ARM cross-compiler | 🟡 Pending |
| DEP-02 | Firmware build | Brand separation | Cannot verify brand changes without compiling | 🟡 Pending |
| DEP-03 | Brand separation | Firmware identity | Cannot version firmware until branding is configurable | 🟡 Pending |
| DEP-04 | Firmware USB protocol | Studio communication | Studio needs documented protocol to implement USB link | 🟢 Not yet needed |
| DEP-05 | Documentation | All tasks | DDD policy requires docs before task completion | 🟢 Active |
| DEP-06 | Investor docs | Funding | Cannot raise without presentation-ready materials | 🟢 Complete |
| DEP-07 | Studio scaffold | All Studio features | Dashboard, tuning, datalogging depend on scaffold | 🟢 Not yet needed |
| DEP-08 | Hardware PCB design | Enclosure design | Enclosure dimensions depend on PCB layout | 🟢 Not yet needed |
| DEP-09 | Cloud API | Mobile app | Mobile app needs cloud API for remote features | 🟢 Not yet needed |
| DEP-10 | Seed funding | Hardware prototype | Prototype manufacturing requires capital | 🟢 Not yet needed |

## External Dependencies

| Dependency | Version | Purpose | Status |
|-----------|---------|---------|--------|
| ARM GCC Embedded | 10.3-2021.10+ | Firmware compilation | ❌ Not verified |
| rusEFI upstream | Commit `8540e44` | Firmware foundation | ✅ Cloned |
| Node.js | 18+ | Studio development | ❌ Not verified |
| Flutter SDK | 3.16+ | Mobile development | ❌ Not verified |
| Docker | 20.10+ | Reproducible builds | ❌ Not verified |

## Dependency Graph (Simplified)

```
Toolchain → Firmware Build → Brand Separation → Firmware Identity
                                                      ↓
Funding → Hardware Prototype ← Studio Features ← Studio Scaffold
              ↓                      ↓
         Enclosure Design       Cloud API
                                    ↓
                               Mobile App
```
