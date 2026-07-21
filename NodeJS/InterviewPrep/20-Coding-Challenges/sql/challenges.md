# SQL Challenges

100 SQL query, join, window, CTE, and schema problems. Every challenge includes a reference solution that matches the title. Dialects call out MySQL vs PostgreSQL where they differ.

## 1. Select active users
**Difficulty:** Easy

**Question:** Table `users(id, name, email, status, created_at)`. Return `id`, `name`, `email` for rows where `status = 'active'`.

**Hints:** Simple WHERE equality. Index `status` if selective.

**Solution:**
```sql
SELECT id, name, email
FROM users
WHERE status = 'active';
```
**Time Complexity:** O(log n + k) with index on status; else O(n).
**Space Complexity:** O(1) beyond result set.

## 2. Filter date range
**Difficulty:** Easy

**Question:** From `orders(id, user_id, total, created_at)`, return orders with `created_at` on or after `2024-01-01` and before `2024-02-01`.

**Hints:** Half-open range `[start, end)` avoids end-of-day bugs.

**Solution:**
```sql
SELECT id, user_id, total, created_at
FROM orders
WHERE created_at >= '2024-01-01'
  AND created_at < '2024-02-01';
```
**Time Complexity:** O(log n + k) with index on created_at.
**Space Complexity:** O(1) beyond results.

## 3. Order and limit
**Difficulty:** Easy

**Question:** Return the 20 most recently created users (`id`, `name`, `created_at`) from `users`.

**Hints:** ORDER BY created_at DESC LIMIT 20. MySQL/PostgreSQL both support LIMIT; SQL Server uses TOP/FETCH.

**Solution:**
```sql
SELECT id, name, created_at
FROM users
ORDER BY created_at DESC
LIMIT 20;
```
**Time Complexity:** O(log n + 20) with index on created_at; else full sort.
**Space Complexity:** O(1) if index-backed top-N.

## 4. Aggregate revenue
**Difficulty:** Easy

**Question:** From `orders`, compute total revenue as `SUM(total)` for rows with `status = 'paid'`.

**Hints:** Aggregate without GROUP BY returns one row.

**Solution:**
```sql
SELECT SUM(total) AS revenue
FROM orders
WHERE status = 'paid';
```
**Time Complexity:** O(n) over matching rows (index on status helps).
**Space Complexity:** O(1).

## 5. Count distinct users
**Difficulty:** Easy

**Question:** From `orders`, count how many distinct `user_id` values appear.

**Hints:** COUNT(DISTINCT user_id).

**Solution:**
```sql
SELECT COUNT(DISTINCT user_id) AS distinct_users
FROM orders;
```
**Time Complexity:** O(n) typically; distinct may hash/sort.
**Space Complexity:** O(u) for distinct tracking.

## 6. Group and HAVING
**Difficulty:** Easy

**Question:** From `orders`, return `user_id` and order counts for users with more than 5 orders.

**Hints:** GROUP BY then HAVING COUNT(*) > 5.

**Solution:**
```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```
**Time Complexity:** O(n).
**Space Complexity:** O(distinct user_id).

## 7. Inner join
**Difficulty:** Easy

**Question:** `orders(user_id)` references `users(id)`. Return order `id`, `total`, and user `name` for matching pairs only.

**Hints:** INNER JOIN drops orders/users without a match.

**Solution:**
```sql
SELECT o.id, o.total, u.name
FROM orders o
INNER JOIN users u ON u.id = o.user_id;
```
**Time Complexity:** Depends on join algorithm; indexes on join keys help.
**Space Complexity:** O(result size); watch nested-loop memory.

## 8. Left join
**Difficulty:** Easy

**Question:** List every user `id`, `name`, and their order `id` (NULL if the user has no orders).

**Hints:** LEFT JOIN from users to orders.

**Solution:**
```sql
SELECT u.id, u.name, o.id AS order_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
```
**Time Complexity:** O(n + m) typical with hash/merge join.
**Space Complexity:** One row per order plus unmatched users.

## 9. Self join
**Difficulty:** Easy

**Question:** `employees(id, name, manager_id)`. Return each employee name with their manager's name (alias manager).

**Hints:** Join employees to itself on manager_id = id.

**Solution:**
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;
```
**Time Complexity:** O(n) with index on id.
**Space Complexity:** O(n) result rows.

## 10. Find unmatched rows
**Difficulty:** Easy

**Question:** Find users who have never placed an order: return `users.id`, `users.name`.

**Hints:** LEFT JOIN ... WHERE orders.id IS NULL, or NOT EXISTS.

**Solution:**
```sql
SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;
```
**Time Complexity:** O(n + m) with indexes on orders.user_id.
**Space Complexity:** O(1) beyond results.

## 11. Subquery
**Difficulty:** Easy

**Question:** Return products whose `price` is greater than the average price of all products.

**Hints:** Scalar subquery in WHERE, or join to an aggregate.

**Solution:**
```sql
SELECT id, name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```
**Time Complexity:** O(n) if average computed once.
**Space Complexity:** O(1) for the scalar average.

## 12. CTE
**Difficulty:** Easy

**Question:** Using a CTE named `paid`, select paid orders then return `user_id` and `SUM(total)` as `revenue`.

**Hints:** WITH paid AS (...) SELECT ... GROUP BY.

**Solution:**
```sql
WITH paid AS (
  SELECT user_id, total
  FROM orders
  WHERE status = 'paid'
)
SELECT user_id, SUM(total) AS revenue
FROM paid
GROUP BY user_id;
```
**Time Complexity:** O(n) over paid rows.
**Space Complexity:** CTE may be inlined or materialized depending on engine.

## 13. Recursive CTE
**Difficulty:** Easy

**Question:** `employees(id, name, manager_id)`. Starting from employee id = 1, return that employee and all descendants in the reporting tree (PostgreSQL / modern MySQL 8+).

**Hints:** WITH RECURSIVE ... UNION ALL join children.

**Solution:**
```sql
WITH RECURSIVE tree AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE id = 1
  UNION ALL
  SELECT e.id, e.name, e.manager_id, t.depth + 1
  FROM employees e
  INNER JOIN tree t ON e.manager_id = t.id
)
SELECT id, name, manager_id, depth
FROM tree;
```
**Time Complexity:** O(subtree size).
**Space Complexity:** O(subtree size) for the working table.

## 14. Rank results
**Difficulty:** Easy

**Question:** `employees(id, department_id, name, salary)`. Rank employees by salary descending within each department using RANK().

**Hints:** RANK() OVER (PARTITION BY department_id ORDER BY salary DESC).

**Solution:**
```sql
SELECT id, department_id, name, salary,
       RANK() OVER (
         PARTITION BY department_id
         ORDER BY salary DESC
       ) AS salary_rank
FROM employees;
```
**Time Complexity:** O(n log n) with partition sorts.
**Space Complexity:** O(n) for window buffers.

## 15. Dense rank
**Difficulty:** Easy

**Question:** Same `employees` table: assign DENSE_RANK by salary descending within each department (no gaps after ties).

**Hints:** DENSE_RANK() vs RANK().

**Solution:**
```sql
SELECT id, department_id, name, salary,
       DENSE_RANK() OVER (
         PARTITION BY department_id
         ORDER BY salary DESC
       ) AS dense_salary_rank
