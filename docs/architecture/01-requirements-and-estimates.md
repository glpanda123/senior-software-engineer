# TaskFlow — Requirements & capacity estimates

Step 1–2 of the system design. Source of product scope: [`docs/PRD.md`](../PRD.md). Vietnamese version: [`01-requirements-and-estimates.vi.md`](01-requirements-and-estimates.vi.md).

> **Updated 2026-10-26 (PRD v1.3, scope locked):** comments, labels, file attachments and full-text search moved to v1.1. v1 adds an activity log per project and AI drafting on a real LLM. Capacity numbers below are unchanged (comments/attachments were a small share). Architecture: taskflow repo `docs/architecture/`.

## Functional requirements

1. **Accounts:** users sign up, log in and stay logged in securely (refresh-token rotation), log out.
2. **Workspaces & access:** owners/admins create a workspace and projects, invite people by email with a role — **owner, admin, member, viewer**. Owners/admins/members see every project in the workspace; **viewers are invited to specific projects only**.
3. **Tasks:** members create, edit and assign tasks (title, description, status, assignee, priority, due date, labels), comment, and attach files.
4. **Board & realtime:** members change status and order by drag and drop (or "Move to"); **everyone viewing the project sees the change live**.
5. **Overview:** "Today" view (late, due soon, who's doing what), task search, activity log.
6. **AI assist:** paste free text → draft tasks the user reviews before saving.

**Out of scope (v1):** sprints/Gantt, time tracking, billing, native mobile apps, third-party integrations, SSO.

## Non-functional requirements

| | Target | Why it matters for the design |
| --- | --- | --- |
| **Scale** | Year 1: 2,000 workspaces × ~10 people = **20k users**, ~10k daily active, ~4k concurrent at peak. Design for 10× without a rewrite | Decides single DB vs. sharding, number of realtime instances |
| **Latency** | Board/task-list API **p95 < 200 ms** (100k tasks in a workspace); realtime update visible in other tabs **p95 < 1 s** | Needs proper indexes + cursor pagination; push over WebSocket, not polling |
| **Availability** | **99.9%** (≈ 43 min downtime/month) | ≥ 2 API instances behind a load balancer, zero-downtime deploys, DB backups + point-in-time recovery |
| **Consistency** | **Strong** for the source of truth: every task write (incl. status and position) and all memberships/roles; concurrent edits → **409 via optimistic locking**, never silent overwrite. **Eventual** (seconds) for derived views: realtime fan-out, caches, Today counters, activity feed, search index | Single Postgres primary + transactions; async/cached paths only for derived data |
| **Security** | **Tenant isolation**: workspace A can never read workspace B. RBAC enforced **in the API** (UI hiding is UX only). Viewers scoped per project | `workspace_id` on every tenant table + enforced filter or Postgres RLS; e2e isolation tests in CI |
| **Read/write mix** | ~6 reads : 1 write | Read-heavy but small — caching optional, not required |

## Capacity estimates

**Assumptions** (from the PRD's 3–15-person teams):
- 2,000 workspaces × 10 people = **20,000 users**
- Work tool, used daily → **50% DAU = 10,000**
- Per active user per day: **~60 reads** (Today, board opens, task details), **~10 writes** (create, edit, move, comment)
- Peak = **5× average** (office hours)

| | Calculation | Result |
| --- | --- | --- |
| Reads | 10,000 × 60 = 600k/day ÷ 100k s | **~6 QPS avg, ~30 QPS peak** |
| Writes | 10,000 × 10 = 100k/day ÷ 100k s | **~1 QPS avg, ~5 QPS peak** |
| Read : write | 600k : 100k | **~6 : 1** |
| WebSocket connections | 10,000 DAU × 40% with the app open at peak | **~4,000 concurrent** |
| Realtime messages | 5 writes/s × ~3 people viewing the same project | **~15 messages/s** |
| Task storage (1 yr) | 10,000 × 3 new tasks/day × 250 workdays = 7.5M tasks × ~1 KB | **~7.5 GB** |
| + comments, activity log | × ~3 | **~20–25 GB** in Postgres |
| Attachments | stored in S3, not the DB | grows separately (cost, not DB load) |

## What the numbers tell us

1. **One Postgres primary is plenty.** ~35 QPS at peak is tiny for Postgres; no sharding, no read replica needed. Spend effort on indexes, transactions and backups instead.
2. **Realtime needs ≥ 2 instances anyway.** ~4k connections fit on one Node process, but 99.9% availability and rolling deploys require at least two. Then a user on instance A must receive changes made on instance B → **Redis pub/sub** (Socket.IO Redis adapter).
3. **Storage is small.** ~25 GB/year fits a single database comfortably; files go to S3.
4. **Cache is optional.** At 6:1 and 30 read QPS, Postgres serves reads directly. Add cache-aside later only for measured hot paths.
5. **The hard parts are correctness, not scale:** tenant isolation, concurrent edits (409), ordering without rewriting whole lists (fractional indexing), and realtime across instances. That's where the deep dive goes.
6. **At 10×** (200k users, ~350 peak QPS, ~40k connections): still one primary DB with good indexes; more realtime instances; consider a read replica for the Today/overview queries.
