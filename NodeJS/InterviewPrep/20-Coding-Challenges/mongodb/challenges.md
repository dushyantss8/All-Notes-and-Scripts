# MongoDB Challenges

100 MongoDB query, aggregation, indexing, and modeling problems. Every challenge includes a reference solution that matches the title.

## 1. Find documents by equality
**Difficulty:** Easy

**Question:** Collection `users` has `{ _id, email, status, createdAt }`. Return all users where `status` equals `"active"`.

**Hints:** Use `find` with an equality filter. Index `status` (or a compound starting with it) for large collections.

**Solution:**
```javascript
db.users.find({ status: "active" })
```
**Time Complexity:** O(log n + k) with an index on status; O(n) without (k = matches).
**Space Complexity:** O(1) beyond the result cursor batch.

## 2. Project selected fields
**Difficulty:** Easy

**Question:** From `users`, return only `name` and `email` (include `_id` by default). Do not return other fields such as `passwordHash`.

**Hints:** Second argument to `find` is a projection. Use inclusion (`1`) for the fields you want.

**Solution:**
```javascript
db.users.find({}, { name: 1, email: 1 })
```
**Time Complexity:** Same scan cost as the filter; projection mainly reduces bytes transferred.
**Space Complexity:** Smaller documents on the wire.

## 3. Sort and limit results
**Difficulty:** Easy

**Question:** From `orders` `{ _id, total, createdAt }`, return the 10 most recent orders by `createdAt` descending.

**Hints:** `sort` then `limit`. An index on `createdAt` avoids a large in-memory sort.

**Solution:**
```javascript
db.orders.find({}).sort({ createdAt: -1 }).limit(10)
```
**Time Complexity:** O(log n + 10) with index on createdAt; otherwise sort scales with n.
**Space Complexity:** O(1) for limit 10 if index-backed.

## 4. Skip-based pagination
**Difficulty:** Easy

**Question:** Paginate `products` sorted by `name` ascending, page size 20, page index 2 (third page).

**Hints:** `skip(page * pageSize).limit(pageSize)`. Deep skip is expensive — prefer keyset pagination later.

**Solution:**
```javascript
db.products.find({}).sort({ name: 1 }).skip(40).limit(20)
```
**Time Complexity:** O(skip + limit) — deep pages still walk skipped docs.
**Space Complexity:** O(page size) for the returned batch.

## 5. Filter nested documents
**Difficulty:** Easy

**Question:** Collection `orders` embeds `shipping: { city, country }`. Find orders with `shipping.city` equal to `"Berlin"`.

**Hints:** Dot notation: `"shipping.city"`. Index that path if the filter is common.

**Solution:**
```javascript
db.orders.find({ "shipping.city": "Berlin" })
```
**Time Complexity:** O(log n + k) with index on shipping.city; else O(n).
**Space Complexity:** O(1) beyond results.

## 6. Use $in and $nin
**Difficulty:** Easy

**Question:** Find `products` whose `category` is in `["books","music","games"]` and whose `status` is not `"archived"` (use `$nin`).

**Hints:** `$in` for membership; `$nin` for exclusion. Index `category` when selective.

**Solution:**
```javascript
db.products.find({
  category: { $in: ["books", "music", "games"] },
  status: { $nin: ["archived"] }
})
```
**Time Complexity:** O(log n + k) with supporting indexes; $nin is often less selective.
**Space Complexity:** O(1) beyond results.

## 7. Use $exists and null checks
**Difficulty:** Easy

**Question:** Find `users` that have `emailVerifiedAt` present and not null.

**Hints:** `$exists: true` alone still matches explicit null — combine with `$ne: null`.

**Solution:**
```javascript
db.users.find({
  emailVerifiedAt: { $exists: true, $ne: null }
})
```
**Time Complexity:** Often a collection scan unless a sparse/partial index covers the field.
**Space Complexity:** O(1) beyond results.

## 8. Insert one document
**Difficulty:** Easy

**Question:** Insert `{ email: "a@example.com", status: "active", createdAt: new Date() }` into `users`.

**Hints:** `insertOne`. Let MongoDB assign `_id` unless you supply one.

**Solution:**
```javascript
db.users.insertOne({
  email: "a@example.com",
  status: "active",
  createdAt: new Date()
})
```
**Time Complexity:** O(1) plus index maintenance per index.
**Space Complexity:** O(1) for the write.

## 9. Insert many documents
**Difficulty:** Easy

**Question:** Bulk-insert three products `{ name, price }` into `products` with one call.

**Hints:** `insertMany`. Choose `ordered: true/false` for failure behavior.

**Solution:**
```javascript
db.products.insertMany([
  { name: "Keyboard", price: 49.99 },
  { name: "Mouse", price: 24.99 },
  { name: "Monitor", price: 199.99 }
])
```
**Time Complexity:** O(m) for m inserts plus index updates.
**Space Complexity:** O(m) for the batch payload.

## 10. Update fields with $set
**Difficulty:** Easy

**Question:** For `_id: ObjectId("64f000000000000000000001")` in `users`, set `name` to `"Ada"` and `updatedAt` to now.

**Hints:** `updateOne` with `$set` — do not replace the whole document.

**Solution:**
```javascript
db.users.updateOne(
  { _id: ObjectId("64f000000000000000000001") },
  { $set: { name: "Ada", updatedAt: new Date() } }
)
```
**Time Complexity:** O(log n) by _id, then O(1) document update.
**Space Complexity:** O(1).

## 11. Update with upsert
**Difficulty:** Easy

**Question:** Ensure a settings doc for `tenantId: "t1"` exists and set `theme: "dark"`. Insert if missing.

**Hints:** `upsert: true` with `$set` and `$setOnInsert` for create-only fields.

**Solution:**
```javascript
db.settings.updateOne(
  { tenantId: "t1" },
  {
    $set: { theme: "dark" },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
)
```
**Time Complexity:** O(log n) with unique index on tenantId.
**Space Complexity:** O(1).

## 12. Increment a counter
**Difficulty:** Easy

**Question:** Atomically increment `loginCount` by 1 for the user with `email: "a@example.com"`.

**Hints:** `$inc` is atomic on a single document.

**Solution:**
```javascript
db.users.updateOne(
  { email: "a@example.com" },
  { $inc: { loginCount: 1 } }
)
```
**Time Complexity:** O(log n) with index on email.
**Space Complexity:** O(1).

## 13. Push to an array
**Difficulty:** Easy

**Question:** On `posts` `_id: postId`, append `{ userId, text, at: new Date() }` to `comments`.

