# MegaSquirt — Analysis

## Overview

**MegaSquirt** is the most established aftermarket ECU ecosystem. It uses a hybrid open/proprietary model and is the de facto standard for DIY engine management.

## Top 10 Sources

| # | Source | URL | Type |
|---|--------|-----|------|
| 1 | MSExtra.com | https://www.msextra.com/ | Portal/Docs |
| 2 | MegaManual.com | http://www.megamanual.com/ | Hardware Manual |
| 3 | DIYAutoTune.com | https://diyautotune.com/ | Retail/Support |
| 4 | MSExtra GitHub | https://github.com/msextra | Firmware |
| 5 | TunerStudio | https://www.tunerstudio.com/ | Tuning SW |
| 6 | MS3-Pro | http://www.ms3pro.com/ | Pro Hardware |
| 7 | MSExtra Forums | https://www.msextra.com/forums/ | Community |
| 8 | MS-Runs.com | http://www.msruns.com/ | Config Archive |
| 9 | GPIO/MShift Forums | http://www.msgpio.com/ | Expansion |
| 10 | MegaSquirt Facebook | https://www.facebook.com/groups/megasquirt/ | Community |

## Architecture

| Variant | MCU | Features |
|---------|-----|----------|
| **MS1** | Obsolete | Basic fuel only |
| **MS2** | Various | Sequential fuel, basic ignition |
| **MS2Extra** | Various | Expanded features |
| **MS3** | Various | Full sequential, knock, SD logging |
| **MS3Extra** | Various | Advanced features |
| **MicroSquirt** | MS2-based | Compact, sealed unit |
| **MS3-Pro** | MS3-based | Professional grade |

## Licensing

- **Model:** Copyrighted/B&G proprietary — not open source in FOSS sense
- **Personal use:** Permitted
- **Commercial production:** Prohibited without license from B&G
- **Firmware:** Source viewable but with restrictive IP agreements

## Strengths

- Mature, battle-tested ecosystem (20+ years)
- Extremely large community and knowledge base
- Professional hardware options (MS3-Pro)
- Full TunerStudio integration
- Wide hardware ecosystem (expansion boards, IO extenders)
- Extensive documentation and wiring guides

## Weaknesses

- Not truly open source — restrictive licensing
- DIY assembly requires significant skill
- Grounding/noise issues in DIY builds
- Steep learning curve
- High cost for professional variants (MS3-Pro)
- Aging architecture in some variants

## TEN8 Applicability

- **Commercial model** (TunerStudio licensing) is a tested path
- **ECU + expansion board** ecosystem pattern is valuable
- **MS3-Pro productization** shows how to professionalize open designs
- **Market position** — TEN8 can compete on integration and modernity

## References

- [MSExtra](https://www.msextra.com/)
- [MegaManual](http://www.megamanual.com/)
- [DIYAutoTune](https://diyautotune.com/)
- [MSExtra GitHub](https://github.com/msextra)
