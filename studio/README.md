# 7100CPT Studio

> **TB-002:** Studio launches with 7100CPT branding
> **Architecture:** Tauri 2 + React 18 + TypeScript
> **ADR:** 0001 (White-Label), 0009 (Platform Strategy)

---

## Architecture

```
7100CPT Studio
        │
        ▼
EcuService               (core/services/EcuService.ts)
        │
        ▼
EcuProtocol (interface)  (core/transport/EcuProtocol.ts)
        ▲
        │
RusEFIProtocolAdapter    (adapters/RusEFIProtocolAdapter.ts)
        │
        ▼
UsbTransport             (core/transport/EcuTransport.ts)
        │
        ▼
rusEFI Firmware
```

## Directory Structure

```
studio/
  core/
    transport/
      EcuTransport.ts      # Transport interface (ADR-0010)
      EcuProtocol.ts       # Protocol interface (ADR-0012)
    services/
      EcuService.ts        # Business logic layer
    branding/
      BrandProvider.ts     # Brand configuration
    repositories/
      types.ts             # Repository interfaces (ADR-0011)
    types.ts               # Application core types
  adapters/
    RusEFIProtocolAdapter.ts  # rusEFI protocol implementation
  src/
    App.tsx                # Application root
    main.tsx               # Entry point
    styles.css             # Dark theme
  src-tauri/
    src/lib.rs             # Tauri backend
```

## Build

```bash
cd studio
npm install
npm run tauri dev     # Development
npm run tauri build   # Production build
```

## License

Proprietary. See 11_Documentation/LICENSE_NOTES.md.
