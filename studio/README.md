# Prototype Studio

> **TB-002:** Studio launches with Prototype ECU branding
> **Framework:** Tauri 2 + React 18 + TypeScript + Vite
> **Status:** ✅ UI scaffold complete

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Desktop Shell | Tauri | 2.x |
| UI Framework | React | 18.3 |
| Language | TypeScript | 5.5 |
| Build | Vite | 5.4 |
| Style | CSS (custom dark theme) | — |

## Structure

```
studio/
├── index.html              Entry point
├── package.json            Node deps
├── vite.config.ts          Vite config
├── tsconfig.json           TypeScript config
├── src/
│   ├── main.tsx            React entry
│   ├── App.tsx             Main component (loads brand.json)
│   ├── styles.css          Dark theme (GitHub-inspired)
│   └── vite-env.d.ts       Vite types
├── src-tauri/
│   ├── tauri.conf.json     Tauri config
│   ├── Cargo.toml          Rust deps
│   ├── build.rs            Tauri build
│   └── src/
│       ├── main.rs         Rust entry
│       └── lib.rs          Tauri commands
└── dist/                   Build output
```

## Building

```bash
cd studio
npm install
npm run build        # Frontend only
cargo tauri build    # Full Tauri app (requires Rust)
```

## Features (TB-002)

- [x] React + TypeScript + Vite project scaffolded
- [x] Frontend builds (31 modules, 508ms)
- [x] Branding loaded from brand.json at runtime
- [x] Dark theme (GitHub color palette)
- [x] Navigation shell with 8 planned sections
- [x] ECU connection status indicator
- [x] Offline mode indicator
- [x] Footer with company name and version

## Output

| File | Size | Gzip |
|------|------|------|
| index.html | 463 B | 302 B |
| CSS | 2.65 KB | 0.94 KB |
| JS | 144.56 KB | 46.36 KB |

## Next: TB-003 — Studio Connects to ECU

Add serial port communication via Tauri plugin. ECU discovery and handshake protocol.
