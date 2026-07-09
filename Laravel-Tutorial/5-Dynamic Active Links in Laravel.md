# Dynamic Active Navigation Links with Blade Components

# 1. Fix the Layout Height

To make the layout occupy the full viewport height, apply `h-full` to both the `<html>` and `<body>` elements.

```html
<html class="h-full bg-gray-100">
```

```html
<body class="h-full">
```

This ensures:

* The page background fills the entire viewport.
* Full-height layouts behave correctly.

---

# 2. Problem: Active Navigation is Hardcoded

Initially, the **Home** navigation link always appears active, even when visiting the About or Contact pages.

Current behavior:

* Home → Active ✅
* About → Still shows Home as active ❌
* Contact → Still shows Home as active ❌

The goal is to apply active styling dynamically.

---

# 3. Apply Conditional Tailwind Classes

Laravel Blade allows conditional class selection using the ternary operator.

Example:

```blade
class="{{ true
    ? 'bg-gray-900 text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
}}"
```

If the condition is:

* `true` → Active styling
* `false` → Default styling

Active styles:

```text
bg-gray-900 text-white
```

Inactive styles:

```text
text-gray-300 hover:bg-gray-700 hover:text-white
```

---

# 4. Detect the Current Route

Laravel provides the `request()` helper.

The `is()` method checks whether the current URL matches a pattern.

Example:

```blade
request()->is('/')
```

This returns:

* `true` when visiting `/`
* `false` on any other page

Example usage:

```blade
class="{{ request()->is('/')
    ? 'bg-gray-900 text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
}}"
```

---

# 5. Apply It to Every Navigation Link

Home:

```blade
request()->is('/')
```

About:

```blade
request()->is('about')
```

Contact:

```blade
request()->is('contact')
```

Each navigation item now becomes active only when its corresponding page is being viewed.

---

# 6. Move Navigation into a Blade Component

Instead of repeating the same HTML multiple times, create a reusable component.

Create:

```
resources/views/components/nav-link.blade.php
```

Replace repeated links:

```blade
<x-nav-link href="/">
    Home
</x-nav-link>

<x-nav-link href="/about">
    About
</x-nav-link>

<x-nav-link href="/contact">
    Contact
</x-nav-link>
```

This centralizes all navigation logic into a single component.

---

# 7. Use the Slot Instead of Hardcoded Text

Instead of writing:

```blade
Home
```

inside the component, use Blade's default slot.

```blade
{{ $slot }}
```

This allows any text to be inserted:

```blade
<x-nav-link>Home</x-nav-link>
```

becomes

```html
Home
```

Similarly:

```blade
<x-nav-link>About</x-nav-link>
```

outputs

```html
About
```

---

# 8. Accessibility with `aria-current`

Navigation links should indicate which page is currently active for screen readers.

Example:

```blade
aria-current="{{ condition ? 'page' : 'false' }}"
```

When active:

```html
aria-current="page"
```

When inactive:

```html
aria-current="false"
```

This improves accessibility for users relying on assistive technologies.

---

# 9. Blade Attributes vs Props

Blade components distinguish between **HTML attributes** and **component props**.

## Attributes

Attributes are standard HTML attributes that are rendered onto the element.

Examples:

```blade
href
class
id
target
```

Example:

```blade
<x-nav-link href="/" id="home-link">
```

Inside the component:

```blade
{{ $attributes }}
```

renders:

```html
<a href="/" id="home-link">
```

---

## Props

Props are values used internally by the component and **should not become HTML attributes**.

Example:

```blade
active
```

If not declared as a prop, Blade assumes it's an HTML attribute and outputs:

```html
<a active>
```

which is invalid.

Declare props using:

```blade
@props(['active'])
```

Now `active` becomes an internal variable instead of an HTML attribute.

---

# 10. Declare Props

Blade provides the `@props` directive.

Example:

```blade
@props([
    'active'
])
```

This creates:

```blade
$active
```

which can be used inside the component.

---

# 11. Give Props Default Values

If a prop is optional, assign a default value.

Example:

```blade
@props([
    'active' => false
])
```

Now every navigation link starts as inactive unless specified otherwise.

---

# 12. Use the Prop Instead of Route Logic

Instead of checking the route inside the component:

```blade
request()->is(...)
```

simply use the prop:

```blade
class="{{ $active
    ? 'bg-gray-900 text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
}}"
```

The component no longer needs to know anything about routes.

It only knows whether it is active.

---

# 13. Passing Boolean Props

A common mistake is writing:

```blade
active="false"
```

This passes the string:

```text
"false"
```

Since any non-empty string is truthy in PHP, the component still behaves as if it were active.

---

## Correct Approach

Prefix the attribute with a colon.

```blade
:active="false"
```

or

```blade
:active="true"
```

The colon tells Blade to evaluate the value as a PHP expression instead of treating it as a string.

---

### Examples

Incorrect:

```blade
active="false"
```

Result:

```php
"false"
```

A non-empty string → evaluates to `true`.

---

Correct:

```blade
:active="false"
```

Result:

```php
false
```

Correct Boolean value.

---

# 14. Pass Route Expressions

Now the active state can be determined outside the component.

Home:

```blade
<x-nav-link
    href="/"
    :active="request()->is('/')"
>
    Home
</x-nav-link>
```

About:

```blade
<x-nav-link
    href="/about"
    :active="request()->is('about')"
>
    About
</x-nav-link>
```

Contact:

```blade
<x-nav-link
    href="/contact"
    :active="request()->is('contact')"
>
    Contact
</x-nav-link>
```

The component only receives a Boolean value and renders itself accordingly.

---

# 15. Blade Directives

Blade directives begin with `@` and provide shorthand syntax that compiles into standard PHP.

Examples:

```blade
@if

@foreach

@unless

@php

@props
```

These directives simplify template logic while keeping Blade templates clean and readable.

---

# 16. Writing PHP Inside a Blade Component

For more complex logic, Blade allows embedding PHP using the `@php` directive.

Example:

```blade
@php
    if ($active) {
        // custom logic
    }
@endphp
```

This keeps component-specific logic isolated within the component rather than spreading it throughout multiple views.

---

# Final Navigation Component Structure

A reusable navigation component now provides:

* Dynamic active styling
* Reusable HTML
* Automatic slot rendering
* Accessibility support (`aria-current`)
* Boolean props
* Clean separation between routing logic and presentation
* Easy maintenance from a single file

---

# Homework

Extend the `NavLink` Blade component by introducing a new prop:

```blade
type
```

The `type` prop should determine which HTML element the component renders:

* If `type` is `"a"` → render an `<a>` tag.
* If `type` is `"button"` → render a `<button>` tag.

This requires adding conditional logic inside the component so it can render different HTML elements while reusing the same styling and behavior.
