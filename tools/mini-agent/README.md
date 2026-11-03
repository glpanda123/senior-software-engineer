# mini-agent

A small coding agent built on the Claude Agent SDK. It runs the same engine as Claude Code, but bills to Console API credits (the "Agent SDK" scope).

## Run

```bash
cd tools/mini-agent && npm install
export ANTHROPIC_API_KEY=sk-ant-...
cd /path/to/repo-you-want-to-work-on
npx --prefix /path/to/tools/mini-agent tsx /path/to/tools/mini-agent/agent.ts
```

Commands: `/model haiku|sonnet|opus`, `/effort low|medium|high|xhigh|max`, `/mode auto|acceptEdits|default|plan`, `/cost`, `/new` (fresh conversation), `/exit`.

Env: `AGENT_MODEL` (default `opus`), `AGENT_EFFORT` (default `high`), `AGENT_MODE` (default `auto`), `AGENT_LIMIT_USD` (optional cap on total spend across all runs; no cap if unset).

Total spend is saved in `.spend.json` (gitignored). Delete it to reset. The numbers are the SDK's estimate; Console Billing is the source of truth. For a hard cap, also set a spend limit in Console → Settings → Limits.

## Permissions

In `auto` mode (default) a classifier model approves or denies each tool call and asks you only when it can't decide. It adds a small cost per tool call. If auto mode is unavailable, the agent prints the mode it actually runs in.

In `acceptEdits` mode:

- Read / Glob / Grep: run without asking.
- Edit / Write: auto-approved (`acceptEdits`). Review with `git diff`.
- Bash and everything else: asks `[y/N]` first.
