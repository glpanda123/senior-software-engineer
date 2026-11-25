# CCAF study (Claude Certified Architect – Foundations, CCAR-F)

Exam: **Sat 12/12/2026**. 60 items (single- and multiple-response), 120 minutes, 4 scenarios drawn from a bank of 6, pass at 720 on a 100–1,000 scale. Source: the official Exam Guide v1.1 (Nov 2026), downloaded from the Partner Academy (not committed; keep the PDF locally).

## Domains

| # | Domain | Weight | Task statements |
| --- | --- | --- | --- |
| 1 | Agentic Architecture & Orchestration | 27% | 1.1 agentic loop · 1.2 coordinator–subagent · 1.3 subagent invocation and context passing · 1.4 enforcement and handoff · 1.5 Agent SDK hooks · 1.6 task decomposition · 1.7 sessions: resume and fork |
| 2 | Tool Design & MCP Integration | 18% | 2.1 tool descriptions and boundaries · 2.2 structured MCP errors · 2.3 tool distribution and tool_choice · 2.4 MCP in Claude Code and agents · 2.5 built-in tools |
| 3 | Claude Code Configuration & Workflows | 20% | 3.1 CLAUDE.md hierarchy · 3.2 slash commands and skills · 3.3 path-specific rules · 3.4 plan mode vs direct · 3.5 iterative refinement · 3.6 CI/CD |
| 4 | Prompt Engineering & Structured Output | 20% | 4.1 explicit criteria · 4.2 few-shot · 4.3 tool_use + JSON schema · 4.4 validation and retry · 4.5 batch processing · 4.6 multi-pass review |
| 5 | Context Management & Reliability | 15% | 5.1 long conversations · 5.2 escalation and ambiguity · 5.3 error propagation · 5.4 large codebases · 5.5 human review and confidence · 5.6 provenance and uncertainty |

## Scenarios (4 of these 6 appear)

1. Customer support resolution agent (Agent SDK + MCP tools, escalation) — D1, D2, D5
2. Code generation with Claude Code (slash commands, CLAUDE.md, plan mode) — D3, D5
3. Multi-agent research system (coordinator + subagents, cited reports) — D1, D2, D5
4. Developer productivity with the Agent SDK (built-in tools, MCP) — D2, D3, D1
5. Claude Code in CI/CD (reviews, tests, PR feedback, few false positives) — D3, D4
6. Structured data extraction (JSON schema, validation, edge cases) — D4, D5

## How the sample questions think

The right answer is usually the **proportionate fix for the root cause**:

- A rule that must always hold (identity before refund, refund limit) → **code** (hook, prerequisite gate), not more prompt. Prompts are probabilistic.
- The model picks the wrong tool → **better tool descriptions** first, not a router or a merged tool.
- Unclear decision boundaries → **explicit criteria + few-shot examples** first, before classifiers or new infrastructure.
- Self-reported confidence from the model is poorly calibrated; don't route on it alone.
- Watch for "first step" and "most effective": the cheapest change that fixes the actual cause wins.

## Schedule

Weekday ~2 h, weekend ~4 h. Each session: concepts (from what I know, with TaskFlow examples) → 8–10 scenario questions → review the misses → log them in `practice-log.md`.

| Day | Session |
| --- | --- |
| Tue 24/11 | D1 part 1: 1.1–1.4 (agentic loop, coordinator–subagent, Task tool, enforcement) |
| Wed 25/11 | D1 part 2: 1.5–1.7 (hooks, decomposition, sessions) |
| Thu 26/11 | D2: tools and MCP (2.1–2.5) |
| Fri 27/11 | D3: Claude Code configuration (3.1–3.6) |
| Sat 28/11 (4 h) | D4: prompts and structured output (4.1–4.6) + D5: context and reliability (5.1–5.6) |
| Sun 29/11 (4 h) | **Mock 1** (60 items, 120 min) + review |
| Mon 30/11 – Fri 04/12 | Weak task statements from mock 1; hands-on: guide exercise 1 (agent with Agent SDK, hook, escalation) and exercise 2 (Claude Code config, reuses the TaskFlow MCP branch) |
| Sat 05/12 (4 h) | **Mock 2** + review |
| Sun 06/12 | Weak areas |
| Mon 07/12 – Tue 08/12 | Light review of the log |
| Wed 09/12 | **Mock 3** |
| Thu 10/12 | Review mock 3 misses only |
| Fri 11/12 | Rest |
| **Sat 12/12** | **Exam** |

Mocks are written by Claude against the blueprint weights (not real exam items). If the Partner Academy offers the official practice test, it replaces mock 1 or 2.

## Progress

| Task statement | Studied | Questions right |
| --- | --- | --- |
| D1 1.1–1.4 | 24–25/11 | 8/8 |
| D1 1.5–1.7 | 25/11 | 4/4 |
| D2 2.1–2.5 | | |
| D3 3.1–3.6 | | |
| D4 4.1–4.6 | | |
| D5 5.1–5.6 | | |
