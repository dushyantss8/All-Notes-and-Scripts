# Passing Data to Views and Dynamic Routes

## Overview

* Pass data from routes to Blade views.
* Display dynamic data in Blade templates.
* Loop through arrays using Blade directives.
* Build a simple Jobs listing page.
* Create dynamic routes with route parameters.
* Retrieve a specific item based on its ID.
* Use Laravel's `Arr::first()` helper.
* Create individual Job Detail pages.

---

# Homework Solution – Dynamic Component Type

The previous challenge was to make the `NavLink` component render either:

* an `<a>` tag
* or a `<button>`

depending on a `type` prop.

## Default Prop

Set a default value:

```php
@props([
    'type' => 'a'
])
```

Usage:

```blade
<x-nav-link href="/" type="button">
    Contact
</x-nav-link>
```

Without passing `type`, it defaults to:

```html
<a></a>
```

---

## Incorrect Approach

Changing the HTML tag dynamically:

```blade
<{{ $type }}>
```

Although this renders correctly, many editors cannot parse dynamic tag names properly and display errors such as:

```
Tag start is not closed
```

Because of poor editor support, this approach is not recommended.

---

## Better Approach

Render separate HTML elements conditionally.

Traditional PHP:

```php
<?php if ($type == 'a'): ?>

<a href="{{ $href }}">
    {{ $slot }}
</a>

<?php else: ?>

<button>
    {{ $slot }}
</button>

<?php endif; ?>
```

---

## Blade Version

Blade provides cleaner directives.

```blade
@if ($type == 'a')

<a href="{{ $href }}">
    {{ $slot }}
</a>

@else

<button>
    {{ $slot }}
</button>

@endif
```

Blade directives are simply compiled into normal PHP behind the scenes.

Useful directives include:

```blade
@if

@else

@endif
```

This approach is cleaner, easier to read, and editor-friendly.

---

# Passing Data to Views

Laravel's `view()` helper accepts a second argument.

Syntax:

```php
return view('home', [
    'greeting' => 'Hello'
]);
```

The array keys become variables inside the Blade view.

Example:

```blade
{{ $greeting }}
```

Output:

```
Hello
```

---

## Passing Multiple Variables

```php
return view('home', [
    'greeting' => 'Hello',
    'name' => 'Larry'
]);
```

Blade:

```blade
{{ $greeting }} {{ $name }}
```

Output:

```
Hello Larry
```

---

# Passing Complex Data

Instead of strings, entire arrays can be passed.

Example:

```php
return view('jobs', [
    'jobs' => [
        [
            'title' => 'Director',
            'salary' => '$50,000'
        ],
        [
            'title' => 'Programmer',
            'salary' => '$10,000'
        ],
        [
            'title' => 'Teacher',
            'salary' => '$40,000'
        ]
    ]
]);
```

In a real application, this data would typically come from a database rather than being hardcoded.

---

# Looping Through Data in Blade

Instead of PHP's `foreach`, Blade provides:

```blade
@foreach
```

Example:

```blade
@foreach ($jobs as $job)

<li>
    {{ $job['title'] }}
</li>

@endforeach
```

---

## Display More Information

```blade
@foreach ($jobs as $job)

<li>
    <strong>{{ $job['title'] }}</strong>

    Pays {{ $job['salary'] }} per year
</li>

@endforeach
```

Output:

```
Director – Pays $50,000 per year

Programmer – Pays $10,000 per year

Teacher – Pays $40,000 per year
```

---

# Creating a Dedicated Jobs Page

Instead of displaying jobs on the homepage, create a separate route.

```php
Route::get('/jobs', function () {

    return view('jobs', [
        'jobs' => [...]
    ]);

});
```

The homepage can return a simple view again.

Navigation:

```
/
```

↓

```
/jobs
```

---

# Preparing for Individual Job Pages

Each job needs a unique identifier.

Example data:

```php
[
    'id' => 1,
    'title' => 'Director',
    'salary' => '$50,000'
]
```

```php
[
    'id' => 2,
    'title' => 'Programmer',
    'salary' => '$10,000'
]
```

