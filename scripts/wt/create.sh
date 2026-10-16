#!/usr/bin/env bash
# Create a git worktree off a fresh base ref, install deps, and print the absolute worktree
# path on stdout (and nothing else) — same contract as vetvet's scripts/wt/create.sh.
#
# Usage: scripts/wt/create.sh <name> [base-ref]     (base-ref defaults to origin/main)
set -euo pipefail

NAME="${1:?usage: scripts/wt/create.sh <name> [base-ref]}"
BASE_REF="${2:-origin/main}"

PRIMARY_GIT_DIR="$(git rev-parse --path-format=absolute --git-common-dir)"
PRIMARY_ROOT="$(cd "$(dirname "$PRIMARY_GIT_DIR")" && pwd)"
REPO_NAME="$(basename "$PRIMARY_ROOT")"
WT_ROOT="${WORKTREE_ROOT:-$HOME/dev/worktrees/$REPO_NAME}"
mkdir -p "$WT_ROOT"
WT_ROOT_ABS="$(cd "$WT_ROOT" && pwd)"

# Keep only safe identifier chars and strip leading dots/dashes so the name cannot escape WT_ROOT.
SAFE_NAME="$(printf '%s' "$NAME" | tr -cs 'A-Za-z0-9._-' '-' | sed 's:^[.-]*::; s:-*$::')"
if [[ -z "$SAFE_NAME" || "$SAFE_NAME" == "." || "$SAFE_NAME" == ".." ]]; then
  echo "[wt] invalid worktree name: '$NAME'" >&2
  exit 1
fi
WT_PATH="$WT_ROOT_ABS/$SAFE_NAME"

if [[ -e "$WT_PATH" ]]; then
  if git -C "$PRIMARY_ROOT" worktree list --porcelain | grep -Fxq "worktree $WT_PATH"; then
    echo "[wt] reusing existing worktree: $WT_PATH" >&2
    echo "$WT_PATH"
    exit 0
  fi
  echo "[wt] $WT_PATH exists but is not a registered git worktree; refusing to reuse" >&2
  exit 1
fi

# Always start from a freshly fetched base (orquestador scenario S1 checks this).
if [[ "$BASE_REF" == origin/* ]]; then
  git -C "$PRIMARY_ROOT" fetch --quiet origin "${BASE_REF#origin/}" >&2
fi

git -C "$PRIMARY_ROOT" worktree add --detach "$WT_PATH" "$BASE_REF" >&2

cleanup_on_error() {
  local status=$?
  trap - ERR
  git -C "$PRIMARY_ROOT" worktree remove --force "$WT_PATH" 2>/dev/null || true
  git -C "$PRIMARY_ROOT" worktree prune 2>/dev/null || true
  echo "[wt] setup failed; removed $WT_PATH" >&2
  exit "$status"
}
trap cleanup_on_error ERR

(cd "$WT_PATH" && pnpm install --frozen-lockfile --prefer-offline >&2)

trap - ERR
echo "$WT_PATH"
