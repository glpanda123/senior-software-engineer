# mini-agent

A small coding agent built on the Claude Agent SDK. It runs the same engine as Claude Code, but bills to Console API credits (the "Agent SDK" scope).

## Run

```bash
cd tools/mini-agent && npm install
export ANTHROPIC_API_KEY=sk-ant-...
cd /path/to/repo-you-want-to-work-on
npx --prefix /path/to/tools/mini-agent tsx /path/to/tools/mini-agent/agent.ts
```

Commands: `/model haiku|sonnet|opus`, `/mode acceptEdits|auto|default|plan`, `/new` (fresh conversation), `/exit`.

Env: `AGENT_MODEL` (default `sonnet`), `AGENT_MODE` (default `acceptEdits`), `AGENT_BUDGET_USD` (max spend per prompt, default `2`).

## Permissions

In `auto` mode a classifier model approves or denies each tool call and asks you only when it can't decide. It adds a small cost per tool call. If auto mode is unavailable, the agent prints the mode it actually runs in.

In `acceptEdits` mode (default):

- Read / Glob / Grep: run without asking.
- Edit / Write: auto-approved (`acceptEdits`). Review with `git diff`.
- Bash and everything else: asks `[y/N]` first.
