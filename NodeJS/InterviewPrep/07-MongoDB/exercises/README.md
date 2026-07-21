# MongoDB Exercises

> **Interview goal:** explain the mechanism, identify the trade-off, then show how you would verify it in production.

## What it is

Focus on query-shape reasoning, aggregation design, indexing evidence, and resilient data models.


## Core APIs and concepts

- filters, pipeline, explain, transactions
- Prefer official API contracts over folklore; behavior can vary across Node, Express, MongoDB, Mongoose, MySQL, and PostgreSQL versions.
- Keep input validation, authorization, limits, error translation, and observability close to the system boundary.

## Practical example

```js
// Run with mongosh after selecting a disposable database.
db.orders.insertMany([
  { customerId: 1, status: "paid", total: 120, createdAt: new Date("2026-01-10") },
  { customerId: 2, status: "paid", total: 80, createdAt: new Date("2026-01-11") }
]);

// Inspect the plan before assuming this query is fast.
db.orders.createIndex({ status: 1, createdAt: -1 });
db.orders.find({ status: "paid" }, { total: 1, createdAt: 1, _id: 0 })
  .sort({ createdAt: -1 }).limit(20).explain("executionStats");

// Aggregate only the needed documents and fields.
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$customerId", revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  { $sort: { revenue: -1 } }
]);
```

The runnable starter is in [`example.js`](./example.js). Adapt it with explicit tests and environment-specific configuration; do not paste credentials into source.

## mongosh drills

```javascript
// Exact filter + projection; do not fetch fields the endpoint cannot return.
db.users.find({ active: true, age: { $gte: 18 } }, { email: 1, name: 1 });

// Safe update: filter must be as specific as the business invariant requires.
db.users.updateOne({ _id: userId, status: "pending" }, { $set: { status: "active" } });

// Inspect actual scanned documents and chosen index.
db.users.find({ email: "a@example.com" }).explain("executionStats");
```

## Production notes

1. Measure before optimizing: collect latency, error, saturation, and execution-plan evidence.
2. Make timeouts, resource limits, retries, and cancellation intentional.
3. Treat all external input and operational metadata as untrusted until validated or redacted.

## Interview questions with answer direction

1. **How would you estimate the impact of a new index?**  
   Start with the invariant or runtime behavior, then state the trade-off and a concrete operational example.
2. **What data-modeling trade-off is most likely to affect scale?**  
   Mention failure modes, observability, and how you would test the claim.
3. **What would change at 10× traffic or data volume?**  
   Discuss bottlenecks, load distribution, indexes/caching/queues where relevant, and correctness first.

## Exercises

- [ ] Complete every query against sample data and record explain output.
- [ ] Write a failing test for its error or boundary case.
- [ ] Record the metric, trace, explain plan, or benchmark that would prove the implementation is correct.

## Official references

- [MongoDB Data and Operations documentation](https://www.mongodb.com/docs/manual/)