**Hints:** `$push`. Beware unbounded growth on hot documents.

**Solution:**
```javascript
db.posts.updateOne(
  { _id: postId },
  { $push: { comments: { userId, text, at: new Date() } } }
)
```
**Time Complexity:** O(log n) locate + rewrite cost proportional to document size.
**Space Complexity:** Document grows by one array element.

## 14. Pull from an array
**Difficulty:** Easy

**Question:** From `users` `_id: userId`, remove all `roles` elements equal to `"guest"`.

**Hints:** `$pull` removes matching values from an array.

**Solution:**
```javascript
db.users.updateOne(
  { _id: userId },
  { $pull: { roles: "guest" } }
)
```
**Time Complexity:** O(log n) + O(array length).
**Space Complexity:** O(1) extra beyond the document.

## 15. Add unique values with $addToSet
**Difficulty:** Easy

**Question:** Add tag `"nodejs"` to `tags` on product `_id: productId` without duplicating it.

**Hints:** `$addToSet` vs `$push`.

**Solution:**
```javascript
db.products.updateOne(
  { _id: productId },
  { $addToSet: { tags: "nodejs" } }
)
```
**Time Complexity:** O(log n) + O(array length) membership check.
**Space Complexity:** O(1) if present; else +1 element.

## 16. Update matching array element
**Difficulty:** Easy

**Question:** In `orders` `_id: orderId`, set quantity to 3 for the item where `items.sku === "ABC"` using the positional operator.

**Hints:** Filter must match the array element; use `items.$`.

**Solution:**
```javascript
db.orders.updateOne(
  { _id: orderId, "items.sku": "ABC" },
  { $set: { "items.$.quantity": 3 } }
)
```
**Time Complexity:** O(log n) + scan of items on the document.
**Space Complexity:** O(1).

## 17. Delete one document
**Difficulty:** Easy

**Question:** Delete the user with `email: "gone@example.com"`.

**Hints:** `deleteOne` removes at most one match.

**Solution:**
```javascript
db.users.deleteOne({ email: "gone@example.com" })
```
**Time Complexity:** O(log n) with index on email.
**Space Complexity:** O(1).

## 18. Delete many by filter
**Difficulty:** Easy

**Question:** Delete all `sessions` where `expiresAt` is less than now.

**Hints:** `deleteMany`. Prefer a TTL index for automatic expiry when appropriate.

**Solution:**
```javascript
db.sessions.deleteMany({ expiresAt: { $lt: new Date() } })
```
**Time Complexity:** Roughly O(k log n) for k deletes with an index on expiresAt.
**Space Complexity:** O(1).

## 19. Count matching documents
**Difficulty:** Easy

**Question:** Count how many `orders` have `status: "paid"`.

**Hints:** `countDocuments` (preferred over legacy `count`).

**Solution:**
```javascript
db.orders.countDocuments({ status: "paid" })
```
**Time Complexity:** Depends on filter/index; typically better than fetching all docs.
**Space Complexity:** O(1).

## 20. Distinct field values
**Difficulty:** Easy

**Question:** Return distinct `city` values from `stores`.

**Hints:** `distinct("city")`.

**Solution:**
```javascript
db.stores.distinct("city")
```
**Time Complexity:** O(n) worst case; index on city can help.
**Space Complexity:** O(u) for u distinct values.

## 21. Create a unique index
**Difficulty:** Easy

**Question:** Enforce uniqueness of `email` on `users`.

**Hints:** `createIndex` with `unique: true`. Fails if duplicates already exist.

**Solution:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```
**Time Complexity:** Build O(n log n); lookups O(log n).
**Space Complexity:** O(n) index storage.

## 22. Create a compound index
**Difficulty:** Easy

**Question:** Index `events` to filter by `tenantId` and sort by `createdAt` descending.

**Hints:** ESR: equality first, then sort — `{ tenantId: 1, createdAt: -1 }`.

**Solution:**
```javascript
db.events.createIndex({ tenantId: 1, createdAt: -1 })
```
**Time Complexity:** Build O(n log n); matching queries O(log n + k).
**Space Complexity:** O(n) index entries.

## 23. Create a multikey index
**Difficulty:** Easy

**Question:** `products` has `tags: [String]`. Index so `{ tags: "sale" }` is efficient.

**Hints:** Indexing an array field creates a multikey index.

**Solution:**
```javascript
db.products.createIndex({ tags: 1 })
```
**Time Complexity:** Query O(log n + k); index grows with tag occurrences.
**Space Complexity:** One index key per array element per document.

## 24. Create a partial index
**Difficulty:** Easy

**Question:** Index `orders.createdAt` only for documents where `status: "open"`.

**Hints:** `partialFilterExpression` keeps the index smaller.

**Solution:**
```javascript
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: "open" } }
)
```
**Time Complexity:** Faster maintenance/lookups for queries that match the filter.
**Space Complexity:** Proportional to docs matching the partial filter.

## 25. Create a TTL index
**Difficulty:** Easy

**Question:** Expire `sessions` automatically 3600 seconds after `createdAt`.

**Hints:** TTL index on a date field with `expireAfterSeconds`.

**Solution:**
```javascript
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
)
```
**Time Complexity:** Background TTL deletes in batches — not instantaneous.
**Space Complexity:** Index O(n); documents removed over time.

## 26. Explain a query plan
**Difficulty:** Easy

**Question:** Show the execution plan (with stats) for `find({ status: "active" })` on `users`.

**Hints:** `.explain("executionStats")` on the cursor.

**Solution:**
```javascript
db.users.find({ status: "active" }).explain("executionStats")
```
**Time Complexity:** executionStats runs the query once — cost ≈ that query.
**Space Complexity:** Plan/stats object only.

## 27. Find duplicate emails
**Difficulty:** Easy

**Question:** Using aggregation on `users`, find `email` values that appear more than once, with counts.

**Hints:** `$group` by email, then `$match` on count > 1.

**Solution:**
```javascript
db.users.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
```
**Time Complexity:** O(n) to group all emails.
**Space Complexity:** O(u) unique emails during grouping.

## 28. Aggregate total sales
**Difficulty:** Easy

**Question:** From paid `orders` (`status: "paid"`), compute the sum of `total` as a single value.

**Hints:** `$match` then `$group` with `_id: null` and `$sum`.

**Solution:**
```javascript
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: null, totalSales: { $sum: "$total" } } }
])
```
**Time Complexity:** O(n) over paid orders (index on status helps).
**Space Complexity:** O(1) for a single group.

## 29. Group by category
**Difficulty:** Easy

**Question:** On `products`, count documents per `category`.

**Hints:** `$group` by `$category` with `$sum: 1`.

**Solution:**
```javascript
db.products.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(number of categories).

