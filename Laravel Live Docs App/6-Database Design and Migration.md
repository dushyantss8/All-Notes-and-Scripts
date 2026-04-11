# Designing an ERD and Implementing Database Schema with Laravel Migrations

This guide walks through:

1. Designing an **Entity Relationship Diagram (ERD)**
2. Defining relationships (One-to-Many, Many-to-Many)
3. Creating a database in MySQL
4. Implementing tables using **Laravel migrations**
5. Generating models and related components with Artisan
6. Running and verifying migrations

The example application is a blog-style system with:

* Users
* Posts
* Comments
* A pivot table for many-to-many relationships

---

# 1. Designing the Entity Relationship Diagram (ERD)

An **ERD (Entity Relationship Diagram)** defines:

* Tables (entities)
* Columns (attributes)
* Relationships between tables

You can design your ERD using:

* Pen & paper
* Whiteboard
* Software like **draw.io**

The tool does not matter — clarity does.

---

## 1.1 Identifying Entities (Tables)

For a blogging application:

### Tables Required

* `users`
* `posts`
* `comments`
* `post_user` (pivot table)

---

# 2. Defining Table Structures and Relationships

---

## 2.1 Users Table

Stores user information.

### Fields:

| Column     | Type            |
| ---------- | --------------- |
| id         | bigint (PK)     |
| name       | string          |
| email      | string (unique) |
| password   | string          |
| created_at | timestamp       |
| updated_at | timestamp       |

---

## 2.2 Posts Table

Stores blog posts.

### Fields:

| Column     | Type            |
| ---------- | --------------- |
| id         | bigint (PK)     |
| title      | string          |
| body       | json (nullable) |
| created_at | timestamp       |
| updated_at | timestamp       |

### Why Use `json` for `body`?

Instead of `string` or `text`, we use `json` because:

* Rich text editors store structured content
* Formatting metadata (headings, colors, styles) is preserved
* JSON allows structured storage

---

## 2.3 Many-to-Many: Users ↔ Posts

A user can be involved in many posts.
A post can involve many users.

This is a **Many-to-Many** relationship.

### Solution: Pivot Table

Laravel convention:

* Singular model names
* Alphabetical order

`posts` + `users` → `post_user`

---

### post_user Table

| Column  | Type   |
| ------- | ------ |
| user_id | bigint |
| post_id | bigint |

No `id` column required.

Composite primary key:

```
PRIMARY KEY (user_id, post_id)
```

---

### Example Pivot Table Data

If:

* User 1 → Post 1, 2, 3
* User 2 → Post 1, 2

Pivot table would look like:

| user_id | post_id |
| ------- | ------- |
| 1       | 1       |
| 1       | 2       |
| 1       | 3       |
| 2       | 1       |
| 2       | 2       |

---

## 2.4 Comments Table

A comment:

* Belongs to a user
* Belongs to a post

This is **One-to-Many**:

* One user → many comments
* One post → many comments

---

### Comments Table Structure

| Column     | Type            |
| ---------- | --------------- |
| id         | bigint (PK)     |
| body       | json (nullable) |
| user_id    | bigint (FK)     |
| post_id    | bigint (FK)     |
| created_at | timestamp       |
| updated_at | timestamp       |

---

# 3. Setting Up Database Connection

Open `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=live_post
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

## 3.1 Create Database in MySQL

Using MySQL Workbench:

1. Click **Create New Schema**
2. Name it: `live_post`
3. Apply changes

---

# 4. Understanding Laravel Migrations

## What is a Migration?

Migration = Version control for database schema.

It allows you to:

* Create tables
* Modify columns
* Drop tables
* Rollback changes

---

## Migration File Structure

Located in:

```
database/migrations
```

File naming convention:

```
YYYY_MM_DD_HHMMSS_create_table_name.php
```

Example:

```
2014_10_12_000000_create_users_table.php
```

Laravel runs migrations **chronologically** based on timestamp.

---

## Migration Class Structure

```php
public function up()
{
    // Schema creation logic
}

public function down()
{
    // Rollback logic
}
```

* `up()` → applies migration
* `down()` → reverses migration

---

# 5. Generating Models and Migrations Using Artisan

List commands:

```bash
php artisan
```

Create a model with related files:

```bash
php artisan make:model Post -a --api
```

Options:

* `-a` → generate:

  * Migration
  * Controller
  * Factory
  * Seeder
* `--api` → generate API controller

Create Comment model:

```bash
php artisan make:model Comment -a --api
```

---

# 6. Writing Migration Code

---

## 6.1 Posts Migration

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->json('body')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
```

---

## 6.2 Comments Migration

```php
class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->json('body')->nullable();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->foreignId('post_id')
                  ->constrained('posts')
                  ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
```

### Explanation:

* `foreignId()` → unsignedBigInteger
* `constrained('users')` → references `id` on users table
* `cascadeOnDelete()` → deletes comments if parent is deleted

---

## 6.3 Creating Pivot Table Migration

Laravel does not auto-generate pivot migration.

Create manually:

```bash
php artisan make:migration create_post_user_table
```

Then modify:

```php
class CreatePostUserTable extends Migration
{
    public function up()
    {
        Schema::create('post_user', function (Blueprint $table) {
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('post_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->primary(['user_id', 'post_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('post_user');
    }
}
```

### Important:

* No `id()` column
* Composite primary key
* Foreign keys indexed automatically

---

# 7. Running Migrations

Run all migrations:

```bash
php artisan migrate
```

Rollback last batch:

```bash
php artisan migrate:rollback
```

Refresh database:

```bash
php artisan migrate:fresh
```

---

# 8. Verifying Tables in MySQL

After running migrations:

* Open MySQL Workbench
* Refresh schema
* Inspect tables
* Confirm:

  * Column types
  * Foreign keys
  * Constraints

---

# 9. Git Best Practice After Schema Changes

```bash
git status
git add .
git commit -m "Add post, comment and pivot table migrations"
git push
```

Commit frequently after schema changes.

---

# Final Section: Key Notes, Best Practices & Important Considerations

---

## 1. Always Design ERD First

* Prevents structural mistakes
* Avoids relationship confusion
* Reduces refactoring later

---

## 2. Understand Relationship Types

| Relationship | Implementation |
| ------------ | -------------- |
| One-to-One   | Foreign key    |
| One-to-Many  | Foreign key    |
| Many-to-Many | Pivot table    |

---

## 3. Follow Naming Conventions

* Pivot table → singular + alphabetical
* Foreign keys → `model_id`
* Tables → plural

---

## 4. Migration Execution Order Matters

* Migrations run by timestamp
* Parent tables must be created before dependent tables
* Do not manually alter timestamps incorrectly

---

## 5. Use `foreignId()->constrained()` When Possible

Cleaner and safer than manual foreign key definitions.

---

## 6. Use JSON for Rich Structured Content

Use `json` column when:

* Data structure is nested
* Rich formatting required
* Flexible schema needed

---

## 7. Use Composite Primary Keys for Pivot Tables

Improves:

* Data integrity
* Query performance
* Prevents duplicate entries

---

## 8. Always Implement `down()` Method Properly

Ensures:

* Safe rollback
* Clean schema resets
* Reliable deployment pipelines

---

## 9. Treat Migrations as Source of Truth

Never manually edit production tables.
Always:

* Create new migration
* Commit changes
* Deploy safely

---

This completes the full workflow:

**ERD → Schema Design → Laravel Migrations → Execution → Verification**

Understanding this process deeply is essential for building scalable Laravel applications with clean database architecture.
