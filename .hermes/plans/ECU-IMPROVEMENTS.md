# ECU Platform Improvements — Vertical Slices

> Start: 2026-07-07

## Slice Map

| Slice | What It Proves | Depends On | Est. Time |
|-------|---------------|------------|-----------|
| **S1 Brand Pipeline** | Brand.json loads in Tauri runtime, hardcoded strings replaced | nothing | ~30min |
| **S2 Sensor Data Pipeline** | Dashboard reads from ECU, live data flows end-to-end | S1 | ~1h |
| **S3 Calibration Write Pipeline** | Write to ECU works, Save/Load from file works | S2 | ~45min |
| **S4 Repository Cleanup** | Clean structure, documented, changelog | nothing | ~20min |
| **S5 Error Recovery & Quality** | Retry, reconnection, tests for S2+S3 | S2, S3 | ~30min |

---

## SLICE 1: Brand Pipeline

**Proves:** Brand.json loads correctly in Tauri desktop app. Hardcoded product names replaced with brand config. No broken fetch at runtime.

### Files
- MOD: `studio/src-tauri/tauri.conf.json` — add `bundle.resources` for branding
- MOD: `studio/src/core/branding/BrandProvider.ts` — use Tauri asset path, not fetch
- MOD: `studio/src/components/ConnectionBar.tsx` — replace "7100CPT Studio" with brand config
- NEW: `branding/logos/.gitkeep`
- NEW: `branding/icons/.gitkeep`

### Acceptance
- [ ] App doesn't hang on loading (no failed fetch to `/branding/brand.json`)
- [ ] ConnectionBar shows brand.productShortName from loaded config
- [ ] BrandProvider loads correctly in Tauri desktop runtime

---

## SLICE 2: Sensor Data Pipeline

**Proves:** Dashboard shows real ECU data. Protocol parsing is board-aware.

### Files
- MOD: `studio/src/core/transport/RusEfiProtocol.ts` — add board-registry for output channel layouts
- MOD: `studio/src/components/Dashboard.tsx` — wire real readSensors() call when connected
- MOD: `studio/src/App.tsx` — pass transport+protocol+connection to Dashboard
- MOD: `studio/src/components/Calibration.tsx` — wire "Read from ECU" button

### Acceptance
- [ ] Connected Dashboard calls readSensors() periodically (every 250ms)
- [ ] Data from ECU appears in gauges (not demo mode when connected)
- [ ] Board-aware offset parsing works for f407-discovery
- [ ] "Read from ECU" button in Calibration calls readCalibration()

---

## SLICE 3: Calibration Write Pipeline

**Proves:** Calibration writes flow through protocol → transport → ECU. Save/load to disk works.

### Files
- MOD: `studio/src/core/transport/RusEfiProtocol.ts` — implement writeCalibration + burn
- MOD: `studio/src/components/Calibration.tsx` — wire "Write to ECU", "Save to File", "Load from File"
- MOD: `studio/src-tauri/src/serial.rs` — add send_command + burn frame support if needed

### Acceptance
- [ ] Write Calibration sends correct TS_BURN + TS_CHUNK_WRITE frames
- [ ] "Save to File" exports JSON
- [ ] "Load from File" imports JSON

---

## SLICE 4: Repository Cleanup

**Proves:** Clean, documented repo structure. No stale duplicates.

### Files
- RM: `06_Cloud/|cloud/` — consolidate into one (pick `cloud/`)
- NEW: `.env.example` — documented env vars
- MOD: `.gitignore` — ignore Engineering_Template
- MOD: `11_Documentation/CHANGELOG.md` — add changelog entries

---

## SLICE 5: Error Recovery & Quality

**Proves:** Protocol handles disconnects, timeouts, CRC failures gracefully.

### Files
- MOD: `studio/src/core/transport/EcuTransport.ts` — add reconnection state machine
- MOD: `studio/src/core/transport/RusEfiProtocol.ts` — retry logic on timeout/CRC
- MOD: `studio/src/core/transport/UsbTransport.ts` — heartbeat polling
- NEW: `studio/src/core/transport/__tests__/` — unit tests
