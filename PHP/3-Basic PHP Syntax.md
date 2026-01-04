# PHP Basics: Writing, Running, and Embedding PHP Code

## 1. Setting Up the PHP Project

### 1.1 Opening the Project Directory

* PHP projects served locally are typically placed inside the `htdocs` directory (for example, when using XAMPP).
* Open the `htdocs` folder in your code editor.
* This directory acts as the document root for the local web server.

### 1.2 Creating a PHP File

* Create a new file named:

```text
index.php
```

**Important:**

* PHP files **must** have a `.php` extension to be interpreted as PHP.
* A `.html` file will not execute PHP code.

---

## 2. PHP Syntax Fundamentals

### 2.1 PHP Opening and Closing Tags

PHP code is interpreted only inside PHP tags:

```php
<?php
// PHP code here
?>
```

* Opening tag: `<?php`
* Closing tag: `?>`

### 2.2 When to Omit the Closing Tag

* If a file contains **only PHP code**, the closing `?>` tag should be omitted.
* This prevents accidental whitespace or newlines from being sent to the browser, which can cause unexpected output or header errors.

**Recommended:**

```php
<?php
echo "Hello World";
```

**Required (when embedding PHP in HTML):**

```php
<?php echo "Hello World"; ?>
```

---

## 3. Outputting Data in PHP

### 3.1 Using `echo`

`echo` is used to output data to the browser.

```php
<?php
echo "Hello World";
```

Key points:

* Statements end with a semicolon (`;`).
* Missing semicolons cause parser errors.
* PHP is a **server-side language**; PHP code is not visible in the browser’s source.

### 3.2 Running PHP from the Browser

* Visit:

```text
http://localhost/index.php
```

* The browser displays only the output, not the PHP source code.

---

## 4. Running PHP from the Command Line

### 4.1 Opening the Shell

* Open the XAMPP Control Panel.
* Click **Shell** to open the terminal.

### 4.2 Executing a PHP Script

Navigate to the project directory:

```bash
cd htdocs
```

Run the PHP file:

```bash
php index.php
```

Output:

```text
Hello World
```

---

## 5. `echo` vs `print`

### 5.1 Differences Between `echo` and `print`

| Feature             | echo                  | print           |
| ------------------- | --------------------- | --------------- |
| Return value        | None                  | Returns `1`     |
| Used in expressions | ❌                     | ✅               |
| Performance         | Slightly faster       | Slightly slower |
| Multiple arguments  | Yes (comma-separated) | No              |

### 5.2 Example: `print` Return Value

```php
<?php
echo print "Hello World";
```

Output:

```text
Hello World1
```

### 5.3 Multiple Arguments with `echo`

```php
<?php
echo "Hello", " ", "World";
```

---

## 6. Working with Strings

### 6.1 Escaping Quotes

Invalid string:

```php
echo 'Joe's invoice'; // Syntax error
```

Valid approaches:

**Escape the quote**

```php
echo 'Joe\'s invoice';
```

**Use double quotes**

```php
echo "Joe's invoice";
```

---

## 7. Variables in PHP

### 7.1 Declaring Variables

* Variables start with a `$` symbol.

```php
<?php
$name = "John Doe";
echo $name;
```

### 7.2 Variable Naming Rules

* Must start with a **letter** or **underscore**
* Cannot start with a number
* Cannot contain special characters
* `$this` is reserved and cannot be reassigned

Valid:

```php
$_user1 = "Admin";
```

Invalid:

```php
1name = "Test"; // Syntax error
```

---

## 8. Variable Assignment: By Value vs By Reference

### 8.1 Assignment by Value (Default)

```php
<?php
$x = 1;
$y = $x;
$x = 3;

echo $y; // Outputs 1
```

### 8.2 Assignment by Reference

```php
<?php
$x = 1;
$y = &$x;
$x = 3;

echo $y; // Outputs 3
```

* The ampersand (`&`) makes `$y` reference `$x`.

---

## 9. Strings and Variables

### 9.1 Single Quotes vs Double Quotes

**Single quotes (no variable parsing):**

```php
echo 'Hello $name';
```

Output:

```text
Hello $name
```

**Double quotes (variable interpolation):**

```php
echo "Hello $name";
```

Output:

```text
Hello John Doe
```

### 9.2 Using Curly Braces for Clarity

```php
echo "Hello {$name}";
```

### 9.3 String Concatenation

```php
echo "Hello " . $name;
```

* `.` is the concatenation operator.

---

## 10. Embedding PHP in HTML

### 10.1 Basic Example

```php
<!DOCTYPE html>
<html>
<body>
  <h1><?php echo "Hello World"; ?></h1>
</body>
</html>
```

### 10.2 PHP Short Echo Tag

```php
<h1><?= "Hello World" ?></h1>
```

* Equivalent to `<?php echo ... ?>`
* Semicolon not required for single-line output

---

## 11. Outputting HTML from PHP

```php
<?php
echo "<p>This is a paragraph</p>";
```

* PHP can generate HTML dynamically.
* Excessive mixing of PHP and HTML is discouraged.
* Presentation logic should be separated from business logic.

---

## 12. Comments in PHP

### 12.1 Single-Line Comments

```php
// This is a comment
# This is also a comment
```

### 12.2 Multi-Line Comments

```php
/*
This is a
multi-line comment
*/
```

### 12.3 Important Rules

* Comments after the closing `?>` tag do **not** comment out HTML.
* Nested multi-line comments are **not allowed** and cause syntax errors.

---

## 13. Documentation Comments (Overview)

```php
/**
 * This is a documentation block
 */
```

* Used for documenting classes, methods, and properties.
* Covered in more detail in Object-Oriented PHP.

---