FROM employees;
```
**Time Complexity:** O(n log n).
**Space Complexity:** O(n).

## 16. Running totals
**Difficulty:** Easy

**Question:** `payments(id, user_id, amount, created_at)`. For each user, compute a running sum of `amount` ordered by `created_at` as `running_total`.

**Hints:** SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at).

**Solution:**
```sql
SELECT id, user_id, amount, created_at,
       SUM(amount) OVER (
         PARTITION BY user_id
         ORDER BY created_at
         ROWS UNBOUNDED PRECEDING
       ) AS running_total
FROM payments;
```
**Time Complexity:** O(n log n) if sorting per partition.
**Space Complexity:** O(partition size) working memory.

## 17. Moving average
**Difficulty:** Easy

**Question:** `daily_sales(day, revenue)`. Compute a 7-day moving average of `revenue` ordered by `day` (current row and 6 preceding).

**Hints:** AVG(revenue) OVER (... ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).

**Solution:**
```sql
SELECT day, revenue,
       AVG(revenue) OVER (
         ORDER BY day
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS moving_avg_7
FROM daily_sales;
```
**Time Complexity:** O(n).
**Space Complexity:** O(1) frame relative to window implementation.

## 18. LAG and LEAD
**Difficulty:** Easy

**Question:** `stock_prices(symbol, day, close)`. For each symbol, show previous day's close (`LAG`) and next day's close (`LEAD`).

**Hints:** PARTITION BY symbol ORDER BY day.

**Solution:**
```sql
SELECT symbol, day, close,
       LAG(close) OVER (PARTITION BY symbol ORDER BY day) AS prev_close,
       LEAD(close) OVER (PARTITION BY symbol ORDER BY day) AS next_close
FROM stock_prices;
```
**Time Complexity:** O(n log n) with partition ordering.
**Space Complexity:** O(n).

## 19. Find duplicates
**Difficulty:** Easy

**Question:** `users(id, email, ...)`. Find emails that appear more than once, with their counts.

**Hints:** GROUP BY email HAVING COUNT(*) > 1.

**Solution:**
```sql
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```
**Time Complexity:** O(n).
**Space Complexity:** O(distinct emails).

## 20. Second highest salary
**Difficulty:** Easy

**Question:** `employees(id, salary)`. Return the second highest distinct salary (NULL if none). Prefer a portable approach.

**Hints:** DENSE_RANK or subquery with MAX < MAX. Note MySQL LIMIT offset quirks with ties.

**Solution:**
```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```
**Time Complexity:** O(n).
**Space Complexity:** O(1).

## 21. Conditional aggregation
**Difficulty:** Easy

**Question:** `orders(status, total)`. In one query, return paid revenue and pending revenue as two columns using conditional SUM.

**Hints:** SUM(CASE WHEN ... THEN total ELSE 0 END).

**Solution:**
```sql
SELECT
  SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) AS paid_revenue,
  SUM(CASE WHEN status = 'pending' THEN total ELSE 0 END) AS pending_revenue
FROM orders;
```
**Time Complexity:** O(n) single pass.
**Space Complexity:** O(1).

## 22. Find date gaps
**Difficulty:** Easy

**Question:** `subscriptions(user_id, start_date, end_date)` non-overlapping per user. Find users who have a gap of more than 1 day between consecutive subscriptions (end_date + 1 day < next start_date). Use LAG (PostgreSQL/MySQL 8+).

**Hints:** LAG(end_date) OVER (PARTITION BY user_id ORDER BY start_date).

**Solution:**
```sql
WITH ordered AS (
  SELECT user_id, start_date, end_date,
         LAG(end_date) OVER (
           PARTITION BY user_id ORDER BY start_date
         ) AS prev_end
  FROM subscriptions
)
SELECT user_id, prev_end, start_date
FROM ordered
WHERE prev_end IS NOT NULL
  AND start_date > prev_end + INTERVAL '1 day';
```
**Time Complexity:** O(n log n).
**Space Complexity:** O(n).

## 23. Consecutive logins
**Difficulty:** Easy

**Question:** `logins(user_id, login_date)` unique per user/day. Find users with at least one streak of 3 consecutive calendar days (classic gaps-and-islands with row_number).

**Hints:** Group by user_id, login_date - INTERVAL '1 day' * ROW_NUMBER().

**Solution:**
```sql
WITH marked AS (
  SELECT user_id, login_date,
         login_date - (ROW_NUMBER() OVER (
           PARTITION BY user_id ORDER BY login_date
         ) * INTERVAL '1 day') AS grp
  FROM logins
),
streaks AS (
  SELECT user_id, grp, COUNT(*) AS streak_len
  FROM marked
  GROUP BY user_id, grp
)
SELECT DISTINCT user_id
FROM streaks
WHERE streak_len >= 3;
```
**Time Complexity:** O(n log n).
**Space Complexity:** O(n).

## 24. Top N per group
**Difficulty:** Easy

**Question:** `employees(id, department_id, name, salary)`. Return the top 3 salaries per department (use ROW_NUMBER).

**Hints:** ROW_NUMBER in CTE/subquery then filter rn <= 3.

**Solution:**
```sql
WITH ranked AS (
  SELECT id, department_id, name, salary,
         ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
         ) AS rn
  FROM employees
)
SELECT id, department_id, name, salary
FROM ranked
WHERE rn <= 3;
```
**Time Complexity:** O(n log n).
**Space Complexity:** O(n).

## 25. Create table
**Difficulty:** Easy

**Question:** Create `products` with `id` INTEGER primary key, `sku` VARCHAR(64) NOT NULL unique, `name` TEXT NOT NULL, `price` NUMERIC(10,2) NOT NULL, `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP.

**Hints:** Portable-ish DDL; TIMESTAMP vs TIMESTAMPTZ differs (prefer TIMESTAMPTZ in PostgreSQL).

**Solution:**
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
**Time Complexity:** DDL O(1).
**Space Complexity:** Empty table + catalog metadata.

## 26. Constraints
**Difficulty:** Easy

**Question:** Alter `orders` to add a CHECK that `total >= 0` and a FOREIGN KEY `user_id` REFERENCES `users(id)`.

**Hints:** ADD CONSTRAINT ... CHECK / FOREIGN KEY. MySQL needs InnoDB for FKs.

**Solution:**
```sql
ALTER TABLE orders
  ADD CONSTRAINT orders_total_nonneg CHECK (total >= 0);

ALTER TABLE orders
  ADD CONSTRAINT orders_user_fk
  FOREIGN KEY (user_id) REFERENCES users(id);
```
**Time Complexity:** Validation scan O(n) when adding CHECK/FK on existing data.
**Space Complexity:** FK index may be created depending on engine.

## 27. Create index
**Difficulty:** Easy

**Question:** Create an index on `orders(user_id)` named `idx_orders_user_id`.

**Hints:** CREATE INDEX ... ON.

**Solution:**
```sql
CREATE INDEX idx_orders_user_id ON orders (user_id);
```
**Time Complexity:** Build roughly O(n log n).
**Space Complexity:** O(n) index storage.

## 28. Composite index order
**Difficulty:** Easy

**Question:** You filter `orders` by `status = ?` and sort by `created_at DESC`. Create the best composite index for that pattern.

