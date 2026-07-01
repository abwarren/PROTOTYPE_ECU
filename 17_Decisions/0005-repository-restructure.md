# ADR-0005: Repository Restructured into 18 Numbered Directories

## Status

Accepted

## Context

The repository had a mixed structure where documentation was split between root-level files, a `docs/` directory (5 audiences), source code directories (`firmware/`, `studio/`, `cloud/`, etc.), research at `research/`, and decisions at `ADR/`. This made it difficult for new agents and stakeholders to find content quickly. Browsing the root directory showed a flat list of ~25 entries with no organizational pattern.

The multi-agent R&D system design proposed an 18-directory numbered structure that organizes content by function rather than by audience or file type.

## Decision

Restructure the repository into 18 numbered top-level directories:

| Directory | Content |
|-----------|---------|
| `01_Architecture/` | System architecture docs |
| `02_Hardware/` | Hardware design docs |
| `03_PCB/` | PCB layouts and stackups |
| `04_Firmware/` | Firmware source + module docs |
| `05_Software/` | Studio application |
| `06_Cloud/` | Cloud platform |
| `07_Manufacturing/` | Manufacturing guides |
| `08_Testing/` | Test plans |
| `09_Compliance/` | Standards |
| `10_Market_Research/` | Competitive analysis |
| `11_Documentation/` | Knowledge base (5 audiences) |
| `12_BOM/` | Bill of materials |
| `13_Datasheets/` | Component datasheets |
| `14_Diagrams/` | Architecture diagrams |
| `15_Suppliers/` | Supplier contacts |
| `16_Quality_Audits/` | Audit reports |
| `17_Decisions/` | ADRs + decision log |
| `18_Roadmap/` | Roadmaps and sprints |

## Consequences

### Positive
- Numbered directories provide clear browsing order
- Every directory has a specific function
- Source code directories remain at root alongside numbered dirs
- All documentation is now in organized homes

### Negative
- Source code directories (`firmware/`, `studio/`, etc.) sit outside the numbered system
- Root now has ~30 entries (18 numbered + source code + config)
- All existing cross-reference links had to be updated

### Neutral
- The `docs/` directory was removed entirely
- Legacy directories (`research/`, `01_Research/`, `10_Documentation/`) were removed
