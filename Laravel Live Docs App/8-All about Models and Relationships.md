# Defining Eloquent Relationships, Pivot Operations, Accessors, and Mutators in Laravel

This guide explains how to:

* Define **one-to-many** and **many-to-many** relationships in Laravel
* Work with pivot tables using `attach`, `detach`, `toggle`, and `sync`
* Use **accessors** and **mutators** to transform model attributes
* Understand how Eloquent resolves relationship properties internally

All examples assume you are working with the following models:

* `User`
* `Post`
* `Comment`

---

# 1. One-to-Many Relationship (Post ↔ Comments)

## 1.1 Understanding the Relationship

In a one-to-many relationship:

* A **Post has many Comments**
* A **Comment belongs to one Post**
* The **child model** (Comment) holds the **foreign key**

### Database Structure

```text
posts
- id
- title
- body
- created_at
- updated_at

comments
- id
- post_id   ← Foreign key
- body
- created_at
- updated_at
```

---

## 1.2 Defining the Relationship in the Post Model

Open:

```php
app/Models/Post.php
```

Define the relationship:

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id', 'id');
    }
}
```

### Explanation

```php
$this->hasMany(
    Comment::class, // Related model
    'post_id',      // Foreign key in comments table
    'id'            // Local key in posts table
);
```

If you follow Laravel conventions (`post_id` and `id`), you can simplify:

```php
return $this->hasMany(Comment::class);
```

---

## 1.3 Testing in Tinker

```bash
php artisan tinker
```

```php
$post = App\Models\Post::find(1);
$post->comments;
```

This returns a **Collection** of related comments.

---

## 1.4 How Relationship Properties Work Internally

When you access:

```php
$post->comments;
```

Laravel:

1. Intercepts the property access via `__get()`
2. Checks if `comments()` is a relationship method
3. Executes the relationship query
4. Returns a `Collection`

This dynamic resolution happens inside the base `Model` class using:

* `__get()`
* `getAttribute()`
* `getRelationValue()`

---

# 2. Defining the Inverse Relationship (Comment → Post)

Open:

```php
app/Models/Comment.php
```

Define:

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }
}
```

Simplified version:

```php
return $this->belongsTo(Post::class);
```

---

## 2.1 Testing the Inverse

```php
$comment = App\Models\Comment::find(1);
$comment->post;
```

This returns the parent `Post` model.

---

# 3. Many-to-Many Relationship (User ↔ Post)

## 3.1 Database Structure

```text
users
- id
- name
- email

posts
- id
- title

post_user (Pivot Table)
- user_id
- post_id
```

The pivot table name must be alphabetical: `post_user`.

---

## 3.2 Defining the Relationship in Post Model

```php
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'post_user',
            'post_id',
            'user_id'
        );
    }
}
```

Simplified version (if conventions are followed):

```php
return $this->belongsToMany(User::class);
```

---

## 3.3 Defining the Relationship in User Model

```php
class User extends Model
{
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(
            Post::class,
            'post_user',
            'user_id',
            'post_id'
        );
    }
}
```

---

# 4. Managing Pivot Table Records

All pivot operations are performed through the relationship.

---

## 4.1 Attach

Associate records:

```php
$user = App\Models\User::find(1);
$user->posts()->attach(1);
```

Attach multiple:

```php
$user->posts()->attach([2, 3]);
```

---

## 4.2 Detach

Remove relationship:

```php
$user->posts()->detach(1);
```

Detach all:

```php
$user->posts()->detach();
```

---

## 4.3 Toggle

Attach if not exists, detach if exists:

```php
$user->posts()->toggle(1);
```

---

## 4.4 Sync

Replace all existing relationships:

```php
$user->posts()->sync([1, 2]);
```

Result:

* Removes all other posts
* Keeps only 1 and 2

---

## 4.5 Sync Without Detaching

Adds without removing existing:

```php
$user->posts()->syncWithoutDetaching([3]);
```

---

# 5. Accessors (Transforming Retrieved Values)

Accessors transform values when **retrieving** attributes.

---

## 5.1 Defining an Accessor (Classic Method Style)

Inside `Post` model:

```php
class Post extends Model
{
    public function getTitleUppercaseAttribute(): string
    {
        return strtoupper($this->title);
    }
}
```

Naming convention:

```
get{AttributeName}Attribute
```

---

## 5.2 Using the Accessor

```php
$post = Post::find(1);
$post->title_uppercase;
```

Returns:

```
HELLO WORLD
```

No extra database column required.

---

# 6. Mutators (Transforming Before Saving)

Mutators transform values **before storing them** in the database.

---

## 6.1 Defining a Mutator (Classic Method Style)

```php
class Post extends Model
{
    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = strtolower($value);
    }
}
```

Naming convention:

```
set{AttributeName}Attribute
```

---

## 6.2 Testing the Mutator

```php
$post = Post::find(1);
$post->title = "HELLO WORLD";
$post->save();
```

Database value becomes:

```
hello world
```

---

# 7. Modern Accessors & Mutators (Laravel 9+ Recommended)

Laravel now recommends using the `Attribute` class.

---

## 7.1 Example

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

class Post extends Model
{
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => strtoupper($value),
            set: fn ($value) => strtolower($value),
        );
    }
}
```

This replaces both classic accessor and mutator.

---

# 8. Attribute Casting

Laravel allows automatic type conversion using `$casts`.

```php
class Post extends Model
{
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'meta' => 'array',
    ];
}
```

This ensures proper data types when retrieving attributes.

---

# 9. Key Concepts Summary

## Relationship Methods

| Relationship Type | Method            |
| ----------------- | ----------------- |
| One-to-Many       | `hasMany()`       |
| Inverse           | `belongsTo()`     |
| Many-to-Many      | `belongsToMany()` |

---

## Pivot Table Methods

| Method                   | Purpose                   |
| ------------------------ | ------------------------- |
| `attach()`               | Add relationship          |
| `detach()`               | Remove relationship       |
| `toggle()`               | Add/remove conditionally  |
| `sync()`                 | Replace all relationships |
| `syncWithoutDetaching()` | Add without removing      |

---

## Accessors & Mutators

| Type     | When It Runs  |
| -------- | ------------- |
| Accessor | On retrieval  |
| Mutator  | Before saving |

---

# 10. Best Practices & Important Notes

### 1. Follow Naming Conventions

Laravel conventions reduce boilerplate:

* Foreign keys: `model_id`
* Pivot table: alphabetical order (`post_user`)

---

### 2. Always Use Relationship Methods (Not Direct Pivot Inserts)

Avoid:

```php
DB::table('post_user')->insert(...);
```

Use:

```php
$user->posts()->attach();
```

This keeps your code expressive and maintainable.

---

### 3. Prefer Eager Loading to Avoid N+1

```php
Post::with('comments')->get();
```

Prevents performance issues.

---

### 4. Use Modern Attribute API in New Projects

Prefer:

```php
protected function title(): Attribute
```

Over classic `getXAttribute()` and `setXAttribute()`.

---

### 5. Keep Business Logic Out of Accessors

Accessors should:

* Transform data
* Not contain complex domain logic

---

### 6. Use Type Hinting for Relationships

Improves static analysis and IDE support:

```php
public function comments(): HasMany
```

---

# Final Takeaways

* Define one-to-many using `hasMany()` and `belongsTo()`
* Define many-to-many using `belongsToMany()`
* Manage pivot tables using `attach`, `detach`, `toggle`, and `sync`
* Use accessors to transform retrieved values
* Use mutators to transform values before persistence
* Prefer Laravel’s modern `Attribute` class for clean, centralized transformations
