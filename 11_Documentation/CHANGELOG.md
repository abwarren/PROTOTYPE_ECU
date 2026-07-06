# Changelog

All notable changes to the ECU Platform Core project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-dev] — 2026-07-07

### Added
- BrandProvider loads brand.json via Vite/Tauri asset path (not broken fetch)
- BrandProvider reads theme colors from brand.json (dark theme)
- Board-aware output channel layout registry for rusEFI protocol (f407-discovery, proteus_f7)
- Dashboard polls live ECU sensor data when connected (250ms interval)
- Calibration page: "Read from ECU" button functional (reads calibration data)
- Calibration page: "Write to ECU" button functional (sends TS chunk write + burn)
- Calibration page: "Save to File" / "Load from File" with JSON format
- Calibration page: status messages for read/write/save/load operations
- CHANGELOG.md
- .env.example with documented environment variables
- Branding asset placeholder directories (.gitkeep)
- Studio builds for f407-discovery board confirmed

### Fixed
- BrandProvider no longer uses broken fetch("/branding/brand.json") — now served from Vite public/
- Hardcoded "7100CPT Studio" replaced with brandConfig.productName from brand.json
- Stale `greet` Tauri command removed from lib.rs
- tauri.conf.json productName/identifier use ECU Platform branding
- Tauri window title updated to match brand
- Sensor offset parsing now board-aware (not hardcoded for f407-discovery only)
- Duplicate directories consolidated (06_Cloud/ → cloud/)
- .gitignore covers studio/node_modules, studio/src-tauri/target, Engineering_Template

---

## [0.1.0-alpha] — 2026-07-05

### Added
- Complete Studio UI overhaul with dark cyber-automotive theme
- Native binary builds with Tauri 2
- Communication layer: USB transport, TunerStudio binary protocol
- Serial port management (list, open, close, read, write, CRC-framed commands)
- 12-sheet KiCad schematic design with NXP S32K344
- 3 prototype ECU enclosure designs
- Hardware EMC strategy, protection circuits, CAN design docs
- SA vehicle database schema + seed data
- QA evidence package and tracer bullet methodology

### Fixed
- STL files re-rendered as binary (8x smaller than ASCII)
- Repository restructured to 18-directory multi-agent system
- Build toolchain: ARM GCC 10.3.1, Java for code generation

---

## [0.0.1] — 2026-07-01

### Added
- Initial project scaffold
- rusEFI firmware submodule (commit 8540e44)
- Firmware build pipeline for f407-discovery
- Architecture Decision Records (ADRs) 0001-0012
- MASTER_DIRECTIVE engineering constitution
- Repository manifest, governance framework
- Session handoff system
- QA engineering review process
