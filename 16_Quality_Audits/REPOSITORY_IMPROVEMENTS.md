# REPOSITORY_IMPROVEMENTS.md — Repository Structure, CI & Submodule Fixes

> **Type:** EDR Companion — Repository Domain
> **Governance:** Per ADR-0007 — proposals only

---

## 1. Critical Bug Fixes

### 1.1 .gitmodules URL (🔴 Critical)

**Current:**
```
[submodule "firmware/upstream"]
    url = ./firmware/upstream
```

**Problem:** Fresh clones fail `git submodule update --init` because `./firmware/upstream` is a relative path that resolves to a directory that doesn't contain a git repo in the fresh clone.

**Fix:**
```
[submodule "firmware/upstream"]
    url = https://github.com/rusefi/rusefi.git
```

**Migration:** `git submodule sync` after editing `.gitmodules`

**Priority:** P0 (5 minutes)

---

### 1.2 CI Branch Mismatch (🟠 High)

**Current:** `.github/workflows/ddd-check.yml`
```yaml
on:
  push:
    branches: [main, develop]
```

**Problem:** The repository's only branch is `master`. The DDD quality gate has never run on push. Silent failure.

**Fix:**
```yaml
on:
  push:
    branches: [master, main, develop]
```

**Priority:** P0 (5 minutes)

---

### 1.3 Submodule Working Tree Pollution (🟡 Medium)

**Current:** `firmware/upstream` has 5 modified generated files (25K lines) and 1 untracked FORK_METADATA.md.

**Fix:**
```bash
cd firmware/upstream
git checkout -- .                    # Discard generated file changes
git add FORK_METADATA.md
git commit -m "docs: add fork metadata"
cd ../..
git add firmware/upstream
git commit -m "chore: pin rusEFI submodule after cleanup"
```

**Priority:** P1 (15 minutes)

---

### 1.4 Submodule Local Commits Not Pushed (🟠 High)

**Current:** Submodule has commit `7abb688` (GCC 12 build fix) that exists only on this workstation. If the submodule directory is deleted and re-cloned, the fix is lost.

**Fix:** The submodule needs its own fork on GitHub to push commits to. Options:

**Option A:** Push to a fork under `abwarren/rusefi` — then the submodule points to the fork. But the `.gitmodules` URL must change to the fork URL, which means the fork must be maintained.

**Option B:** Submit the GCC 12 fix upstream to `rusefi/rusefi` — if accepted, the submodule tracks upstream HEAD. Best option but depends on upstream merge.

**Option C:** Cherry-pick the GCC 12 fix into the build scripts in `scripts/build-firmware.sh` — keep the fix in the root repo, keep the submodule pristine at upstream commit. Recommended for simplicity.

**Recommendation:** Option C. Keep the submodule at the upstream commit. Apply the GCC 12 fix as a CFLAGS override in the build script. This keeps the submodule clean and the build fix under project control.

**Priority:** P1

---

## 2. Repository Structure Improvements

### 2.1 Empty Placeholder Directories

**Current:** 12 directories under `firmware/` plus `studio/`, `hardware/`, `mobile/`, `cloud/` are empty.

**Problem:** Empty directories imply architecture that doesn't exist. A new engineer finds 16 directories and discovers 16 are empty.

**Recommendation:** Add `README.md` to each empty directory defining its interface contract:

```
firmware/bootloader/README.md:
  # Bootloader
  ## Interface Contract
  - Accepts firmware images via USB CDC protocol (see protocol-architecture.md)
  - Verifies ECDSA signature before flashing
  - Implements A/B partition switching
  - Exposes boot reason to application firmware
  ## Dependencies
  - 01_Architecture/protocol-architecture.md
  - 01_Architecture/security-architecture.md
  ## Status: Phase 3 (not yet implemented)
```

This transforms empty directories from "nothing exists" to "here is the contract you must implement."

**Priority:** P2 (2 sessions for all 16 directories)

---

### 2.2 Documentation Duplication

**Current:** `MASTER_DIRECTIVE.md` §3 and `CONTEXT_LIFECYCLE.md` overlap ~70%.

**Problem:** Two documents with overlapping scope create a maintenance burden. When policy changes, both must be updated or they diverge.

**Recommendation:** Consolidate into `MASTER_DIRECTIVE.md` §3 as the authoritative source. Convert `CONTEXT_LIFECYCLE.md` into a short reference that points to the authoritative section:

```markdown
# CONTEXT_LIFECYCLE.md
> See MASTER_DIRECTIVE.md §3 for the mandatory context lifecycle policy.
> This file is a convenience reference for agents that need a quick reminder of the handoff checklist.
```

**Priority:** P2 (30 minutes)

---

### 2.3 Link Rot Prevention

**Current:** 143 markdown documents with no automated link checking. The DDD gate checks presence, not correctness.

**Recommendation:** Add a markdown link checker to the DDD quality gate:

```bash
# Add to scripts/ddd-check.sh:
# Check for broken internal links
find . -name "*.md" -not -path "./.git/*" -not -path "./firmware/upstream/*" | while read f; do
    grep -oP '\[([^\]]+)\]\(([^)]+\.md[^)]*)\)' "$f" | while read -r line; do
        target=$(echo "$line" | grep -oP '(?<=\()[^)]+\.md[^)]*(?=\))' | sed 's/#.*//')
        if [ ! -f "$target" ]; then
            echo "BROKEN: $f -> $target"
        fi
    done
done
```

**Priority:** P2 (1 session)

---

## 3. CI/CD Expansion

### Current: One workflow (ddd-check.yml) that doesn't run

### Recommendation: Progressive CI Pipeline

| Phase | Workflow | Trigger | Purpose |
|-------|----------|---------|---------|
| Now | `ddd-check.yml` | push to `master` | Documentation quality gate |
| TB-001 | `build-firmware.yml` | push to `master` | Verify firmware compiles |
| TB-001 | `protocol-test.yml` | push to `master` | Verify protocol conformance |
| TB-002+ | `integration-test.yml` | PR to `master` | End-to-end tracer bullet tests |

**Priority:** P2 (scales with implementation progress)

---

## 4. Directory Renaming Proposal

### Current: `11_Documentation/` is the catch-all

**Problem:** `11_Documentation/` contains 51 markdown files across 8 subdirectories. It's the largest and most heterogeneous directory. "Documentation" doesn't communicate its role clearly — it's really the "Knowledge Base."

**Recommendation:** No rename. `11_Documentation` is well-established and referenced in ~50 cross-document links. The cost of updating every reference outweighs the naming clarity benefit. Accept the current name and document it clearly in the README.

**Priority:** P3 (do not implement — cost > benefit)

---

*Per ADR-0007, these are proposals. No baseline documents have been modified.*