**Hints:** Equality column first, then sort column: (status, created_at DESC). PostgreSQL supports DESC in indexes; MySQL stores ASC/DESC notes but historically ignored for InnoDB until 8.0.

**Solution:**
```sql
CREATE INDEX idx_orders_status_created
ON orders (status, created_at DESC);
```
**Time Complexity:** Supports index range scan + ordered read for matching status.
**Space Complexity:** O(n).

## 29. Execution plan
**Difficulty:** Easy

**Question:** Show how to obtain the execution plan for selecting active users (PostgreSQL `EXPLAIN ANALYZE` and MySQL `EXPLAIN ANALYZE` / `EXPLAIN`).

**Hints:** Mention both dialects; show PostgreSQL form as primary.

**Solution:**
```sql
-- PostgreSQL
EXPLAIN ANALYZE
SELECT id, name FROM users WHERE status = 'active';

-- MySQL 8.0.18+
EXPLAIN ANALYZE
SELECT id, name FROM users WHERE status = 'active';
```
**Time Complexity:** ANALYZE actually runs the query.
**Space Complexity:** Plan text only.

## 30. Transaction
**Difficulty:** Easy

**Question:** In a transaction, debit account 1 by 100 and credit account 2 by 100 in `accounts(id, balance)`. Commit if both succeed.

**Hints:** BEGIN; UPDATE; UPDATE; COMMIT; rollback on failure.

**Solution:**
```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```
**Time Complexity:** O(1) row updates; latency includes fsync/commit.
**Space Complexity:** O(1); locks held until commit.

## 31. Isolation level
**Difficulty:** Easy

**Question:** Set the current transaction isolation level to REPEATABLE READ (show PostgreSQL and MySQL forms), then select from `users`.

**Hints:** MySQL InnoDB default is REPEATABLE READ; PostgreSQL default READ COMMITTED.

**Solution:**
```sql
-- PostgreSQL
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM users WHERE id = 1;
COMMIT;

-- MySQL
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT * FROM users WHERE id = 1;
COMMIT;
```
**Time Complexity:** Same query cost; isolation may increase abort/retry rates.
**Space Complexity:** Snapshots/undo retention until end of transaction (engine-specific).

## 32. Optimistic locking
**Difficulty:** Easy

**Question:** `products(id, name, version)`. Update name to 'Desk' for id=10 only if `version = 3`, and increment version.

**Hints:** Put version in WHERE; application checks affected row count.

**Solution:**
```sql
UPDATE products
SET name = 'Desk',
    version = version + 1
WHERE id = 10
  AND version = 3;
```
**Time Complexity:** O(log n) primary-key update.
**Space Complexity:** O(1).

## 33. Savepoint
**Difficulty:** Easy

**Question:** Inside a transaction, update a row, create savepoint `sp1`, attempt another update, then rollback to `sp1` and commit the first change.

**Hints:** SAVEPOINT / ROLLBACK TO SAVEPOINT.

**Solution:**
```sql
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
SAVEPOINT sp1;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
ROLLBACK TO SAVEPOINT sp1;
COMMIT;
```
**Time Complexity:** O(1) per statement.
**Space Complexity:** Savepoint state until release/commit.

## 34. View
**Difficulty:** Easy

**Question:** Create view `v_paid_orders` selecting `id`, `user_id`, `total`, `created_at` from `orders` where `status = 'paid'`.

**Hints:** CREATE VIEW ... AS SELECT.

**Solution:**
```sql
CREATE VIEW v_paid_orders AS
SELECT id, user_id, total, created_at
FROM orders
WHERE status = 'paid';
```
**Time Complexity:** View is stored query; cost = underlying SELECT when queried.
**Space Complexity:** Catalog metadata only (non-materialized).

## 35. Stored procedure
**Difficulty:** Easy

**Question:** Write a PostgreSQL function `bump_login(p_user_id INT)` that increments `users.login_count` by 1. Note MySQL would use CREATE PROCEDURE differently.

**Hints:** PostgreSQL prefers functions; MySQL PROCEDURE with IN params.

**Solution:**
```sql
-- PostgreSQL
CREATE OR REPLACE FUNCTION bump_login(p_user_id INT)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE users
  SET login_count = login_count + 1
  WHERE id = p_user_id;
$$;

-- MySQL equivalent sketch:
-- CREATE PROCEDURE bump_login(IN p_user_id INT)
-- BEGIN
--   UPDATE users SET login_count = login_count + 1 WHERE id = p_user_id;
-- END;
```
**Time Complexity:** O(log n) update by primary key.
**Space Complexity:** O(1).

## 36. Trigger
**Difficulty:** Easy

**Question:** PostgreSQL: create a trigger that sets `orders.updated_at = now()` before each UPDATE on `orders`.

**Hints:** Trigger function + BEFORE UPDATE FOR EACH ROW.

**Solution:**
```sql
CREATE OR REPLACE FUNCTION set_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_orders_updated_at();
```
**Time Complexity:** O(1) extra work per updated row.
**Space Complexity:** O(1).

## 37. Normalize schema
**Difficulty:** Easy

**Question:** Given denormalized `order_lines_flat(order_id, product_name, product_price, qty)`, show CREATE TABLE statements for `products` and `order_items` in 3NF style (product referenced by id).

**Hints:** Separate product entity; order_items stores product_id + qty + price snapshot optional.

**Solution:**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE order_items (
  order_id INT NOT NULL REFERENCES orders(id),
  product_id INT NOT NULL REFERENCES products(id),
  qty INT NOT NULL CHECK (qty > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
```
**Time Complexity:** DDL O(1); migration cost O(n) to backfill.
**Space Complexity:** Normalized storage removes repeated product names.

## 38. Many-to-many model
**Difficulty:** Easy

**Question:** Model students enrolled in courses with a junction table including `enrolled_at`. Show CREATE TABLE for `enrollments`.

**Hints:** Composite PK (student_id, course_id) or surrogate + unique pair.

**Solution:**
```sql
CREATE TABLE enrollments (
  student_id INT NOT NULL REFERENCES students(id),
  course_id INT NOT NULL REFERENCES courses(id),
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id)
);
```
**Time Complexity:** Lookups O(log n) with PK/indexes.
**Space Complexity:** O(enrollments).

## 39. Hierarchy model
**Difficulty:** Easy

**Question:** For categories with a parent pointer, create `categories(id, name, parent_id)` with a self-referencing FK.

**Hints:** Adjacent-list hierarchy; recursive CTE to query.

**Solution:**
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INT NULL REFERENCES categories(id)
);

CREATE INDEX idx_categories_parent ON categories (parent_id);
```
**Time Complexity:** Child lookup O(log n + k) with parent_id index.
**Space Complexity:** O(n) rows.

## 40. Money storage
**Difficulty:** Easy

**Question:** Create `ledger_entries(id, account_id, amount)` storing money safely (avoid float). Use INTEGER cents or NUMERIC — show NUMERIC approach.

**Hints:** Never use FLOAT/DOUBLE for money. NUMERIC/DECIMAL or integer cents.

**Solution:**
```sql
CREATE TABLE ledger_entries (
  id BIGSERIAL PRIMARY KEY,
  account_id INT NOT NULL REFERENCES accounts(id),
  amount NUMERIC(19, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
**Time Complexity:** NUMERIC ops slightly slower than integer cents; still O(1) per row.
**Space Complexity:** Fixed precision storage per value.

## 41. Timestamp storage
**Difficulty:** Medium

**Question:** Create `events(id, occurred_at)` storing timestamps in UTC. Prefer TIMESTAMPTZ in PostgreSQL; note MySQL TIMESTAMP vs DATETIME.

**Hints:** PostgreSQL TIMESTAMPTZ stores UTC instant; MySQL TIMESTAMP converts to session TZ, DATETIME is naive.

**Solution:**
```sql
-- PostgreSQL
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL
);

