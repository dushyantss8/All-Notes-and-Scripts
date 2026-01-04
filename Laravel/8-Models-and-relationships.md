# **1. Understanding Model Relationships in Laravel**

In the previous lesson, an **ERD (Entity Relationship Diagram)** was created to visualize how models relate to each other.
This lesson explains **how to implement those relationships in Laravel**, specifically:

* **One-to-Many relationship** (Post → Comments)
* **Many-to-Many relationship** (Users ↔ Posts)
* **Accessors & Mutators** in Eloquent models

---

# **2. One-to-Many Relationship: Post → Comments**

### **Identifying Parent and Child**

* **Post** = Parent
* **Comment** = Child
* Child table contains the **foreign key** (`post_id`)

---

## **2.1 Defining Relationship in Post Model**

### **📌 Post.php**

```php
class Post extends Model
{
    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id', 'id');
    }
}
```

* `hasMany()` → Used on the **parent model**
* `post_id` → Foreign key in comments table
* `id` → Local key in posts table (default)

---

## **2.2 Testing in Tinker**

```php
$post = Post::find(1);
$post->comments;
```

This returns a **collection of related comments**.
Laravel uses PHP's `__get()` magic method to fetch relationship data automatically.

---

## **2.3 Defining the Inverse Relationship (Comment → Post)**

### **📌 Comment.php**

```php
class Comment extends Model
{
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }
}
```

### **Tinker Test**

```php
$comment = Comment::find(1);
$comment->post;
```

---

# **3. Many-to-Many Relationship: Users ↔ Posts**

User can be linked to multiple posts, and posts can have multiple users.

### **Pivot Table Example**

```
post_user
---------
post_id
user_id
```

---

## **3.1 Defining Relationship in Post Model**

### **📌 Post.php**

```php
class Post extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class, 'post_user', 'post_id', 'user_id');
    }
}
```

---

## **3.2 Defining Relationship in User Model**

### **📌 User.php**

```php
class User extends Model
{
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_user', 'user_id', 'post_id');
    }
}
```

---

## **3.3 Managing Pivot Table Data**

### **Attach a Post to a User**

```php
$user = User::find(1);
$user->posts()->attach(1);
```

### **Attach Multiple Posts**

```php
$user->posts()->attach([2, 3]);
```

### **Detach a Post**

```php
$user->posts()->detach(1);
```

### **Toggle (Attach if not exists; detach if exists)**

```php
$user->posts()->toggle(1);
```

### **Sync (Replace all existing relations)**

```php
$user->posts()->sync([1, 2]);
```

### **Sync without detaching**

```php
$user->posts()->syncWithoutDetaching([3]);
```

---

# **4. Accessors (Get Mutators)**

Accessors transform data **when retrieving from the model**.

### **Example: Convert title to uppercase**

### **📌 Post.php**

```php
public function getTitleUppercaseAttribute()
{
    return strtoupper($this->title);
}
```

### **Usage in Tinker**

```php
$post = Post::find(1);
$post->title_uppercase;
```

---

# **5. Mutators (Set Mutators)**

Mutators transform data **before saving to database**.

### **Example: Save title in lowercase**

### **📌 Post.php**

```php
public function setTitleAttribute($value)
{
    $this->attributes['title'] = strtolower($value);
}
```

### **Testing in Tinker**

```php
$post = Post::find(1);
$post->title = "HEY THERE";
$post->save();
```

The value stored in DB becomes `"hey there"`.

---

# **6. Behind-the-Scenes: Magic Methods**

Laravel uses PHP’s:

```php
__get()
```

method to detect whether you're accessing:

* a real attribute
* an accessor
* a relationship method

If it's a relationship, Laravel runs a SQL query and returns a **Relation object or Collection**.

---

# **7. Key Takeaways**

### ✔ **One-to-Many**

* `hasMany()`
* `belongsTo()`

### ✔ **Many-to-Many**

* `belongsToMany()`
* Methods to manage pivot table:

  * `attach()`
  * `detach()`
  * `toggle()`
  * `sync()`
  * `syncWithoutDetaching()`

### ✔ **Accessors**

* Transform data when retrieving
* Naming: `get{AttributeName}Attribute()`

### ✔ **Mutators**

* Transform data before saving
* Naming: `set{AttributeName}Attribute()`
