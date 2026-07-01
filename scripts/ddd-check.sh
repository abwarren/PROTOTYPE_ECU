#!/usr/bin/env bash
# =============================================================================
# DDD Quality Gate — Documentation-Driven Development Validation
# =============================================================================
#
# Usage:
#   ./scripts/ddd-check.sh              # Check all required documentation
#   ./scripts/ddd-check.sh --ci         # CI mode (quiet, exit code only)
#   ./scripts/ddd-check.sh --verbose    # Show all checks, pass or fail
#   ./scripts/ddd-check.sh --list       # List all documents checked
#
# Exit codes:
#   0 = All required documentation present
#   1 = One or more required documents missing
#   2 = Configuration error
# =============================================================================

set -euo pipefail

# --- Config ---
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-verbose}"  # verbose, ci, list

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Stats
TOTAL_CHECKS=0
PASSED=0
FAILED=0
MISSING_DOCS=""

# --- Helpers ---
check_file() {
    local path="$1"
    local label="${2:-$1}"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    if [[ -f "$PROJECT_ROOT/$path" ]]; then
        PASSED=$((PASSED + 1))
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${GREEN}✅${NC} $label"
        fi
        return 0
    else
        FAILED=$((FAILED + 1))
        MISSING_DOCS="$MISSING_DOCS  - $label ($path)\\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} $label"
        fi
        return 1
    fi
}

check_dir_has_files() {
    local dir="$1"
    local label="${2:-$1}"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    local count
    count=$(find "$PROJECT_ROOT/$dir" -maxdepth 1 -name '*.md' 2>/dev/null | wc -l)

    if [[ "$count" -gt 0 ]]; then
        PASSED=$((PASSED + 1))
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${GREEN}✅${NC} $label ($count files)"
        fi
        return 0
    else
        FAILED=$((FAILED + 1))
        MISSING_DOCS="$MISSING_DOCS  - $label (no .md files in $dir/)\\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} $label"
        fi
        return 1
    fi
}

