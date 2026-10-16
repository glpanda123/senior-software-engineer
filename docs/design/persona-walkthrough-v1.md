# AI persona walkthrough — mockup v1 (16/10/2026)

Method: cognitive walkthrough by 3 AI subagents, each playing one persona through the test script in `ui-acceptance.md`. This is an expert-review substitute, **not** a usability test with real people: AI knows UI conventions and gets confused less than real users. Re-validate with real users once the prototype is live.

Personas: **Chi** (agency owner, non-technical, impatient) · **Tuan** (member, Trello/Linear power user, keyboard + mobile) · **Mr. Binh** (client viewer, 52, slow English reader, phone).

## Findings hit by ≥ 2 of 3 personas (must fix before Day 4) — all fixed in mockup v2 (16/10)

| # | Issue | Hit by | Fix |
| --- | --- | --- | --- |
| 1 | No feedback after create / status change / drop / invite ("did it save?") | Chi, Tuan | Toast "Moved to In review · Undo"; highlight the changed or new row |
| 2 | Moving a task only works by drag; list rows can't be clicked or focused, so the keyboard hint is false | Chi, Tuan | Rows open the detail panel on click/Enter; row "Move to…" menu; 44px handle; live-region announcement |
| 3 | Viewers see the full editing UI on Project and mobile screens | Chi, Binh | Read-only variants: fields as text, no drag/handles/+ buttons, banner naming who to contact |
| 4 | Viewers can see **every** project in the workspace (agency: client sees other clients) | Chi, Binh, Tuan | Product decision → per-project access for viewers (affects RBAC + data model) |
| 5 | Onboarding: no sign-up step but "Signed in as…"; first task pre-filled with a past due date and someone else as assignee; no confirmation after "Create task" | Chi, Tuan | Add sign-up screen; empty due date with picker; assignee defaults to me; land on list with the new task highlighted |
| 6 | Same thing, different names: "Owner" column vs "Assignee" field vs "Owner" role; "lead" is not a role | Tuan, Binh | One word: Assignee. Roles: Owner, Admin, Member, Viewer only |
| 7 | "Overdue · Oct 13" makes people compute how late it is; mobile drops the date | Binh, Tuan | "1 day late (due Oct 13)" everywhere |

## Single-persona findings (consider)

- No overall project status for viewers: add "On track / At risk", "2 of 8 done" bar, launch date (Binh).
- Jargon: "About to slip" → "Late or due soon"; "Open board" → "See all tasks" (Binh).
- Mobile text too small for older readers: body ≥ 16px, meta ≥ 14px (Binh).
- Invite role defaults to Member → easy to over-grant (Chi).
- "Overdue" counter card should be clickable as a filter (Chi, Tuan mentioned in passing).
- Keyboard shortcuts (C new task, / search, ⌘K) (Tuan).
- Tokens board misses overdue text #8F330C and in-review #7A4FD0 (Tuan).

## What changed in mockup v2

1. Toast with Undo after moving a task (Project screen).
2. Rows are focusable buttons that open the detail; row "⋯ → Move to" menu; 44px drag handle; hint text matches real behaviour.
3. `role` tweak (team / viewer) on Today, Project and all mobile screens: viewers get plain-text fields, no create/move/comment controls, and a banner naming who to contact.
4. Viewers are scoped to chosen projects: invite form has a project checklist; viewer sidebar shows only their project. PRD updated.
5. New Sign-up screen; onboarding is 3 steps (workspace → project → first task); first task has empty due date with a date picker and defaults to "Me".
6. "Assignee" everywhere; roles are Owner/Admin/Member/Viewer only.
7. "1 day late · due Oct 13" everywhere; plus single-persona fixes: project status ("At risk · 2 of 8 done · launch Oct 30"), "Late or due soon", "See all tasks", newest comments first, mobile text ≥ 14px, invite role labels explain each role, token board shows overdue text + in-review colors.
