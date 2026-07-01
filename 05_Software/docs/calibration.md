# Studio Calibration Module

> **Note:** Studio is in the planning phase. This document describes the intended architecture for V1.

## Purpose

Provide tools for viewing, editing, and managing ECU calibration data including fuel tables, ignition tables, and all configurable parameters.

## Responsibilities

- Display 2D and 3D table editors for calibration data
- Support real-time table editing while engine is running
- Provide interpolation and smoothing tools
- Manage calibration file save/load
- Compare calibration versions
- Support undo/redo for table edits

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Calibration data | ECU via USB CDC | Binary |
| User edits | Mouse/keyboard | UI events |
| Calibration files | Local storage | Binary/JSON |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Updated calibration | ECU via USB CDC | Binary commands |
| Calibration file | Local file system | JSON/Binary |
| Display | Canvas rendering | Visual |

## Planned Editors (V1)

| Editor | Type | Description |
|--------|------|-------------|
| Fuel VE Table | 3D surface | RPM × Load |
| Ignition Timing Table | 3D surface | RPM × Load |
| AFR Target Table | 3D surface | RPM × Load |
| Warmup Enrichment | 2D curve | Coolant temp |
| Acceleration Enrichment | 2D curve | TPS rate |
| Dwell Time Table | 3D surface | Battery V × RPM |
| Injector Flow | 2D curve | Fuel pressure |

## Planned Features (V1)

- [ ] 3D table editor with rotation/zoom
- [ ] Real-time cell editing
- [ ] Interpolation and smoothing
- [ ] Copy/paste between tables
- [ ] Calibration compare (side-by-side)
- [ ] Calibration file management
- [ ] Engine setup wizard

## Technology

| Component | Technology |
|-----------|-----------|
| 3D Rendering | WebGL / Three.js |
| 2D Rendering | Canvas 2D |
| State | Zustand |

## Known Issues

- None yet (not implemented)

## Future Improvements

- [ ] Auto-tuning via wideband feedback
- [ ] AI-assisted calibration suggestions
- [ ] Cloud calibration sharing
- [ ] Version history for calibrations
