# TaskFlow — 5-minute demo script

Stage 2 gate: present to the mentor + 2–3 team leads, collect feedback, fix what **2+ people** mention, then freeze the UI.

- Deck (8 slides, speaker notes on each): https://claude.ai/artifact/AatZ6Tk9aQ8wCEM3Q6LcDC — share it from its Share menu before sending.
- Live prototype: https://taskflow-blond-gamma.vercel.app → "Try the live demo"
- Backup: the 100-second video on the landing page ("Watch the demo")
- Build status: https://taskflow-blond-gamma.vercel.app/status

## Timing

| Time | Slide | What you do |
| --- | --- | --- |
| 0:00–0:20 | 1 Cover | Name, one line about you, "in five minutes: problem, demo, next" |
| 0:20–1:20 | 2 Problem + 3 Customer | The 60-second pitch, paragraph 1 + who it's for |
| 1:20–1:40 | 4 Solution | Three things: Today, client viewers, AI drafting |
| 1:40–4:10 | 5 Demo | Switch to the browser, six steps below |
| 4:10–4:40 | 6 Alternatives + 7 Model | One sentence each |
| 4:40–5:00 | 8 Next + ask | "Would you send this link to a client?" |

## The live demo (2.5 minutes)

Before you start: open the landing page in a fresh tab (the mock resets on reload, so **don't reload** mid-demo). Close other tabs and notifications.

| # | Click | Say |
| --- | --- | --- |
| 1 | Landing → **Try the live demo** | "One click, no sign-up. I'm the owner of a small studio." |
| 2 | **Today** — point at *Late* and *Projects to watch* | "Monday morning: three tasks are late, and Website redesign needs attention first." |
| 3 | **Website redesign** → drag *Collect client logos* to *In progress* | "The board. It also works with the keyboard and screen readers." |
| 4 | Wait 5–15 s for the **Live** toast | "That's Minh moving a task from another laptop — it shows up instantly." *(On the mock these are virtual teammates; say so if asked.)* |
| 5 | **Draft with AI** → *Use a sample brief* → *Draft tasks* → untick one → **Add** | "Paste the client's brief, review, then save. Nothing is saved until I click Add." |
| 6 | **Activity** tab | "Who changed what, and when — the history Trello doesn't give you." |
| 7 | **Log out** → log in as `viewer@client.dev` / `password123` | "This is the client. They only see their own project, and can't change anything." |

If something breaks: "That's the prototype on a mock API — here's the recording", then play the video.

## Questions you will likely get

| Question | Short honest answer |
| --- | --- |
| Is there a real backend? | Not yet. Everything runs on a mock API in the browser, built from the OpenAPI contract. The backend (NestJS, Postgres, Redis) starts Oct 29, test first. |
| Is the AI real? | Not yet: a rule-based stand-in with the same request/response shape. The real model comes after the backend core, with evals in CI. |
| Why would a team switch from Trello? | Safe, free client access per project, and one screen for what's slipping. Trello guests see the whole board. |
| How does realtime work across servers? | Each API instance publishes changes to Redis pub/sub; every instance pushes them to its WebSocket clients. Designed in Stage 3. |
| What if two people edit the same task? | Every task has a version. The second save gets a 409 with the latest task, and the UI lets them re-apply or discard. |
| Will clients like seeing the messy board? | That's my riskiest assumption. The plan is to ask five leads, and a v1.1 option to mark tasks internal. |

## Feedback message to send

> Hi [name], could you spend 5 minutes on a prototype I'm building? Link: https://taskflow-blond-gamma.vercel.app (click "Try the live demo"). Three questions:
> 1. Would you send this link to a client? Why / why not?
> 2. What confused you, or felt unfinished?
> 3. Which one thing would make you try it with your team?
>
> Honest answers help most. Thank you!

Log each answer in `docs/business/03-feedback.md` (person, role, answers). Change only what 2+ people raise; everything else goes to the v1.1 backlog.
