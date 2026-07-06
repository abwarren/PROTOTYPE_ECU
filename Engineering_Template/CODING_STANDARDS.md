# CODING_STANDARDS.md — Coding Standards

> **Purpose:** Consistent code quality across the project.
> See `CONTRIBUTING.md` for the DDD policy and PR process.

---

## 1. Documentation-Driven Development (DDD)

- All work is incomplete until documented
- Run `bash scripts/ddd-check.sh --ci` before marking any task complete
- Update `CHANGELOG.md` with every significant change
- Architecture changes require an ADR before implementation

## 2. General Principles

- **Readability over cleverness:** Code is written once, read many times
- **Consistency over preference:** Follow existing patterns in the codebase
- **Explicitness over implicitness:** Be clear about intent
- **Minimal dependencies:** Every dependency is a liability — evaluate carefully before adding
- **Test the public interface:** Test behavior, not implementation details

## 3. Language-Specific Standards

### General Guidelines
- Use strict/type-safe modes for all languages that support them
- Prefer interfaces/contracts over concrete implementations for public APIs
- Use meaningful names — avoid abbreviations except for well-known terms
- Keep functions small and focused on a single responsibility
- Document all public APIs with standard doc comments

### TypeScript / JavaScript
- TypeScript strict mode enabled
- Prefer interfaces over types for object shapes
- Use functional components with hooks (React)
- Use async/await over raw promises
- Use `const` over `let` where possible

### Python
- Follow PEP 8 style guide
- Use type hints for all public functions
- Use virtual environments for dependency isolation
- Prefer `pathlib` over `os.path`

### Rust
- Use `clippy` as linter — all warnings addressed
- Document all public APIs with doc comments
- Prefer `Result` over panics for error handling
- Use workspace crates for multi-crate projects

### C / C++
- Follow project coding conventions
- All warnings treated as errors (`-Werror`)
- Use `-Wno-error=` flags sparingly, with a comment explaining why
- Prefer `constexpr` over `#define` for constants
- Document all public APIs with Doxygen-style comments

### Go
- Run `gofmt` before every commit
- Follow standard Go project layout conventions
- Use interfaces for abstraction

## 4. Git Standards

- Descriptive commit messages with area prefix: `[core]`, `[docs]`, `[build]`, `[feat]`, `[fix]`
- No commits to `main` directly — use feature branches (see `PROJECT_RULES.md`)
- Squash commits before merging to `main`
- Keep commits focused on a single change

## 5. Documentation Standards

- All documentation in Markdown
- Use relative paths for internal links
- Tables for structured data
- Code blocks with language tags for examples
- One concept per document
- Include diagrams where they aid understanding (Mermaid preferred)

## 6. Review Requirements

| Change Type | Review Required |
|-------------|----------------|
| Architecture decision | ADR + QA Agent review |
| Public API change | Team member review |
| Core module change | QA Agent review |
| Documentation change | QA Agent review |
| Build/CI change | Peer review |
| Configuration change | Peer review |
