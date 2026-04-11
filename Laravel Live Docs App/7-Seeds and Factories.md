# Database Seeding and Model Factories in Laravel

This guide explains how to populate your Laravel database with dummy data using **factories** and **seeders**. It includes complete examples and best practices for managing foreign key constraints, truncating tables, and customizing factory-generated data.

---

# 1. What is Database Seeding?

**Seeding** refers to populating the database with test or dummy data.

In Laravel:

* **Factories** generate fake model data.
* **Seeders** execute the logic to insert that data into the database.
* The command `php artisan db:seed` runs the seeding process.

Seeding is essential for:

* Local development
* Automated testing
* Rapid prototyping

---

# 2. Model Factories in Laravel

A **Factory** is a class responsible for generating model instances filled with fake data.

Factories are located in:

```
database/factories
```

Laravel includes a default `UserFactory`.

---

## 2.1 Example: User Factory

```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
        ];
    }
}
```

### Explanation

* `$model` → Specifies which model the factory belongs to.
* `definition()` → Returns an array mapping model fields to fake values.
* `$this->faker` → Instance of the Faker library (built-in).
* `safeEmail()` → Prevents sending test emails to real addresses.
* `now()` → Returns current time as Carbon instance.

---

## 2.2 Enable Factory in Model

Each model must use the `HasFactory` trait.

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Model
{
    use HasFactory;
}
```

Without this trait, the factory cannot be used.

---

# 3. Database Seeders

Seeders are located in:

```
database/seeders
```

Laravel provides a main seeder:

```
DatabaseSeeder.php
```

---

## 3.1 Creating a Dedicated User Seeder

Instead of placing all logic in `DatabaseSeeder`, create a separate seeder:

```bash
php artisan make:seeder UserSeeder
```

### UserSeeder.php

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(10)->create();
    }
}
```

---

## 3.2 Register Seeder in DatabaseSeeder

```php
public function run(): void
{
    $this->call([
        UserSeeder::class,
    ]);
}
```

---

## 3.3 Run Seeder

```bash
php artisan db:seed
```

This will insert 10 users into the database.

---

# 4. Avoiding Duplicate Data During Seeding

Running seeders repeatedly will keep inserting new records.

To prevent database flooding:

* Truncate table before inserting new records.

---

# 5. Handling Foreign Key Constraints

Truncating tables with foreign keys may cause errors.

To solve this:

1. Disable foreign key checks
2. Truncate table
3. Re-enable foreign key checks

---

## 5.1 Create Reusable Trait: TruncateTable

Create:

```
database/seeders/Traits/TruncateTable.php
```

```php
<?php

namespace Database\Seeders\Traits;

use Illuminate\Support\Facades\DB;

trait TruncateTable
{
    protected function truncate(string $table)
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table($table)->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
```

---

## 5.2 Use Trait in UserSeeder

```php
use Database\Seeders\Traits\TruncateTable;

class UserSeeder extends Seeder
{
    use TruncateTable;

    public function run(): void
    {
        $this->truncate('users');

        User::factory()->count(10)->create();
    }
}
```

Now, running the seeder multiple times will always keep exactly 10 records.

---

# 6. Post Factory and Seeder

---

## 6.1 Post Factory

```php
<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'body' => [],
        ];
    }
}
```

---

## 6.2 Cast JSON Field in Model

If `body` column is JSON type:

```php
class Post extends Model
{
    use HasFactory;

    protected $casts = [
        'body' => 'array',
    ];
}
```

This ensures automatic JSON encoding/decoding.

---

## 6.3 Post Seeder

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use Database\Seeders\Traits\TruncateTable;

class PostSeeder extends Seeder
{
    use TruncateTable;

    public function run(): void
    {
        $this->truncate('posts');

        Post::factory()->count(3)->create();
    }
}
```

Register in `DatabaseSeeder`.

---

# 7. Comment Factory and Seeder

---

## 7.1 Comment Factory

```php
<?php

namespace Database\Factories;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'body' => [],
            'user_id' => 1,
            'post_id' => 1,
        ];
    }
}
```

---

## 7.2 Cast JSON in Comment Model

```php
protected $casts = [
    'body' => 'array',
];
```

---

## 7.3 Comment Seeder

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use Database\Seeders\Traits\TruncateTable;

class CommentSeeder extends Seeder
{
    use TruncateTable;

    public function run(): void
    {
        $this->truncate('comments');

        Comment::factory()->count(5)->create();
    }
}
```

Register in `DatabaseSeeder`.

---

# 8. Factory State: Overriding Default Values

You can override factory defaults using `state()`.

---

## 8.1 Override Directly in Seeder

```php
Post::factory()
    ->count(3)
    ->state(['title' => 'Untitled'])
    ->create();
```

---

## 8.2 Define Custom State in Factory

Inside `PostFactory`:

```php
public function untitled()
{
    return $this->state(fn () => [
        'title' => 'Untitled',
    ]);
}
```

Use in Seeder:

```php
Post::factory()
    ->count(3)
    ->untitled()
    ->create();
```

---

## 8.3 Alternative State Syntax

```php
Post::factory()->create([
    'title' => 'Untitled'
]);
```

---

# 9. make() vs create()

| Method     | Persists to DB | Returns         |
| ---------- | -------------- | --------------- |
| `make()`   | ❌ No           | Model instance  |
| `create()` | ✅ Yes          | Persisted model |

Example:

```php
User::factory()->make();   // Not saved
User::factory()->create(); // Saved
```

---

# 10. Running Seeders Efficiently

### Run all seeders

```bash
php artisan db:seed
```

### Run specific seeder

```bash
php artisan db:seed --class=UserSeeder
```

### Refresh migrations and reseed

```bash
php artisan migrate:fresh --seed
```

---

# Key Notes, Best Practices & Important Considerations

### 1. Always Separate Seeders

Keep each model’s seeding logic in its own seeder class.

### 2. Use Traits for Reusability

Avoid duplicating foreign key disabling logic. Use reusable traits.

### 3. Cast JSON Columns

Always define `$casts` for JSON fields to prevent manual encoding.

### 4. Prefer Factory States

Encapsulate repeated customizations using factory state methods.

### 5. Use make() for Testing Logic

Use `make()` when you do not want to persist records.

### 6. Avoid Hardcoded Foreign Keys

Instead of:

```php
'user_id' => 1
```

Prefer:

```php
'user_id' => User::factory(),
```

(when relationships are properly defined)

### 7. Use migrate:fresh --seed During Development

This guarantees a clean schema and controlled test data.

### 8. Never Run Development Seeders in Production

Keep production data separate from test seeders.

---

# Summary

* **Factories** generate fake model data.
* **Seeders** insert that data into the database.
* Use `HasFactory` in models.
* Use traits to manage truncation and foreign keys.
* Customize factories with `state()`.
* Run seeders using `php artisan db:seed`.

This structured approach ensures controlled, reusable, and maintainable database seeding in Laravel applications.
