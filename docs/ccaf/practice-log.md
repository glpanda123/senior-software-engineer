# CCAF practice log

Misses and lucky guesses only, so the review before each mock stays short. Questions are written by Claude against the blueprint (not real exam items).

| Date | Task | Result | Takeaway |
| --- | --- | --- | --- |
| 24/11 | 1.1 | 4/4 (1.1–1.2) | — |
| 24/11 | 1.1 | Unsure (B vs C) | The API is stateless: every call must resend the whole conversation, tool results included. Prompt caching only makes resending a long prefix cheaper and faster; it never makes the model "remember" anything that wasn't sent. |
