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
