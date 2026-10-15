# Wireframe decision — board/task screen

Date: 2026-10-14 · Decided by: Ly · Wireframes: Option A (Kanban), B (List + detail panel), C (Today overview)

## Decision

Pick the layout **by role** instead of one screen for everyone:

| Role | Default screen | Why |
| --- | --- | --- |
| Lead | **C · Today overview**, one click to B | Answers the PRD's job to be done: "who is doing what, what is about to slip" without opening a board |
| Member | **B · List + detail panel** | Priority and due date are scannable in one row; edit a task without leaving the list |
| Viewer | **C, read-only** | Status at a glance: overdue, due soon, done, unassigned |

Option A (Kanban) is dropped as the primary view.

## Changes to the wireframes

1. **B gets vertical drag and drop between status groups** (e.g. drag a row from *In progress* to *In review*). This keeps the realtime drag-and-drop goal (PRD §4, goal 2) that B was missing.
   - Status groups become more compact and collapsible, so the target group stays visible while dragging.
   - Auto-scroll while dragging near the edge of a long list.
   - Non-drag alternative stays: the Status field in the detail panel and keyboard move (WCAG 2.2 SC 2.5.7, Dragging Movements).
   - Compact density on desktop only; rows keep 44px touch targets on phones.
2. **C for viewers hides every action that changes data** (New task, Assign). Navigation stays: viewers can still open a task in read-only mode.
   - Hiding buttons is UX only. The API enforces viewer = read-only (403 on any write); the RBAC tests on Day 7 cover it.
3. **C adds a "Done this week" count**, so viewers see progress, not only risk.

## Open question

- Should viewers (clients) see the "Who's doing what" section? It exposes internal workload. v1 proposal: hide it for viewers; leads only.
