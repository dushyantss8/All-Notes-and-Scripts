# SQL Challenge Bank

100 questions in [challenges.md](challenges.md). **Every challenge includes a reference solution** — focus on join logic, null behavior, and indexes. Dialects note MySQL vs PostgreSQL where they differ.

## How to use

1. Restate tables, grain (one row means…), and required output columns.
2. Write SQL without running it first if practicing whiteboard style; then verify when you can.
3. For each query, name the join type and whether duplicates can explode rows.
4. After solving, ask: which index would make this production-safe?
5. Retry any query you got wrong on nulls, `GROUP BY`, or window functions.

## Difficulty progression

```text
1–40    Easy — SELECT filters, joins, GROUP BY, basic DDL/indexes, simple windows
41–70   Medium — keyset pagination, EXISTS, dialect upserts/JSON, FOR UPDATE, pivots
71–100  Hard — sessions/islands, exclusion constraints, FDW, advisory locks, online DDL
```

Master `LEFT JOIN` + `GROUP BY` + nulls before heavy window-function grinding.

## Study plans

### 1-week SQL sprint

| Day | Focus | Approx. |
|---|---|---|
| 1 | Filtering & aggregates | 1–12 |
| 2 | GROUP BY / HAVING / joins | 13–28 |
| 3 | Windows & CTEs | 14–24, 29–40 |
| 4 | Subqueries / EXISTS / dialect notes | 41–55 |
| 5 | Transactions & locking | 56–70 |
| 6 | Schema & advanced PG/MySQL | 71–85 |
| 7 | Mixed timed set | misses + 86–100 |

### Pair with Mongo

Same day of week: morning SQL, evening Mongo (or alternate days). Interviewers often ask you to justify SQL for payments/inventory and document stores for flexible catalog content.

## Tips for SQL interviews

- Clarify **one-to-many** relationships before joining — row multiplication is the #1 bug.
- Prefer `EXISTS` over `IN` for correlated “has child” checks when appropriate; know both.
- `COUNT(*)` vs `COUNT(col)` (nulls); `SUM` ignores nulls.
- `WHERE` filters pre-aggregate; `HAVING` filters post-aggregate.
- Window functions: `PARTITION BY` / `ORDER BY` / frame — say them explicitly.
- Index talk: equality columns first, then range; covering indexes when useful.
- Transactions: read committed vs repeatable read at a high level; when you need `SELECT FOR UPDATE`.
- Avoid `SELECT *` in production-shaped answers.
- Call out MySQL vs PostgreSQL differences (FULL OUTER JOIN, partial indexes, `RETURNING`, `SKIP LOCKED`, JSON operators).

## Mental checklist

- [ ] Correct grain of result  
- [ ] Join predicates complete (no accidental Cartesian)  
- [ ] Null-safe logic (`IS NULL`, coalescing)  
- [ ] Deterministic `ORDER BY` when using limits  
- [ ] Index sketch for hot filters  

## Related

- Parent: [Coding Challenges](../README.md)  
- Concepts: [SQL interview Q&A](../../21-Interview-Questions/sql/README.md)
