# Building a Reusable Three-Page Layout Using Blade Components

---

# Overview

* Creating multiple pages
* Avoiding duplicate HTML
* Using **Blade Components**
* Creating a reusable **Layout Component**
* Understanding **Slots**
* Using Blade's `{{ }}` echo syntax

---

# Goal

Build a simple website with three pages:

* Home
* About
* Contact

Then improve the code by:

* Removing duplicated HTML
* Creating a reusable layout
* Learning Blade Components
* Learning Blade Slots

---

# Initial Project State

```php
Route::get('/', function () {
    return view('welcome');
});

Route::get('/about', function () {
    return view('about');
});
```

If not already created, add:

```php
Route::get('/contact', function () {
    return view('contact');
});
```

Now the application has three routes.

```
/
about
contact
```

---

# Renaming the Default View

Laravel ships with:

```
welcome.blade.php
```

The instructor renames it to something more meaningful.

Instead of:

```
welcome
```

Use:

```
home
```

Update the route accordingly.

Before:

```php
return view('welcome');
```

After:

```php
return view('home');
```

---

# Creating Three Simple Views

Initially every page contains only one heading.

### home.blade.php

```html
<h1>Hello from the homepage.</h1>
```

---

### about.blade.php

```html
<h1>Hello from the about page.</h1>
```

---

### contact.blade.php

```html
<h1>Hello from the contact page.</h1>
```

---

# Result

Visiting each route displays:

```
/
Hello from the homepage

/about
Hello from the about page

/contact
Hello from the contact page
```

Everything works.

---

# Problem: Navigation

Typing URLs manually isn't practical.

Example:

```html
<nav>
    <a href="/">Home</a>

    <a href="/about">
        About
    </a>

    <a href="/contact">
        Contact
    </a>
</nav>
```

Initially this navigation is added only to the Home page.

Result:

```
Home About Contact

Hello from Homepage
```

Clicking About loads:

```
Hello from About Page
```

But the navigation disappears.

---

# Beginner's Solution (Incorrect)

Most beginners solve this by copying the navigation into every page.

Example:

Home

```html
<nav>
    ...
</nav>

<h1>Homepage</h1>
```

About

```html
<nav>
    ...
</nav>

<h1>About</h1>
```

Contact

```html
<nav>
    ...
</nav>

<h1>Contact</h1>
```

This works.

However, it creates duplicated code.

---

# Why Duplication is Bad

Imagine later adding another menu item.

```
Team
```

You must edit:

* Home
* About
* Contact
* Every future page

This becomes difficult to maintain.

The solution is a reusable layout.

---

# Introducing Blade

Laravel's view files use Blade.

Rename each file from:

```
home.php
```

to

```
home.blade.php
```

Similarly:

```
about.blade.php
contact.blade.php
```

---

# What is Blade?

Blade is Laravel's templating engine.

Think of it as:

```
Blade
↓

PHP
↓

HTML
```

Blade is only a thin layer on top of PHP.

It provides:

* cleaner syntax
* directives
* helpers
* layouts
* components
* slots

Eventually Blade compiles into normal PHP.

The browser never sees Blade.

---

# Creating Components Directory

Inside

```
resources/views
```

Create

```
components/
```

Result:

```
resources
└── views
    ├── components
    ├── home.blade.php
    ├── about.blade.php
    └── contact.blade.php
```

---

# What is a Component?

A component is any reusable piece of UI.

Examples:

* Navigation
* Card
* Button
* Avatar
* Dropdown
* Alert
* Task item
* Layout

Instead of repeating code, create one reusable component.

---

# Creating the Layout Component

Inside:

```
resources/views/components
```

Create:

```
layout.blade.php
```

---

# Moving Shared HTML

Suppose Home originally looked like:

```html
<html>

<head>

</head>

<body>

<nav>
    Home
    About
    Contact
</nav>

<h1>Hello from Homepage</h1>

</body>

</html>
```

Most of this is common across every page.

Move everything except the page-specific content into:

```
layout.blade.php
```

Result:

```html
<html>

<head>

</head>

<body>

<nav>

    <a href="/">Home</a>

    <a href="/about">
        About
    </a>

    <a href="/contact">
        Contact
    </a>

</nav>

</body>

</html>
```

Notice the heading is removed because it belongs only to the Home page.

---

# Using the Layout Component

The Home view is now almost empty.

Instead of all the HTML:

```blade
<x-layout>

</x-layout>
```

How does Laravel know where this comes from?

Laravel automatically maps:

```
components/layout.blade.php
```

to

```blade
<x-layout>
```

This is why components are placed inside the `components` directory.

---

# Why Use `<x-layout>`?

Blade components behave like custom HTML elements.

Example:

```blade
<x-layout>

</x-layout>
```

is not an HTML tag.

It represents:

```
resources/views/components/layout.blade.php
```

Laravel renders that file automatically.

---

# Problem

The Home page heading disappeared.

Why?

Because the layout currently contains only:

* HTML
* Body
* Navigation

