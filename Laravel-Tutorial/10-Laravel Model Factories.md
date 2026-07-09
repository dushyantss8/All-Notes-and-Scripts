# Model Factories

## Overview

* Populating your local development database with sample data.
* Creating test data for automated testing.
* Generating related models automatically.

---

# What is a Factory?

Laravel ships with a default factory for the `User` model.

Example:

```php
database/factories/UserFactory.php
```

```php
public function definition(): array
{
    return [
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'email_verified_at' => now(),
    ];
}
```

Laravel uses the **Faker** library to generate realistic fake data such as:

* Names
* Email addresses
* Company names
* Job titles
* Phone numbers
* Addresses
* Dates
* Much more

Factories can also define **states**, allowing the same model to be generated with different configurations.

Example:

```php
public function unverified(): static
{
    return $this->state(fn (array $attributes) => [
        'email_verified_at' => null,
    ]);
}
```

---

# Common Uses of Factories

## 1. Generating test data

Instead of manually creating records during tests:

```text
Given I have 10 users...
```

Generate them instantly:

```php
User::factory()->count(10)->create();
```

---

## 2. Populating the local database

Rather than manually inserting dozens of records:

Instead of:

```
1 Job Listing
```

Generate:

```
50 Job Listings
100 Users
300 Products
```

This makes development much easier.

---

# Using Factories in Tinker

Factories can be used anywhere Laravel code is executed.

A convenient place is **Laravel Tinker**.

Start Tinker:

```bash
php artisan tinker
```

Generate one user:

```php
User::factory()->create();
```

---

# Why `factory()` Exists

The `User` model includes the `HasFactory` trait.

```php
use HasFactory;
```

When creating models using:

```bash
php artisan make:model User
```

Laravel automatically adds this trait.

The trait provides methods like:

```php
User::factory()
```

Without it, factories cannot be used.

---

Some faker methods examples:

```php
fake()->firstName()

fake()->lastName()
```

---

# Restart Tinker After Editing Code

Tinker loads classes into memory.

After changing factory code:

Exit:

```bash
Ctrl + C
```

Restart:

```bash
php artisan tinker
```

Otherwise, Tinker continues using the old code.

---

# Creating Multiple Records

Generate a single user:

```php
User::factory()->create();
```

Generate many:

```php
User::factory(100)->create();
```

or

```php
User::factory()->count(100)->create();
```

Laravel inserts all records in seconds.

---

# Creating a Factory for Another Model

Instead of manually creating the factory file:

```bash
php artisan make:factory JobFactory
```

Laravel generators should be preferred.

Example:

```bash
php artisan make:factory JobFactory
```

---

# Defining Factory Attributes

Example Job Factory:

```php
public function definition(): array
{
    return [
        'title' => fake()->jobTitle(),
        'salary' => '90000',
    ];
}
```

For salary you may:

Hardcode:

```php
'salary' => '90000'
```

or generate dynamic values if needed.

The choice depends entirely on your application.

---

# Using the Job Factory

Generate one job:

```php
Job::factory()->create();
```

Initially this produced:

```
Call to undefined method Job::factory()
```

Reason:

The `Job` model had been created manually instead of with:

```bash
php artisan make:model Job
```

So it was missing:

```php
use HasFactory;
```

and

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;
```

After adding the trait:

```php
class Job extends Model
{
    use HasFactory;
}
```

Factories worked normally.

---

# Generating Hundreds of Jobs

Example:

```php
Job::factory(300)->create();
```

Faker generated realistic titles such as:

* Musician
* Physicist
* Warehouse Manager
* Geological Data Technician

This is especially useful when building and testing interfaces.

---

# Factory States

The `UserFactory` contains a state called:

```php
unverified()
```

Definition:

```php
public function unverified(): static
{
    return $this->state(fn () => [
        'email_verified_at' => null,
    ]);
}
```

Usage:

```php
User::factory()
    ->unverified()
    ->create();
```

Result:

```
email_verified_at = NULL
```

instead of

```php
now()
```

States are commonly used during testing.

---

# Creating Custom States

Suppose your users table contains:

```php
admin
```

which defaults to:

```php
false
```

Create a custom state:

```php
public function admin(): static
{
    return $this->state(fn () => [
        'admin' => true,
    ]);
}
```

Usage:

```php
User::factory()
    ->admin()
    ->create();
```

Laravel first creates the default attributes, then overrides them with the state values.

---

# Preparing Database Relationships

The lesson introduces a simple relationship:

```
Employer
    ↓
Job Listings
```

One employer can own many job listings.

Each job listing belongs to exactly one employer.

---

# Updating the Migration

Add an employer reference:

```php
$table->foreignIdFor(Employer::class);
```

Equivalent to manually writing:

```php
$table->unsignedBigInteger('employer_id');
```

Laravel's helper is preferred because it automatically follows conventions.

---

# Creating the Employer Model

Generate both model and migration:

```bash
php artisan make:model Employer -m
```

Employer migration:

```php
$table->string('name');
```

For demonstration purposes, a name is sufficient.

---

# Updating the Job Factory

Now every job requires an employer.

Instead of hardcoding:

```php
'employer_id' => 1
```

Use another factory:

```php
'employer_id' => Employer::factory(),
```

Laravel will:

1. Create an employer.
2. Save it.
3. Retrieve its ID.
4. Insert that ID into the job record.

This automatically creates related models.

---

# Missing Employer Factory

Generate both model and factory together:

```bash
php artisan make:model Employer -f
```

If the migration already exists, omit `-m`.

Laravel can also generate everything at once using multiple flags.

---

# Employer Factory

Example:

```php
public function definition(): array
{
    return [
        'name' => fake()->company(),
    ];
}
```

Faker provides realistic company names.

---

# Automatic Relationship Creation

After updating the factory:

```php
Job::factory(10)->create();
```

Laravel automatically:

* Creates 10 employers.
* Creates 10 job listings.
* Connects each listing to its employer.

Example database:

```
Job Listing
-------------
Forest Firefighter
Employer ID: 2

Employer
-------------
ABC Legal Group
```

The relationship is established automatically.

---

# Multiple Jobs for the Same Employer

By default:

```
Job A → Employer A

Job B → Employer B

Job C → Employer C
```

If multiple jobs should belong to the **same employer**, Laravel provides the:

```php
recycle()
```

method.

This topic is mentioned as an advanced feature and is explored later.

---

# Key Takeaways

* **Factories** quickly generate fake database records.
* They are ideal for local development and automated testing.
* **Faker** generates realistic data such as names, job titles, emails, and company names.
* Every Eloquent model should include the **`HasFactory`** trait to enable `Model::factory()`.
* Factory **states** allow models to be created in different predefined configurations (e.g., unverified users, admin users).
* Factories can automatically create **related models** using nested factories such as `Employer::factory()`.
* Use `php artisan make:factory` or generate factories alongside models using Artisan options.
* During early development, `php artisan migrate:fresh` is useful for rebuilding the database from scratch.
* This lesson prepares the database relationship (`Employer → Job Listing`), which is further explored using **Eloquent Relationships** in the next lesson.
