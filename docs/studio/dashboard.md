# Studio Dashboard Module

> **Note:** Studio is in the planning phase. This document describes the intended architecture for V1.

## Purpose

Provide the primary user interface for real-time engine monitoring, gauge display, and system status.

## Responsibilities

- Display real-time engine data (RPM, AFR, temps, pressures, etc.)
- Render analog and digital gauge widgets
- Support drag-and-drop widget layout customization
- Provide resizable and dockable widget panels
- Alert system with configurable thresholds
- Dark mode and light mode themes

## Inputs

| Signal | Source | Type |
|--------|--------|------|
| Engine data stream | ECU via USB CDC | Binary stream |
| Widget configuration | User preferences | JSON |
| Theme configuration | branding/brand.json | JSON |
| Workspace layout | User preferences | JSON |

## Outputs

| Signal | Destination | Type |
|--------|-------------|------|
| Gauge rendering | Canvas/WebGL display | Visual |
| Alert notifications | UI overlay | Visual/audio |
| Gauge values | User display | Visual |

## Dependencies

| Dependency | Module | Description |
|------------|--------|-------------|
| Communication | Studio IPC + USB | Data from ECU |
| Branding | branding/brand.json | Theme, colors |
| State | Zustand store | Real-time data |

## Planned Features (V1)

- [ ] Customizable gauge layouts (drag-and-drop)
- [ ] Gauge types: analog, digital, bar, graph
- [ ] Dark mode (default) and light mode
- [ ] Resizable widgets
- [ ] Dockable panels
- [ ] Alert thresholds (user-configurable)
- [ ] Workspace layout save/load
- [ ] Multi-monitor support

## Technology

| Component | Technology |
|-----------|-----------|
| Rendering | Canvas / WebGL |
| State | Zustand |
| IPC | Electron preload bridge |
| Branding | Runtime brand.json load |

## Known Issues

- None yet (not implemented)

## Future Improvements

- [ ] User-created gauge widgets
- [ ] Plugin gauge types
- [ ] Dashboard themes marketplace
- [ ] AI panel integration
