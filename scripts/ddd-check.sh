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
        MISSING_DOCS="$MISSING_DOCS  - $label ($path)\n"
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
        MISSING_DOCS="$MISSING_DOCS  - $label (no .md files in $dir/)\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} $label"
        fi
        return 1
    fi
}

check_recent_daily_log() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    local log_dir="$PROJECT_ROOT/docs/history"
    local latest

    if [[ ! -d "$log_dir" ]]; then
        FAILED=$((FAILED + 1))
        MISSING_DOCS="$MISSING_DOCS  - Daily engineering log (docs/history/ directory missing)\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} Daily engineering log (directory missing)"
        fi
        return 1
    fi

    latest=$(ls -t "$log_dir"/*.md 2>/dev/null | head -1)
    if [[ -z "$latest" ]]; then
        FAILED=$((FAILED + 1))
        MISSING_DOCS="$MISSING_DOCS  - Daily engineering log (no .md files in docs/history/)\n"
        if [[ "$MODE" != "ci" ]]; then
            echo -e "  ${RED}❌${NC} Daily engineering log (no files found)"
        fi
        return 1
    fi

    # Check the most recent log is within 14 days
    local log_date
    log_date=$(basename "$latest" .md)
    local current_date
    current_date=$(date +%Y-%m-%d)
    local diff_days=0

    if [[ "$(uname)" == "Darwin" ]]; then
        # macOS date
        local log_epoch current_epoch
        log_epoch=$(date -j -f "%Y-%m-%d" "$log_date" "+%s" 2>/dev/null || echo 0)
        current_epoch=$(date "+%s")
        if [[ "$log_epoch" -gt 0 ]]; then
            diff_days=$(( (current_epoch - log_epoch) / 86400 ))
        fi
    else
        # Linux date
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
        echo -e "\n${BOLD}${CYAN}📋 $1${NC}"
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
    echo "  README.md, ARCHITECTURE.md, ROADMAP.md, BUILD.md"
    echo "  CHANGELOG.md, CONTRIBUTING.md, DECISIONS.md"
    echo "  LICENSE_NOTES.md, PROJECT_STATUS.md, TECH_DEBT.md"
    echo "  docs/BASELINE.md, docs/RELEASE_NOTES.md"
    echo ""
    echo "Engineering:"
    echo "  docs/README.md (master index)"
    echo "  docs/history/ (daily engineering logs)"
    echo "  ADR/ (architecture decision records)"
    echo "  docs/firmware/ (module docs)"
    echo "  docs/studio/ (studio module docs)"
    echo "  docs/hardware/ (hardware module docs)"
    echo "  docs/diagrams/ (architecture diagrams)"
    echo "  docs/onboarding/ (new engineer guide)"
    echo ""
    echo "Management:"
    echo "  docs/management/Executive_Dashboard.md"
    echo "  docs/management/KPIs.md"
    echo "  docs/management/Risk_Register.md"
    echo "  docs/management/Current_Sprint.md"
    echo "  docs/management/Deliverables.md"
    echo ""
    echo "Investor:"
    echo "  docs/investor/Executive_Summary.md"
    local investor_count
    investor_count=$(find docs/investor -maxdepth 1 -name '*.md' 2>/dev/null | wc -l)
    echo "  docs/investor/ ($investor_count documents)"
    echo ""
    echo "Workshop:"
    echo "  docs/workshop/Installation_Guide.md"
    echo "  docs/workshop/Tuning_Guide.md"
    echo "  docs/workshop/Technician_Checklist.md"
    echo ""
    echo "Build Infrastructure:"
    echo "  .github/PULL_REQUEST_TEMPLATE.md"
    echo "  branding/brand.json"
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

# Check for config error
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
check_file "ARCHITECTURE.md" "ARCHITECTURE.md — System architecture"
check_file "ROADMAP.md" "ROADMAP.md — Development roadmap"
check_file "BUILD.md" "BUILD.md — Build instructions"
check_file "CHANGELOG.md" "CHANGELOG.md — Change log"
check_file "CONTRIBUTING.md" "CONTRIBUTING.md — DDD policy & standards"
check_file "DECISIONS.md" "DECISIONS.md — Decision index"
check_file "LICENSE_NOTES.md" "LICENSE_NOTES.md — License information"
check_file "PROJECT_STATUS.md" "PROJECT_STATUS.md — Status tracking"
check_file "TECH_DEBT.md" "TECH_DEBT.md — Technical debt"
check_file "docs/BASELINE.md" "BASELINE.md — DDD baseline"
check_file "docs/RELEASE_NOTES.md" "RELEASE_NOTES.md — Release notes"

# =============================================================================
# Engineering Documentation
# =============================================================================
section "Engineering Documentation"

check_file "docs/README.md" "docs/README.md — Knowledge base master index"
check_recent_daily_log
check_dir_has_files "ADR" "ADR/ — Architecture Decision Records"
check_dir_has_files "docs/firmware" "docs/firmware/ — Module documentation"
check_dir_has_files "docs/studio" "docs/studio/ — Studio module docs"
check_dir_has_files "docs/hardware" "docs/hardware/ — Hardware module docs"
check_file "docs/onboarding/new-engineer-guide.md" "docs/onboarding/new-engineer-guide.md"

# Check diagrams if they've been created (informational)
if [[ -d "$PROJECT_ROOT/docs/diagrams" ]]; then
    check_dir_has_files "docs/diagrams" "docs/diagrams/ — Architecture diagrams"
fi

# =============================================================================
# Management Documentation
# =============================================================================
section "Management Documentation"

check_file "docs/management/Executive_Dashboard.md" "Executive Dashboard"
check_file "docs/management/KPIs.md" "KPIs"
check_file "docs/management/Risk_Register.md" "Risk Register"
check_file "docs/management/Current_Sprint.md" "Current Sprint"
check_file "docs/management/Deliverables.md" "Deliverables"
check_file "docs/management/Company_Roadmap.md" "Company Roadmap"
check_file "docs/management/Budget.md" "Budget"
check_file "docs/management/Dependencies.md" "Dependencies"

# =============================================================================
# Investor Documentation
# =============================================================================
section "Investor Documentation"

check_file "docs/investor/Executive_Summary.md" "Executive Summary"
check_dir_has_files "docs/investor" "docs/investor/ — Investor docs (should have 17)"

# =============================================================================
# Workshop Documentation
# =============================================================================
section "Workshop Documentation"

check_file "docs/workshop/Installation_Guide.md" "Installation Guide"
check_file "docs/workshop/Tuning_Guide.md" "Tuning Guide"
check_file "docs/workshop/Firmware_Flash_Guide.md" "Firmware Flash Guide"
check_file "docs/workshop/Technician_Checklist.md" "Technician Checklist"
check_file "docs/workshop/Customer_Workflow.md" "Customer Workflow"
check_file "docs/workshop/Vehicle_Support_Matrix.md" "Vehicle Support Matrix"

# =============================================================================
# Build Infrastructure
# =============================================================================
section "Build Infrastructure"

check_file ".github/PULL_REQUEST_TEMPLATE.md" "PR template with DDD checklist"
check_file "branding/brand.json" "brand.json — Brand configuration"

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
