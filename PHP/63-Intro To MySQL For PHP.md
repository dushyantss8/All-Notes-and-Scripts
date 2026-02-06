# MySQL Basics for PHP Developers —

This lesson introduces **MySQL fundamentals** required for building PHP-based web applications. The goal is to understand relational databases, basic SQL syntax, table design, and relationships—enough to confidently use MySQL with PHP later.

---

## 1. What Is MySQL and Why It’s Needed

* **MySQL** is a **relational database management system (RDBMS)**
* Uses **SQL (Structured Query Language)** for data manipulation
* Commonly used with PHP to **persist application data**
* Stores structured data in **tables with rows and columns**

Typical use cases:

* Users
* Orders / invoices
* Products
* Logs and metadata

---

## 2. Installing MySQL (Docker Setup)

> If you are using **XAMPP**, MySQL is already installed and this step can be skipped.

### Docker Compose MySQL Service

```yaml
services:
  mysql:
    container_name: program-with-go-db
    image: mysql:8.0
    volumes:
      - ./storage/mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
```

### Key Points

* **Volume mapping** ensures data persists even if the container is destroyed
* **Port 3306** is exposed for local connections
* Root password is set via environment variables

Start the container:

```bash
docker compose up --build
```

Verify:

```bash
docker ps
```

---

## 3. Connecting to MySQL via Command Line

Enter the container:

```bash
docker exec -it program-with-go-db bash
```

Connect to MySQL:

```bash
mysql -u root -p
```

Password:

```
root
```

---

## 4. Working with Databases

### Show Existing Databases

```sql
SHOW DATABASES;
```

### Create a Database

```sql
CREATE DATABASE my_db;
```

### Select a Database

```sql
USE my_db;
```

---

## 5. Creating Tables

### Users Table Example

```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    INDEX idx_is_active (is_active)
);
```

### Explanation

* `id`: Primary key, auto-incremented
* `email`: Unique, required
* `is_active`: Boolean flag (`BOOLEAN` → `TINYINT(1)` internally)
* `created_at`: Record creation timestamp
* Index added for query optimization

---

## 6. Inspecting Table Structure

```sql
DESCRIBE users;
```

---

## 7. Modifying Tables (ALTER TABLE)

### Add Column

```sql
ALTER TABLE users
ADD COLUMN phone VARCHAR(150);
```

### Modify Column

```sql
ALTER TABLE users
MODIFY full_name VARCHAR(150);
```

### Drop Column

```sql
ALTER TABLE users
DROP COLUMN is_active;
```

---

## 8. Dropping and Recreating Tables

```sql
DROP TABLE users;
```

Then recreate the table as needed.

---

## 9. Inserting Data

### Insert Multiple Rows

```sql
INSERT INTO users (email, full_name, is_active, created_at)
VALUES
('john@doe.com', 'John Doe', 1, NOW()),
('jane@doe.com', 'Jane Doe', 1, NOW());
```

---

## 10. Selecting Data

### Select All Columns

```sql
SELECT * FROM users;
```

### Select Specific Columns

```sql
SELECT id, email FROM users;
```

---

## 11. Filtering Results (WHERE)

```sql
SELECT * FROM users WHERE id = 2;
```

```sql
SELECT * FROM users WHERE is_active = 0;
```

---

## 12. Sorting Results (ORDER BY)

```sql
SELECT * FROM users
ORDER BY created_at DESC;
```

---

## 13. Searching with LIKE

### Contains Text

```sql
SELECT * FROM users
WHERE email LIKE '%doe%';
```

### Starts With

```sql
SELECT * FROM users
WHERE email LIKE 'john%';
```

### Ends With

```sql
SELECT * FROM users
WHERE email LIKE '%@doe.com';
```

### Negation

```sql
SELECT * FROM users
WHERE email NOT LIKE '%john%';
```

---

## 14. Updating Records (UPDATE)

⚠️ **Always use WHERE to avoid mass updates**

```sql
UPDATE users
SET email = 'jane@gmail.com'
WHERE id = 2;
```

### Example: Activate One User

```sql
UPDATE users
SET is_active = 1
WHERE id = 1;
```

---

## 15. Deleting Records (DELETE)

⚠️ **Never omit WHERE unless intentional**

```sql
DELETE FROM users
WHERE id = 2;
```

### Reset Auto-Increment Completely

```sql
TRUNCATE TABLE users;
```

---

## 16. Foreign Keys and Relationships

### Invoices Table with Foreign Key

```sql
CREATE TABLE invoices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,4) NOT NULL,
    user_id INT UNSIGNED,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
```

### Why `DECIMAL` for Money?

* Avoids floating-point rounding errors
* Ensures exact precision

---

## 17. Inserting Related Records

```sql
INSERT INTO invoices (amount, user_id)
VALUES
(25.00, 1),
(115.95, 1),
(10500.00, 1);
```

---

## 18. Joining Tables (INNER JOIN)

### Problem

Invoice data does not contain user names.

### Solution: JOIN

```sql
SELECT
    invoices.id,
    invoices.amount,
    users.full_name
FROM invoices
INNER JOIN users
    ON users.id = invoices.user_id;
```

### Why Table Prefixes Are Required

Both tables contain an `id` column → ambiguity must be resolved.

---

## 19. Filtering Joined Data

```sql
SELECT
    invoices.id,
    invoices.amount,
    users.full_name
FROM invoices
INNER JOIN users
    ON users.id = invoices.user_id
WHERE invoices.amount < 100;
```

---

## 20. Key Concepts Covered

✔ Databases and tables
✔ Primary & foreign keys
✔ Indexes
✔ CRUD operations
✔ Relationships
✔ JOINs
✔ Safe updates & deletes

---

## 21. What’s Next

Next step is **connecting MySQL with PHP**, using:

* **PDO**
* **Prepared Statements**
* Secure database queries

This MySQL foundation is sufficient for building real-world PHP applications.

---