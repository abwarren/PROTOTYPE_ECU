# rusEFI Upstream Synchronization Procedure

> **ED-005:** Documented upstream sync strategy
> **Date:** 2026-07-03
> **Submodule:** `firmware/upstream/`
> **Upstream:** `https://github.com/rusefi/rusefi.git`

---

## 1. Current State

| Field | Value |
|-------|-------|
| Integration method | Git submodule |
| Local HEAD | `7abb688` |
| Fork point (upstream base) | `8540e44` (2026-06-30) |
| Upstream HEAD | `0c955db` (2026-07-02) |
| Behind upstream | ~33 commits |
| Local patches | 1 (`-Wno-error=shadow` for GCC 12+) |
| Patch location | `firmware/Makefile`, 2 lines |
| Patch upstream viability | High — follows existing pattern (`-Wno-error=tautological-compare`) |

---

## 2. Sync Procedure

### 2.1 Check current state

```bash
cd firmware/upstream
git fetch origin
git log --oneline HEAD...origin/master
```

### 2.2 Update submodule (standard case — no local patches needed)

```bash
cd firmware/upstream
git fetch origin
git merge origin/master          # fast-forward
cd ../..
git add firmware/upstream
git commit -m "[firmware] Update rusEFI submodule to <sha>"
```

### 2.3 Update submodule (with local patches)

If the GCC 12 patch has not yet been accepted upstream:

```bash
cd firmware/upstream                    # inside submodule root
git fetch origin
git rebase origin/master                # replay local patch on top of upstream
# resolve conflicts if any (unlikely — patch touches one line in Makefile)
# verify build from project root:
cd ../..                               # back to ECU_PLATFORM root
verify_build.sh                         # see §2.4
# if build OK:
git add firmware/upstream
git commit -m "[firmware] Sync rusEFI submodule to <sha>, rebase GCC12 patch"
```

### 2.4 Verify build after sync

```bash
export PATH="/home/wa/tools/gcc-12/bin:/home/wa/tools/java/bin:/home/wa/tools/7zip:/home/wa/tools/mtools/usr/bin:/usr/sbin:$PATH"
export JAVA_HOME="/home/wa/tools/java"
cd firmware/upstream/firmware
make clean && make -j$(nproc)
# Confirm:
#   - Exit code 0
#   - rusefi.bin, rusefi.elf, rusefi.hex, rusefi.srec in build/
#   - file build/rusefi.elf → "ELF 32-bit LSB executable, ARM"
#   - No new compiler warnings (or only expected ones)
```

### 2.5 Rollback

```bash
cd firmware/upstream
git checkout <previous-good-sha>   # e.g., 7abb688
cd ../..
git add firmware/upstream
git commit -m "[firmware] Revert rusEFI submodule to <sha>"
```

---

## 3. Submitting the GCC 12 Patch Upstream

The local patch (`7abb688`) is a candidate for upstream contribution.

### 3.1 Patch content

```diff
# GCC 12+ stricter shadow checking; suppress until code is refactored
+USE_CPPOPT += -Wno-error=shadow
```

This follows the existing pattern in `firmware/Makefile`:
```makefile
# Hellen is one of the boards which cares
USE_CPPOPT += -Wno-error=tautological-compare
```

### 3.2 Submission checklist

- [ ] Verify the patch builds cleanly on latest upstream HEAD
- [ ] Check rusEFI contribution guidelines (GitHub: `rusefi/rusefi/CONTRIBUTING.md`)
- [ ] Open PR against `rusefi/rusefi` `master` branch
- [ ] PR title: "Build: suppress -Wshadow error for GCC 12+ compatibility"
- [ ] PR body: Explain that GCC 12 promoted `-Wshadow` to error, this follows the existing `-Wno-error=tautological-compare` pattern
- [ ] Once merged upstream, drop local patch and fast-forward submodule

### 3.3 Post-upstream acceptance

```bash
cd firmware/upstream
git fetch origin
git checkout origin/master        # detach to upstream HEAD
# local patch is now in upstream — no rebase needed
cd ../..
git add firmware/upstream
git commit -m "[firmware] Fast-forward rusEFI submodule — GCC12 patch accepted upstream"
```

---

## 4. Sync Schedule

| Frequency | Action |
|-----------|--------|
| Weekly | `git fetch origin` — check for new commits |
| Per sprint | Merge upstream if behind by >10 commits |
| Before release | Sync to latest upstream tag |
| After major feature | Verify build still passes against current upstream |

---

## 5. What NOT To Do

- Do NOT modify rusEFI source files directly (only the Makefile patch is authorized)
- Do NOT commit generated files to the submodule
- Do NOT merge upstream into local without verifying the build
- Do NOT leave the submodule detached from a branch (always on `master` or a tagged release)

---

*ED-005 addressed. This document is the authoritative sync procedure.*
