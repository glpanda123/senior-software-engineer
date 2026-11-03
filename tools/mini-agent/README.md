# mini-agent

A small coding agent built on the Claude Agent SDK. It runs the same engine as Claude Code, but bills to Console API credits (the "Agent SDK" scope).

## Run

```bash
cd tools/mini-agent && npm install
export ANTHROPIC_API_KEY=sk-ant-...
cd /path/to/repo-you-want-to-work-on
npx --prefix /path/to/tools/mini-agent tsx /path/to/tools/mini-agent/agent.ts
```

Commands: `/model haiku|sonnet|opus`, `/new` (fresh conversation), `/exit`.

Env: `AGENT_MODEL` (default `sonnet`), `AGENT_BUDGET_USD` (max spend per prompt, default `2`).

## Permissions

- Read / Glob / Grep: run without asking.
- Edit / Write: auto-approved (`acceptEdits`). Review with `git diff`.
- Bash and everything else: asks `[y/N]` first.
