# PHP File Inclusion: -

## 1. Why Split PHP Code into Multiple Files

Although it is possible to place all PHP logic in a single file, doing so makes maintenance, scalability, and extensibility difficult. Splitting functionality into separate files improves structure and reusability. Autoloading and namespaces provide more advanced organization, but the first step is learning how to include files.

---

# 2. File Inclusion Statements in PHP

PHP provides four file-inclusion constructs:

* `include`
* `include_once`
* `require`
* `require_once`

All of them **include and evaluate** a file based on its path.

### 2.1 Basic Syntax

```php
include "file.php";
require "file.php";
include_once "file.php";
require_once "file.php";
```

---

## 3. Difference Between `include` and `require`

### 3.1 Behavior on Missing Files

| Statement | If File Missing       | Script Execution  |
| --------- | --------------------- | ----------------- |
| include   | Emits **warning**     | Continues running |
| require   | Emits **fatal error** | Stops execution   |

**Example:**

```php
include "file.php";
echo "Hello World";  // still executed even if file.php is missing
```

```php
require "file.php";
echo "Hello World";  // never executed if file.php is missing
```

---

## 4. How PHP Resolves File Paths

If no explicit path is provided:

1. PHP checks directories listed under **include_path** in `php.ini`.
2. If not found, PHP checks the **current script directory**.
3. If still not found, a warning or fatal error occurs depending on the statement used.

---

# 5. Using `*_once` Variants (`include_once` and `require_once`)

These ensure a file is included **only one time**, even if referenced multiple times.

### Example:

```php
require_once "file.php";
require_once "file.php";
```

The code inside `file.php` executes only once.

This prevents:

* Function redeclaration errors
* Variable value resets
* Accidental overwriting due to repeated includes

---

## 6. Variable Scope Effects When Including Files

Files included using any of the four statements inherit the variable scope of the parent file.

### 6.1 Example demonstrating overwrite issues:

**file.php:**

```php
$x = 5;
```

**index.php:**

```php
require "file.php";
$x++;    // x becomes 6
echo $x; // prints 6

require "file.php";
echo $x; // prints 5 — overwritten by second include
```

### 6.2 Using `require_once` avoids overwriting:

```php
require_once "file.php";
require_once "file.php";   // ignored second time
```

---

## 7. Return Values from Included Files

### Default behavior:

* `include` returns `1` on success.
* `include` returns `false` on failure.

### Example:

```php
$y = include "file.php";
var_dump($y); // int(1)
```

If file not found:

```php
$y = include "missing.php";
var_dump($y); // bool(false)
```

### Returning custom values:

**file.php:**

```php
return ["host" => "localhost"];
```

**index.php:**

```php
$config = include "file.php";
var_dump($config); // array with config values
```

This technique is frequently used for configuration files.

---

# 8. Using Includes for HTML Partials

A common use case is injecting reusable HTML fragments (e.g., navigation bars, headers, footers).

### Steps:

1. Create a directory `partials/`.
2. Create `nav.php`.

**partials/nav.php:**

```php
<nav>
   <a href="home.php">Home</a>
   <a href="about.php">About</a>
   <a href="contact.php">Contact</a>
</nav>
```

3. Include it in another file:

```php
include "partials/nav.php";
```

Any updates made to `nav.php` automatically propagate to all pages.

---

# 9. Capturing Included File Output into a String

By default, `include` outputs content immediately. To capture it instead, use **output buffering**.

### Step-by-step example:

```php
ob_start();                         // Start buffering
include "partials/nav.php";         // File output goes into buffer
$nav = ob_get_clean();              // Retrieve and clear buffer
```

`$nav` now contains the HTML string.

### Example: Modifying the captured string

```php
$nav = str_replace("About", "About Us", $nav);
echo $nav;
```

This pattern is useful for templating and dynamic content manipulation.

---

# 10. Summary of Practical Use Cases

### Appropriate use cases for `include` / `require`:

* Reusable components (navigation, headers, footers)
* Centralized configuration files
* Loading helper functions
* Modularizing large scripts

### When to use `require_once`:

* When files declare functions or classes
* When re-including would cause variable or state resets
* When the file is essential for application execution

### When to use output buffering:

* When you need the included content as a string instead of direct output
* When preparing dynamic HTML templates

---