# 🏢 ECU Platform Core

**The digital headquarters for a next-generation automotive ECU platform.**

This repository is the single source of truth for the entire platform — organized as a multi-agent R&D system with 18 dedicated directories.

---

## 🧭 Quick Navigation

```
🏗 Architecture    → 01_Architecture/
⚡ Hardware        → 02_Hardware/ + 03_PCB/
💻 Firmware        → 04_Firmware/
🌐 Software/Cloud  → 05_Software/ + 06_Cloud/
🏭 Manufacturing   → 07_Manufacturing/
🔬 Testing         → 08_Testing/
📜 Compliance      → 09_Compliance/
📈 Market Research → 10_Market_Research/
📚 Documentation   → 11_Documentation/
📦 BOM             → 12_BOM/
📋 Datasheets      → 13_Datasheets/
📐 Diagrams        → 14_Diagrams/
🏪 Suppliers       → 15_Suppliers/
📊 Quality Audits  → 16_Quality_Audits/
📝 Decisions       → 17_Decisions/
🗺️ Roadmap        → 18_Roadmap/
```

---

## 🚀 What We're Building

A **white-label, cloud-connected ECU platform** for the automotive performance market.

| Component | Description | Status |
|-----------|-------------|--------|
| **ECU Firmware** | Engine control based on proven rusEFI foundation | 🟡 In progress |
| **Prototype Studio** | Modern desktop tuning application | 🟡 Planning |
| **Cloud Platform** | Telemetry, OTA, fleet management | ⚪ Future |
| **Mobile App** | BLE diagnostics companion | ⚪ Future |
| **Custom Hardware** | Professional ECU PCB + enclosure | ⚪ Future |

See [Project Status](11_Documentation/PROJECT_STATUS.md) for detailed progress.

---

## 📋 Current State

| Metric | Value |
|--------|-------|
| **Phase** | Phase 1 — Foundation |
| **Overall Progress** | ~18% |
| **Documentation** | 68% ████████████████░░░░ |
| **Firmware** | 28% ███████░░░░░░░░░░░░ |
| **rusEFI Upstream** | Commit `8540e44` (June 30, 2026) |
| **Build Toolchain** | ARM GCC 12.3 ✅ — Java 11 ✅ — DDD Gate ✅ |

---

## 👥 Five Audiences

``` 
👨‍💼 Management    → 11_Documentation/management/   → "What's the status?"
👨‍💻 Engineering   → 04_Firmware/ + 01_Architecture/ → "How do I build it?"
💼 Investors      → 11_Documentation/investor/     → "Why should I invest?"
👨‍🔧 Workshop     → 11_Documentation/workshop/     → "How do I install it?"
🏭 Manufacturing  → 07_Manufacturing/               → "How do I make it?"
```

---

## 📖 Start Here

| Resource | Location |
|----------|----------|
| **Specification contract** | [MASTER_DIRECTIVE.md](./MASTER_DIRECTIVE.md) |
| First-time guide | [START_HERE.md](./START_HERE.md) |
| Current session | [SESSION.md](./SESSION.md) |
| Agent system | [11_Documentation/engineering/agent-system.md](11_Documentation/engineering/agent-system.md) |
| Quality gate | `./scripts/ddd-check.sh` |

---

## 📄 License

See [11_Documentation/LICENSE_NOTES.md](11_Documentation/LICENSE_NOTES.md). The firmware is GPL-3.0 (upstream rusEFI);
the Studio, Cloud, and Mobile applications are proprietary.
