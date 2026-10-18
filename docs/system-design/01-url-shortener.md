# System design: URL shortener (worked example)

A classic interview question, solved with the 7-step framework. Vietnamese version: [`01-url-shortener.vi.md`](01-url-shortener.vi.md).

Each step has **what to say** (the spoken version, roughly what you'd say in the interview) and **the reasoning** behind it.

---

## 1. Requirements (5 min)

**What to say:**
> "Before designing, let me confirm the scope. Users paste a long URL and get a short one; anyone opening the short URL is redirected. Do we need custom aliases, expiry, and click analytics? Do users need accounts? And what scale should I design for?"

Assume the interviewer answers: custom alias and expiry yes, basic click counts yes, no accounts (an optional API key for heavy users), 100M new links per month.

**Functional**
1. Create a short URL from a long URL; optional custom alias and expiry date.
2. Redirect `short.ly/{code}` to the long URL.
3. Count clicks per link.

Out of scope: user accounts, editing links, detailed analytics (geo, device).

**Non-functional**

| | Target | Why it matters |
| --- | --- | --- |
| Scale | 100M new links/month, read:write ≈ 100:1 | Very read-heavy → design the read path first |
| Latency | Redirect p99 < 50 ms (server side) | Every click waits on us; it must feel instant |
| Availability | Redirect 99.99%; creating links 99.9% | A broken redirect breaks someone else's page, email or ad; creation failing is less harmful |
| Consistency | A new link must work right after it's created (read-your-writes); click counts can lag | Counts are derived data → eventual consistency is fine |
| Security | Codes not guessable; rate-limit creation | Sequential codes let anyone enumerate every link (private docs!) |

---

## 2. Estimates (3 min)

**What to say:**
> "100M links a month is about 3M a day, so roughly 40 writes per second, maybe 200 at peak. With 100 reads per write that's 4,000 redirects per second on average and 20k at peak. Over five years we store 6 billion links; at about 500 bytes each that's 3 TB. A 7-character base62 code gives 3.5 trillion combinations, far more than 6 billion. And if 20% of links get most of the traffic, the hot set fits in one Redis node."

| | Calculation | Result |
| --- | --- | --- |
| Writes | 100M / 30 days ≈ 3.3M/day ÷ 100k s | **~40 QPS**, peak ~200 |
| Reads | 40 × 100 | **~4k QPS**, peak ~20k |
| Storage (5 years) | 100M × 12 × 5 = 6B links × ~500 B | **~3 TB** |
| Code length | 62⁶ = 57B (too tight over time), 62⁷ = 3.5T | **7 characters** (base62: `a–z A–Z 0–9`) |
| Cache | ~20% hot links, ~20M × 500 B | **~10 GB** → one Redis node |
| Bandwidth | 20k × 500 B | ~10 MB/s, not a concern |

**Conclusion:** writes are small; **the challenge is serving 20k redirects/s with low latency and high availability**, and generating unique codes without coordination.

---

## 3. API (5 min)

```http
POST /api/v1/urls
{ "longUrl": "https://…", "customAlias": "launch-2026", "expiresAt": "2027-01-01T00:00:00Z" }
→ 201 { "code": "aZ3k9Qx", "shortUrl": "https://short.ly/aZ3k9Qx", "expiresAt": … }
→ 409 if the custom alias is taken · 422 if the URL is invalid · 429 if rate limited

GET /{code}
→ 302 Location: https://…   (404 if unknown, 410 Gone if expired)

GET /api/v1/urls/{code}/stats
→ 200 { "clicks": 1234 }
```

**301 or 302?** This decision gets asked often.
- **301 Moved Permanently**: the browser caches the redirect and skips us next time. Less load, but **we never see repeat clicks**, so analytics break, and we can't change or expire the link for that browser.
- **302 Found** (or 307): the browser asks us every time. More load, but **accurate counts and expiry work**.
- Choice: **302**, because click counts and expiry are requirements. The cache layer absorbs the extra load.

---

## 4. Data model (5 min)

```
urls
  code        varchar(7)  PRIMARY KEY
  long_url    text        NOT NULL
  created_at  timestamp
  expires_at  timestamp   NULL
  api_key_id  uuid        NULL

click_counts                       (written by the async analytics consumer)
  code        varchar(7)  PRIMARY KEY
  clicks      bigint
```

- The only hot query is **"find by code"**, a primary-key lookup. No other index is needed on the read path.
- **Same long URL twice → two different codes.** Deduplicating would need an index on `long_url` (or its hash) and a lookup on every write, and would mix up different people's expiry and stats. Not worth it.
- **Which database?** The access pattern is pure key-value at 6B rows → a **key-value store such as DynamoDB** fits naturally: it scales horizontally without manual sharding and has built-in TTL for expiry. Postgres would be fine for the first year (40 writes/s is nothing); the reason to move is size (3 TB+), not load.

---

## 5. High-level architecture (7 min)

```
                  ┌──────────── write path ────────────┐
Client ─► LB ─► App servers (stateless) ─► Key-value DB
                  │        ▲
                  │        └── cache-aside ── Redis
                  │
                  └── click event ─► Queue (SQS/Kafka) ─► Analytics consumer ─► click_counts
```

- **App servers are stateless** → add more behind the load balancer as traffic grows.
- **Redirect (read path):** Redis first; on a miss, read the DB and fill the cache.
- **Clicks are counted asynchronously:** the redirect publishes an event and returns immediately; a consumer aggregates counts. A slow analytics system must never slow down a redirect.
- Create and redirect can be one service at this scale; split them later only if they need to scale or deploy separately.

---

## 6. Deep dive (15 min)

### 6a. Generating unique codes

| Option | How | Pros | Cons |
| --- | --- | --- | --- |
| **Hash the URL** | MD5/SHA-256 of the long URL, keep 7 base62 chars | Same URL → same code | Truncating causes collisions → still need check + retry; dedup is not wanted anyway |
| **Auto-increment counter** | DB sequence → base62 (1 → `b`, 2 → `c`…) | No collisions | **Guessable** (enumerate all links); a single counter is a bottleneck and single point of failure |
| **Counter with ranges** | Each server leases a block (e.g. 1,000 IDs) from a central counter, then encodes and scrambles them | No collisions, almost no coordination | More moving parts; a scramble step is needed to avoid guessable codes |
| **Random code** ✅ | 7 random base62 chars, insert with "only if not exists" | Stateless, unguessable, simple | Rare collision → retry |

**Choice: random code + conditional insert.** Collision odds per insert ≈ links stored ÷ code space = 6B ÷ 3.5T ≈ **0.2% even after five years**. One retry almost always succeeds. The uniqueness guarantee comes from the database (`PRIMARY KEY` / DynamoDB conditional put), not from application code, so two servers can never hand out the same code.

> "If the interviewer pushes on 'avoid the retry entirely', I'd switch to counter ranges with a scramble step."

### 6b. Serving 20k redirects per second

1. **Cache-aside in Redis.** With a 90% hit ratio, the DB sees ~2k reads/s, which is easy for a key-value store.
2. **Cache TTL**: 24 h, never later than the link's own `expires_at`.
3. **Negative caching**: cache "not found" for a few minutes too. Otherwise bots scanning random codes go straight to the DB on every request.
4. **Expiry check on read**: if `expires_at` has passed → 410, even if the TTL cleanup hasn't removed the row yet.
5. **Hot links** (one link going viral): a single Redis key can get hammered → keep a small **in-process cache** (a few seconds) on each app server for the hottest codes.

---

## 7. Failure points and scaling (5 min)

**What to say:**
> "Let me go through what breaks. If Redis goes down, redirects fall back to the database. Latency goes up, but they keep working, and I'd rate-limit to protect the DB. The database runs across availability zones; for 99.99% on redirects I'd replicate it to a second region, which is fine because links are written once and never change. The analytics queue can lag or even drop events without affecting redirects. Abuse is the real-world risk: rate-limit creation per IP and API key, and scan new URLs against a malware list asynchronously."

| What fails / grows | Impact | Mitigation |
| --- | --- | --- |
| Redis down | Slower redirects | Fall back to DB, rate limit, Redis replica |
| DB AZ / region down | Redirects fail | Multi-AZ; cross-region read replicas (links are immutable → replication lag is harmless) |
| Analytics queue backlog | Counts lag | Acceptable by requirement; redirects unaffected |
| Spam / phishing links | Domain gets blocklisted | Rate limit creation, async malware scan, takedown flag |
| Custom alias race | Two users claim the same alias | Conditional insert → second gets 409 |
| ×10 traffic | 200k redirects/s | More app servers, Redis cluster, DB partitioned by `code` (hash spreads evenly); CDN for the hottest links |

---

## 60-second summary

> "It's a read-heavy key-value problem: about 40 writes and 4,000 reads per second, 3 TB over five years. Codes are 7 random base62 characters; uniqueness comes from a conditional insert, and collisions are rare enough to retry. Redirects use 302 so counts and expiry work, with Redis cache-aside, negative caching for unknown codes, and click counting pushed to a queue so it never slows a redirect down. Storage is a key-value store partitioned by code. The main risks are cache failure, which degrades to the DB, and abuse, which needs rate limiting and URL scanning."