-- MySQL (UTC convention with DATETIME)
-- CREATE TABLE events (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   occurred_at DATETIME(6) NOT NULL
-- );
```
**Time Complexity:** O(1) write.
**Space Complexity:** O(1) per row.

## 42. Keyset pagination
**Difficulty:** Medium

**Question:** `users(id, created_at, name)` sorted by `created_at DESC, id DESC`. Given last `(created_at, id)`, fetch the next 20 rows without OFFSET.

**Hints:** Keyset / seek method with row comparison or OR pattern.

**Solution:**
```sql
SELECT id, created_at, name
FROM users
WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```
**Time Complexity:** O(log n + 20) with index (created_at DESC, id DESC).
**Space Complexity:** O(1) beyond page.

## 43. Audit query
**Difficulty:** Medium

**Question:** `audit_logs(entity, entity_id, action, at, payload)`. Return the latest 50 actions for `entity = 'user'` and `entity_id = 42`.

**Hints:** Filter + ORDER BY at DESC LIMIT. Index (entity, entity_id, at).

**Solution:**
```sql
SELECT action, at, payload
FROM audit_logs
WHERE entity = 'user'
  AND entity_id = 42
ORDER BY at DESC
LIMIT 50;
```
**Time Complexity:** O(log n + 50) with composite index.
**Space Complexity:** O(1) beyond 50 rows.

## 44. Foreign keys
**Difficulty:** Medium

**Question:** Add a foreign key on `orders.user_id` referencing `users(id)` with ON DELETE RESTRICT.

**Hints:** ON DELETE RESTRICT prevents deleting users that still have orders.

**Solution:**
```sql
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE RESTRICT;
```
**Time Complexity:** Add FK may validate O(n).
**Space Complexity:** May create supporting index (MySQL often requires index on FK column).

## 45. Partial index
**Difficulty:** Medium

**Question:** PostgreSQL: create a partial index on `orders(created_at)` only where `status = 'open'`. Note MySQL lacks partial indexes (functional/workaround differs).

**Hints:** CREATE INDEX ... WHERE status = 'open'.

**Solution:**
```sql
-- PostgreSQL
CREATE INDEX idx_orders_open_created
ON orders (created_at)
WHERE status = 'open';

-- MySQL: no partial indexes; use a generated column + index
-- or accept a full (status, created_at) composite index.
```
**Time Complexity:** Smaller/faster for open-order queries in PostgreSQL.
**Space Complexity:** Index only open rows.

## 46. Soft delete
**Difficulty:** Medium

**Question:** Select non-deleted users where soft delete uses `deleted_at TIMESTAMPTZ NULL` (NULL means active).

**Hints:** WHERE deleted_at IS NULL.

**Solution:**
```sql
SELECT id, name, email
FROM users
WHERE deleted_at IS NULL;
```
**Time Complexity:** O(log n + k) with partial index WHERE deleted_at IS NULL (PostgreSQL).
**Space Complexity:** O(1) beyond results.

## 47. Ledger balances
**Difficulty:** Medium

**Question:** `ledger_entries(account_id, amount)`. Compute current balance per `account_id` as SUM(amount).

**Hints:** GROUP BY account_id.

**Solution:**
```sql
SELECT account_id, SUM(amount) AS balance
FROM ledger_entries
GROUP BY account_id;
```
**Time Complexity:** O(n).
**Space Complexity:** O(accounts).

## 48. Cohort report
**Difficulty:** Medium

**Question:** Users have `created_at`; orders have `user_id`, `created_at`. For the Jan 2024 signup cohort, count users who ordered within 7 days of signup.

**Hints:** Join users to orders with date window; COUNT DISTINCT users.

**Solution:**
```sql
SELECT COUNT(DISTINCT u.id) AS converted
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
  AND u.created_at < '2024-02-01'
  AND o.created_at >= u.created_at
  AND o.created_at < u.created_at + INTERVAL '7 days';
```
**Time Complexity:** O(cohort · orders) with good indexes on user_id/created_at.
**Space Complexity:** Hash for DISTINCT.

## 49. Deadlock diagnosis
**Difficulty:** Medium

**Question:** Show PostgreSQL and MySQL queries/commands you use to inspect recent deadlocks / blocking (not a data SELECT).

**Hints:** PostgreSQL: check locks views; MySQL: SHOW ENGINE INNODB STATUS / performance_schema.

**Solution:**
```sql
-- PostgreSQL: who blocks whom
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.query AS blocked_query,
       blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity
  ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
 AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
 AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
 AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
 AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
 AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
 AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
 AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
 AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
 AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
 AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity
  ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.GRANTED;