```php
[
    'id' => 3,
    'title' => 'Teacher',
    'salary' => '$40,000'
]
```

The ID uniquely identifies each job.

---

# Dynamic Links

Each job should link to its own page.

Example:

```blade
<a href="/jobs/{{ $job['id'] }}">
    {{ $job['title'] }}
</a>
```

Generated URLs:

```
/jobs/1

/jobs/2

/jobs/3
```

---

# Route Parameters (Wildcards)

Laravel supports dynamic route parameters.

```php
Route::get('/jobs/{id}', function ($id) {

});
```

The braces indicate a wildcard.

Whatever value appears in the URL is automatically passed into the route callback.

Examples:

```
/jobs/1
```

Produces:

```php
$id = 1;
```

```
/jobs/3
```

Produces:

```php
$id = 3;
```

---

# Debugging with `dd()`

Laravel provides two useful debugging helpers:

```php
dump()
```

Displays a variable and continues execution.

```php
dd()
```

(Dump and Die)

Displays the variable and immediately stops execution.

Example:

```php
dd($id);
```

Visiting:

```
/jobs/3
```

Outputs:

```
3
```

---

# Finding the Requested Job

Initially, jobs are still hardcoded.

To find the requested job, Laravel provides the `Arr` helper.

Import it:

```php
use Illuminate\Support\Arr;
```

Retrieve the first matching item:

```php
$job = Arr::first($jobs, function ($job) use ($id) {

    return $job['id'] == $id;

});
```

The callback runs for every array element until it finds the first matching item.

---

## Short Arrow Function (PHP 8+)

A shorter version uses arrow functions.

```php
$job = Arr::first(
    $jobs,
    fn ($job) => $job['id'] == $id
);
```

Advantages:

* Less code
* Cleaner syntax
* Automatically captures variables from the outer scope
* No need for `use ($id)`

Arrow functions are recommended for simple one-line callbacks.

---

# Missing Records

If the requested job doesn't exist:

```
/jobs/5
```

Result:

```php
null
```

This introduces an important concept: applications must handle missing resources gracefully. Error handling for this will be covered later.

---

# Returning the Job View

Once the matching job is found:

```php
return view('job', [
    'job' => $job
]);
```

---

# Job Detail Page

Example Blade template:

```blade
<h2>
    {{ $job['title'] }}
</h2>

<p>
    This job pays {{ $job['salary'] }} per year.
</p>
```

Tailwind classes were added for simple styling:

```html
text-lg

font-bold
```

These are optional and only improve presentation.

---

# Final Job Links

Update the Jobs page:

```blade
<ul>

@foreach ($jobs as $job)

<li>

<a href="/jobs/{{ $job['id'] }}">

{{ $job['title'] }}

</a>

</li>

@endforeach

</ul>
```

Optionally add simple Tailwind styling:

```html
text-blue-500

hover:underline
```

Now every job title becomes clickable and opens its own detail page.

---

# Blade Directives Introduced

Conditional rendering:

```blade
@if

@else

@endif
```

Looping:

```blade
@foreach

@endforeach
```

---

# Laravel Helpers Introduced

### Pass data to a view

```php
view('home', [...])
```

### Debug variables

```php
dump()

dd()
```

### Find an array item

```php
Arr::first()
```

---

# Key Takeaways

* `view()` accepts a second argument for passing data to Blade templates.
* Array keys passed to a view become variables inside the template.
* Blade provides cleaner alternatives to PHP using directives like `@if` and `@foreach`.
* Separate pages can receive their own datasets from routes.
* Dynamic route parameters (`{id}`) allow URLs such as `/jobs/1`.
* Route parameters are automatically injected into route callbacks.
* `dd()` is an essential debugging helper that dumps data and stops execution.
* `Arr::first()` provides a convenient way to search arrays for the first matching item.
* Arrow functions (`fn()`) offer a concise alternative to traditional closures and automatically capture variables from the parent scope.
* Combining dynamic routes with Blade templates enables the creation of individual resource pages, forming the foundation for CRUD-style applications that will later use database-backed data instead of hardcoded arrays.
