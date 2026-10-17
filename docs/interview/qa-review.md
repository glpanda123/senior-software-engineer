# Interview Q&A review

Every question I've answered so far, with my original answer, what was wrong, and a model answer.
**How to review:** read the question, answer out loud first (60–90 s), then open "Model answer" and compare. Mark ✅ / 🔁 in the Review log.

Story-type answers (Tell me about yourself, STAR stories) live in [`stories.md`](stories.md).

---

## Q1. Product: "Why is 'no native mobile app' a non-goal, but the web app must still work at 375px?"

**My answer (14/10):**
> Because of mobility abilities. At that time, we dont have enough resource to implement mobile, but at least stakeholder can view on mobile device

**What was off:** ideas right (limited resources, stakeholders need mobile), but no cost explained, no "who exactly", no condition to revisit.

<details><summary>Model answer</summary>

> "A native app means a second codebase, app-store releases, and a team we don't have for v1. But our users still check status on their phones, especially viewers and leads between meetings. So a responsive web app covers that use case at a fraction of the cost. We'll revisit native only if mobile usage data shows people need things like push notifications or offline access."

**Takeaway:** state the cost → who needs it → the cheaper option → **when you'd revisit the decision**.
</details>

---

## Q2. Product/UX: "Which layout would you choose for the task screen, and why?"

**My answer (14/10):**
> I choose wireframes B and C based on the user's role. With viewers like stakeholders, wireframe C helps them have an overview of the current status: how many task that near the deadline, how many tasks are done, and how many are unassigned. stake holder is viewed-only so all buttons on wireframe C should be deleted. About B, leads and members can easily view priority and due date. I suggest having vertical drag-and-drop behavior to change task status, but each block (in progress, in review,...) should be more compact to be easier to view

**What was off:** strong idea (choose by role). Missed: keep read/navigation actions for viewers (only hide writes); **hiding buttons is not security — the API must return 403**; drag-and-drop needs a non-drag alternative (WCAG 2.2, 2.5.7).

<details><summary>Model answer</summary>

> "I'd pick the layout by role rather than one screen for everyone. For viewers like stakeholders, Option C gives a quick overview: what's overdue, what's due soon, what's done and what's unassigned. Since they have view-only access, we hide every action that changes data, and the API rejects those writes anyway. For leads and members, Option B makes priority and due dates easy to scan. I'd add vertical drag and drop between status groups and make the groups more compact, so we keep the realtime board experience without the wide Kanban layout."

**Takeaway:** UI hiding = UX; authorization = backend. Always say both.
</details>

---

