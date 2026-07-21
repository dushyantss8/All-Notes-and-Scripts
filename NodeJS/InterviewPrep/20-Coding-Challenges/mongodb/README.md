# MongoDB Challenge Bank

100 questions in [challenges.md](challenges.md). **Every challenge includes a reference solution** — study the query shape and index rationale.

## How to use

1. Read each prompt as a product question: what must be fast? unique? consistent?
2. Write the query / aggregation yourself first.
3. Sketch the index you expect (`explain` mentally: filter → sort → project).
4. Compare to the worked solution; note operator choices (`$lookup` vs app join, etc.).
5. Re-do missed aggregations a few days later without looking.

## Difficulty progression

```text
1–40    Easy — CRUD, filters, projection, sort/limit, basic indexes & aggregation
41–70   Medium — arrays, keyset pagination, lookup pipelines, text/geo, modeling
71–100  Hard — sharding, transactions, change streams, cohort pipelines, write concerns
```

If aggregations feel opaque, pause and review `$match` → `$group` → `$project` ordering rules (match early).

## Study plans

### 1-week Mongo sprint

| Day | Focus | Approx. |
|---|---|---|
| 1 | Find/update/delete, operators | 1–15 |
| 2 | Indexes & uniqueness | 16–30 |
| 3 | Aggregation basics | 27–40 |
| 4 | `$lookup`, `$unwind`, facets, arrays | 41–55 |
| 5 | Modeling (embed vs reference) | 56–70 |
| 6 | Transactions / atomic patterns | 71–85 |
| 7 | Timed mixed + review | misses + 86–100 |

### Interview integration

- Alternate days with [SQL](../sql/README.md) so you can compare “when Mongo vs when relational.”
- After each modeling question, speak aloud: access patterns → schema → indexes → consistency.

## Tips for MongoDB interviews

- **Design from queries**, not from entity diagrams alone.
- Embedding is great for data read together; referencing for many-to-many / unbounded growth.
- Index fields used in filter + sort; beware unused indexes and write cost.
- Aggregation: reduce documents early (`$match` first).
- Know multikey index pitfalls and ESR (Equality, Sort, Range) rule of thumb.
- Explain atomic single-document updates vs multi-document transactions.
- Mention working set in RAM and covered queries when relevant.
- Avoid unbounded arrays that grow forever on hot documents.

## Checklist

- [ ] Equality / range / sort supported by index  
- [ ] No collection scan on hot path (in design discussion)  
- [ ] Unique constraints where business requires  
- [ ] Idempotent updates when retries happen  
- [ ] Clear embed vs reference decision  

## Related

- Parent: [Coding Challenges](../README.md)  
- Concepts: [MongoDB interview Q&A](../../21-Interview-Questions/mongodb/README.md)
