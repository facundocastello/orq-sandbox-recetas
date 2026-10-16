---
description: Do a small task end-to-end in this repo — branch, implement, test, draft PR
argument-hint: <plain-language description of the task>
---

# Goal

Carry "$ARGUMENTS" from idea to a draft PR. This repo is a throwaway sandbox for orquestador
tests, so keep every change small.

# Steps

1. **Where you are.** You are already in a fresh worktree off `origin/main` (created by
   `scripts/wt/create.sh`). Create a branch: `git switch -c <short-kebab-name>`.
2. **Plan in two lines.** Say what you will change and how you will check it. If the request is
   ambiguous, ask one question with `AskUserQuestion` (2–4 options) instead of guessing.
3. **Implement.** Frontend in `src/`, API in `server/`, pure logic in `src/recipes.ts`.
4. **Verify.** Run `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e`. Add or update a
   test for the behavior you changed.
5. **Commit and push**, then open a **draft** PR with `gh pr create --draft`. Body: what changed
   and "How to test (step by step)".
6. **Wait for CI** without burning tokens: `orq wait --pr <N> --for ci` if available, otherwise
   `gh pr checks <N> --watch`. If CI is red, read the log, fix, push again.
7. Report the PR URL and the CI result in one short message.

# Rules

- Never run anything against `sandbox-prod` (the fake production) unless the task says so.
  Reads use `scripts/sandbox-prod "sqlite3 /data/prod.db" < query.sql`.
- Do not merge. Do not touch `main` directly.
