# How I learn with AI (rules for every session)

Source: Gregor Ojstersek, "How to Use AI to Learn Faster" (Engineering Leadership, 12/10/2026), sections *Learning a New Framework or Programming Language*, *Building Hands-On Projects*, *How to Use AI as a Thinking Partner*.

Goal: be a **multiplier**, not an over-relier. Delegate busywork, never judgment. Optimize for understanding WHY code exists and HOW it affects the system, not for how much code AI writes.

## 1. Learning a new framework or language: start from what I know

My base: senior frontend (React, Next.js, TypeScript). Backend, database and infra are new.

For every new technology, before any code:
1. Give AI my context: *"I'm an experienced React/Next.js engineer and need to become productive in X. Explain the most important differences using concepts I already understand. Focus on what is most likely to surprise me or cause mistakes."*
2. Get a **translation table**: concept I know → same concept in X (e.g. FastAPI→Spring Boot in the article; for me: Next.js route handlers/middleware → NestJS controllers/guards/pipes/interceptors, React Context → NestJS DI, optimistic UI rollback → DB transactions).
3. Then specific to the work: *"I know how to do A in React/Next. Show me how the same works in X: routing, DI, validation, data access, error handling."*
4. While working: ask AI to explain unfamiliar code and to review my code for mistakes.

## 2. Building hands-on projects: learn by building, one slice at a time

1. **Plan first, no code.** *"Create a plan that helps me learn X while building feature Y. Don't write the code yet."* (Plan mode.)
2. I review the plan and ask at least one **why** question: *"Why structure it this way? How is this different from how I'd do it in React/Next?"*
3. **Build one part at a time.** Never one-shot a whole feature.
4. When a pattern I don't recognize appears: ask **why it's there, what the alternatives are, and how it maps to what I already know.**
5. For the topic of the day (e.g. refresh-token rotation, optimistic locking), **I write or design the core part myself first**, then compare with AI's version (same rule as plan strategy #5).
6. Review: *"Review this code as an experienced X engineer. What works but isn't good practice? Explain why and show how an experienced X developer would do it."*

## 3. AI as a thinking partner: I draft first, AI challenges

- **Specs, ADRs, designs:** I write the first version; AI stress-tests it (challenge assumptions, alternatives, what I missed, failure modes).
- **Problems:** I explain the problem as clearly as I can before asking for solutions. Explaining it clearly is part of the learning.
- **Difficult conversations** (why I'm leaving, salary negotiation, pushing back on scope): I draft a script → AI gives feedback → I refine → I rehearse out loud until it's natural.
- **Writing and English:** AI points out problems and suggests fixes; **I apply the changes myself** in my own words. AI shows a model version only after my rewrite, for comparison.

## 4. Onboarding to an unfamiliar codebase (new job, Day 25 live build)

1. Read CLAUDE.md / AGENTS.md, or run `/init` with a strong model.
2. Map the architecture (top-level components, top 10 directories, runtime boundaries, Mermaid dependency diagram, cite files; don't edit).
3. Identify the testing strategy and the fastest local confidence loop.
4. Get a repo-specific setup checklist that ends with a smoke test of one key flow.
