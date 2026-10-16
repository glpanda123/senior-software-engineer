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

## My recurring English mistakes

| ❌ I wrote | ✅ Say instead | Rule |
| --- | --- | --- |
| 7 years experiment on | 7 years **of experience in** | experiment = thí nghiệm |
| i | **I** | always capital |
| enough resource / stakeholder can view | enough **resources** / **stakeholders** can view | countable nouns → plural |
| on mobile device | on **a** mobile device / on **their phones** | singular countable needs an article |
| At that time (about a current decision) | **For v1** | "at that time" = in the past |
| hand-ons on infrastructure | **hands-on** experience **with** infrastructure | |
| oppoturnity | **opportunity** | spelling |
| how many task that near the deadline | how many tasks **are close to** their deadline | missing verb |
| stake holder is viewed-only | stakeholders **have view-only access** | |
| About B, | **As for** B, | |
| sync jobs / async jobs | **synchronous code** / **asynchronous callbacks** | Node vocabulary |
| all thread pool is exhausted | **the whole** thread pool is exhausted | |
| mobility abilities | people check status **on the go** | |

---

## Review log

| Date | Q1 | Q2 | Q3 | Q4 | Notes |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