## 30. Early $match filtering
**Difficulty:** Easy

**Question:** Compute average `amount` from `payments` for `currency: "USD"` and `createdAt >= 2024-01-01`. Put `$match` first.

**Hints:** Always reduce documents before `$group`.

**Solution:**
```javascript
db.payments.aggregate([
  {
    $match: {
      currency: "USD",
      createdAt: { $gte: ISODate("2024-01-01T00:00:00Z") }
    }
  },
  { $group: { _id: null, avgAmount: { $avg: "$amount" } } }
])
```
**Time Complexity:** O(m) on matched subset m when selective.
**Space Complexity:** O(1) for one group.

## 31. Compute averages per customer
**Difficulty:** Easy

**Question:** For paid `orders`, compute average `total` per `customerId`.

**Hints:** `$match` then `$group` with `$avg`.

**Solution:**
```javascript
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$customerId", avgTotal: { $avg: "$total" } } }
])
```
**Time Complexity:** O(n) over paid orders.
**Space Complexity:** O(distinct customers).

## 32. Min and max per group
**Difficulty:** Easy

**Question:** Per `productId` in `prices` `{ productId, price, at }`, find min and max `price`.

**Hints:** `$group` with `$min` and `$max`.

**Solution:**
```javascript
db.prices.aggregate([
  {
    $group: {
      _id: "$productId",
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" }
    }
  }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(distinct productIds).

## 33. Use $project expressions
**Difficulty:** Easy

**Question:** From `orders`, project `_id`, `customerId`, and `totalCents` as `total * 100`.

**Hints:** `$project` with `$multiply`.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $project: {
      customerId: 1,
      totalCents: { $multiply: ["$total", 100] }
    }
  }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(1) per output document streaming.

## 34. Conditional field with $cond
**Difficulty:** Easy

**Question:** Project `orders` with `label` `"high"` if `total >= 100`, else `"normal"`.

**Hints:** `$cond: [condition, then, else]`.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $project: {
      total: 1,
      label: {
        $cond: [{ $gte: ["$total", 100] }, "high", "normal"]
      }
    }
  }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(1) per document.

## 35. Join with $lookup
**Difficulty:** Easy

**Question:** For each `orders` document, join `users` where `orders.customerId` equals `users._id`, as array `customer`.

**Hints:** `$lookup` with localField/foreignField/as.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  }
])
```
**Time Complexity:** Roughly O(n · lookup); index on foreignField helps.
**Space Complexity:** Each order carries a customer array (usually 0–1).

## 36. Flatten arrays with $unwind
**Difficulty:** Easy

**Question:** `orders` has `items: [{ sku, qty }]`. Produce one document per item.

**Hints:** `$unwind: "$items"`.

**Solution:**
```javascript
db.orders.aggregate([
  { $unwind: "$items" }
])
```
**Time Complexity:** O(total items across orders).
**Space Complexity:** Output size = sum of array lengths.

## 37. Unwind preserving empty arrays
**Difficulty:** Easy

**Question:** Unwind `orders.items` but keep orders with missing/empty `items`.

**Hints:** `preserveNullAndEmptyArrays: true`.

**Solution:**
```javascript
db.orders.aggregate([
  { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } }
])
```
**Time Complexity:** O(n + total items).
**Space Complexity:** At least one output doc per order.

## 38. Bucket values with $bucket
**Difficulty:** Easy

**Question:** Bucket `users.age` into boundaries `[0, 18, 30, 50, 120]` and count each bucket.

**Hints:** `$bucket` with groupBy, boundaries, default, output.

**Solution:**
```javascript
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 30, 50, 120],
      default: "other",
      output: { count: { $sum: 1 } }
    }
  }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(number of buckets).

## 39. Facet multiple pipelines
**Difficulty:** Easy

**Question:** On `orders`, in one aggregation return (a) counts by `status` and (b) top 5 by `total` descending using `$facet`.

**Hints:** `$facet` runs parallel sub-pipelines on the same input.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $facet: {
      byStatus: [
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ],
      topTotals: [
        { $sort: { total: -1 } },
        { $limit: 5 }
      ]
    }
  }
])
```
**Time Complexity:** Approximately the sum of sub-pipeline costs.
**Space Complexity:** Facet outputs held in memory — keep them small.

## 40. Filter by date range
**Difficulty:** Easy

**Question:** Find `orders` with `createdAt` from 2024-01-01 inclusive to 2024-02-01 exclusive.

**Hints:** `$gte` / `$lt` on ISODate. Index `createdAt`.

**Solution:**
```javascript
db.orders.find({
  createdAt: {
    $gte: ISODate("2024-01-01T00:00:00Z"),
    $lt: ISODate("2024-02-01T00:00:00Z")
  }
})
```
**Time Complexity:** O(log n + k) with index on createdAt.
**Space Complexity:** O(1) beyond results.

## 41. Keyset cursor pagination
**Difficulty:** Medium

**Question:** Paginate `events` sorted by `createdAt` desc, `_id` desc. Given last seen `{ createdAt, _id }`, return the next 20 without `skip`.

**Hints:** Compound keyset with `$or` for timestamp ties.

**Solution:**
```javascript
db.events.find({
  $or: [
    { createdAt: { $lt: lastCreatedAt } },
    { createdAt: lastCreatedAt, _id: { $lt: lastId } }
  ]
}).sort({ createdAt: -1, _id: -1 }).limit(20)
```
**Time Complexity:** O(log n + 20) with index { createdAt: -1, _id: -1 }.
**Space Complexity:** O(1) beyond page size.

## 42. Match array element with $elemMatch
**Difficulty:** Medium

**Question:** Find `orders` with at least one item where `sku: "ABC"` AND `qty >= 2` on the same item.

**Hints:** Dot notation can mix fields across items — use `$elemMatch`.

**Solution:**
```javascript
db.orders.find({
  items: { $elemMatch: { sku: "ABC", qty: { $gte: 2 } } }
})
```
**Time Complexity:** O(n) or better with multikey index on items.sku.
**Space Complexity:** O(1) beyond results.

## 43. Filter by array size
**Difficulty:** Medium

**Question:** Find `users` whose `roles` array has exactly 3 elements.

**Hints:** `$size: 3`. Cannot combine `$size` with inequality ranges directly.

