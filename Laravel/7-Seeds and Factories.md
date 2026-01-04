# **Laravel Database Seeding & Factories — Detailed Summary**

## **1. Introduction to Seeding**

**Seeding** means populating your database with **dummy data** for testing.
Laravel provides a built-in way to generate and insert such fake records using:

* **Factories** → Generate fake model data
* **Seeders** → Insert the generated data into the database

---

# **2. What Are Factories?**

A **factory** is a class that generates a single record of a model with fake data.

### **Location**

```
database/factories/
```

### **Example: UserFactory**

```php
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
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

### **Notes**

* `faker` is automatically loaded.
* `unique()->safeEmail()` ensures no duplicate email data.
* `now()` returns current timestamp via Carbon.

---

# **3. Using Factories with Models**

To use a factory, your model **must include the `HasFactory` trait**:

### **User Model**

```php
class User extends Model
{
    use HasFactory;
}
```

---

# **4. What Are Seeders?**

**Seeders** run the logic that inserts fake records into the database.

### **Location**

```
database/seeders/
```

### **Base structure**

```php
class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // call seeders here
    }
}
```

---

# **5. Creating a User Seeder**

### **UserSeeder**

```php
class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->count(10)->create();
    }
}
```

### **Register in DatabaseSeeder**

```php
public function run()
{
    $this->call([
        UserSeeder::class,
    ]);
}
```

### **Run Seeder**

```
php artisan db:seed
```

---

# **6. Preventing Duplicate Data (Truncate Table Before Seeding)**

If we run `php artisan db:seed` repeatedly, it keeps adding more rows.

### **Basic Truncate**

```php
DB::table('users')->truncate();
```

### **Problem**

MySQL prevents truncating tables with **foreign key constraints**.

---

# **7. Disabling Foreign Key Checks**

To truncate safely, we disable foreign key checks.

### **Before truncate**

```php
DB::statement('SET FOREIGN_KEY_CHECKS=0;');
```

### **After truncate**

```php
DB::statement('SET FOREIGN_KEY_CHECKS=1;');
```

---

# **8. Creating Helper Traits**

To avoid repeating enable/disable code in every seeder, traits are used.

---

## **Trait 1 — TruncateTable**

```php
trait TruncateTable
{
    protected function truncate($table)
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table($table)->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
```

---

## **Trait 2 — DisableForeignKeys**

```php
trait DisableForeignKeys
{
    protected function disableForeignKeys()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    }

    protected function enableForeignKeys()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
```

---

## **Using Traits in Seeder**

```php
class UserSeeder extends Seeder
{
    use TruncateTable, DisableForeignKeys;

    public function run()
    {
        $this->disableForeignKeys();
        $this->truncate('users');

        User::factory()->count(10)->create();

        $this->enableForeignKeys();
    }
}
```

---

# **9. Post Factory & Seeder**

### **PostFactory**

```php
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'title' => $this->faker->word(),
            'body'  => [],
        ];
    }
}
```

### **Casting JSON Fields**

Since `body` is stored as JSON:

```php
class Post extends Model
{
    protected $casts = [
        'body' => 'array',
    ];
}
```

### **PostSeeder**

```php
class PostSeeder extends Seeder
{
    use TruncateTable, DisableForeignKeys;

    public function run()
    {
        $this->disableForeignKeys();
        $this->truncate('posts');

        Post::factory()->count(3)->create();

        $this->enableForeignKeys();
    }
}
```

---

# **10. Comment Factory & Seeder**

### **CommentFactory**

```php
class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition()
    {
        return [
            'body' => [],
            'user_id' => 1,   // TEMPORARY (will be dynamic in relationships lesson)
            'post_id' => 1
        ];
    }
}
```

### **Cast JSON in Comment Model**

```php
class Comment extends Model
{
    protected $casts = [
        'body' => 'array',
    ];
}
```

### **CommentSeeder**

```php
class CommentSeeder extends Seeder
{
    use TruncateTable, DisableForeignKeys;

    public function run()
    {
        $this->disableForeignKeys();
        $this->truncate('comments');

        Comment::factory()->count(5)->create(); 

        $this->enableForeignKeys();
    }
}
```

---

# **11. Overriding Factory Defaults with `state()`**

### **Override inline**

```php
Post::factory()
    ->state(['title' => 'Untitled'])
    ->count(3)
    ->create();
```

### **Define custom state inside the factory**

```php
public function untitled()
{
    return $this->state(fn() => ['title' => 'Untitled']);
}
```

### **Use custom state**

```php
Post::factory()->untitled()->count(3)->create();
```

---

# **12. Key Takeaways**

### ✔ **Seeding**

Populates DB with fake data for testing.

### ✔ **Factories**

Generate fake records without manually writing data.

### ✔ **Seeders**

Organize data insertion logic and run via `php artisan db:seed`.

### ✔ **Traits**

Reuse logic for truncating tables and disabling foreign keys.

### ✔ **Casting JSON fields**

Use `$casts` attribute to auto-convert JSON ↔ array.

### ✔ **State modification**

Easily override default factory values.