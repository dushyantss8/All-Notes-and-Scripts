# SQL Exercises

> **Interview goal:** explain the mechanism, identify the trade-off, then show how you would verify it in production.

## What it is

Practice reading a schema, writing correct joins and windows, and justifying indexes from query shape.


## Core APIs and concepts

- joins, CTEs, constraints, plans, transactions
- Prefer official API contracts over folklore; behavior can vary across Node, Express, MongoDB, Mongoose, MySQL, and PostgreSQL versions.
- Keep input validation, authorization, limits, error translation, and observability close to the system boundary.

## Practical example

```js
// SQL reference: use parameterized values through your database driver.
const postgres = {
  text: `SELECT customer_id, SUM(total) AS revenue
         FROM orders
         WHERE created_at >= $1 AND status = $2
         GROUP BY customer_id
         HAVING SUM(total) > $3
         ORDER BY revenue DESC
         LIMIT $4`,
  values: ["2026-01-01", "paid", 100, 20],
};

// PostgreSQL: INSERT ... ON CONFLICT (email) DO UPDATE SET ...
// MySQL:      INSERT ... ON DUPLICATE KEY UPDATE ...
// Always inspect with EXPLAIN (ANALYZE, BUFFERS) in PostgreSQL or EXPLAIN ANALYZE in MySQL 8.
```

The runnable starter is in [`example.js`](./example.js). Adapt it with explicit tests and environment-specific configuration; do not paste credentials into source.

## Query drills

```sql
-- Top two orders per customer (PostgreSQL / MySQL 8)
WITH ranked AS (
  SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total DESC) AS rn
  FROM orders o
)
SELECT * FROM ranked WHERE rn <= 2;

-- Find customers with no orders
SELECT c.* FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## Production notes

1. Measure before optimizing: collect latency, error, saturation, and execution-plan evidence.
2. Make timeouts, resource limits, retries, and cancellation intentional.
3. Treat all external input and operational metadata as untrusted until validated or redacted.

## Interview questions with answer direction

1. **How would you validate a query's correctness and performance?**  
   Start with the invariant or runtime behavior, then state the trade-off and a concrete operational example.
2. **Which queries need a transaction?**  
   Mention failure modes, observability, and how you would test the claim.
3. **What would change at 10× traffic or data volume?**  
   Discuss bottlenecks, load distribution, indexes/caching/queues where relevant, and correctness first.

## Exercises

- [ ] Solve the query drills against sample tables.
- [ ] Write a failing test for its error or boundary case.
- [ ] Record the metric, trace, explain plan, or benchmark that would prove the implementation is correct.

## Official references

- [SQL: MySQL and PostgreSQL documentation](https://www.postgresql.org/docs/current/)