**Solution:**
```javascript
db.users.find({ roles: { $size: 3 } })
```
**Time Complexity:** Typically O(n); store a count field if this is hot.
**Space Complexity:** O(1) beyond results.

## 44. Project array slice
**Difficulty:** Medium

**Question:** Return `posts` with `_id`, `title`, and only the last 2 `comments`.

**Hints:** Projection `$slice: -2`.

**Solution:**
```javascript
db.posts.find({}, { title: 1, comments: { $slice: -2 } })
```
**Time Complexity:** O(n) reads; slice reduces payload.
**Space Complexity:** Smaller documents returned.

## 45. Replace an entire document
**Difficulty:** Medium

**Question:** Replace `profiles` `_id: id` with `{ _id: id, name: "Bea", bio: "" }` using `replaceOne`.

**Hints:** `replaceOne` replaces the whole document; `_id` must stay the same.

**Solution:**
```javascript
db.profiles.replaceOne(
  { _id: id },
  { _id: id, name: "Bea", bio: "" }
)
```
**Time Complexity:** O(log n).
**Space Complexity:** O(1).

## 46. findOneAndUpdate returning the new doc
**Difficulty:** Medium

**Question:** Atomically claim the oldest queued job: set `status: "processing"` on the oldest `jobs` doc with `status: "queued"` (sort `createdAt` asc) and return the updated document.

**Hints:** `findOneAndUpdate` with `sort` and `returnDocument: "after"`.

**Solution:**
```javascript
db.jobs.findOneAndUpdate(
  { status: "queued" },
  { $set: { status: "processing", startedAt: new Date() } },
  { sort: { createdAt: 1 }, returnDocument: "after" }
)
```
**Time Complexity:** O(log n) with index { status: 1, createdAt: 1 }.
**Space Complexity:** O(1).

## 47. Soft-delete filter
**Difficulty:** Medium

**Question:** Find `users` with `status: "active"` and `deletedAt: null` (soft-deleted users excluded).

**Hints:** Keep `deletedAt: null` explicit; a partial index on active rows helps.

**Solution:**
```javascript
db.users.find({
  status: "active",
  deletedAt: null
})
```
**Time Complexity:** O(log n + k) with a supporting compound/partial index.
**Space Complexity:** O(1) beyond results.

## 48. Optimistic concurrency with version
**Difficulty:** Medium

**Question:** Update user `_id: userId` setting `name` only if `version` equals `expectedVersion`, and `$inc` version by 1.

**Hints:** Put version in the filter; check `matchedCount` for conflicts.

**Solution:**
```javascript
db.users.updateOne(
  { _id: userId, version: expectedVersion },
  { $set: { name: newName }, $inc: { version: 1 } }
)
```
**Time Complexity:** O(log n).
**Space Complexity:** O(1).

## 49. Bulk write mixed operations
**Difficulty:** Medium

**Question:** In one `bulkWrite`, insert `{ _id: "p1", name: "X" }` and set `price: 10` on `_id: "p2"` in `products`.

**Hints:** `bulkWrite` with insertOne and updateOne.

**Solution:**
```javascript
db.products.bulkWrite([
  { insertOne: { document: { _id: "p1", name: "X" } } },
  { updateOne: { filter: { _id: "p2" }, update: { $set: { price: 10 } } } }
])
```
**Time Complexity:** O(number of ops) with fewer round-trips.
**Space Complexity:** O(batch size).

## 50. Add computed fields with $addFields
**Difficulty:** Medium

**Question:** Add `fullName` = `firstName + " " + lastName` on `users` without dropping other fields.

**Hints:** `$addFields` with `$concat`.

**Solution:**
```javascript
db.users.aggregate([
  {
    $addFields: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
  }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(1) per document streaming.

## 51. Date histogram with $dateTrunc
**Difficulty:** Medium

**Question:** Count `orders` per UTC calendar day of `createdAt` using `$dateTrunc`.

**Hints:** Group by `{ $dateTrunc: { date: "$createdAt", unit: "day" } }`.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $group: {
      _id: { $dateTrunc: { date: "$createdAt", unit: "day" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(number of days).

## 52. Running total with $setWindowFields
**Difficulty:** Medium

**Question:** On `payments` sorted by `createdAt`, compute running sum of `amount` as `runningTotal`.

**Hints:** `$setWindowFields` with `$sum` over documents from unbounded to current.

**Solution:**
```javascript
db.payments.aggregate([
  {
    $setWindowFields: {
      sortBy: { createdAt: 1 },
      output: {
        runningTotal: {
          $sum: "$amount",
          window: { documents: ["unbounded", "current"] }
        }
      }
    }
  }
])
```
**Time Complexity:** O(n log n) sort + O(n) window.
**Space Complexity:** Sort/window working set can be O(n).

## 53. Rank within groups
**Difficulty:** Medium

**Question:** Rank `employees` by `salary` descending within each `departmentId` using `$rank`.

**Hints:** `$setWindowFields` with partitionBy and `$rank`.

**Solution:**
```javascript
db.employees.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$departmentId",
      sortBy: { salary: -1 },
      output: { rank: { $rank: {} } }
    }
  }
])
```
**Time Complexity:** O(n log n) with partitioning/sorting.
**Space Complexity:** O(n) working memory possible.

## 54. Handle nulls with $ifNull
**Difficulty:** Medium

**Question:** Project `displayName` as `nickname`, else `name`, else `"anonymous"` from `users`.

**Hints:** Nest `$ifNull`.

**Solution:**
```javascript
db.users.aggregate([
  {
    $project: {
      displayName: {
        $ifNull: ["$nickname", { $ifNull: ["$name", "anonymous"] }]
      }
    }
  }
])
```
**Time Complexity:** O(n).
**Space Complexity:** O(1) per document.

## 55. Safe anchored regex search
**Difficulty:** Medium

**Question:** Find `users` whose `email` starts with `"admin"` using a prefix regex (index-friendly).

**Hints:** Anchor with `^`. Avoid leading wildcards.

**Solution:**
```javascript
db.users.find({ email: { $regex: /^admin/ } })
```
**Time Complexity:** Prefix regex can be O(log n + k) with an index; unanchored is O(n).
**Space Complexity:** O(1) beyond results.

## 56. Create a text index
**Difficulty:** Medium

**Question:** Create a text index on `articles` covering `title` and `body`.

**Hints:** Weights optional; `{ title: "text", body: "text" }`.

**Solution:**
```javascript
db.articles.createIndex({ title: "text", body: "text" })
```
**Time Complexity:** Build O(n); search depends on term selectivity.
**Space Complexity:** Text indexes are larger than simple btree indexes.

## 57. Query with $text search
**Difficulty:** Medium

**Question:** With a text index on `articles`, search `"mongodb aggregation"`, project textScore, sort by score.

**Hints:** `$text` + `$meta: "textScore"`.

**Solution:**
```javascript
db.articles.find(
  { $text: { $search: "mongodb aggregation" } },
  { score: { $meta: "textScore" }, title: 1 }
).sort({ score: { $meta: "textScore" } })
```
**Time Complexity:** Depends on inverted-index hits; usually far better than regex scan.
**Space Complexity:** O(result set).

## 58. Geospatial near query
**Difficulty:** Medium

**Question:** `places.location` is a GeoJSON Point with a 2dsphere index. Find places near `[-73.97, 40.77]` within 1000 meters.

**Hints:** `$near` with `$geometry` and `$maxDistance` in meters.

**Solution:**
```javascript
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.97, 40.77] },
      $maxDistance: 1000
    }
  }
})
```
**Time Complexity:** O(log n + k) with 2dsphere index.
**Space Complexity:** O(1) beyond results.

## 59. Top N per group
**Difficulty:** Medium

**Question:** For each `category` in `products`, return the top 3 by `sales` descending.

**Hints:** Sort, `$group` + `$push`, then `$slice` (or window `$rank`).

**Solution:**
```javascript
db.products.aggregate([
  { $sort: { category: 1, sales: -1 } },
  {
    $group: {
      _id: "$category",
      top: { $push: { name: "$name", sales: "$sales" } }
    }
  },
  { $project: { top: { $slice: ["$top", 3] } } }
])
```
**Time Complexity:** O(n log n) sort + O(n) group.
**Space Complexity:** Can be large if groups are huge before slicing — prefer windows at scale.

## 60. Lookup with sub-pipeline
**Difficulty:** Medium

**Question:** Join `orders` to `users` on `customerId` → `_id`, attaching only users with `status: "active"`, projecting `name` and `email`.

**Hints:** `$lookup` with `let` + `pipeline` + `$expr`.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      let: { cid: "$customerId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$cid"] },
            status: "active"
          }
        },
        { $project: { name: 1, email: 1 } }
      ],
      as: "customer"
    }
  }
])
```
**Time Complexity:** Per-order lookup; users._id index makes the match a point read.
**Space Complexity:** Customer array per order.

