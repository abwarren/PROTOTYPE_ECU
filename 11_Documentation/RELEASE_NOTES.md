# Release Notes

> **Policy:** Release notes are updated with every tagged release.
> See `CHANGELOG.md` for the full change log.
> See `PROJECT_STATUS.md` for current project status.

---

## [Unreleased]

### Version
- **Product:** ${PRODUCT_NAME} (from `branding/brand.json`)
- **Version:** ${PRODUCT_VERSION}
- **Build:** ${BUILD_DATE} / ${BUILD_HASH}

### Summary

Phase 1 foundation complete. Repository structured, rusEFI fork cloned, architecture documented, branding abstraction in place.

### What's New

- White-label platform architecture
- Brand abstraction layer (single brand.json)
- rusEFI firmware fork (commit `8540e441`)
- Complete architecture documentation (9 documents)
- Architecture audit of 16 firmware modules
- 4 Architecture Decision Records
- Documentation-Driven Development policy adopted

### Known Issues

See `TECH_DEBT.md` for full technical debt log.

### Upgrade Notes

N/A — initial release.

### Downloads

- Firmware binary: `firmware/build/<product_short_name>-<version>.bin`
- Studio installer: `studio/dist/<product_name>-<version>.exe` (future)
