# Creating Models & Encapsulating Data

## Objective

Refactor the application by moving job-related data and logic out of the `routes/web.php` file into a dedicated **Model**, making the application cleaner, more maintainable, and easier to extend.

---

# 1. Remove Duplicate Data

### Before

```php
Route::get('/jobs', function () {
    $jobs = [
        // jobs...
    ];
});

Route::get('/jobs/{id}', function ($id) {
    $jobs = [
        // same jobs...
    ];
});
```

This violates the **DRY (Don't Repeat Yourself)** principle.

---

## First Improvement

Move the array outside the route closures.

```php
$jobs = [
    // jobs...
];

Route::get('/jobs', function () use ($jobs) {
    ...
});

Route::get('/jobs/{id}', function ($id) use ($jobs) {
    ...
});
```

The duplication is removed, but the data still resides inside the routes file.

---

# 2. Create a `Job` Class

Instead of storing job data directly inside `routes/web.php`, create a class to encapsulate it.

Example:

```php
class Job
{
    public static function all(): array
    {
        return [
            // jobs...
        ];
    }
}
```

### Benefits

* Keeps data separate from routing logic.
* Provides a centralized place for job-related behavior.
* Makes future extensions easier.

The explicit return type:

```php
public static function all(): array
```

indicates that the method always returns an array.

---

# 3. Replace Variables with the Model

Instead of using the `$jobs` variable:

```php
Job::all()
```

Example:

```php
Route::get('/jobs', function () {
    return view('jobs', [
        'jobs' => Job::all()
    ]);
});
```

The application behaves exactly the same but has a cleaner structure.

---

# 4. Move the Class into the `Models` Directory

A model should not remain inside the routes file.

Move it to:

```
app/
└── Models/
    └── Job.php
```

Laravel already contains an example model:

```
app/Models/User.php
```

Following the same convention, create:

```
app/Models/Job.php
```

---

# 5. Understanding MVC Architecture

Laravel follows the **MVC (Model-View-Controller)** architecture.

## Model

Responsible for:

* Representing application data
* Business logic
* Data persistence

Examples for a Job model:

* Create a job
* Update a job
* Delete a job
* Archive a job
* Mark a job as filled
* Determine whether a job is open
* Retrieve jobs from a database or another data source

The model encapsulates all job-related behavior.

---

## View

Responsible only for displaying data to the user.

Example:

```
resources/views/jobs.blade.php
```

---

## Controller

Handles incoming requests and coordinates between models and views.

Currently, the route closures are temporarily acting as controllers.

Dedicated controllers will be introduced later.

---

# 6. Namespaces

The model begins with:

```php
namespace App\Models;
```

Namespaces organize classes and prevent naming collisions.

For example, multiple classes named `Job` can exist:

* Queue Job
* Interface Job
* Application Job Model

Namespaces uniquely identify each one.

Example:

```
App\Models\Job
```

Directory structure:

```
app/
    Models/
        Job.php
```

matches

```
App\Models
```

---

# 7. PSR-4 Autoloading

Laravel follows the **PSR-4 Autoloading Standard**.

The mapping is defined inside:

```
composer.json
```

Example:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/"
    }
}
```

Meaning:

```
App\
```

maps to

```
app/
```

Therefore:

```
app/Models/Job.php
```

automatically becomes:

```
App\Models\Job
```

No manual `require` statements are necessary.

---

# 8. Importing the Model

Inside `routes/web.php`:

```php
use App\Models\Job;
```

Now the class can be used anywhere in the file.

---

# 9. Move Job Lookup Logic into the Model

Previously, finding a job required complicated logic inside the route.

Example:

```php
Arr::first(Job::all(), fn ($job) => $job['id'] == $id);
```

This logic belongs inside the model.

---

## Add a `find()` Method

```php
public static function find(int $id): array
{
    return Arr::first(
        static::all(),
        fn ($job) => $job['id'] == $id
    );
}
```

Import Laravel's helper:

```php
use Illuminate\Support\Arr;
```

Notice the use of:

```php
static::all()
```

instead of:

```php
Job::all()
```

because the code is already inside the `Job` class.

---

# 10. Simplify the Route

Before:

```php
$job = Arr::first(
    Job::all(),
    fn ($job) => $job['id'] == $id
);
```

After:

```php
$job = Job::find($id);
```

The route becomes much easier to read because the implementation details are hidden behind a meaningful method.

---

# 11. Happy Path vs. Sad Path

### Happy Path

Everything works as expected.

Example:

```
/jobs/2
```

A matching job exists.

---

### Sad Path

Unexpected situations.

Example:

```
/jobs/20
```

No matching job exists.

`Job::find()` returns:

```php
null
```

instead of an array.

---

# 12. Why Return Types Matter

Without a return type:

```php
public static function find(int $id)
```

the application eventually fails because the view expects an array but receives `null`.

With a declared return type:

```php
public static function find(int $id): array
```

PHP detects the problem earlier during execution.

Benefits of return types:

* Earlier error detection
* Better debugging
* Clearer method contracts
* Improved code reliability

Although type declarations are optional in PHP, they help catch issues sooner.

---

# 13. Handle Missing Jobs Properly

Instead of allowing the application to crash, check whether a job exists.

```php
$job = Job::find($id);

if (! $job) {
    abort(404);
}
```

or

```php
if (is_null($job)) {
    abort(404);
}
```

---

# 14. The `abort()` Helper

Laravel provides the helper:

```php
abort(404);
```

The number represents an HTTP status code.

**404 = Not Found**

Laravel automatically converts this into an HTTP response and displays the default **404 Not Found** page.

No additional configuration is required.

---

# 15. Route Cleanup

After moving data and lookup logic into the model, the routes become much cleaner.

The routes are now responsible only for:

* Receiving requests
* Calling model methods
* Returning views

All business logic resides inside the model.

---

# Concepts Learned

* Eliminating duplicated data
* Applying the DRY principle
* Creating the first Laravel model
* Organizing models inside `app/Models`
* Understanding the basics of MVC architecture
* Using namespaces
* Understanding PSR-4 autoloading
* Importing models with `use`
* Encapsulating data and behavior inside models
* Creating static model methods
* Using explicit return types
* Moving lookup logic into models
* Simplifying route code
* Understanding happy path vs. sad path
* Handling missing resources
* Using Laravel's `abort()` helper
* Returning proper HTTP status codes (404 Not Found)

## Final Outcome

By the end of this lesson, the application is significantly better organized:

* Duplicate job data is eliminated.
* Job-related logic is encapsulated within a dedicated `Job` model.
* Routes are cleaner and easier to understand.
* Lookup behavior is abstracted behind `Job::find()`.
* Missing resources are handled gracefully using Laravel's built-in `abort(404)` helper.
* Core Laravel concepts such as **Models, MVC, Namespaces, PSR-4 Autoloading, Return Types, Data Encapsulation, and HTTP Status Codes** are introduced and applied in a practical example.