## 61. Sample random documents
**Difficulty:** Medium

**Question:** Return 5 random documents from `questions` using `$sample`.

**Hints:** `$sample: { size: 5 }`.

**Solution:**
```javascript
db.questions.aggregate([{ $sample: { size: 5 } }])
```
**Time Complexity:** Efficient for small samples vs large n; worst cases may scan.
**Space Complexity:** O(sample size).

## 62. Case-insensitive find with collation
**Difficulty:** Medium

**Question:** Find `users` with `name` equal to `"ada"` using collation locale `en`, strength 1 (case-insensitive).

**Hints:** Match index collation to the query collation.

**Solution:**
```javascript
db.users.find({ name: "ada" }).collation({ locale: "en", strength: 1 })
```
**Time Complexity:** O(log n) with a matching collation index; else may scan.
**Space Complexity:** O(1) beyond results.

## 63. Schema validation rules
**Difficulty:** Medium

**Question:** Create collection `accounts` requiring `email` (string) and `balance` (number >= 0) via `$jsonSchema`.

**Hints:** `createCollection` with `validator`.

**Solution:**
```javascript
db.createCollection("accounts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "balance"],
      properties: {
        email: { bsonType: "string" },
        balance: { bsonType: "number", minimum: 0 }
      }
    }
  }
})
```
**Time Complexity:** Validation cost proportional to document size per write.
**Space Complexity:** O(1) extra.

## 64. Embed vs reference decision
**Difficulty:** Medium

**Question:** Model blog posts that always load with up to ~50 comments (not queried across posts). Show an `insertOne` into `posts` with embedded `comments` referencing `userId`.

**Hints:** Embed bounded data read together; reference unbounded/many-to-many.

**Solution:**
```javascript
db.posts.insertOne({
  title: "Hello Mongo",
  authorId: ObjectId("64f0000000000000000000aa"),
  comments: [
    { userId: ObjectId("64f0000000000000000000bb"), text: "Nice", at: new Date() }
  ],
  createdAt: new Date()
})
```
**Time Complexity:** Single-document read O(log n) — no join.
**Space Complexity:** Document size grows with comments — keep bounded.

## 65. Multi-document transaction
**Difficulty:** Medium

**Question:** Transfer 10 units from account `_id: "A"` to `"B"` in `accounts` inside a transaction (debit only if balance >= 10).

**Hints:** startTransaction; pass session to both updates; commit/abort.

**Solution:**
```javascript
const session = db.getMongo().startSession();
session.startTransaction();
try {
  const accounts = session.getDatabase("app").accounts;
  accounts.updateOne(
    { _id: "A", balance: { $gte: 10 } },
    { $inc: { balance: -10 } },
    { session }
  );
  accounts.updateOne({ _id: "B" }, { $inc: { balance: 10 } }, { session });
  session.commitTransaction();
} catch (e) {
  session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}
```
**Time Complexity:** Higher latency than single-doc writes; conflicts may retry.
**Space Complexity:** O(1); transaction holds resources until commit.

## 66. Watch a change stream
**Difficulty:** Medium

**Question:** Open a change stream on `orders` that only emits `insert` events.

**Hints:** `watch` with `$match` on `operationType`.

**Solution:**
```javascript
const cursor = db.orders.watch([
  { $match: { operationType: "insert" } }
]);
while (cursor.hasNext()) {
  printjson(cursor.next());
}
```
**Time Complexity:** Event-driven; not a collection scan.
**Space Complexity:** Store resume tokens for durability.

## 67. Create a capped collection
**Difficulty:** Medium

**Question:** Create capped collection `recent_errors` with size 1MB.

**Hints:** `capped: true`, `size` in bytes.

**Solution:**
```javascript
db.createCollection("recent_errors", { capped: true, size: 1024 * 1024 })
```
**Time Complexity:** Inserts O(1); oldest overwritten when full.
**Space Complexity:** Fixed ~1MB.

## 68. Outbox collection pattern
**Difficulty:** Medium

**Question:** Insert a domain event into `outbox`: `{ aggregateId, type, payload, createdAt, publishedAt: null }`.

**Hints:** In production, write outbox in the same transaction as the domain change.