## Q3. Node.js: "What does this print, and why?"

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
setImmediate(() => console.log('C'));
Promise.resolve().then(() => console.log('D'));
process.nextTick(() => console.log('E'));
console.log('F');
```

**My answer (16/10):**
> A F E D B C. Explain: in JS, sync jobs have the highest priority, then async jobs. In async jobs, the priority is nextTick, promise - async await, libuv tasks (like setTimeout, I/O,...)

**What was off (8/10):** order correct in practice, but **B vs C is not guaranteed in the main module** (setTimeout 0 is really 1 ms). Inside an I/O callback, setImmediate always runs first. Name the phases.

<details><summary>Model answer</summary>

> "A and F first, because synchronous code runs to completion. Then the nextTick queue, so E, then promise microtasks, so D. Then the event loop phases: timers, where setTimeout's B runs, then poll for I/O, then check, where setImmediate's C runs. One caveat: in the main module the order of B and C isn't guaranteed, because a 0 ms timeout is really 1 ms and may not have expired when the loop first reaches the timers phase. Inside an I/O callback, setImmediate always runs before the timer."

**Takeaway:** sync → nextTick → promises → timers → poll → check → close; microtasks drain between every callback.
</details>

---

## Q4. Node.js / debugging: "Every endpoint is slow, but CPU is only 25% on a 4-core machine. What could be happening?"

**My answer (16/10):**
> Maybe some jobs take time; therefore all thread pool is exhausted, making the app blocked

**What was off (5/10):** thread-pool exhaustion is a valid second guess, but the clue is **25% of 4 cores = one core at 100%**: the single JavaScript thread is busy → event loop blocked. Also missing: how to confirm, how to fix.

<details><summary>Model answer</summary>

> "25% on four cores usually means one core is pegged, and Node runs JavaScript on a single thread. So my first suspect is something blocking the event loop: synchronous CPU work like parsing a huge JSON payload, a sync crypto call, or a slow regex. I'd confirm it by measuring event loop delay with `perf_hooks.monitorEventLoopDelay` and taking a CPU profile to find the hot function. The fix is to move that work off the main thread, with worker threads or a background job, and to run one process per core so all four are used. If event loop delay is low, requests are waiting on something else: the libuv thread pool (fs, DNS, crypto) or the database connection pool. Then I'd check pool usage and queue times."

**Takeaway:** hypothesis → how to measure → fix → second hypothesis. Network I/O does **not** use the libuv thread pool; fs, dns.lookup, crypto and zlib do (default 4 threads).
</details>

---

## Q5. Estimation: "A system gets 5 million requests a day. What's the average QPS? And at peak?"

**My answer (16/10):**
> 50 QPS, cao điểm khoảng 150-250 QPS

**What was off:** nothing. ✅

<details><summary>Model answer</summary>

> "A day is about 100k seconds, so 5 million a day is roughly 50 QPS on average. Traffic isn't flat, so I'd plan for 3 to 5 times that at peak, around 150 to 250 QPS."

**Takeaway:** 1 day ≈ 100k s → 1M/day ≈ 10 QPS; peak ≈ 3–5× average.
</details>

---

## Q6. Consistency: "In TaskFlow, which data must be strongly consistent, and which can be eventually consistent?"

**My answer (16/10):**
> Theo t thì dữ liệu buộc nhất quán ngay là task, khi sửa hoặc xóa task thì nên đồng nhất về dữ liệu để tránh làm sai lệch thông tin. status của task có thể để stale, vì n chỉ ảnh hưởng việc hiển thị, data có thể sync up sau

**What was off:** right instinct, wrong example. A task's **status is part of the task record**: changing it is a write that must be consistent (two people dragging the same task → the 409 check depends on it). What can be stale is the **copies/views** of data: other users' screens updated via realtime, cached reads, dashboard counters, activity feed, search index. Also missing: **permissions** must be strongly consistent (a removed member must lose access immediately).

<details><summary>Model answer</summary>

> "The source of truth has to be strongly consistent: every write to a task, including status and position, goes to a single Postgres primary in a transaction, with a version check so concurrent edits get a 409 instead of silently overwriting. Memberships and roles too, because revoking access must take effect immediately. What can be eventually consistent are derived views: the realtime push to other people's boards, cached task lists, the 'Today' counters, the activity feed and the search index. If those are a second or two behind, nobody is harmed, and it lets us use caching and async updates."

**Takeaway:** strongly consistent = **source of truth + permissions**; eventually consistent = **copies and derived views** (realtime fan-out, cache, counters, search).
</details>

---

## Q7. System design: "Design TaskFlow." — Step 1 (requirements) and step 2 (estimates)

**My answer v1 (16/10):**
> 1.1 Functional: Leader can create workspace · Leader can create task, set due date · Leader can invite and remove member · Leader and member can assign task · Member can change task status
> 1.2 Non-functional: Scale: 2k workspace, 50k user · Latency: open board less than 2s, realtime in 300ms · availability: 99.9% · Consistency: all data related to workspace, project and task must be strong consistency, data in cache and use to display can be stale · Security: leader and member cannot view other project that not involve, viewer can only view project that they are invited
> 2. Estimate: 100 workspace, 1000 each, 10% · each user can write 30, read 60 · QPS for write is 100 * 1000 * 10 % * 30 / 86400, for read is 100 * 1000 * 10 % * 60 / 86400, r/w ratio is 2/1. memory i assume is 15gb

**What was off:** numbers contradicted each other (50k vs 100k users, 1,000 people per workspace vs PRD's 3–15); "Leader" isn't a role; missed drag-and-drop + realtime (the hardest part); missed tenant isolation; latency as page load instead of API p95; estimate stopped at formulas (no results, no conclusion); "memory" should be storage, with a calculation; no WebSocket connection estimate.

<details><summary>Model answer</summary>

See [`docs/architecture/01-requirements-and-estimates.md`](../architecture/01-requirements-and-estimates.md).

Spoken version (~60 s):
> "Functionally: accounts, workspaces with four roles, tasks with comments and attachments, drag-and-drop with live updates for everyone on the board, a Today overview, search, and AI task drafts. Out of scope: sprints, billing, native apps.
> Year one: 2,000 workspaces of about ten people, so 20k users, half active daily. Sixty reads and ten writes each gives about 6 read QPS and 1 write QPS on average, maybe 30 and 5 at peak, plus around 4,000 concurrent WebSocket connections and 25 GB of data a year.
> So scale isn't the problem: one Postgres primary is plenty. But I still need at least two API instances for 99.9% availability, which means Redis pub/sub so realtime events reach users on either instance. The real challenges are correctness: tenant isolation, concurrent edits, and ordering — that's where I'd go deep."

**Takeaway:** assumptions → calculation → number → **conclusion**. The conclusion is what gets you points.
</details>

---

## Q8. Follow-ups on the TaskFlow estimate

**Questions:** (a) One Node instance can hold 4,000 connections — why run two? (b) Reads are 6:1 — why no cache yet? (c) At 10× scale, what changes first?

**My answer (17/10):**
> 1. cần 2 instance để đạt 99.9% và deploy không gián đoạn
> 2. vì 35 QPS là nhỏ với postgres
> 3. thêm read replica db

**What was off:** (a) ✅ (b) ✅ — could add that a cache brings invalidation complexity, so add it only when measured. (c) partly: a read replica is one option, but the first thing to hit limits is the **realtime layer** (~40k connections → more instances); the database is still fine with good indexes.

<details><summary>Model answer</summary>

> (a) "Not for load — for availability. With one instance, a crash or a deploy drops every connection. Two instances behind a load balancer give 99.9% and rolling deploys; Redis pub/sub keeps events flowing between them."
> (b) "30 read QPS on a small dataset is easy for Postgres with the right indexes. A cache adds invalidation bugs and stale data, so I'd add it only for a hot path I've actually measured."
> (c) "At 10× we'd have ~40k concurrent connections, so the realtime tier scales out first. The database is still one primary at ~350 QPS; I'd check slow queries and maybe add a read replica for the heavy Today overview queries."

**Takeaway:** every component you add has a cost; justify it with a number or a requirement.
</details>

---

## Review log

| Date | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |
