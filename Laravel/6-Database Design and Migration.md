# 🧩 **1. Introduction: Designing a Database Schema**

Before starting a new Laravel project, the first step is to design the **UI** and the **database schema**, represented as an **Entity Relationship Diagram (ERD)**.
The ERD defines:

* The **tables** (entities)
* The **fields (columns)** in each table
* The **relationships** between tables

### Tools for ERD:

You can design your ERD on:

* Paper or whiteboard
* Software like **[Draw.io](https://draw.io)** (free and open-source)

---

# 🧱 **2. Creating the Database Schema**

## **Tables and Relationships**

For the example app (a blogging platform), the following tables are created:

### **a. Users Table**

Holds user information such as:

* `id`
* `name`
* `email`
* `password`
* `created_at`, `updated_at`

### **b. Posts Table**

Contains post data:

* `id`
* `title`
* `body (JSON)`
* `created_at`, `updated_at`

> The **`body`** field is stored as **JSON** instead of string because rich-text formatting (headings, colors, fonts, etc.) needs to be preserved.

### **c. Comments Table**

Contains comments written by users:

* `id`
* `body (JSON)`
* `user_id` (foreign key → users)
* `post_id` (foreign key → posts)
* `created_at`, `updated_at`

### **d. Post_User Pivot Table**

This table establishes a **many-to-many** relationship between users and posts:

* `user_id` (foreign key → users)
* `post_id` (foreign key → posts)

**Naming convention:**
Pivot table name should be in **singular form** of both tables in **alphabetical order** → `post_user`.

---

# 🔗 **3. Understanding Relationships**

### **a. One-to-Many Relationship**

* A **user** can write **many comments**
* A **post** can have **many comments**

Represented as:

```
User (1) ----> (∞) Comments
Post (1) ----> (∞) Comments
```

### **b. Many-to-Many Relationship**

* A **user** can write multiple **posts**
* A **post** can be written by multiple **users**

This requires a **pivot table** (`post_user`).

#### Example Pivot Data:

| user_id | post_id |
| ------- | ------- |
| 1       | 1       |
| 1       | 2       |
| 1       | 3       |
| 2       | 1       |
| 2       | 2       |

---

# 🗄️ **4. Database Setup in Laravel**

### **a. Configure `.env`**

Set up your MySQL database connection:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=live_post
DB_USERNAME=root
DB_PASSWORD=
```

### **b. Create Schema in MySQL Workbench**

Create a new schema called `live_post` manually or using:

```sql
CREATE DATABASE live_post;
```

---

# ⚙️ **5. Laravel Migrations Overview**

### What is a Migration?

* Version control for your database structure.
* Each migration file performs schema operations like:

  * Creating tables
  * Modifying columns
  * Dropping tables

### Default Migrations in Laravel:

1. `create_users_table`
2. `create_password_resets_table`
3. `create_failed_jobs_table`

> **Note:** Laravel runs migrations in **chronological order** based on the **timestamp** in their filenames.

---

# 🧠 **6. Anatomy of a Migration File**

Each migration contains two methods:

```php
public function up()
{
    // Runs when migration is applied
}

public function down()
{
    // Runs when migration is rolled back
}
```

### Example: Users Table Migration

```php
public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->rememberToken();
        $table->timestamps();
    });
}
```

---

# 💻 **7. Using Artisan to Create Migrations**

List Artisan commands:

```bash
php artisan list
```

Create a **model** along with migrations and API controller:

```bash
php artisan make:model Post -a --api
php artisan make:model Comment -a --api
```

This generates:

* Model (`app/Models/Post.php`)
* Migration (`database/migrations/...create_posts_table.php`)
* Controller (`app/Http/Controllers/API/PostController.php`)

---

# 🧩 **8. Defining Migrations for Each Table**

### **a. Posts Table**

```php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->json('body')->nullable();
        $table->timestamps();
    });
}
```

---

### **b. Comments Table**

```php
public function up()
{
    Schema::create('comments', function (Blueprint $table) {
        $table->id();
        $table->json('body')->nullable();

        $table->foreignId('user_id')
              ->constrained('users')
              ->onDelete('cascade');

        $table->foreignId('post_id')
              ->constrained('posts')
              ->onDelete('cascade');

        $table->timestamps();
    });
}
```

---

### **c. Post_User Pivot Table**

```php
public function up()
{
    Schema::create('post_user', function (Blueprint $table) {
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('post_id');

        $table->primary(['user_id', 'post_id']);

        $table->index(['user_id', 'post_id']);
    });
}
```

---

# 🚀 **9. Running and Verifying Migrations**

Run all migrations:

```bash
php artisan migrate
```

Verify tables in MySQL Workbench → confirm structure and data types.

---

# 🧩 **10. Git Version Control (Optional Workflow)**

To manage source control:

```bash
git status
git add .
git commit -m "Added migrations for posts, comments, and pivot table"
git push
```

(Uses shorthand like `ga` and `gcam` from **Oh My Zsh** for Unix-based systems.)

---

# 🧭 **11. Key Takeaways**

✅ **ERD Design First** — Always visualize tables and relationships before coding.
✅ **Migration = Version Control** — Laravel runs migrations based on timestamps.
✅ **Artisan Commands Save Time** — Use them to generate models, migrations, and controllers quickly.
✅ **Use JSON for Rich Text Fields** — To store formatted content easily.
✅ **Foreign Key Constraints** — Ensure referential integrity and cascading deletes.

---

# 📘 **Example Folder Structure After Setup**

```
app/
 ├── Models/
 │    ├── Post.php
 │    └── Comment.php
database/
 ├── migrations/
 │    ├── 2025_11_09_000001_create_users_table.php
 │    ├── 2025_11_09_000002_create_posts_table.php
 │    ├── 2025_11_09_000003_create_comments_table.php
 │    └── 2025_11_09_000004_create_post_user_table.php
```
