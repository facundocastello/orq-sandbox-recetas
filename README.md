# orq-sandbox-recetas

A toy recipe list app. It exists only as a safe, throwaway target for
[orquestador](https://github.com/facundocastello/orquestador) end-to-end tests: Claude sessions
spawned from Telegram work on this repo, open PRs, break and fix CI, and run "prod" commands
against a fake production container.

## Run it

```sh
pnpm install
pnpm dev            # API on :3001, web on :5173
pnpm test           # Vitest
pnpm test:e2e       # Playwright (own ports 3101/5273)
```

## Fake production

```sh
pnpm prod:up                                                     # docker container + SQLite
scripts/sandbox-prod "sqlite3 /data/prod.db 'select count(*) from recipes'"  # read
echo "select * from recipes;" | scripts/sandbox-prod "sqlite3 /data/prod.db" # ssh-style stdin
pnpm prod:down                                                   # throw it away (resets data)
```

`scripts/sandbox-prod` behaves like `ssh <host> "<cmd>"`: arguments become one remote command and
stdin is forwarded. Put it on `PATH` as `sandbox-prod` so commands read like a real ssh call; list
`sandbox-prod` in orquestador's `prodHosts` so its `!` commands get the prod risk tier.

## Orquestador / Cockpit contract

- `.cockpit.json` — repo name, base ref, worktree scripts, workflow.
- `scripts/wt/create.sh <name> [baseRef]` — fetches, creates a worktree, installs, prints its path.
- `scripts/wt/remove.sh <path> [--force]` — refuses dirty worktrees without `--force`.
- `.claude/commands/work-on.md` — the short `/work-on` workflow sessions follow.

Deliberately missing features (orquestador scenarios ask sessions to add them): search by
ingredient, dark mode.
