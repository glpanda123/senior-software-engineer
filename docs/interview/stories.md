# Interview stories

Spoken English, ~90 s each. Practise out loud, record, listen back.

## Tell me about yourself (~90 s)

> Hi, I'm Hoang. I've been a software engineer since 2019, so about seven years, mostly on the frontend with React and Next.js. For the past few months I've moved into full-stack work with NestJS and PostgreSQL.
>
> Earlier, I worked on a shipment system for a UK logistics company. It was a program of more than a hundred people, I built the multi-step order form, and our team was named best team.
>
> Now I work on AiNavi, a job platform where candidates find jobs and apply, in a team of eight. What I'm proudest of there is how I changed my workflow with AI. The agent reads the spec, I approve its plan, it implements, and it writes Playwright tests straight from the acceptance criteria. So I verify every feature before it reaches QC. Bugs logged against my work dropped from around ten a month to one to three, and they're less severe.
>
> Since moving to the backend, I've been going deeper on my own. I'm building a multi-tenant SaaS with realtime updates, row-level security and an AWS deployment with Terraform. I'm looking for a role where I can bring my frontend depth and keep growing on the backend, and [one specific thing about the company].

Rules: 7 years total, frontend strength, backend ~3 months. Never claim the UK program's revenue as personal. Don't quote a % speed-up until it is measured (log time per ticket in DEVLOG).

## Story 1 — AI workflow cut bugs before QC

Use for: biggest achievement · how do you use AI · how do you ensure quality.

- **S:** AiNavi, team of 8 (1 PO, 1 BA, 4 dev, 2 QC). QC logged ~10 bugs/month against each developer's work.
- **T:** Catch my own bugs before QC without slowing down.
- **A:** Agent reads the spec → proposes a plan → I review and approve → agent implements → agent writes Playwright e2e tests from the acceptance criteria → hand to QC only when they pass. Also drafted shared structure + convention docs with AI for the other devs.
- **R:** ~10 → 1–3 bugs/month, lower severity. Lesson: AI speed only helps when verification is built in.

Likely follow-ups:
- How do you know the AI-written tests check the right thing? → I review the tests against the AC like a spec before trusting them.
- What if the agent writes wrong code that passes its own tests? → plan review up front, tests mapped 1:1 to AC, I read the diff.
- Did the team adopt it? → be honest about how far it spread.

## Story 2 — eKYC fail fast

Use for: hard bug · improved UX · resilience with third parties.

- **S:** Third-party eKYC tool sometimes returned an invalid/empty file. Neither FE nor BE validated it → empty data sent to the AI verification server → user waited ~30 s, got a failure, redid the flow.
- **T:** I owned the fix.
- **A:** Validate the file right after the third-party tool returns; if invalid, stop and show a clear error immediately. Added a 30 s timeout on verification: on timeout, stop and ask the user to retry later.
- **R:** Invalid requests no longer reach the AI server (saves processing time and cost); users get instant feedback instead of a 30 s wait. Lesson: never trust third-party output; validate at the boundary.

Likely follow-up: "Why only on the frontend?" → validate on both sides: frontend for fast feedback, backend to protect the system because the frontend can be bypassed. If the backend check wasn't done: "If I did it again, I'd validate on both sides."

## Story 3 — Page load 5 s → 2 s (short)

Use for: performance improvement.

- Lazy-loaded heavy components not needed on first view; turned off link **prefetching** (`<Link prefetch={false}>`) for rarely visited routes, so the first load fetched only what the page needed. ~5 s → ~2 s.
- Be ready for: "How did you measure it?" (Lighthouse / DevTools). Say *prefetch*, not *pre-render*.

## If asked about details I don't remember (UK project)

Say so, then reason it through: "That was a few years ago, so I don't remember the exact implementation, but here's how I'd build a multi-step form today: one form state shared across steps, per-step schema validation (e.g. zod), the current step in the URL so back/refresh work, and a saved draft so users can leave and come back." Honest + shows current thinking.
