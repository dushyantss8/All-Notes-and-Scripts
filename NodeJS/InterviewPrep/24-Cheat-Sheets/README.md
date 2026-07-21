# 24 — Cheat Sheets

> Fast lookup cards for interview day and daily revision. Use these after you understand the topic — not as a first read.

---

## Who This Section Is For

- Candidates in the last 48 hours before interviews
- Engineers who want a single scrollable reminder of syntax and gotchas
- Anyone pairing deep sections (01–18) with rapid drills

**Prerequisites:** Work through the matching deep-dive section at least once.

---

## How to Use

1. Skim the sheet once; mark 3–5 weak lines.
2. Recite aloud without looking (HTTP statuses, event-loop order, index rules).
3. Cross-link back to the full section when a line is fuzzy.
4. On interview morning, reread [interview-day](./interview-day.md) only.

```mermaid
flowchart LR
  Study[Deep sections 01-18] --> Sheets[Cheat sheets]
  Sheets --> Day[Interview day card]
  Day --> Review[25 Revision Notes]
```

---

## Sheet Index

| Sheet | File | Use when |
|-------|------|----------|
| JavaScript | [javascript.md](./javascript.md) | Types, coercion, arrays, this |
| Node.js | [nodejs.md](./nodejs.md) | Modules, event loop, process, fs |
| Express | [express.md](./express.md) | Middleware order, errors, routing |
| MongoDB | [mongodb.md](./mongodb.md) | CRUD, indexes, aggregation snippets |
| SQL | [sql.md](./sql.md) | Joins, windows, EXPLAIN cues |
| HTTP Status | [http-status.md](./http-status.md) | Choosing 2xx/4xx/5xx quickly |
| Git | [git.md](./git.md) | Branching, rebase vs merge, undo |
| Linux | [linux.md](./linux.md) | Process, pipes, permissions |
| Interview Day | [interview-day.md](./interview-day.md) | Warm-up checklist |

---

## Study Roadmap (1–2 days)

| Block | Sheets | Goal |
|-------|--------|------|
| Language + runtime | JS, Node | Predict output; event-loop story |
| HTTP + API | Express, HTTP status | Status code discipline |
| Data | MongoDB, SQL | Index + join one-liners |
| Ops glue | Git, Linux | Debug a failed deploy story |
| Day-of | Interview day | Calm, structured answers |

---

## Interview Focus

- Prefer one crisp example per bullet over memorizing entire sheets.
- Tie each reminder to a production failure you can describe.
- Use HTTP status and Mongo index lines in system-design follow-ups.

---

## Common Pitfalls

- Reading cheat sheets instead of building [19-Projects](../19-Projects/README.md).
- Out-of-date snippets — verify against current Node/Express docs if unsure.
- Dumping sheet contents verbatim in interviews; interviewers want reasoning.
