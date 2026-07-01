# ADR-0006: Multi-Agent R&D System

## Status

Accepted

## Context

The project needs a structured way to organize parallel work across hardware, firmware, software, manufacturing, testing, compliance, market research, and documentation. Without defined agent roles, file ownership, and workflows, work is uncoordinated — multiple agents may modify the same files, duplicate research, or skip documentation.

Research shows that structured multi-agent systems with clear role definitions, file locking, and quality gates produce higher quality outcomes than unstructured collaboration.

## Decision

Adopt a multi-agent R&D system with:

1. **11 specialized agents** with defined roles and directory ownership
2. **Agent locking** — each agent owns specific directories; only Agent 0 (QA) has universal write access
3. **Branch strategy** — each agent works on a feature branch; QA reviews and merges to `main`
4. **Standardized workflow** — 9-step START→END process for every agent
5. **Quality gate** — 10-point checklist with 90/100 minimum score
6. **Session startup protocol** — pull, read shared files, check recent commits, continue assigned work
7. **Shared project files** — 9 files every agent reads before starting work

## Consequences

### Positive
- Clear role boundaries prevent duplicate work
- Agent locking prevents file collisions
- Quality gate ensures minimum standard before acceptance
- Standardized workflow means any agent can pick up where another left off
- Session startup protocol ensures all agents are synchronized

### Negative
- Rigid agent locking can slow down cross-cutting changes
- Requires discipline to follow the workflow every session
- 11 agents is a large team to coordinate

### Neutral
- The QA Agent (0) and Project Manager (11) are coordination roles, not implementers
- The system is documented in `PROJECT_RULES.md` and `11_Documentation/engineering/agent-system.md`