There is nowhere for the page content to appear.

---

# Slots

Blade provides a special variable:

```php
$slot
```

It represents everything written between:

```blade
<x-layout>

...

</x-layout>
```

Example:

```blade
<x-layout>

<h1>Hello Homepage</h1>

</x-layout>
```

Everything inside becomes:

```
$slot
```

---

# Displaying the Slot

Inside

```
layout.blade.php
```

add:

```php
<?php echo $slot; ?>
```

Now the Home page renders correctly.

The layout provides the outer HTML.

The slot inserts page-specific content.

---

# Understanding the Flow

Home page:

```blade
<x-layout>

<h1>Hello Homepage</h1>

</x-layout>
```

↓

Laravel loads:

```
layout.blade.php
```

↓

When Laravel reaches:

```php
echo $slot;
```

↓

It inserts:

```html
<h1>Hello Homepage</h1>
```

Final HTML becomes:

```html
<html>

<body>

<nav>

...

</nav>

<h1>Hello Homepage</h1>

</body>

</html>
```

---

# Applying the Layout to Every Page

Home:

```blade
<x-layout>

<h1>Hello from Homepage</h1>

</x-layout>
```

---

About

```blade
<x-layout>

<h1>Hello from About</h1>

</x-layout>
```

---

Contact

```blade
<x-layout>

<h1>Hello from Contact</h1>

</x-layout>
```

Now every page shares the same layout.

Only the heading changes.

---

# Benefits

Suppose later you add:

```html
<a href="/team">
    Team
</a>
```

Without layouts:

Edit every page.

With layouts:

Edit only:

```
layout.blade.php
```

Every page updates automatically.

This is one of the biggest advantages of reusable layouts.

---

# Blade Echo Shortcut

Instead of writing:

```php
<?php echo $slot; ?>
```

Blade provides a helper.

Use:

```blade
{{ $slot }}
```

This is equivalent to:

```php
<?php echo $slot; ?>
```

Whenever you see:

```blade
{{ something }}
```

Mentally translate it to:

```php
echo something;
```

Blade simply compiles this into normal PHP.

---

# Blade Compilation

Blade:

```blade
{{ $slot }}
```

↓

Compiles internally into PHP:

```php
<?php echo $slot; ?>
```

↓

PHP outputs HTML.

The browser never receives Blade syntax.

---

# Final Layout Structure

```blade
<html>

<head>

</head>

<body>

<nav>

    <a href="/">Home</a>

    <a href="/about">About</a>

    <a href="/contact">Contact</a>

</nav>

{{ $slot }}

</body>

</html>
```

---

# Final Home Page

```blade
<x-layout>

<h1>Hello from Homepage</h1>

</x-layout>
```

---

# Final About Page

```blade
<x-layout>

<h1>Hello from About Page</h1>

</x-layout>
```

---

# Final Contact Page

```blade
<x-layout>

<h1>Hello from Contact Page</h1>

</x-layout>
```

---

# Concepts Learned

## 1. Blade Templates

* Laravel's templating engine.
* Adds cleaner syntax on top of PHP.
* Compiles into normal PHP.

---

## 2. Components

Reusable UI blocks.

Examples:

* Layouts
* Buttons
* Navigation
* Cards
* Alerts
* Dropdowns
* Forms

---

## 3. Layout Components

Store common page structure:

* `<html>`
* `<head>`
* Navigation
* Footer
* Scripts
* Stylesheets

Individual pages only provide unique content.

---

## 4. Slots

`$slot` contains everything placed inside a Blade component.

Example:

```blade
<x-layout>

<h1>Page Content</h1>

</x-layout>
```

Inside the layout:

```blade
{{ $slot }}
```

Outputs:

```html
<h1>Page Content</h1>
```

---

## 5. Blade Echo Syntax

Instead of:

```php
<?php echo $variable; ?>
```

Use:

```blade
{{ $variable }}
```

Cleaner, shorter, and more readable.

---

# Homework (Day 3)

Create a new reusable Blade component named:

```
nav-link
```

### Requirements

1. Create a component file named:

```
nav-link.blade.php
```

2. Place it inside the correct directory:

```
resources/views/components/
```

3. Move the repeated anchor (`<a>`) tag into this component.

Instead of repeating:

```html
<a href="/">Home</a>

<a href="/about">About</a>

<a href="/contact">Contact</a>
```

create one reusable component.

4. The link text (**Home**, **About**, **Contact**) should **not** be hardcoded. Instead, make it dynamic using a **slot**, just as the layout component used `{{ $slot }}`.

---

# Key Takeaways

* Use **Blade** instead of plain PHP for views.
* Convert view files to `.blade.php`.
* Avoid duplicating HTML across pages.
* Create reusable **layout components** for shared page structure.
* Render page-specific content with the **`$slot`** variable.
* Use **`{{ }}`** instead of `echo` for output in Blade.
* Organizing shared UI into components makes applications cleaner, easier to maintain, and much more scalable.
