# TB-CI-001 — Windows Build Pipeline

> **Status:** ⬚ NEXT — C0 Designed (advancing to C1)
> **Prerequisite:** TB-005A (USB Transport Implementation)
> **Category:** CI/CD Infrastructure
> **Policy:** Every commit produces a shippable Windows installer.

---

## Objective

Produce `7100CPT-Studio-<version>-Setup.exe` automatically on every push
via GitHub Actions. Eliminate the dependency on a developer machine for
building Windows binaries.

---

## Scope

### Deliverables

- [ ] `.github/workflows/windows-build.yml` — GitHub Actions workflow
- [ ] Windows runner (`windows-latest`)
- [ ] Tauri 2 build with NSIS bundler produces .exe installer
- [ ] Artifact uploaded and downloadable from Actions tab
- [ ] Version embedded from `tauri.conf.json`
- [ ] Smoke test: binary exists, non-zero size
- [ ] Build status badge in README.md

### Pipeline Stages

```
Git Push
    │
    ▼
Checkout + Setup (Node 20, Rust stable, Tauri CLI)
    │
    ▼
npm ci (install frontend deps)
    │
    ▼
npx tsc --noEmit (TypeScript check)
    │
    ▼
npm run build (Vite frontend bundle)
    │
    ▼
npx tauri build --bundles nsis (Windows .exe + .msi)
    │
    ▼
Upload artifact (7100CPT-Studio-x.y.z-Setup.exe)
    │
    ▼
Smoke test (verify binary exists)
    │
    ▼
Build summary
```

---

## Demo Gate (MANDATORY)

- [ ] GitHub Actions workflow runs on push
- [ ] Windows build succeeds (green checkmark)
- [ ] `7100CPT-Studio-0.1.0-Setup.exe` produced
- [ ] Installer downloadable from Actions artifacts
- [ ] Installer installs and launches on Windows 10/11

---

## QA Checklist

| Gate | Criteria |
|------|----------|
| Workflow triggers | Runs on push to master + manual dispatch |
| Build time | < 10 minutes |
| Artifact uploaded | .exe > 1 MB |
| TypeScript | 0 errors |
| Smoke test | Binary found, non-zero |
| Status badge | In README.md |

---

## Completion Criteria (7 Artifacts)

- [ ] 1: Working pipeline — workflow file committed, runs on push
- [ ] 2: Automated test — smoke test step in workflow
- [ ] 3: Documentation — TB-CI-001 README updated with results
- [ ] 4: Capability Matrix — CAPABILITY_MATRIX.md #C1 advanced to C3
- [ ] 5: QA evidence — green workflow run, download link
- [ ] 6: Session handoff — SESSION_HANDOFF.md generated
- [ ] 7: GitHub commit — committed, pushed, verified

---

## Why This Before TB-005B

CI multiplies every future tracer bullet. Once CI produces an installer:

- TB-005B (USB Transport Demo): QA installs and runs immediately
- TB-006 (ECU Discovery): verified on Windows, not a dev machine
- TB-007+ (all subsequent): same installer, just newer version

Without CI, every demo requires a developer with a working Tauri build
environment. With CI, anyone can download and run.
