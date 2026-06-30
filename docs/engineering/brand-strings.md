# rusEFI Brand String Mapping

> **Status:** Draft — 404 occurrences found as of 2026-06-30
> **Strategy:** All customer-facing strings get brand injection. Internal include paths get renamed in Phase 2.

## Priority 1: Customer-Facing (Inject Now)

These strings are visible to users and must be replaced with `branding/brand.json` variables.

| File | String | Brand Variable |
|------|--------|----------------|
| `controllers/core/error_handling.cpp:325` | `"rusEFI v%d@%u"` | `firmware.firmware_version_string` |
| `controllers/core/error_handling.h:15` | `rusEFI distinguishes three kinds of errors` | Documentation reference |

## Priority 2: Copyright/GPL Headers (Keep Until Module Rewrite)

These are boilerplate headers in every source file. They remain until each module is rewritten as proprietary.

**Pattern:** `This file is part of rusEfi - see http://rusefi.com`
**Occurrences:** ~200+ files across controllers/ and console/

## Priority 3: Include Paths (Rename in Phase 2)

**Pattern:** `#include <rusefi/...>`
**Occurrences:** ~150+ files
**Action:** Rename namespace from `rusefi/` to `epc/` or platform namespace

## Priority 4: Perma-Attribution (Stays Forever)

- Upstream commit references (GPL compliance requires attribution)
- wiki.rusefi.com links in comments (educational references)
- License text references
