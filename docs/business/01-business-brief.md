# TaskFlow — Business Brief (one page)

Status: Stage 1 worked example · Draft for review · 2026-10-22

> **One line:** a lightweight task board for small agencies that work with clients — see what's slipping in one screen, and give each client a live, read-only view of *their* project instead of a screenshot.

## 1. Problem

Small teams that deliver projects for clients (design, dev and marketing agencies, 3–15 people) run work across Zalo/Slack threads, spreadsheets and free Trello boards.

| Pain | Evidence today | Status |
| --- | --- | --- |
| The lead spends ~30 min/day asking "who is on what?" | My own experience in agency/outsourcing teams | **Assumption** — to validate |
| Late work is noticed only after the deadline | Same | **Assumption** |
| Clients get status by screenshot or a weekly report, because sharing the board means giving edit rights to everything | Trello/Jira guests see the whole board; per-project read-only access needs paid tiers or workarounds | **Partly verified** (product docs) |
| Jira is too heavy for 5 people; Trello has no real roles or change history | Common complaint in reviews and "Jira alternatives" articles | **Partly verified** |

**Validation plan (before claiming any of this in public):** 5 short interviews with agency team leads. Key question: *"Last week, how did your client find out the status of their project?"*

## 2. Customer segment

- **Beachhead:** agencies and outsourcing teams in Vietnam with **5–15 people and 2+ external clients at a time**. They feel the client-visibility pain every week and choose tools without a procurement process.
- **Buyer = user:** the team lead / project manager. The client (viewer) never pays but sees the product every week.
- **Not now:** enterprises (need SSO, audits), solo freelancers (no team to coordinate), software teams that live in GitHub (Linear fits them better).

## 3. Alternatives and competitors

| Option | Why teams pick it | Why it fails this segment | Entry paid price* |
| --- | --- | --- | --- |
| Chat + spreadsheet | Free, already there | No status, no history, nothing for the client | $0 |
| Trello | Easy, free tier | Weak roles; a client guest sees the board, not "their project, read-only" | ≈ $5/user/mo |
| Jira | Powerful, permissions, history | Heavy setup, built for software sprints | ≈ $7.75/user/mo |
| Asana / ClickUp | Feature-rich | Many features to learn; client access is a paid add-on or a full seat | ≈ $7–11/user/mo |
| Linear | Fast, loved by devs | Built for software issues, not client delivery | ≈ $8–10/user/mo |
| Base.vn (local) | Vietnamese, HR + work suite | Suite for whole SMEs, heavier than a team board | Not published |

\* Annual billing, from third-party comparisons (Oct 2026). Check vendor pricing pages before quoting.

## 4. Differentiation

**Positioning:** *For small agencies that deliver projects to clients, TaskFlow is the task board where each client gets a live, read-only view of their own project. Unlike Trello or Jira, client access is safe by default and free, and the lead sees what's slipping on one screen.*

1. **Client viewers per project** — read-only, see only the projects they were invited to, always free.
2. **Today screen** — late, due-this-week and unassigned work at a glance; replaces the morning "who's on what?".
3. **AI task drafting** — paste a client brief, get a task list to review before saving. Saves the most boring step of starting a project.
4. **Small on purpose** — no sprints, no custom workflows; a new team assigns its first task in under 3 minutes.

## 5. Business model (hypothesis)

- **Free:** up to 5 members, 3 projects. **Client viewers are unlimited and free on every plan.**
- **Team:** ≈ $3/user/month (≈ 75,000 VND), only owners/admins/members count as seats. Undercuts Trello Standard while including what Trello lacks for this segment.
- **Growth loop (hypothesis):** every client sees TaskFlow every week → some of those clients run teams too → they sign up.
- **Honest scale check:** a 10-seat agency pays ~$30/month; 100 paying teams ≈ $3,000 MRR. This is a niche product, which is fine for a portfolio project; growth would need the AI and client features to carry it.

## 6. Success metrics

| Type | Metric | Target (first 3 months) |
| --- | --- | --- |
| North star | **Weekly active projects** (≥ 3 task updates in a week) | Up and to the right; baseline after launch |
| Activation | New workspaces that assign a first task on day 1 | ≥ 60%, median time < 3 min |
| Client value | Projects with a viewer who opened them in the last 7 days | ≥ 30% of active projects |
| Retention | Workspaces still active in week 4 | ≥ 40% |
| AI | AI drafts saved with ≤ 2 edits | ≥ 50% |
| Trust | Cross-workspace data leaks | 0 (CI isolation tests) |

**Prototype phase (now):** 3 usability testers complete the main flow without help; mentor + 2–3 team leads say "I'd send this link to a client".

## 7. Risks and riskiest assumption

| Risk | Why it matters | How we test or reduce it |
| --- | --- | --- |
| **Leads may not want clients to see the live board** (it shows internal mess) | Kills differentiator #1 | Interview question: "Would you send this link to a client today?" Roadmap: mark tasks *internal* (hidden from viewers) |
| Teams won't leave Zalo + sheets ("good enough") | No adoption | Today screen + 3-minute onboarding; measure activation |
| AI drafts are wrong or generic | Feature becomes a gimmick | Schema-validated output, human review before save, eval set in CI |
| Big tools add free client views | Differentiator gets copied | Stay small and fast for this segment; local language and pricing |
| Data leak between workspaces/clients | One incident ends trust | Tenant isolation by design, 404 for out-of-scope data, tests in CI |

## 8. Scope

**v1 (locked 2026-10-24; Stage 3 designs all of it; PRD v1.3):**

- Accounts: register, log in, stay logged in (refresh rotation), log out
- Workspaces, 4 roles, invitations by email (sent from a queue)
- **Client viewers per project**, read-only
- Projects and a board with 4 status columns, drag and drop, **live updates (< 1 s)**
- Tasks: title, description, status, assignee, priority, due date; edit conflicts detected (409)
- **Today** overview
- **Activity log** per project (who changed what, when) — answers "no change history"
- **AI task drafting** with a real LLM, human review, eval in CI
- Non-functional: tenant isolation, login rate limiting, caching for the board

**v1.1 roadmap (not built now; new ideas go here):** comments, labels, file attachments (S3), full-text search, *internal* tasks hidden from viewers, late-task email digest, Slack/Zalo notifications.

**Not doing:** sprints, time tracking, billing, custom fields/automation, native apps, SSO (see PRD non-goals).

## 9. 60-second pitch

> Small agencies in Vietnam run client projects on Zalo threads and spreadsheets. Every morning the team lead asks "who's on what?", late tasks show up only after the deadline, and clients get progress by screenshot — because giving them access to Trello or Jira means giving them access to everything.
>
> TaskFlow is a lightweight task board for teams that work with clients. One screen, Today, shows what's late, what's due this week and what nobody owns. Each client gets a live, read-only view of their own project, so the status screenshot disappears. And instead of typing tasks one by one, you paste the client's brief and AI drafts the task list for you to review.
>
> We start with 5-to-15-person agencies. It's free for small teams, and client viewers are always free, so every client link shows TaskFlow to the next team. The prototype is live today, and the backend is next.