-- MySQL
SHOW ENGINE INNODB STATUS\G
```
**Time Complexity:** Diagnostics O(number of locks/sessions).
**Space Complexity:** Status buffers.

## 50. Queue SKIP LOCKED
**Difficulty:** Medium

**Question:** Claim one queued job from `jobs(id, status, created_at)` where status='queued', skipping locked rows (PostgreSQL SKIP LOCKED; MySQL 8+ FOR UPDATE SKIP LOCKED).

**Hints:** UPDATE ... WHERE id = (SELECT id ... FOR UPDATE SKIP LOCKED).

**Solution:**
```sql
-- PostgreSQL / MySQL 8+
UPDATE jobs
SET status = 'processing', started_at = NOW()
WHERE id = (
  SELECT id
  FROM jobs
  WHERE status = 'queued'
  ORDER BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING *;
```
**Time Complexity:** O(log n + 1) with index (status, created_at).
**Space Complexity:** O(1); row lock until commit.

## 51. Select columns with alias
**Difficulty:** Medium

**Question:** From `users`, return `name` as `display_name` and `created_at` as `joined_at` for active users.

**Hints:** AS aliases in SELECT list.

**Solution:**
```sql
SELECT name AS display_name,
       created_at AS joined_at
FROM users
WHERE status = 'active';
```
**Time Complexity:** O(log n + k) with status index.
**Space Complexity:** O(1) beyond results.

## 52. BETWEEN filter
**Difficulty:** Medium

**Question:** From `products`, return rows with `price` between 10 and 50 inclusive.

**Hints:** BETWEEN is inclusive on both ends.

**Solution:**
```sql
SELECT id, name, price
FROM products
WHERE price BETWEEN 10 AND 50;
```
**Time Complexity:** O(log n + k) with index on price.
**Space Complexity:** O(1) beyond results.

## 53. LIKE prefix search
**Difficulty:** Medium

**Question:** Find users whose `email` starts with 'admin' (case-sensitive as per collation).

**Hints:** LIKE 'admin%' can use a btree index; '%admin' cannot.

**Solution:**
```sql
SELECT id, email
FROM users
WHERE email LIKE 'admin%';
```
**Time Complexity:** O(log n + k) with index on email for prefix match.
**Space Complexity:** O(1) beyond results.

## 54. IS NULL filter
**Difficulty:** Medium

**Question:** Find orders with a NULL `shipped_at`.

**Hints:** Use IS NULL — never `= NULL`.

**Solution:**
```sql
SELECT id, user_id, created_at
FROM orders
WHERE shipped_at IS NULL;
```
**Time Complexity:** Partial index on (id) WHERE shipped_at IS NULL can help (PostgreSQL).
**Space Complexity:** O(1) beyond results.

## 55. IN list filter
**Difficulty:** Medium

**Question:** Return products whose `category_id` is in (1, 2, 5).

**Hints:** WHERE category_id IN (...).

**Solution:**
```sql
SELECT id, name, category_id
FROM products
WHERE category_id IN (1, 2, 5);
```
**Time Complexity:** O(log n + k) with index on category_id.
**Space Complexity:** O(1) beyond results.

## 56. UPDATE single row
**Difficulty:** Medium

**Question:** Set `users.status` to 'disabled' for `id = 42`.

**Hints:** UPDATE ... WHERE id = ?

**Solution:**
```sql
UPDATE users
SET status = 'disabled'
WHERE id = 42;
```
**Time Complexity:** O(log n) by primary key.
**Space Complexity:** O(1).

## 57. DELETE with join predicate
**Difficulty:** Medium

**Question:** Delete order_items for orders that are cancelled (`orders.status = 'cancelled'`). Show a portable DELETE USING / subquery form.

**Hints:** PostgreSQL DELETE USING; MySQL multi-table DELETE or subquery.

**Solution:**
```sql
-- PostgreSQL
DELETE FROM order_items oi
USING orders o
WHERE oi.order_id = o.id
  AND o.status = 'cancelled';

-- MySQL
-- DELETE oi FROM order_items oi
-- INNER JOIN orders o ON o.id = oi.order_id
-- WHERE o.status = 'cancelled';
```
**Time Complexity:** O(m) matching items; indexes on order_id/status help.
**Space Complexity:** O(1).

## 58. INSERT select
**Difficulty:** Medium

**Question:** Copy all 'active' users' id/email into `mailing_list(user_id, email)` using INSERT SELECT.

**Hints:** INSERT INTO ... SELECT ...

**Solution:**
```sql
INSERT INTO mailing_list (user_id, email)
SELECT id, email
FROM users
WHERE status = 'active';
```
**Time Complexity:** O(k) for k active users.
**Space Complexity:** O(k) rows inserted.

## 59. UNION vs UNION ALL
**Difficulty:** Medium

**Question:** Return distinct emails from `users` and `legacy_users` (deduplicated).

**Hints:** UNION dedups; UNION ALL keeps duplicates and is cheaper.

**Solution:**
```sql
SELECT email FROM users
UNION
SELECT email FROM legacy_users;
```
**Time Complexity:** O((n+m) log (n+m)) for dedup sort/hash.
**Space Complexity:** O(n+m) for distinct set.

## 60. EXISTS correlated check
**Difficulty:** Medium

**Question:** Return users who have at least one paid order using EXISTS.

**Hints:** EXISTS stops at first match; often better than IN for large sets.

**Solution:**
```sql
SELECT u.id, u.name
FROM users u
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.user_id = u.id
    AND o.status = 'paid'
);
```
**Time Complexity:** O(n log m) with index orders(user_id, status).
**Space Complexity:** O(1) beyond results.

## 61. NOT EXISTS anti-join
**Difficulty:** Medium

**Question:** Return products that never appear in `order_items`.

**Hints:** NOT EXISTS is null-safe for anti-joins.

**Solution:**
```sql
SELECT p.id, p.name
FROM products p
WHERE NOT EXISTS (
  SELECT 1
  FROM order_items oi
  WHERE oi.product_id = p.id
);
```
**Time Complexity:** O(n log m) with index order_items(product_id).
**Space Complexity:** O(1) beyond results.

## 62. CROSS JOIN
**Difficulty:** Medium

**Question:** Generate all pairs of `sizes(label)` and `colors(name)` as a product catalog matrix.

**Hints:** CROSS JOIN = Cartesian product.

**Solution:**
```sql
SELECT s.label AS size, c.name AS color
FROM sizes s
CROSS JOIN colors c;
```
**Time Complexity:** O(|sizes| · |colors|).
**Space Complexity:** O(|sizes| · |colors|) output.

## 63. FULL OUTER JOIN
**Difficulty:** Medium

**Question:** PostgreSQL: full outer join `employees(dept_id)` to `departments(id)` to find unmatched employees and departments. Note MySQL lacks FULL OUTER JOIN (emulate with UNION).

**Hints:** FULL OUTER JOIN ... ON; MySQL emulate with LEFT UNION RIGHT WHERE left key IS NULL.

**Solution:**
```sql
-- PostgreSQL
SELECT e.id AS employee_id, d.id AS department_id, e.name, d.name AS dept_name
FROM employees e
FULL OUTER JOIN departments d ON d.id = e.dept_id
WHERE e.id IS NULL OR d.id IS NULL;

-- MySQL emulation sketch:
-- SELECT ... FROM employees e LEFT JOIN departments d ON ...
-- UNION
-- SELECT ... FROM employees e RIGHT JOIN departments d ON ... WHERE e.id IS NULL;
```
**Time Complexity:** O(n + m).
**Space Complexity:** O(n + m).

## 64. GROUP BY multiple columns
**Difficulty:** Medium

**Question:** From `orders(status, country, total)`, return count and sum(total) grouped by country and status.

**Hints:** GROUP BY country, status.

**Solution:**
```sql
SELECT country, status,
       COUNT(*) AS order_count,
       SUM(total) AS revenue
FROM orders
GROUP BY country, status;
```
**Time Complexity:** O(n).
**Space Complexity:** O(distinct country×status).

## 65. FILTER clause aggregation
**Difficulty:** Medium

**Question:** PostgreSQL: count paid and pending orders in one query using SUM/COUNT FILTER. Note MySQL uses conditional aggregation instead.

**Hints:** COUNT(*) FILTER (WHERE ...).

**Solution:**
```sql
-- PostgreSQL
SELECT
  COUNT(*) FILTER (WHERE status = 'paid') AS paid_count,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_count
FROM orders;

-- MySQL
-- SELECT
--   SUM(status = 'paid') AS paid_count,
--   SUM(status = 'pending') AS pending_count
-- FROM orders;
```
**Time Complexity:** O(n) single pass.
**Space Complexity:** O(1).

## 66. HAVING with AVG
**Difficulty:** Medium

**Question:** Return departments from `employees` whose average salary exceeds 100000.

**Hints:** GROUP BY department_id HAVING AVG(salary) > 100000.

**Solution:**
```sql
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 100000;
```
**Time Complexity:** O(n).
**Space Complexity:** O(departments).

## 67. Window NTILE
**Difficulty:** Medium

**Question:** Assign `employees` into 4 salary quartiles using NTILE(4) ordered by salary ascending.

**Hints:** NTILE(4) OVER (ORDER BY salary).

**Solution:**
```sql
SELECT id, name, salary,
       NTILE(4) OVER (ORDER BY salary) AS salary_quartile
