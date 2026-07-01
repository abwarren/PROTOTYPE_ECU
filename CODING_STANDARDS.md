# CODING_STANDARDS.md — Coding Standards

> **Purpose:** Consistent code quality across the platform.
> See `11_Documentation/CONTRIBUTING.md` for the DDD policy and PR process.

---

## 1. Documentation-Driven Development (DDD)

- All work is incomplete until documented
- Run `bash scripts/ddd-check.sh --ci` before marking any task complete
- Update `CHANGELOG.md` with every significant change
- Architecture changes require an ADR before implementation

## 2. Language-Specific Standards

### Firmware (C/C++)
- Follow rusEFI coding conventions for upstream-compatible code
- Platform-specific code: use `firmware/platform/` directory
- All warnings treated as errors (`-Werror`)
- Use `-Wno-error=` flags sparingly, with a comment explaining why
- Prefer `constexpr` over `#define` for constants
- Document all public APIs with Doxygen-style comments

### Studio (TypeScript/React)
- TypeScript strict mode enabled
- Prefer interfaces over types for object shapes
- Use functional components with hooks
- Follow the existing component structure in `studio/`

## 3. Git Standards

- Descriptive commit messages with area prefix: `[firmware]`, `[docs]`, `[build]`
- No commits to `main` directly — use feature branches (see `PROJECT_RULES.md`)
- Squash commits before merging to `main`
- Keep commits focused on a single change

## 4. Documentation Standards

- All documentation in Markdown
- Use relative paths for internal links
- Tables for structured data
- Code blocks with language tags for examples
- One concept per document

## 5. Review Requirements

| Change Type | Review Required |
|-------------|----------------|
| Architecture decision | ADR + QA Agent review |
| Firmware module change | Agent 3 + Agent 0 review |
| Documentation change | Agent 10 review |
| Build/CI change | Agent 0 review |
| Configuration change | Agent 10 review |