check_recent_daily_log() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    local log_dir="$PROJECT_ROOT/11_Documentation/history"
    local latest

    if [[ ! -d "$log_dir" ]]; then
        FAILED=$((FAILED + 1))
        MISSING_DOCS="$MISSING_DOCS  - Daily engineering log (11_Documentation/history/ directory missing)\\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} Daily engineering log (directory missing)"
        fi
        return 1
    fi

    latest=$(ls -t "$log_dir"/*.md 2>/dev/null | head -1)
    if [[ -z "$latest" ]]; then
        FAILED=$((FAILED + 1))
        MISSING_DOCS="$MISSING_DOCS  - Daily engineering log (no .md files in 11_Documentation/history/)\\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} Daily engineering log (no files found)"
        fi
        return 1
    fi

    local log_date
    log_date=$(basename "$latest" .md)
    local current_date
    current_date=$(date +%Y-%m-%d)
    local diff_days=0

    if [[ "$(uname)" == "Darwin" ]]; then
        local log_epoch current_epoch
        log_epoch=$(date -j -f "%Y-%m-%d" "$log_date" "+%s" 2>/dev/null || echo 0)
        current_epoch=$(date "+%s")
        if [[ "$log_epoch" -gt 0 ]]; then
            diff_days=$(( (current_epoch - log_epoch) / 86400 ))
        fi
    else
        local log_epoch current_epoch
        log_epoch=$(date -d "$log_date" "+%s" 2>/dev/null || echo 0)
        current_epoch=$(date "+%s")
        if [[ "$log_epoch" -gt 0 ]]; then
            diff_days=$(( (current_epoch - log_epoch) / 86400 ))
        fi
    fi

    if [[ "$diff_days" -gt 14 ]]; then
        PASSED=$((PASSED + 1))
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${YELLOW}⚠️${NC} Daily engineering log (stale: $diff_days days old)"
        fi
        return 0
    fi

    PASSED=$((PASSED + 1))
    if [[ "$MODE" != "ci" ]]; then
        echo -e "  ${GREEN}✅${NC} Daily engineering log ($(basename "$latest"))"
    fi
    return 0
}

hr() {
    if [[ "$MODE" != "ci" ]]; then
        echo -e "  ${CYAN}────────────────────────────────────────${NC}"
    fi
}

section() {
    if [[ "$MODE" != "ci" ]]; then
        echo -e "\\n${BOLD}${CYAN}📋 $1${NC}"
        hr
    fi
}

# =============================================================================
# Main
# =============================================================================

cd "$PROJECT_ROOT"

# --- List mode ---
if [[ "$MODE" == "--list" ]]; then
    echo "DDD Quality Gate — Documents Checked"
    echo "====================================="
    echo ""
    echo "Root Documents:"
    echo "  README.md, START_HERE.md, SESSION.md"
    echo "  11_Documentation/PROJECT_STATUS.md, CHANGELOG.md, TECH_DEBT.md"
    echo "  11_Documentation/BUILD.md, CONTRIBUTING.md, LICENSE_NOTES.md"
    echo "  11_Documentation/BASELINE.md, RELEASE_NOTES.md"
    echo ""
    echo "Architecture & Decisions:"
    echo "  01_Architecture/ (10 architecture docs)"
    echo "  17_Decisions/ (4 ADRs + DECISIONS.md)"
    echo ""
    echo "Engineering:"
    echo "  04_Firmware/docs/ (module docs)"
    echo "  05_Software/docs/ (studio module docs)"
    echo "  02_Hardware/docs/ (hardware module docs)"
    echo "  11_Documentation/engineering/ (brand strings, agent system)"
    echo "  11_Documentation/history/ (daily engineering logs)"
    echo "  14_Diagrams/ (architecture diagrams)"
    echo "  11_Documentation/onboarding/ (new engineer guide)"
    echo ""
    echo "Management:"
    echo "  11_Documentation/management/ (9 docs)"
    echo ""
    echo "Investor:"
    echo "  11_Documentation/investor/ (17+ documents)"
    echo ""
    echo "Workshop:"
    echo "  11_Documentation/workshop/ (6 docs)"
    echo ""
    echo "Manufacturing:"
    echo "  07_Manufacturing/docs/ (3 docs)"
    echo ""
    echo "Build Infrastructure:"
    echo "  .github/PULL_REQUEST_TEMPLATE.md"
    echo "  branding/brand.json"
    echo "  scripts/ddd-check.sh"
    echo ""
    echo "Exit codes: 0 = pass, 1 = fail, 2 = config error"
    exit 0
fi

# --- Normal / Verbose mode ---
if [[ "$MODE" == "--ci" ]]; then
    MODE="ci"
elif [[ "$MODE" == "--verbose" || "$MODE" == "" ]]; then
    MODE="verbose"
fi

if [[ "$MODE" != "verbose" && "$MODE" != "ci" ]]; then
    echo "Usage: $0 [--verbose | --ci | --list]"
    exit 2
fi

if [[ "$MODE" == "verbose" ]]; then
    echo ""
    echo -e "${BOLD}🔍 DDD Quality Gate${NC}"
    echo -e "${BOLD}   Documentation-Driven Development Validation${NC}"
    echo ""
fi

# =============================================================================
# Root Documents
# =============================================================================
section "Root Documents"

check_file "README.md" "README.md — Project overview"
check_file "START_HERE.md" "START_HERE.md — Repository entry point"
check_file "SESSION.md" "SESSION.md — Session handoff"
check_file "CURRENT_STATE.md" "CURRENT_STATE.md — Agent shared state"
check_file "PROJECT_RULES.md" "PROJECT_RULES.md — Governance & workflows"
check_file "CODING_STANDARDS.md" "CODING_STANDARDS.md — Coding standards"
check_file "TODO.md" "TODO.md — Task priorities"

# =============================================================================
# Tracking Documents (11_Documentation/)
# =============================================================================
section "Tracking Documents"

check_file "11_Documentation/PROJECT_STATUS.md" "PROJECT_STATUS.md — Status tracking"
check_file "11_Documentation/CHANGELOG.md" "CHANGELOG.md — Change log"
check_file "11_Documentation/TECH_DEBT.md" "TECH_DEBT.md — Technical debt"
check_file "11_Documentation/BUILD.md" "BUILD.md — Build instructions"
check_file "11_Documentation/CONTRIBUTING.md" "CONTRIBUTING.md — DDD policy & standards"
check_file "11_Documentation/LICENSE_NOTES.md" "LICENSE_NOTES.md — License information"
check_file "11_Documentation/BASELINE.md" "BASELINE.md — DDD baseline"
check_file "11_Documentation/RELEASE_NOTES.md" "RELEASE_NOTES.md — Release notes"

# =============================================================================
# Architecture & Decisions
# =============================================================================
section "Architecture & Decisions"

check_dir_has_files "01_Architecture" "01_Architecture/ — System architecture docs"
check_dir_has_files "17_Decisions" "17_Decisions/ — Architecture Decision Records"

# =============================================================================
# Engineering Documentation
# =============================================================================
section "Engineering Documentation"

check_recent_daily_log
check_dir_has_files "04_Firmware/docs" "04_Firmware/docs/ — Firmware module docs"
check_dir_has_files "05_Software/docs" "05_Software/docs/ — Studio module docs"
check_dir_has_files "02_Hardware/docs" "02_Hardware/docs/ — Hardware module docs"
check_dir_has_files "11_Documentation/engineering" "11_Documentation/engineering/ — Engineering guides"
check_file "11_Documentation/onboarding/new-engineer-guide.md" "11_Documentation/onboarding/ — New engineer guide"

# Check diagrams if they exist
if [[ -d "$PROJECT_ROOT/14_Diagrams" ]]; then
    check_dir_has_files "14_Diagrams" "14_Diagrams/ — Architecture diagrams"
fi

# =============================================================================
# Management Documentation
# =============================================================================
section "Management Documentation"

check_dir_has_files "11_Documentation/management" "11_Documentation/management/ — Management docs"

# =============================================================================
# Investor Documentation
# =============================================================================
section "Investor Documentation"

check_file "11_Documentation/investor/Executive_Summary.md" "11_Documentation/investor/Executive_Summary.md"
check_dir_has_files "11_Documentation/investor" "11_Documentation/investor/ — Investor documentation"

# =============================================================================
# Workshop Documentation
# =============================================================================
section "Workshop Documentation"

check_dir_has_files "11_Documentation/workshop" "11_Documentation/workshop/ — Workshop guides"

# =============================================================================
# Manufacturing Documentation
# =============================================================================
section "Manufacturing Documentation"

check_dir_has_files "07_Manufacturing/docs" "07_Manufacturing/docs/ — Manufacturing guides"

# =============================================================================
# Build Infrastructure
# =============================================================================
section "Build Infrastructure"

check_file ".github/PULL_REQUEST_TEMPLATE.md" "PR template with DDD checklist"
check_file "branding/brand.json" "brand.json — Brand configuration"
check_file "scripts/ddd-check.sh" "scripts/ddd-check.sh — DDD quality gate"
check_file "scripts/build-firmware.sh" "scripts/build-firmware.sh — Build automation"

# =============================================================================
# Results
# =============================================================================
section "Results"

if [[ "$MODE" == "verbose" ]]; then
    echo ""
    echo -e "  ${BOLD}Total checks:${NC}  $TOTAL_CHECKS"
    echo -e "  ${GREEN}Passed:${NC}       $PASSED"
    if [[ "$FAILED" -gt 0 ]]; then
        echo -e "  ${RED}Failed:${NC}       $FAILED"
        echo ""
        echo -e "  ${BOLD}${RED}Missing Documents:${NC}"
        echo -e "$MISSING_DOCS"
        echo ""
        echo -e "  ${YELLOW}⚠️  DDD Quality Gate: ${RED}FAILED${NC}"
        echo -e "  ${YELLOW}   Complete the missing documentation before marking tasks done.${NC}"
    else
        echo -e "  ${GREEN}Failed:${NC}       $FAILED"
        echo ""
        echo -e "  ${GREEN}✅ DDD Quality Gate: PASSED${NC}"
        echo -e "  ${GREEN}   All required documentation is present.${NC}"
    fi
    echo ""
fi

if [[ "$FAILED" -gt 0 ]]; then
    exit 1
fi
exit 0