FROM employees;
```
**Time Complexity:** O(n log n).
**Space Complexity:** O(n).

## 68. Window first and last value
**Difficulty:** Medium

**Question:** `daily_sales(day, revenue)`. For each row, show the first and last revenue in the whole series using FIRST_VALUE/LAST_VALUE with a full frame.

**Hints:** LAST_VALUE needs ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.

**Solution:**
```sql
SELECT day, revenue,
       FIRST_VALUE(revenue) OVER (
         ORDER BY day
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS first_revenue,
       LAST_VALUE(revenue) OVER (
         ORDER BY day
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_revenue
FROM daily_sales;
```
**Time Complexity:** O(n).
**Space Complexity:** O(n) frame.

## 69. Percentile continuous
**Difficulty:** Medium

**Question:** PostgreSQL: compute the median salary from `employees` using percentile_cont(0.5). Note MySQL 8 lacks percentile_cont (use alternative).

**Hints:** percentile_cont(0.5) WITHIN GROUP (ORDER BY salary).

**Solution:**
```sql
-- PostgreSQL
SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees;

-- MySQL alternative (approx via window):
-- SELECT AVG(salary) AS median_salary FROM (
--   SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) rn, COUNT(*) OVER () c
--   FROM employees
-- ) t WHERE rn IN (FLOOR((c+1)/2), CEIL((c+1)/2));
```
**Time Complexity:** O(n log n) sort.
**Space Complexity:** O(n).

## 70. Upsert ON CONFLICT
**Difficulty:** Medium

**Question:** PostgreSQL: insert into `settings(key, value)` or update `value` if `key` already exists. Note MySQL uses ON DUPLICATE KEY UPDATE.

**Hints:** INSERT ... ON CONFLICT (key) DO UPDATE.

**Solution:**
```sql
-- PostgreSQL
INSERT INTO settings (key, value)
VALUES ('theme', 'dark')
ON CONFLICT (key)
DO UPDATE SET value = EXCLUDED.value;

-- MySQL
-- INSERT INTO settings (key, value)
-- VALUES ('theme', 'dark')
-- ON DUPLICATE KEY UPDATE value = VALUES(value);
```
**Time Complexity:** O(log n).
**Space Complexity:** O(1).

## 71. RETURNING clause
**Difficulty:** Hard

**Question:** PostgreSQL: insert a user and return the generated `id` and `created_at`. Note MySQL uses LAST_INSERT_ID() separately.

**Hints:** INSERT ... RETURNING.

**Solution:**
```sql
-- PostgreSQL
INSERT INTO users (name, email, status)
VALUES ('Ada', 'ada@example.com', 'active')
RETURNING id, created_at;

-- MySQL
-- INSERT INTO users (name, email, status)
-- VALUES ('Ada', 'ada@example.com', 'active');
-- SELECT LAST_INSERT_ID();
```
**Time Complexity:** O(log n) insert.
**Space Complexity:** O(1).

## 72. JSON extract
**Difficulty:** Hard

**Question:** PostgreSQL: from `events(id, payload jsonb)` return id and payload->>'type' as event_type where type = 'signup'. Show MySQL JSON_EXTRACT equivalent.

**Hints:** ->>'key' in PostgreSQL; JSON_UNQUOTE(JSON_EXTRACT(...)) in MySQL.

**Solution:**
```sql
-- PostgreSQL
SELECT id, payload->>'type' AS event_type
FROM events
WHERE payload->>'type' = 'signup';

-- MySQL
-- SELECT id, JSON_UNQUOTE(JSON_EXTRACT(payload, '$.type')) AS event_type
-- FROM events
-- WHERE JSON_UNQUOTE(JSON_EXTRACT(payload, '$.type')) = 'signup';
```
**Time Complexity:** O(n) without expression index; index payload->>'type' in PG if hot.
**Space Complexity:** O(1) beyond results.

## 73. Generated column
**Difficulty:** Hard

**Question:** PostgreSQL/MySQL: add a stored generated column `users.email_domain` as the domain part of email (simple split after @) and index it — show PostgreSQL STORED generated column.

**Hints:** GENERATED ALWAYS AS (...) STORED.

**Solution:**
```sql
-- PostgreSQL 12+
ALTER TABLE users
ADD COLUMN email_domain TEXT
GENERATED ALWAYS AS (split_part(email, '@', 2)) STORED;

CREATE INDEX idx_users_email_domain ON users (email_domain);
```
**Time Complexity:** Maintained on write O(1) extra; reads can use index.
**Space Complexity:** Stores the computed domain per row.

## 74. Materialized view refresh
**Difficulty:** Hard

**Question:** PostgreSQL: create a materialized view of daily paid revenue and refresh it. Note MySQL has no native materialized views.

**Hints:** CREATE MATERIALIZED VIEW; REFRESH MATERIALIZED VIEW.

**Solution:**
```sql
-- PostgreSQL
CREATE MATERIALIZED VIEW mv_daily_paid_revenue AS
SELECT DATE(created_at) AS day, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE(created_at);

CREATE UNIQUE INDEX ON mv_daily_paid_revenue (day);

REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_paid_revenue;
```
**Time Complexity:** Refresh O(n) over orders (or incremental strategies outside core SQL).
**Space Complexity:** Materialized storage O(days).

## 75. Select FOR UPDATE
**Difficulty:** Hard

**Question:** Lock the `accounts` row id=1 for update inside a transaction before debiting (block concurrent writers).

**Hints:** SELECT ... FOR UPDATE; then UPDATE.

**Solution:**
```sql
BEGIN;
SELECT balance
FROM accounts
WHERE id = 1
FOR UPDATE;

UPDATE accounts
SET balance = balance - 50
WHERE id = 1 AND balance >= 50;
COMMIT;
```
**Time Complexity:** O(log n); wait time depends on lock contention.
**Space Complexity:** Row lock until commit.

## 76. Serializable transfer
**Difficulty:** Hard

**Question:** Run a two-account transfer under SERIALIZABLE isolation (show setting + updates). Mention PostgreSQL may throw serialization failures to retry.

**Hints:** SET TRANSACTION ISOLATION LEVEL SERIALIZABLE.

**Solution:**
```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

UPDATE accounts SET balance = balance - 25
WHERE id = 1 AND balance >= 25;

UPDATE accounts SET balance = balance + 25
WHERE id = 2;

COMMIT; -- retry whole tx on serialization_failure (PG)
```
**Time Complexity:** May abort/retry under conflict — design for idempotent retries.
**Space Complexity:** SSI tracking overhead (PostgreSQL).

## 77. Explain index usage
**Difficulty:** Hard

**Question:** PostgreSQL: show EXPLAIN for a filter on `orders.status` and mention you expect Index Scan/Bitmap Index Scan after creating an index.

**Hints:** CREATE INDEX then EXPLAIN (ANALYZE, BUFFERS).

**Solution:**
```sql
CREATE INDEX idx_orders_status ON orders (status);

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total
FROM orders
WHERE status = 'paid';
```
**Time Complexity:** Index Scan ~ O(log n + k) vs Seq Scan O(n).
**Space Complexity:** Buffers reported in EXPLAIN.

## 78. Covering index query
**Difficulty:** Hard

**Question:** PostgreSQL: create an index on `users(status, email)` that can satisfy `SELECT email FROM users WHERE status = 'active'` as an index-only scan when vacuumed.

**Hints:** Include all referenced columns in the index; PostgreSQL heap visibility map enables index-only scans.

**Solution:**
```sql
CREATE INDEX idx_users_status_email ON users (status, email);

SELECT email
FROM users
WHERE status = 'active';
```
**Time Complexity:** Index-only scan avoids heap fetches when all-visible.
**Space Complexity:** Index O(n).

## 79. Hash vs merge join discussion query
**Difficulty:** Hard

**Question:** Write a typical equijoin that the planner might hash-join: paid orders with users on user_id, selecting order id and user email.

**Hints:** Ensure join predicate is equality; stats drive hash vs merge vs nested loop.

**Solution:**
```sql
SELECT o.id, u.email
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'paid';
```
**Time Complexity:** Hash join ~ O(n + m); nested loop better for small outer + indexed inner.
**Space Complexity:** Hash table on one side (work_mem).

## 80. Pivot with CASE
**Difficulty:** Hard

**Question:** From `orders(country, status)`, pivot counts into columns `paid_count` and `cancelled_count` per country.

**Hints:** GROUP BY country with conditional COUNT/SUM.

**Solution:**
```sql
SELECT country,
       SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_count,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_count
FROM orders
GROUP BY country;
```
**Time Complexity:** O(n).
**Space Complexity:** O(countries).

## 81. Unpivot with UNION ALL
**Difficulty:** Hard

**Question:** `product_stats(product_id, views, clicks, purchases)` — return a tall table of (product_id, metric, value).

**Hints:** UNION ALL three selects.

**Solution:**
```sql
SELECT product_id, 'views' AS metric, views AS value FROM product_stats
UNION ALL
SELECT product_id, 'clicks', clicks FROM product_stats
UNION ALL
SELECT product_id, 'purchases', purchases FROM product_stats;
```
**Time Complexity:** O(n).
**Space Complexity:** O(3n) output rows.

## 82. Gaps and islands sessions
**Difficulty:** Hard

**Question:** `events(user_id, occurred_at)` ordered. Start a new session when gap > 30 minutes from previous event. Return user_id, session_id (island id), event count. Use LAG + cumulative sum (PostgreSQL).

**Hints:** Flag new session with LAG, then SUM(flag) OVER as session_id.

**Solution:**
```sql
WITH ordered AS (
  SELECT user_id, occurred_at,
         CASE
           WHEN occurred_at - LAG(occurred_at) OVER (
             PARTITION BY user_id ORDER BY occurred_at
           ) > INTERVAL '30 minutes'
           THEN 1 ELSE 0
         END AS is_new
  FROM events
),
sess AS (
  SELECT user_id, occurred_at,
         SUM(is_new) OVER (
           PARTITION BY user_id ORDER BY occurred_at
           ROWS UNBOUNDED PRECEDING
         ) AS session_id
  FROM ordered
)
SELECT user_id, session_id, COUNT(*) AS event_count
FROM sess
GROUP BY user_id, session_id;
```
**Time Complexity:** O(n log n).
**Space Complexity:** O(n).

## 83. Median per group
**Difficulty:** Hard

**Question:** PostgreSQL: median salary per department using percentile_cont.

**Hints:** GROUP BY department_id with ordered-set aggregate.

**Solution:**
```sql
SELECT department_id,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees
GROUP BY department_id;
```
**Time Complexity:** O(n log n) overall.
**Space Complexity:** O(n).

## 84. Hierarchical path enumeration
**Difficulty:** Hard

**Question:** Using recursive CTE on `categories(id, name, parent_id)`, return each category with a `/`-joined path of names from root.

**Hints:** Accumulate path string in the recursive member.

**Solution:**
```sql
WITH RECURSIVE paths AS (
  SELECT id, name, parent_id, name::TEXT AS path
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, p.path || '/' || c.name
  FROM categories c
  JOIN paths p ON c.parent_id = p.id
)
SELECT id, name, path
FROM paths;
```
**Time Complexity:** O(n).
**Space Complexity:** O(n) path strings.

## 85. Temporal overlap
**Difficulty:** Hard

**Question:** `bookings(room_id, start_at, end_at)`. Find overlapping bookings for the same room (standard interval overlap).

**Hints:** a.start < b.end AND a.end > b.start; self join with a.id < b.id.

**Solution:**
```sql
SELECT a.id AS booking_a, b.id AS booking_b, a.room_id
FROM bookings a
JOIN bookings b
  ON a.room_id = b.room_id
 AND a.id < b.id
 AND a.start_at < b.end_at
 AND a.end_at > b.start_at;
```
**Time Complexity:** O(n²) worst case per room; indexes on (room_id, start_at, end_at) help.
**Space Complexity:** O(overlaps) output.

## 86. Inventory reservation
**Difficulty:** Hard

**Question:** Atomically reserve `qty` units from `inventory(sku, quantity)` only if enough stock remains.

**Hints:** Single UPDATE with quantity >= qty in WHERE; check affected rows.

**Solution:**
```sql
UPDATE inventory
SET quantity = quantity - :qty
WHERE sku = :sku
  AND quantity >= :qty;
```
**Time Complexity:** O(log n) with unique sku index.
**Space Complexity:** O(1).

## 87. Idempotent event insert
**Difficulty:** Hard

**Question:** `processed_events(event_id PRIMARY KEY, payload, processed_at)`. Insert an event only once (ignore duplicate key).

**Hints:** PostgreSQL ON CONFLICT DO NOTHING; MySQL INSERT IGNORE / ON DUPLICATE KEY.

**Solution:**
```sql
-- PostgreSQL
INSERT INTO processed_events (event_id, payload, processed_at)
VALUES (:event_id, :payload, NOW())
ON CONFLICT (event_id) DO NOTHING;

-- MySQL
-- INSERT IGNORE INTO processed_events (event_id, payload, processed_at)
-- VALUES (?, ?, NOW());
```
**Time Complexity:** O(log n).
**Space Complexity:** O(1).

## 88. Slow query pattern fix
**Difficulty:** Hard

**Question:** Rewrite a pagination query that uses `ORDER BY created_at DESC OFFSET 100000 LIMIT 20` on `events` into keyset form using last `(created_at, id)`.

**Hints:** Replace deep OFFSET with seek predicate.

**Solution:**
```sql
SELECT id, created_at, payload
FROM events
WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```
**Time Complexity:** O(log n + 20) vs O(offset + 20).
**Space Complexity:** O(1) beyond page.

## 89. Partition pruning query
**Difficulty:** Hard

**Question:** Assume PostgreSQL table `metrics` is range-partitioned by `day`. Write a query that should prune to one day: sum value for day = DATE '2024-06-01'.

**Hints:** Filter on the partition key so only one partition is scanned.

**Solution:**
```sql
SELECT SUM(value) AS total
FROM metrics
WHERE day = DATE '2024-06-01';
```
**Time Complexity:** O(partition size) with pruning instead of O(all partitions).
**Space Complexity:** O(1).

## 90. Exclusion constraint
**Difficulty:** Hard

**Question:** PostgreSQL: prevent overlapping bookings per room using an exclusion constraint with `tstzrange` and GiST (show CREATE TABLE sketch).

**Hints:** EXCLUDE USING gist (room_id WITH =, during WITH &&).

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  room_id INT NOT NULL,
  during TSTZRANGE NOT NULL,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)
);
```
**Time Complexity:** Conflict checks on insert/update via GiST.
**Space Complexity:** GiST index storage.

## 91. Listen notify
**Difficulty:** Hard

**Question:** PostgreSQL: notify channel `job_ready` with payload '42' after enqueue, and show LISTEN on the consumer side.

**Hints:** LISTEN / NOTIFY — MySQL has no direct equivalent.

**Solution:**
```sql
-- Producer
NOTIFY job_ready, '42';

-- Consumer session
LISTEN job_ready;
-- wait for notification events from the driver
```
**Time Complexity:** O(1) notify; delivery to connected listeners.
**Space Complexity:** Payload limited (≈8000 bytes).

## 92. Advisory lock
**Difficulty:** Hard

**Question:** PostgreSQL: take a session advisory lock for product id 555 before a critical section, then release it.

**Hints:** pg_advisory_lock / pg_advisory_unlock. MySQL GET_LOCK/RELEASE_LOCK.

**Solution:**
```sql
-- PostgreSQL
SELECT pg_advisory_lock(555);
-- critical section --
SELECT pg_advisory_unlock(555);

-- MySQL
-- SELECT GET_LOCK('product:555', 10);
-- SELECT RELEASE_LOCK('product:555');
```
**Time Complexity:** O(1); may block waiting for the lock.
**Space Complexity:** O(1).

## 93. BRIN index for time series
**Difficulty:** Hard

**Question:** PostgreSQL: create a BRIN index on `events(created_at)` for append-only time-series data. Note MySQL has no BRIN (use BTREE/partitioning).

**Hints:** BRIN shines when values correlate with physical order.

**Solution:**
```sql
-- PostgreSQL
CREATE INDEX idx_events_created_brin
ON events USING BRIN (created_at);

-- MySQL: rely on BTREE (created_at) and/or partitioning by range.
```
**Time Complexity:** Range queries can skip large chunks with tiny index size.
**Space Complexity:** Much smaller than BTREE for huge append-only tables.

## 94. Foreign data wrapper sketch
**Difficulty:** Hard

**Question:** PostgreSQL: show the SQL to create an extension stub and a foreign table definition shape for remote `users` (conceptual; names illustrative).

**Hints:** CREATE EXTENSION postgres_fdw; CREATE SERVER; CREATE FOREIGN TABLE.

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER remote_app
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'remote', dbname 'app');

