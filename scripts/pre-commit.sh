#!/usr/bin/env bash
# pre-commit.sh — Local pre-commit checks mirroring CI workflows.
#
# Runs the same checks as the GitHub Actions pipelines:
#   - Type check (tsc --noEmit)
#   - ESLint
#   - Build (esbuild)
#   - Security audit (npm audit)
#
# Usage:
#   bash scripts/pre-commit.sh          # run all checks
#   bash scripts/pre-commit.sh --quick  # skip slow checks (npm audit)
#
# To install as a git pre-commit hook:
#   ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit

# ── Resolve repo root ────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

# ── Colours (disabled when stdout is not a terminal) ──────────────────
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BOLD='\033[1m'
    RESET='\033[0m'
else
    RED='' GREEN='' YELLOW='' BOLD='' RESET=''
fi

# ── Parse arguments ──────────────────────────────────────────────────
QUICK=0
for arg in "$@"; do
    case "$arg" in
        --quick) QUICK=1 ;;
        *)
            echo "Unknown option: $arg"
            echo "Usage: $0 [--quick]"
            exit 1
            ;;
    esac
done

passed=0
failed=0
skipped=0

run_step() {
  local name="$1"
  shift
  printf "  %-20s" "$name"
  if "$@" &> /dev/null; then
    echo -e "${GREEN}OK${RESET}"
    ((passed++))
  else
    echo -e "${RED}FAIL${RESET}"
    ((failed++))
  fi
}

skip_step() {
  printf "  %-20s" "$1"
  echo -e "${YELLOW}SKIP${RESET} ($2)"
  ((skipped++))
}

echo -e "${BOLD}Running CI checks...${RESET}"
echo ""

run_step "Type Check" npx tsc --noEmit
run_step "Lint" npm run --silent lint
run_step "Test" npm run --silent test:run
run_step "Build" npm run --silent build

# ── Security audit ───────────────────────────────────────────────────
if [ "$QUICK" -eq 1 ]; then
    skip_step "Security Audit" "--quick mode"
else
    run_step "Security Audit" npm audit --omit=dev
fi

echo ""
if [ "$failed" -eq 0 ]; then
    echo -e "${GREEN}${BOLD}Results: $passed passed, $failed failed${RESET}"
else
    echo -e "${RED}${BOLD}Results: $passed passed, $failed failed${RESET}"
fi

if [ "$failed" -gt 0 ]; then
  exit 1
fi