**Solution:**
```javascript
db.outbox.insertOne({
  aggregateId: orderId,
  type: "OrderPaid",
  payload: { orderId, total },
  createdAt: new Date(),
  publishedAt: null
})
```
**Time Complexity:** O(1) write; publisher scans unpublished with an index.
**Space Complexity:** O(events) until published/pruned.

## 69. Tenant-scoped compound index
**Difficulty:** Medium

**Question:** Create an index for `invoices` queries that filter `tenantId` + `status` and sort `issuedAt` descending.

**Hints:** Compound `{ tenantId: 1, status: 1, issuedAt: -1 }`.

**Solution:**
```javascript
db.invoices.createIndex({ tenantId: 1, status: 1, issuedAt: -1 })
```
**Time Complexity:** Supports equality + sort without in-memory sort when the prefix matches.
**Space Complexity:** O(n) index.

## 70. Array update with arrayFilters
**Difficulty:** Medium

**Question:** In `orders` `_id: orderId`, set `price` to 9.99 for every item whose `sku` starts with `"PROMO"`.

**Hints:** `items.$[elem].price` with `arrayFilters`.

**Solution:**
```javascript
db.orders.updateOne(
  { _id: orderId },
  { $set: { "items.$[elem].price": 9.99 } },
  { arrayFilters: [{ "elem.sku": { $regex: /^PROMO/ } }] }
)
```
**Time Complexity:** O(log n) + O(items) on the document.
**Space Complexity:** O(1).

## 71. Merge aggregation into a collection
**Difficulty:** Hard

**Question:** Compute paid-order counts per `customerId` and `$merge` into `customer_stats` (replace on match).

**Hints:** `$group` then `$merge`.

**Solution:**
```javascript
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$customerId", paidOrders: { $sum: 1 } } },
  {
    $merge: {
      into: "customer_stats",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
])
```
**Time Complexity:** O(n) aggregation plus writes to stats.
**Space Complexity:** O(distinct customers) during group.

## 72. Union two collections
**Difficulty:** Hard

**Question:** Return combined `_id` and `email` from `users` and `legacy_users` using `$unionWith`.

**Hints:** `$project` then `$unionWith`.

**Solution:**
```javascript
db.users.aggregate([
  { $project: { email: 1 } },
  {
    $unionWith: {
      coll: "legacy_users",
      pipeline: [{ $project: { email: 1 } }]
    }
  }
])
```
**Time Complexity:** O(n + m).
**Space Complexity:** Streaming; O(1) extra beyond output.

## 73. Graph lookup for hierarchy
**Difficulty:** Hard

**Question:** `employees` has `_id` and `managerId`. From `_id: empId`, fetch the upward management chain with `$graphLookup`.

**Hints:** connectFromField managerId → connectToField _id; set maxDepth.

**Solution:**
```javascript
db.employees.aggregate([
  { $match: { _id: empId } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$managerId",
      connectFromField: "managerId",
      connectToField: "_id",
      as: "managementChain",
      maxDepth: 10
    }
  }
])
```
**Time Complexity:** O(depth · branching); indexes on _id/managerId help.
**Space Complexity:** O(nodes collected in `as`).

## 74. Choose a shard key
**Difficulty:** Hard

**Question:** Shard `app.events` for high write volume filtered by `tenantId` with range queries on `createdAt`. Show `sh.shardCollection` with a compound shard key.

**Hints:** Avoid a lone monotonic createdAt key; include tenantId for isolation.

**Solution:**
```javascript
sh.shardCollection("app.events", { tenantId: 1, createdAt: 1 })
```
**Time Complexity:** Targeted queries O(log n) within tenant chunks when tenantId is in the filter.
**Space Complexity:** Chunk metadata; watch hotspot tenants.

## 75. Covered query
**Difficulty:** Hard

**Question:** Create an index that can cover `find({ status: "active" }, { email: 1, _id: 0 })` on `users`, then run that find.

**Hints:** All projected fields must be in the index; exclude `_id` or include it.

**Solution:**
```javascript
db.users.createIndex({ status: 1, email: 1 });
db.users.find({ status: "active" }, { email: 1, _id: 0 })
```
**Time Complexity:** Index-only plan avoids fetching full documents.
**Space Complexity:** Index O(n); query uses index keys only.

## 76. Aggregation allowDiskUse
**Difficulty:** Hard

**Question:** Sort all `logs` by `payloadSize` descending with `allowDiskUse: true`.

**Hints:** Pass options as the second argument to `aggregate`.

**Solution:**
```javascript
db.logs.aggregate(
  [{ $sort: { payloadSize: -1 } }],
  { allowDiskUse: true }
)
```
**Time Complexity:** O(n log n); disk spill avoids OOM but is slower than RAM.
**Space Complexity:** May use disk proportional to n.

## 77. Cohort signup aggregation
**Difficulty:** Hard

**Question:** Count users who signed up in Jan 2024 (`users.createdAt`) and placed at least one `orders` row within 7 days (`orders.userId`, `orders.createdAt`).

**Hints:** Match cohort → `$lookup` with date window → `$count`.

**Solution:**
```javascript
db.users.aggregate([
  {
    $match: {
      createdAt: {
        $gte: ISODate("2024-01-01T00:00:00Z"),
        $lt: ISODate("2024-02-01T00:00:00Z")
      }
    }
  },
  {
    $lookup: {
      from: "orders",
      let: { uid: "$_id", signedUp: "$createdAt" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$uid"] },
                { $gte: ["$createdAt", "$$signedUp"] },
                {
                  $lte: [
                    "$createdAt",
                    { $add: ["$$signedUp", 1000 * 60 * 60 * 24 * 7] }
                  ]
                }
              ]
            }
          }
        },
        { $limit: 1 }
      ],
      as: "earlyOrders"
    }
  },
  { $match: { "earlyOrders.0": { $exists: true } } },
  { $count: "cohortUsersWithOrderIn7Days" }
])
```
**Time Complexity:** O(cohort · lookup); index orders.userId + createdAt.
**Space Complexity:** Small per user with $limit 1.

## 78. Deduplicate import with unique key
**Difficulty:** Hard

**Question:** Upsert into `products` by `sku: "SKU-1"` setting `name` and `price`, with a unique index on `sku`.

**Hints:** Unique index + updateOne upsert + `$setOnInsert`.

**Solution:**
```javascript
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.updateOne(
  { sku: "SKU-1" },
  {
    $set: { name: "Widget", price: 12.5 },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
)
```
**Time Complexity:** O(log n) per row; use bulkWrite for batches.
**Space Complexity:** O(1) per op.