CREATE FOREIGN TABLE remote_users (
  id INT,
  email TEXT
)
SERVER remote_app
OPTIONS (schema_name 'public', table_name 'users');
```
**Time Complexity:** Remote query cost dominated by network + remote plan.
**Space Complexity:** Local FDW metadata only.

## 95. CDC style audit trigger
**Difficulty:** Hard

**Question:** PostgreSQL: write a row-level trigger function that inserts old/new JSON into `audit_logs` on UPDATE of `users`.

**Hints:** BEFORE/AFTER UPDATE function using `to_jsonb(OLD/NEW)`.

**Solution:**
```sql
CREATE OR REPLACE FUNCTION audit_users_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO audit_logs (entity, entity_id, action, before, after, at)
  VALUES ('user', OLD.id, 'update', to_jsonb(OLD), to_jsonb(NEW), now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_audit
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_users_update();
```
**Time Complexity:** O(1) extra insert per updated row.
**Space Complexity:** Audit table growth O(updates).

## 96. Online DDL note
**Difficulty:** Hard

**Question:** Show a PostgreSQL `CREATE INDEX CONCURRENTLY` on `orders(user_id)` and note MySQL `ALGORITHM=INPLACE` style ALTER for comparison.

**Hints:** CONCURRENTLY avoids long write locks but cannot run in a transaction.

**Solution:**
```sql
-- PostgreSQL
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);

