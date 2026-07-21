# Coding Challenges

Practice banks for Node.js backend interview prep. Use them with a timer, speak your approach aloud, then compare to references where provided.

## Tracks

| Track | Questions | Focus | Start here |
|---|---:|---|---|
| [JavaScript](javascript/README.md) | 300 | Algorithms, language fluency, data structures | Easy 1–30 |
| [Node.js](nodejs/README.md) | 150 | Runtime, APIs, streams, error handling, concurrency | Easy first 20 |
| [MongoDB](mongodb/README.md) | 100 | Queries, aggregation, indexes, modeling | Challenges 1–25 |
| [SQL](sql/README.md) | 100 | Joins, windowing, indexes, schema design | Challenges 1–25 |

## How to use this folder

1. **Pick one track per session** — do not hop between SQL and JS every ten minutes.
2. **Read the prompt fully** — restate inputs, outputs, and constraints before coding.
3. **Talk through brute force → improve** — interviewers grade communication as much as code.
4. **Write working code** — then refactor names and edge cases.
5. **Check complexity** — time and space; know when O(n²) is unacceptable.
6. **Compare to reference** — every challenge includes a matching solution; note a technique you missed; do not memorize line-by-line.
7. **Revisit misses after 48 hours** — spaced repetition beats bingeing.

## Recommended study plans

### 2-week sprint (interview soon)

| Day | Focus |
|---|---|
| 1–3 | JS Easy (arrays/strings/hash maps) — 8–10 problems/day |
| 4–5 | JS Medium (two pointers, BFS/DFS intro) — 4–6/day |
| 6–7 | Node.js Easy + Medium API/runtime — 6/day |
| 8–9 | SQL fundamentals + joins — 8/day |
| 10 | MongoDB queries + indexes — 8/day |
| 11 | Mixed timed set (JS Medium + one Node) |
| 12 | Weak-area review only |
| 13 | One Hard JS + one system-flavored Node challenge |
| 14 | Light review + sleep; no new topics |

### 6-week deep prep

- **Weeks 1–2:** JS Easy → Medium; 60–90 min/day
- **Week 3:** Node.js track (streams, events, error-first callbacks, async)
- **Week 4:** SQL + MongoDB alternating days
- **Week 5:** Medium/Hard mix; mock interviews (45 min)
- **Week 6:** Mistakes journal only; company-tagged topics

### Ongoing (employed, interviewing casually)

- 4 weekdays × 45 minutes: 3 Easy or 1–2 Medium
- Saturday: 1 Hard or 1 Node deep-dive
- Sunday: review journal, no new problems

## Difficulty progression

```text
Warm-up     →  Easy patterns you can finish in <20 min
Interview   →  Medium: 25–40 min with narration
Stretch     →  Hard: 45–60 min; focus on approach even if code incomplete
Backend mix →  Node/Mongo/SQL after JS fundamentals feel stable
```

Do not grind Hard problems while Easy hash-map/string problems still feel shaky.

## Interview tips (all tracks)

- Clarify types, empty inputs, duplicates, and overflow early.
- For backend prompts: ask about concurrency, idempotency, and failure modes.
- Prefer clear code over clever one-liners.
- After coding, list tests: null/empty, single element, large n, adversarial order.
- If stuck 5 minutes, state what you know and try a simpler version of the problem.
- Manage time: leave 5 minutes to walk through an example on your code.

## Tracking progress

Keep a simple log:

| Date | Track | # | Difficulty | Result | Technique to reuse |
|---|---|---|---|---|---|
| | JS | 42 | Easy | Solved | sliding window |

Re-solve any “needed hint” problem within a week.

## Related prep

- [System Design](../16-System-Design/README.md) — for design rounds
- [Interview Questions](../21-Interview-Questions/README.md) — conceptual Q&A
- Topic modules under `01`–`15` for fundamentals before grinding challenges