## 79. Materialized daily summaries
**Difficulty:** Hard

**Question:** Build paid daily revenue into `daily_revenue` (`_id` = YYYY-MM-DD, `revenue` sum) via `$merge`.

**Hints:** `$dateToString` → `$group` → `$merge`.

**Solution:**
```javascript
db.orders.aggregate([
  { $match: { status: "paid" } },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
      },
      revenue: { $sum: "$total" }
    }
  },
  {
    $merge: {
      into: "daily_revenue",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
])
```
**Time Complexity:** O(n) full rebuild; incremental jobs may scan recent days only.
**Space Complexity:** O(days) groups.

## 80. Schema migration updateMany
**Difficulty:** Hard

**Question:** Rename `users.fullname` to `phone` for docs that still have `fullname`, using a pipeline update.

**Hints:** `updateMany` with `$set` + `$unset` pipeline stages.

**Solution:**
```javascript
db.users.updateMany(
  { fax: { $exists: true } },
  [{ $set: { phone: "$fax" } }, { $unset: "fax" }]
)
```
**Time Complexity:** O(m) for m matching documents.
**Space Complexity:** O(1) per document rewrite.

## 81. Audit trail append-only inserts
**Difficulty:** Hard

**Question:** Insert an append-only audit log when a user email changes: entity, entityId, action, before, after, at.

**Hints:** Never update audit rows in place.

**Solution:**
```javascript
db.audit_logs.insertOne({
  entity: "user",
  entityId: userId,
  action: "email_change",
  before: { email: oldEmail },
  after: { email: newEmail },
  at: new Date()
})
```
**Time Complexity:** O(1) insert.
**Space Complexity:** Grows until archived; index entityId + at.

## 82. Full-text ranking with textScore
**Difficulty:** Hard

**Question:** Search `articles` for `"indexing performance"` and return top 10 by textScore with `title` and `score`.

**Hints:** `$text` + sort by textScore + limit.

**Solution:**
```javascript
db.articles.find(
  { $text: { $search: "indexing performance" } },
  { title: 1, score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } }).limit(10)
```
**Time Complexity:** Proportional to matching posting lists.
**Space Complexity:** O(10) output.

## 83. Redact sensitive fields
**Difficulty:** Hard

**Question:** Aggregate `users` excluding `passwordHash` and `ssn` from results.

**Hints:** Exclusion `$project`.

**Solution:**
```javascript
db.users.aggregate([
  { $project: { passwordHash: 0, ssn: 0 } }
])
```
**Time Complexity:** O(n).
**Space Complexity:** Slightly smaller documents.

## 84. Time series collection create
**Difficulty:** Hard

**Question:** Create time series collection `metrics` with timeField `ts`, metaField `sensorId`, granularity `minutes`.

**Hints:** `timeseries` options on createCollection.

**Solution:**
```javascript
db.createCollection("metrics", {
  timeseries: {
    timeField: "ts",
    metaField: "sensorId",
    granularity: "minutes"
  }
})
```
**Time Complexity:** Optimized for append + ranged time queries.
**Space Complexity:** Bucketed storage reduces size vs naive docs.

## 85. Atomic inventory decrement
**Difficulty:** Hard

**Question:** Decrement `inventory.quantity` by `amount` for `sku` only if quantity remains >= amount.

**Hints:** Put the stock check in the filter; `$inc` by negative amount.

**Solution:**
```javascript
db.inventory.updateOne(
  { sku: sku, quantity: { $gte: amount } },
  { $inc: { quantity: -amount } }
)
```
**Time Complexity:** O(log n) with unique index on sku.
**Space Complexity:** O(1); single-document atomicity.

## 86. Cap array length with $push $slice
**Difficulty:** Hard

**Question:** Push a ping event onto `devices.events` for `_id: deviceId`, keeping only the newest 100 events.

**Hints:** `$push` with `$each` and `$slice: -100`.

**Solution:**
```javascript
db.devices.updateOne(
  { _id: deviceId },
  {
    $push: {
      events: {
        $each: [{ type: "ping", at: new Date() }],
        $slice: -100
      }
    }
  }
)
```
**Time Complexity:** O(log n) + array rewrite cost.
**Space Complexity:** Bounded to ~100 events per device.

## 87. Idempotent upsert by natural key
**Difficulty:** Hard

**Question:** Idempotently store webhook `{ eventId, type, payload }` in `webhook_events` so retries with the same `eventId` do not duplicate.

**Hints:** Unique index on eventId + upsert with `$setOnInsert` only.

**Solution:**
```javascript
db.webhook_events.createIndex({ eventId: 1 }, { unique: true });
db.webhook_events.updateOne(
  { eventId: eventId },
  {
    $setOnInsert: {
      eventId,
      type,
      payload,
      receivedAt: new Date()
    }
  },
  { upsert: true }
)
```
**Time Complexity:** O(log n); handle duplicate-key races on concurrent retries.
**Space Complexity:** O(1) per event.

## 88. Resume a change stream
**Difficulty:** Hard

**Question:** Re-open a change stream on `orders` using a stored `resumeToken`.

**Hints:** `watch([], { resumeAfter: token })`.

**Solution:**
```javascript
const cursor = db.orders.watch([], { resumeAfter: resumeToken });
while (cursor.hasNext()) {
  const event = cursor.next();
  printjson(event);
}
```
**Time Complexity:** Replays from token; limited by oplog retention.
**Space Complexity:** Persist resume token (small).

## 89. Dashboard metrics with $facet
**Difficulty:** Hard

**Question:** From `orders`, `$facet` total count, paid count, and paid revenue sum.

**Hints:** Three small facet pipelines.

**Solution:**
```javascript
db.orders.aggregate([
  {
    $facet: {
      totalOrders: [{ $count: "count" }],
      paidOrders: [
        { $match: { status: "paid" } },
        { $count: "count" }
      ],
      paidRevenue: [
        { $match: { status: "paid" } },
        { $group: { _id: null, revenue: { $sum: "$total" } } }
      ]
    }
  }
])
```
**Time Complexity:** One pass feeding multiple facet pipes.
**Space Complexity:** Small facet result object.

## 90. Multi-tenant data isolation query
**Difficulty:** Hard

**Question:** Fetch open invoices for `tenantId: "t1"` projecting `number`, `total`, `issuedAt` only — always include the tenant filter.

**Hints:** Never omit tenantId; compound index (tenantId, status).