-- MySQL 8 example
-- ALTER TABLE orders ADD INDEX idx_orders_user_id (user_id), ALGORITHM=INPLACE, LOCK=NONE;
```
**Time Complexity:** Build still O(n log n) but allows concurrent writes (with caveats).
**Space Complexity:** Index O(n).

## 97. Query cost with CTE materialization
**Difficulty:** Hard

**Question:** PostgreSQL 12+: force materialization of a CTE of paid orders then aggregate — show MATERIALIZED hint form — and mention MySQL derived tables are often materialized.

**Hints:** WITH ... AS MATERIALIZED.

**Solution:**
```sql
-- PostgreSQL 12+
WITH paid AS MATERIALIZED (
  SELECT user_id, total
  FROM orders
  WHERE status = 'paid'
)
SELECT user_id, SUM(total) AS revenue
FROM paid
GROUP BY user_id;
```
**Time Complexity:** Materialize O(n) then aggregate O(n); can help when CTE is reused.
**Space Complexity:** Temp storage for CTE rows.

## 98. Hypothesize covering INCLUDE
**Difficulty:** Hard

**Question:** PostgreSQL: create an index on `orders(status)` INCLUDE (`total`, `created_at`) to support filter-by-status reporting without heap fetches.

**Hints:** INCLUDE adds non-key columns (PG11+). MySQL 8 invisible/covering via full composite instead.

**Solution:**
```sql
-- PostgreSQL
CREATE INDEX idx_orders_status_incl
ON orders (status)
INCLUDE (total, created_at);

SELECT total, created_at
FROM orders
WHERE status = 'paid';
```
**Time Complexity:** Index-only capable for this projection/filter.
**Space Complexity:** Wider index leaves.

## 99. Multi-row VALUES join
**Difficulty:** Hard

**Question:** Update product prices from a VALUES list of (id, price) pairs using an UPDATE FROM (PostgreSQL) / JOIN (MySQL).

**Hints:** UPDATE ... FROM (VALUES ...) AS v(...).

**Solution:**
```sql
-- PostgreSQL
UPDATE products p
SET price = v.price
FROM (VALUES (1, 9.99), (2, 19.99), (3, 29.99)) AS v(id, price)
WHERE p.id = v.id;

-- MySQL
-- UPDATE products p
-- JOIN (
--   SELECT 1 AS id, 9.99 AS price UNION ALL
--   SELECT 2, 19.99 UNION ALL
--   SELECT 3, 29.99
-- ) v ON p.id = v.id
-- SET p.price = v.price;
```
**Time Complexity:** O(k log n) for k updates by PK.
**Space Complexity:** O(k).

## 100. Safe money transfer checklist query
**Difficulty:** Hard

**Question:** Write the SQL for a transfer that (1) begins a transaction, (2) locks both account rows in id order to avoid deadlocks, (3) updates balances with checks, (4) inserts ledger rows, (5) commits.

**Hints:** Lock in sorted id order; verify rowcounts/balances.

**Solution:**
```sql
BEGIN;

SELECT id, balance
FROM accounts
WHERE id IN (10, 20)
ORDER BY id
FOR UPDATE;

UPDATE accounts SET balance = balance - 40
WHERE id = 10 AND balance >= 40;

UPDATE accounts SET balance = balance + 40
WHERE id = 20;

INSERT INTO ledger_entries (account_id, amount, created_at)
VALUES (10, -40, NOW()), (20, 40, NOW());

COMMIT;
```
**Time Complexity:** O(1) rows; latency dominated by commit and lock waits.
**Space Complexity:** O(1); locks until commit.
