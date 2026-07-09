# Introduction to Databases and Migrations

# Database Configuration

When creating a new Laravel project using:

```bash
laravel new project-name
```

Laravel asks which database to use.

Supported databases include:

* SQLite (default)
* MySQL
* PostgreSQL
* Others

## Why SQLite is the Default

Laravel defaults to **SQLite**, which is a file-based database.

Despite its reputation as a lightweight database, SQLite is suitable for many applications. Unless an application handles extremely large-scale traffic (millions of database rows and heavy concurrent access), SQLite is often sufficient.

---

# Environment Configuration (.env)

Database configuration is stored inside the `.env` file.

Example:

```env
DB_CONNECTION=sqlite
```

The `.env` file is used to configure:

* Database connection
* Debug mode
* Cache driver
* Session driver
* Mail configuration
* API keys
* Secrets and passwords

Example of storing an API key:

```env
APP_API_KEY=your-secret-api-key
```

This keeps sensitive information out of source code and prevents accidentally committing secrets to Git repositories.

---

# Laravel Artisan

Laravel ships with the Artisan command-line tool.

View all available commands:

```bash
php artisan
```

Commands are organized into namespaces such as:

* cache
* make
* db
* migrate
* route
* queue

The **make** namespace generates Laravel files such as:

* Models
* Controllers
* Events
* Jobs
* Factories
* Migrations

---

# Viewing Database Information

Laravel provides a command to inspect the current database:

```bash
php artisan db:show
```

Example output includes:

* Database connection
* SQLite file path
* Existing tables

Example:

```
Connection: sqlite

Database:
database/database.sqlite

Tables:
- users
- jobs
- cache
- sessions
- migrations
```

---

# Why Tables Already Exist

When a Laravel project is created using:

```bash
laravel new
```

Laravel automatically:

1. Creates the database
2. Runs all default migrations

This is why tables such as:

* users
* sessions
* cache
* jobs
* failed_jobs

already exist in a new project.

---

# Running Migrations Manually

If the database file is deleted, recreate everything using:

```bash
php artisan migrate
```

For SQLite, Laravel automatically asks whether it should create the missing database file.

Example:

```
Would you like to create it? (yes/no)
```

After confirmation, Laravel:

* Creates the database file
* Executes every migration
* Builds all required tables

---

# Viewing the Database

A graphical database manager is recommended instead of using SQL from the terminal.

Recommended tool:

**TablePlus**

Features:

* SQLite
* MySQL
* PostgreSQL
* Redis
* Multiple database support
* Available on Windows, macOS, and Linux

After connecting to the SQLite database file:

```
database/database.sqlite
```

you can inspect:

* Tables
* Records
* Table structures
* Relationships

---

# Default Laravel Tables

A fresh Laravel installation includes several tables.

Common tables include:

* users
* sessions
* cache
* jobs
* failed_jobs
* migrations

Most are used internally by Laravel.

The **users** table is the first one developers commonly work with.

Typical columns:

```
id
name
email
password
created_at
updated_at
```

---

# What are Migrations?

The `database/migrations` directory contains PHP classes that define database structure.

Example migration files:

```
create_users_table.php
create_cache_table.php
create_jobs_table.php
```

Running:

```bash
php artisan migrate
```

executes these migration files.

---

# Example: Users Table Migration

Laravel creates the table using code similar to:

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();

    $table->string('name');

    $table->string('email')->unique();

    $table->string('password');

    $table->timestamps();
});
```

Each method creates a database column.

Examples:

```php
$table->id();
```

Creates:

```
id
```

---

```php
$table->string('name');
```

Creates:

```
name VARCHAR(...)
```

---

```php
$table->string('email')->unique();
```

Creates a unique email column.

---

```php
$table->timestamps();
```

Automatically creates:

```
created_at
updated_at
```

---

# Modifying a Migration

Suppose the application requires separate names instead of one name field.

Original:

```php
$table->string('name');
```

Updated:

```php
$table->string('first_name');

$table->string('last_name');
```

Simply editing the migration file is **not enough**.

The migration must be executed again.

---

# Benefits of Migrations

Migrations solve database synchronization problems.

Instead of manually recreating database tables for every team member, everyone simply runs:

```bash
php artisan migrate
```

Laravel generates an identical database structure automatically.

Because migrations are PHP files, they can also be version controlled with Git.

---

# Useful Migration Commands

## Run all pending migrations

```bash
php artisan migrate
```

Runs only migrations that have not yet been executed.

---

## Rebuild the database

```bash
php artisan migrate:fresh
```

This command:

* Drops every table
* Recreates the database from scratch
* Runs every migration again

Useful during development.

**Do not run this in production**, as it deletes all data.

---

## Roll Back

```bash
php artisan migrate:rollback
```

Reverts the most recently executed migration.

Typical rollback scenarios include:

* Removing a newly added column
* Dropping a recently created table
* Undoing the latest schema change

---

# Creating a New Migration

Generate a migration:

```bash
php artisan make:migration create_job_listings_table
```

Laravel creates a new migration file containing two methods:

```php
up()
```

Applies the change.

```php
down()
```

Reverses the change.

Think of them as:

```
up()   -> Do the operation

down() -> Undo the operation
```

Examples:

| Action        | up()         | down()        |
| ------------- | ------------ | ------------- |
| Create table  | Create table | Drop table    |
| Add column    | Add column   | Remove column |
| Rename column | Rename       | Rename back   |

---

# Creating the Job Listings Table

Laravel scaffolds the migration:

```php
Schema::create('job_listings', function (Blueprint $table) {

    $table->id();

    $table->timestamps();

});
```

Add the required fields:

```php
$table->string('title');

$table->string('salary');
```

Final structure:

```php
Schema::create('job_listings', function (Blueprint $table) {

    $table->id();

    $table->string('title');

    $table->string('salary');

    $table->timestamps();

});
```

---

# Why Salary is a String

Normally, monetary values are stored as integers (for example, cents) to avoid floating-point precision issues.

However, this application allows flexible salary formats such as:

```
$500/month

$60,000/year

Negotiable
```

Because the value is free-form text rather than a precise numeric amount, a string column is more appropriate.

---

# Applying the New Migration

Execute:

```bash
php artisan migrate
```

Laravel detects that previous migrations have already run and executes only the new migration.

---

# Adding Sample Data

Using TablePlus, switch to the **Data** tab and insert records.

Example:

| Title      | Salary |
| ---------- | ------ |
| Director   | 75,000 |
| Programmer | 60,000 |
| Teacher    | 50,000 |

After entering the records:

* Save/commit changes using **Ctrl + S** (Windows/Linux) or **Cmd + S** (macOS).

---

# SQLite Refresh Note

When using SQLite with TablePlus, schema changes may not appear immediately after running migrations.

If refreshing does not show the changes:

1. Close the database connection.
2. Reopen the connection.

The updated table structure will then be visible.

---

# Lesson Recap

By the end of this lesson:

* Learned why databases are necessary for dynamic applications.
* Understood Laravel's default SQLite configuration.
* Explored the purpose of the `.env` file.
* Learned how to inspect databases using `php artisan db:show`.
* Understood how Laravel automatically creates default tables.
* Learned what migrations are and why they are useful.
* Explored the structure of migration files using `up()` and `down()`.
* Used migration commands such as:

  ```bash
  php artisan migrate
  php artisan migrate:fresh
  php artisan migrate:rollback
  ```
* Created a new `job_listings` table using a migration.
* Added `title` and `salary` columns.
* Applied the migration.
* Inserted sample records into the database using TablePlus.