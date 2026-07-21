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
