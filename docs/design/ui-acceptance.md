# UI acceptance criteria & usability test

Mockup (source of truth for UI): https://claude.ai/artifact/Mzv1XZ55ggk23C2jCtP7YG — page "Hi-fi mockup v1" (private; share before sending to testers).
Big UI changes go into the mockup first, then into code.

## Acceptance criteria (UI passes → move to prototype on Day 4)

| # | Criterion | Status (v1, 15/10) |
| --- | --- | --- |
| 1 | Main flow works without guidance: create workspace → create project → create and drag a task | ✅ In mockup: Log in → Create a workspace → First project → New task → Project list (drag state) → task detail, all clickable in Play mode. To be confirmed by the 3-person test |
| 2 | Every screen has empty, loading, error, success states | ⚠️ Defined for the task list (States board, incl. 409 conflict). Still needed for Today and Members |
| 3 | Contrast WCAG AA, every input has a label, usable by keyboard | ✅ In the mockup: text ≥ 4.5:1 (muted #5B6470 = 6.1:1), labels on all inputs, keyboard alternative for drag documented. Re-check in code with axe |
| 4 | Works at 375px width | ✅ Mobile Today, Project list, Task detail at 390px; desktop pages stack below ~760px |
| 5 | 3 people tried the mockup; issues hit by ≥ 2/3 are fixed | ⏳ Not run yet |

## Usability test script (15 min per person)

Testers: 3 people who have never seen TaskFlow (ideally one lead-type, one member-type, one "client").
Setup: share the mockup link, open it in Play mode, start on "Log in". Say: *"I'm testing the design, not you. Please think out loud. I won't help unless you're stuck for a minute."*

Tasks (read one at a time, don't name buttons):
0. "You're new. Set up a space for your team and create your first project and task." (start from "Log in" → "Create a workspace")
1. "You just started your day. Find out which task is late and who owns it."
2. "Open that task and change its status to In review."
3. "Move 'Build signup form' to In review." (drag, or any other way they find)
4. "Invite a new teammate who should only be able to look, not edit."
5. "Your client logs in. What can they see? What can't they do?" (switch Today to the viewer role via Tweaks)

Record per task:

| Task | Tester 1 | Tester 2 | Tester 3 |
| --- | --- | --- | --- |
| 0 | | | |
| 1 | done / help / fail + quote | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

After: "What was confusing? What did you expect to find that wasn't there?"
Rule: an issue hit by ≥ 2 of 3 testers gets fixed in the mockup before Day 4.
