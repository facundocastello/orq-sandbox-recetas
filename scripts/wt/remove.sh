#!/usr/bin/env bash
# Remove a worktree. Refuses a dirty worktree unless --force; refuses the one you stand in.
# Same contract as vetvet's scripts/wt/remove.sh.
#
# Usage: scripts/wt/remove.sh <worktree-path> [--force]
set -euo pipefail

WT_PATH="${1:?usage: scripts/wt/remove.sh <worktree-path> [--force]}"
FORCE="${2:-}"

[[ -d "$WT_PATH" ]] || exit 0

PRIMARY_GIT_DIR="$(git -C "$WT_PATH" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)"
if [[ -z "$PRIMARY_GIT_DIR" ]]; then
  echo "[wt] not a git worktree: $WT_PATH" >&2
  exit 1
fi
PRIMARY_ROOT="$(cd "$(dirname "$PRIMARY_GIT_DIR")" && pwd)"
WT_ABS="$(cd "$WT_PATH" && pwd)"

if [[ "$WT_ABS" == "$PRIMARY_ROOT" ]]; then
  echo "[wt] refusing to remove the primary checkout: $WT_ABS" >&2
  exit 1
fi

PWD_ABS="$(pwd -P)"
if [[ "$PWD_ABS" == "$WT_ABS" || "$PWD_ABS" == "$WT_ABS"/* ]]; then
  echo "[wt] refusing to remove the worktree you are standing in: $WT_ABS" >&2
  echo "[wt]   cd $PRIMARY_ROOT && scripts/wt/remove.sh $WT_ABS ${FORCE}" >&2
  exit 1
fi

if [[ "$FORCE" != "--force" ]]; then
  DIRTY="$(git -C "$WT_ABS" status --porcelain 2>/dev/null || true)"
  if [[ -n "$DIRTY" ]]; then
    echo "[wt] refusing to remove dirty worktree: $WT_ABS" >&2
    echo "$DIRTY" >&2
    echo "[wt] pass --force to remove anyway" >&2
    exit 1
  fi
  git -C "$PRIMARY_ROOT" worktree remove "$WT_ABS" >&2
else
  git -C "$PRIMARY_ROOT" worktree remove --force "$WT_ABS" >&2
fi

git -C "$PRIMARY_ROOT" worktree prune >&2 || true
