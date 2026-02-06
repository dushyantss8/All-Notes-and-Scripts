# PHP Basics: Writing and Executing PHP Code

## 1. Setting Up the Project Structure

### Opening the PHP Project Folder

1. Open your code editor.
2. Navigate to the XAMPP installation directory.
3. Open the `htdocs` folder (default web root for XAMPP).
4. Create and open the folder you will use for this project.
5. Inside the folder, create a file named **`index.php`**.

### Important Note About File Extensions

* To ensure that the PHP interpreter processes your file, its extension must be **`.php`**, not `.html`.
* PHP files can include **HTML, CSS, and JavaScript** alongside PHP code.

---

# 2. PHP Opening and Closing Tags

### Standard PHP Tags

```php
<?php
    // PHP code goes here
?>
```

### How the Parser Works

* Everything **inside** the `<?php ... ?>` block is interpreted as PHP.
* Everything **outside** is treated as plain HTML.

### When to Omit the Closing Tag

* If a PHP file contains *only PHP code*, **omit the closing tag** to prevent accidental whitespace/output that could break your application.
* Example of unintended output:

```php
<?php
echo "Hello";
// accidental text after closing tag:
?>
Hello
```

---

# 3. Printing Output with `echo` and `print`

## Basic Output

```php
echo "Hello World";
```

* Output is sent to the browser.
* PHP code is never visible in the browser since it executes server-side.

### Syntax Elements Explained

* String values are enclosed in `'single'` or `"double"` quotes.
* Statements end with a **semicolon (`;`)**.
* Missing semicolons result in parser errors.

## When Semicolons Are Not Required

* If a PHP tag closes immediately after an expression:

```php
<?php echo "Hello" ?>
```

---

# 4. Running PHP in the Terminal

### Using XAMPP Shell

1. Open **XAMPP Control Panel**.
2. Click **Shell**.
3. Navigate to your project directory:

```bash
cd htdocs/project-folder
```

4. Execute a PHP script:

```bash
php index.php
```

---

# 5. Differences Between `echo` and `print`

### Key Differences

| Feature                | echo                  | print           |
| ---------------------- | --------------------- | --------------- |
| Return value           | None                  | Returns `1`     |
| Use inside expressions | No                    | Yes             |
| Multiple arguments     | Yes (comma separated) | No              |
| Performance            | Slightly faster       | Slightly slower |

### Examples

**`print` returning 1**

```php
echo print("Hello"); // prints "Hello1"
```

**Comma-separated arguments with echo**

```php
echo "Hello", " ", "World";
```

---

# 6. Handling Quotes in Strings

### Escaping Quotes

```php
echo 'Joe\'s invoice';
```

### Using Double Quotes Instead

```php
echo "Joe's invoice";
```

---

# 7. Variables in PHP

### Declaring Variables

* Variables must start with `$`:

```php
$name = "Peter";
```

### Naming Rules

* Must start with a **letter** or **underscore**.
* Cannot start with a number.
* Cannot contain special characters.
* Cannot use reserved name `$this`.

### Variables Are Assigned by Value (Default)

```php
$x = 1;
$y = $x;
$x = 3;
echo $y; // prints 1
```

### Assigning by Reference

```php
$x = 1;
$y = &$x;
$x = 3;
echo $y; // prints 3
```

---

# 8. Using Variables Inside Strings

### Single Quotes (Literal)

```php
echo 'Hello $name'; // prints: Hello $name
```

### Double Quotes (Interpolated)

```php
echo "Hello $name"; // prints: Hello Peter
```

### Using Curly Braces for Clarity

```php
echo "Hello {$name}";
```

### String Concatenation

```php
echo "Hello " . $name;
```

---

# 9. Embedding PHP in HTML

### Example Structure

```html
<!DOCTYPE html>
<html>
<body>
    <?php echo "Hello World"; ?>
</body>
</html>
```

### Shorthand Echo Syntax

```html
<?= "Hello World" ?>
```

Equivalent to:

```php
<?php echo "Hello World"; ?>
```

### Processing PHP + Outputting HTML

```php
<?php
$x = 10;
$y = 5;
echo "<p>Total: " . ($x + $y) . "</p>";
?>
```

---

# 10. Comments in PHP

### Single-Line Comments

```php
// This is a comment
# This is also a comment
```

### Multi-Line Comments

```php
/*
  This is a
  multi-line comment
*/
```

### Important Notes

* Comments on the same line as the closing PHP tag **do not** block following HTML.
* Nested multi-line comments are **not allowed**:

```php
/* outer
   /* inner */   // will cause syntax error
*/
```

---

# Summary of Concepts Covered

You now understand:

* How to create and run a PHP file.
* PHP tags and when to omit closing tags.
* Printing output using `echo` and `print`.
* Running PHP scripts through the browser and terminal.
* String handling and escaping characters.
* Declaring variables and assigning by value or reference.
* Embedding PHP inside HTML.
* Commenting code properly.

---
