# Introduction to Eloquent ORM

## What is Eloquent?

**Eloquent** is Laravel's built-in **ORM (Object Relational Mapper)**.

An ORM maps database records to PHP objects, allowing you to work with database rows as if they were normal PHP objects instead of writing raw SQL queries.

For example:

* Database table: `job_listings`
* Database row:

| id | title    | salary |
| -- | -------- | ------ |
| 1  | Director | 50000  |

With Eloquent, this row becomes a PHP object:

```php
$job = Job::find(1);

echo $job->title;
echo $job->salary;
```

Instead of manually handling arrays or SQL queries, Eloquent provides a clean, object-oriented API.

Laravel's Eloquent follows the **Active Record** pattern.

---

# Converting an Existing Class into an Eloquent Model

Previously, the `Job` class stored hardcoded data and custom methods like:

* `all()`
* `find()`

Since the data now comes from the database, these methods are no longer needed.

Simply extend Laravel's `Model` class.

```php
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
}
```

Once the class extends `Model`, it automatically gains Eloquent's query methods.

---

# Removing Custom Methods

Because Eloquent already provides methods such as:

```php
Job::all();

Job::find(1);
```

there is no need to implement your own versions.

Delete any manually written methods like:

```php
public static function all()

public static function find()
```

Eloquent replaces them with a much more powerful API.

---

# Querying Records

Example route:

```php
use App\Models\Job;

$jobs = Job::all();

dd($jobs);
```

Initially, this returned:

```
Collection {#...}
items: []
```

The collection was empty because Eloquent could not locate the correct database table.

---

# Laravel's Naming Convention

Laravel assumes:

| Model     | Table      |
| --------- | ---------- |
| `Post`    | `posts`    |
| `Comment` | `comments` |
| `Job`     | `jobs`     |

However, the table in this project is named:

```
job_listings
```

instead of

```
jobs
```

Therefore, Laravel needs to be told explicitly which table to use.

---

# Specifying the Table Name

Inside the model:

```php
class Job extends Model
{
    protected $table = 'job_listings';
}
```

Now:

```php
Job::all();
```

returns all database records correctly.

---

# Result of `Job::all()`

```php
$jobs = Job::all();

dd($jobs);
```

Output:

```
Collection
    Item 0 => Job
    Item 1 => Job
    Item 2 => Job
```

Each item is a **Job object**, not just an associative array.

Each object contains attributes such as:

* id
* title
* salary
* created_at
* updated_at

---

# Accessing Individual Records

Collections behave similarly to arrays.

```php
$jobs = Job::all();

$job = $jobs[0];

dd($job);
```

Access attributes:

```php
echo $job->title;

echo $job->salary;
```

Example:

```
Director
50000
```

Second item:

```php
$jobs[1];
```

Example output:

```
Programmer
60000
```

---

# Existing Pages Continue to Work

The Jobs page:

```php
$jobs = Job::all();

return view('jobs', [
    'jobs' => $jobs
]);
```

works exactly as before, but now retrieves data from the database instead of a hardcoded array.

Similarly,

```php
Job::find($id);
```

continues to work for displaying a single job.

---

# Laravel Tinker

Laravel includes an interactive REPL called **Tinker**.

Launch it:

```bash
php artisan tinker
```

Tinker lets you:

* Test queries
* Create records
* Update records
* Delete records
* Experiment with Eloquent
* Inspect returned objects

without creating routes or controllers.

---

# Creating a Record

Example:

```php
use App\Models\Job;

Job::create([
    'title' => 'Acme Director',
    'salary' => 1000000,
]);
```

Initially, this throws an error:

```
MassAssignmentException
```

---

# Understanding Mass Assignment

Laravel protects against accidentally assigning unwanted attributes.

Imagine a form that should update only:

```
title
```

A malicious user modifies the request and submits:

```php
[
    'title' => 'New Title',
    'author_id' => 10,
    'is_admin' => true
]
```

If the application blindly passes all request data into:

```php
Model::create($request->all());
```

sensitive fields like:

* `author_id`
* `user_id`
* `is_admin`

could also be updated.

Laravel prevents this by default.

---

# Allowing Mass Assignment

Specify which attributes are allowed.

```php
class Job extends Model
{
    protected $fillable = [
        'title',
        'salary',
    ];
}
```

Only these attributes may be assigned through:

```php
create()

update()

fill()
```

Any other submitted fields are ignored.

---

# Creating the Record Again

After defining `$fillable`:

```php
Job::create([
    'title' => 'Acme Director',
    'salary' => 1000000,
]);
```

The record is successfully inserted.

Eloquent automatically returns the newly created `Job` object.

---

# Automatic Timestamps

Running:

```php
Job::all();
```

now shows:

* created_at
* updated_at

These timestamp columns are automatically populated by Eloquent.

No manual work is required.

---

# Finding a Record

Retrieve a record by its primary key.

```php
Job::find(7);
```

This executes the appropriate SQL query behind the scenes and returns the matching `Job` model.

Although SQL is still being executed internally, Eloquent provides a much simpler API.

---

# Other Query Methods

Besides:

```php
Job::all();

Job::find();
```

Eloquent supports:

```php
where()

join()

orderBy()

first()

latest()

create()

update()

delete()
```

and many more query methods through a fluent interface.

---

# Deleting a Record

Retrieve a model:

```php
$job = Job::find(7);
```

Delete it:

```php
$job->delete();
```

Return value:

```php
true
```

Refreshing the database confirms that the record has been removed.

---

# Generating Models

Instead of manually creating models, Laravel provides Artisan generators.

Basic command:

```bash
php artisan make:model Comment
```

Generated file:

```
app/
    Models/
        Comment.php
```

Example generated model:

```php
class Comment extends Model
{
    use HasFactory;
}
```

`HasFactory` is included by default and will be covered later.

---

# Viewing Command Help

To see available options:

```bash
php artisan help make:model
```

Useful options include:

| Option          | Purpose                    |
| --------------- | -------------------------- |
| `-m`            | Create migration           |
| `-c`            | Create controller          |
| `-f`            | Create factory             |
| `-s`            | Create seeder              |
| `-p`            | Create policy              |
| `-r`            | Create resource controller |
| `-a` or `--all` | Generate all related files |

---

# Creating a Model with a Migration

Instead of creating only the model:

```bash
php artisan make:model Post
```

create both the model and migration:

```bash
php artisan make:model Post -m
```

Generated:

```
app/Models/Post.php

database/migrations/create_posts_table.php
```

---

# Editing the Migration

Example migration:

```php
$table->string('title');

$table->text('body');
```

Use:

```php
string()
```

for shorter values.

Use:

```php
text()
```

for long content such as blog posts, since `string()` typically maps to a `VARCHAR(255)` column.

---

# Running the Migration

Apply the migration:

```bash
php artisan migrate
```

The new table becomes available in the database.

---

# Recommended Practice

To become comfortable with Eloquent:

1. Generate multiple models.
2. Generate migrations alongside them.
3. Edit the migration files.
4. Run:

   ```bash
   php artisan migrate
   ```
5. Open Tinker:

   ```bash
   php artisan tinker
   ```
6. Practice:

   * `all()`
   * `find()`
   * `create()`
   * `delete()`
   * retrieving records
   * modifying records

Hands-on experimentation with models, migrations, and Tinker is the fastest way to build familiarity with Laravel's Eloquent ORM.