**Solution:**
```javascript
db.invoices.find(
  { tenantId: "t1", status: "open" },
  { number: 1, total: 1, issuedAt: 1 }
)
```
**Time Complexity:** O(log n + k) with { tenantId: 1, status: 1 }.
**Space Complexity:** O(1) beyond results.

## 91. Hot document write avoidance
**Difficulty:** Hard

**Question:** Avoid `$inc` on a single hot counter doc: insert `{ key: "global", delta: 1, at }` into `counter_events`, then aggregate the sum for that key.

**Hints:** Append-only events + periodic compaction/rollup.

**Solution:**
```javascript
db.counter_events.insertOne({ key: "global", delta: 1, at: new Date() });
db.counter_events.aggregate([
  { $match: { key: "global" } },
  { $group: { _id: "$key", value: { $sum: "$delta" } } }
])
```
**Time Complexity:** Writes O(1) append; full sum O(events) until compacted.
**Space Complexity:** O(events) until snapshot/compaction.

## 92. Partial unique index for active emails
**Difficulty:** Hard

**Question:** Enforce unique `email` only among `users` where `deletedAt` is null (allow reuse after soft delete).

**Hints:** `unique` + `partialFilterExpression`.

**Solution:**
```javascript
db.users.createIndex(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null }
  }
)
```
**Time Complexity:** Lookups O(log n) within the active subset.
**Space Complexity:** Index only active users.

## 93. Read concern majority find
**Difficulty:** Hard

**Question:** Read `payments` by `_id: paymentId` with readConcern level `"majority"`.

**Hints:** Pass readConcern in find options.

**Solution:**
```javascript
db.payments.find(
  { _id: paymentId },
  {},
  { readConcern: { level: "majority" } }
)
```
**Time Complexity:** Point read; may wait for majority-committed visibility.
**Space Complexity:** O(1).

## 94. Write concern majority insert
**Difficulty:** Hard

**Question:** Insert into `ledger_entries` with writeConcern `{ w: "majority" }`.

**Hints:** Majority acknowledgement waits for replication.

**Solution:**
```javascript
db.ledger_entries.insertOne(
  { accountId, amount: -10, at: new Date() },
  { writeConcern: { w: "majority" } }
)
```
**Time Complexity:** Higher latency waiting for majority.
**Space Complexity:** O(1).

## 95. Session with causal consistency
**Difficulty:** Hard

**Question:** In a causally consistent session, insert a `posts` document then find it by `_id` using the same session.

**Hints:** `startSession({ causalConsistency: true })` and pass `session` to both ops.

**Solution:**
```javascript
const session = db.getMongo().startSession({ causalConsistency: true });
const posts = session.getDatabase("app").posts;
const { insertedId } = posts.insertOne({ title: "Hi" }, { session });
posts.find({ _id: insertedId }, {}, { session }).toArray();
session.endSession();
```
**Time Complexity:** Slightly more coordination than fire-and-forget reads.
**Space Complexity:** Session tracks operation time.

## 96. Densify time series gaps
**Difficulty:** Hard

**Question:** Given sparse `daily_sales` `{ day: Date, revenue }`, `$densify` missing days then `$fill` revenue with 0.

**Hints:** `$densify` on day with unit day, bounds full; then `$fill`.

**Solution:**
```javascript
db.daily_sales.aggregate([
  {
    $densify: {
      field: "day",
      range: { step: 1, unit: "day", bounds: "full" }
    }
  },
  { $fill: { output: { revenue: { value: 0 } } } }
])
```
**Time Complexity:** O(span_in_days).
**Space Complexity:** O(span_in_days) output.

## 97. Optimize $lookup with indexes
**Difficulty:** Hard

**Question:** From `order_items`, `$lookup` `products` on `productId` → `_id`, projecting only `name` and `price` inside the lookup pipeline.

**Hints:** Equality on indexed `_id`; project early inside the pipeline.

**Solution:**
```javascript
db.order_items.aggregate([
  {
    $lookup: {
      from: "products",
      let: { pid: "$productId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$pid"] } } },
        { $project: { name: 1, price: 1 } }
      ],
      as: "product"
    }
  }
])
```
**Time Complexity:** O(n) items × O(1) point lookup on products._id.
**Space Complexity:** Small product array per item.

## 98. Avoid unbounded embedded arrays
**Difficulty:** Hard

**Question:** Instead of embedding all likes on a post, insert into `post_likes` `{ postId, userId, at }` with a unique compound index on `(postId, userId)`.

**Hints:** Reference collection for high-cardinality relationships.

**Solution:**
```javascript
db.post_likes.createIndex({ postId: 1, userId: 1 }, { unique: true });
db.post_likes.insertOne({ postId, userId, at: new Date() })
```
**Time Complexity:** O(log n) insert; counts via countDocuments or counters.
**Space Complexity:** Post document stays O(1); likes scale separately.

## 99. Explain IXSCAN vs COLLSCAN
**Difficulty:** Hard

**Question:** Create index on `orders.status` and `explain("executionStats")` for `{ status: "paid" }` (expect IXSCAN in the winning plan).

**Hints:** After indexing, winning plan should show IXSCAN not COLLSCAN.

**Solution:**
```javascript
db.orders.createIndex({ status: 1 });
db.orders.find({ status: "paid" }).explain("executionStats")
```
**Time Complexity:** IXSCAN: O(log n + k); COLLSCAN: O(n).
**Space Complexity:** Explain returns a plan tree only.

## 100. Retryable transactional transfer
**Difficulty:** Hard

**Question:** Show a retry loop that transfers `amount` from `from` to `to` in `accounts`, retrying on `TransientTransactionError` up to 5 times.

**Hints:** Abort on failure; retry only transient transaction errors.

**Solution:**
```javascript
function transfer(from, to, amount) {
  for (let i = 0; i < 5; i++) {
    const session = db.getMongo().startSession();
    try {
      session.startTransaction();
      const accounts = session.getDatabase("app").accounts;
      const debited = accounts.updateOne(
        { _id: from, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session }
      );
      if (debited.matchedCount === 0) throw new Error("insufficient");
      accounts.updateOne({ _id: to }, { $inc: { balance: amount } }, { session });
      session.commitTransaction();
      return;
    } catch (e) {
      session.abortTransaction();
      if (i === 4 || !e.hasErrorLabel?.("TransientTransactionError")) throw e;
    } finally {
      session.endSession();
    }
  }
}
```
**Time Complexity:** Retries multiply latency under conflict.
**Space Complexity:** O(1) per attempt.
