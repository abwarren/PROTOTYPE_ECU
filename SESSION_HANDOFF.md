# Session Handoff — ECU Platform Improvements

> **Date:** 2026-07-07
> **Session:** ECU-IMPROVEMENTS-001
> **Next Session:** ECU-IMPROVEMENTS-002

---

## What Was Completed

### Slice 1: Brand Pipeline ✅ COMMITTED (075d203)
- brand.json copied to `studio/public/branding/` for Tauri asset serving
- BrandProvider.ts: uses actual brand.json theme colors instead of GitHub-style fallbacks
- ConnectionBar.tsx: uses `useBrand()` instead of hardcoded "7100CPT Studio"
- App.tsx loading text uses brand config
- tauri.conf.json: productName/identifier updated to match brand
- Stale `greet` command removed from lib.rs
- Branding asset placeholder dirs (.gitkeep) added

### Slice 2: Sensor Data Pipeline ✅ COMMITTED (b95ce9c)
- Board-aware output channel layouts in RusEfiProtocol.ts (f407-discovery, proteus_f7)
- `parseLiveData()` uses detected board layout from handshake
- Dashboard polls `readSensors()` every 250ms when connected
- Demo mode when disconnected, live data when connected

### Slice 3: Calibration Write Pipeline ✅ COMMITTED (b95ce9c)
- `writeCalibration()` implemented: TS chunk write (0x57) + burn (0x42) sequence
- Calibration "Read from ECU" button calls `protocol.readCalibration()`
- Calibration "Write to ECU" button calls `protocol.writeCalibration()`
- Calibration "Save to File" exports JSON via Blob download
- Calibration "Load from File" imports JSON via hidden file input
- Status messages for all operations

### Slice 4: Repository Cleanup ✅ COMMITTED (b95ce9c)
- Duplicate `06_Cloud/` removed (consolidated into `cloud/`)
- `.env.example` with documented env vars
- `.gitignore` updated (Engineering_Template, OS files, IDE files)
- `CHANGELOG.md` with full history from git log

---

## What Remains

### Slice 5: Error Recovery & Quality ❌ NOT STARTED

**Goal:** Protocol handles disconnects, timeouts, CRC failures gracefully.

**S5-1: Retry + Timeout + Reconnect Logic**
- Files: `studio/src/core/transport/EcuTransport.ts`, `studio/src/core/transport/UsbTransport.ts`, `studio/src/core/transport/RusEfiProtocol.ts`
- Add retry wrapper to `sendCommand()` for transient failures (3 retries, exponential backoff)
- Add `hearten()` with proper CRC verification to detect stale connections
- Add reconnection state machine: detect stall → emit RECONNECTING → retry connect → emit CONNECTED/ERROR
- Dashboard should show "Connection lost — reconnecting..." when heartbeat fails
- ConnectionBar should show reconnection state

**S5-2: Unit Tests**
- Files: `studio/vitest.config.ts` (new), `studio/src/core/transport/__tests__/RusEfiProtocol.test.ts` (new)
- Add vitest config (Vite-native test runner, no extra deps beyond what's in package.json)
- Test `parseSignature()` with known board signatures
- Test `parseLiveData()` with mock binary data for f407-discovery
- Test `detectFeatures()` with various signatures
- Test `writeCalibration()` payload construction (mock transport)

---

## Current State

| File | Status |
|------|--------|
| `studio/src/core/branding/BrandProvider.ts` | ✅ Fixed |
| `studio/src/components/ConnectionBar.tsx` | ✅ Fixed |
| `studio/src/App.tsx` | ✅ Updated |
| `studio/src/core/transport/RusEfiProtocol.ts` | ✅ Board-aware + writeCalibration |
| `studio/src/components/Dashboard.tsx` | ✅ Live data polling |
| `studio/src/components/Calibration.tsx` | ✅ All buttons wired |
| `studio/src-tauri/src/lib.rs` | ✅ Cleaned up |
| `studio/src-tauri/tauri.conf.json` | ✅ Updated |
| `studio/public/branding/brand.json` | ✅ Served from public/ |
| `.gitignore` | ✅ Updated |
| `.env.example` | ✅ Created |
| `11_Documentation/CHANGELOG.md` | ✅ Created |
| `studio/src/core/transport/EcuTransport.ts` | ❌ Needs reconnect state machine |
| `studio/src/core/transport/UsbTransport.ts` | ❌ Needs retry logic |
| `studio/src/core/transport/RusEfiProtocol.ts` | ❌ Needs retry wrapper |

---

## Key Context for Next Session

1. **TypeScript compiles clean** — `npx tsc --noEmit` = 0 errors
2. **Board layout architecture:** `BOARD_LAYOUTS` array in `RusEfiProtocol.ts`, `detectedLayout` set during `parseSignature()`
3. **Transport layer:** `EcuTransport.ts` defines the interface, `UsbTransport.ts` implements it, Tauri Rust backend in `serial.rs` handles serial
4. **Protocol layer:** `RusEfiProtocol.ts` implements `EcuProtocol`, talks through `UsbTransport`
5. **Calibration reads:** Use `TS_READ_COMMAND` (0x52), page 0, offset 0, count 288. Returns raw binary.
6. **Calibration writes:** Use `TS_CHUNK_WRITE_COMMAND` (0x57) then `TS_BURN_COMMAND` (0x42). Data flattened as uint16 LE.
7. **Dashboard:** When `connected=true`, polls `readSensors()` at 250ms interval. When `connected=false`, runs demo mode.
8. **Git branch:** `feature/hardware-schematic-v1` — all work on this branch

---

## Verification

```bash
# TypeScript check
cd ~/projects/ECU_PLATFORM/studio && npx tsc --noEmit

# Git log
cd ~/projects/ECU_PLATFORM && git log --oneline -5
```
