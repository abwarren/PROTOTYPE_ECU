# 7100CPT ECU Platform

**The digital headquarters for the 7100CPT automotive ECU platform.**

This repository is the single source of truth for the entire platform — firmware,
Studio, hardware, cloud, and manufacturing — organized as a multi-agent R&D system.

---

## What We're Building

A professional standalone engine management ECU for professional tuners,
motorsport, performance workshops, and OEM retrofit.

| Component | Description | Status |
|-----------|-------------|--------|
| **rusEFI Firmware** | Engine control based on proven rusEFI foundation | ✅ Building |
| **7100CPT Studio** | Modern desktop tuning application | 🟡 Architecture complete |
| **7100CPT ECU** | Custom hardware (NXP S32K344, 6-layer PCB) | 🟡 Phase 0 approved |
| **Cloud Platform** | Telemetry, OTA, fleet management | ⚪ Future |
| **Mobile App** | BLE diagnostics companion | ⚪ Future |

---

## Quick Navigation

```
🏗 Architecture    → 01_Architecture/
⚡ Hardware        → docs/hardware/
💻 Firmware        → firmware/upstream/  (rusEFI fork)
🖥️ Studio         → studio/             (7100CPT Studio)
🏭 Manufacturing   → 07_Manufacturing/
📚 Documentation   → 11_Documentation/
📊 Quality Audits  → 16_Quality_Audits/
📝 Decisions       → 17_Decisions/
```

---

## Current State

| Metric | Value |
|--------|-------|
| **Phase** | Phase 1 — Foundation |
| **Branding** | 7100CPT (Prototype codename deprecated 2026-07-03) |
| **Firmware** | rusEFI upstream fork at commit `8540e44` ✅ |
| **Studio** | Tauri 2 + React 18 + TS, 3-layer architecture ✅ |
| **Hardware** | Phase 0 approved, TB-HW-002 KiCad schematic unlocked |
| **Governance** | 12 ADRs accepted, Two-Agent model |

See [Project Status](11_Documentation/PROJECT_STATUS.md) for detailed progress.

---

## Five Audiences

```
👨‍💼 Management    → 11_Documentation/management/   → "What's the status?"
👨‍💻 Engineering   → firmware/ + studio/ + docs/     → "How do I build it?"
💼 Investors      → 11_Documentation/investor/     → "Why should I invest?"
👨‍🔧 Workshop     → 11_Documentation/workshop/     → "How do I install it?"
🏭 Manufacturing  → 07_Manufacturing/               → "How do I make it?"
```

---

## Start Here

| Resource | Location |
|----------|----------|
| **Specification contract** | [MASTER_DIRECTIVE.md](./MASTER_DIRECTIVE.md) |
| **Product identity** | [BRANDING.md](./BRANDING.md) |
| **Current state** | [CURRENT_STATE.md](./CURRENT_STATE.md) |
| **Project rules** | [PROJECT_RULES.md](./PROJECT_RULES.md) |
| First-time guide | [START_HERE.md](./START_HERE.md) |
| Hardware status | [docs/hardware/HARDWARE_STATUS.md](docs/hardware/HARDWARE_STATUS.md) |

---

## License

Firmware: GPL-3.0 (upstream rusEFI). Studio, Cloud, and Mobile: proprietary.
See [11_Documentation/LICENSE_NOTES.md](11_Documentation/LICENSE_NOTES.md).
