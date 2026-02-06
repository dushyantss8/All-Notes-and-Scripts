# 1. String Data Type in PHP

A **string** in PHP represents a sequence of characters. PHP supports multiple ways to define strings, each with different parsing and interpolation rules.

## 1.1 String Declaration Methods

### a. Single-Quoted Strings (`'...'`)

* **No variable interpolation**
* **No escape sequence parsing**, except:

  * `\'` → single quote in the string
  * `\\` → literal backslash

**Example:**

```php
$name = 'Dushyant';
echo 'Hello $name';     // Output: Hello $name
echo 'It\'s PHP';       // Output: It's PHP
```

### b. Double-Quoted Strings (`"..."`)

* **Variables are interpolated**
* **Escape sequences are parsed** (`\n`, `\t`, etc.)

**Example:**

```php
$name = "Dushyant";
echo "Hello $name";     // Output: Hello Dushyant
echo "Line1\nLine2";    // Output: Line1 (new line) Line2
```

---

# 2. String Operations

### 2.1 Concatenation

Use the dot operator (`.`) to join strings.

```php
$first = "Hello";
$second = "World";
echo $first . " " . $second;  // Output: Hello World
```

### 2.2 String Length

```php
echo strlen("Hello"); // 5
```

### 2.3 Accessing Characters

```php
$str = "PHP";
echo $str[1];  // H
```

---

# 3. Heredoc Syntax in PHP

`Heredoc` is a **multi-line string literal** that behaves like a **double-quoted string**.
This means:

* **Variables are parsed**
* **Escape sequences are interpreted**
* Ideal for embedding large blocks of text, HTML, SQL, JSON, or email templates

## 3.1 Basic Syntax

```php
$str = <<<TEXT
This is a heredoc example.
Variables work here: $name
Escape sequences like \n also work.
TEXT;
```

### Rules:

1. The identifier (e.g., `TEXT`) must appear **alone on a new line**.
2. No whitespace before or after the identifier.
3. The closing identifier **must end with a semicolon (`;`)**.

## 3.2 Example: Multi-line HTML

```php
$title = "Welcome";
$html = <<<HTML
<h1>$title</h1>
<p>This is generated using heredoc.</p>
HTML;

echo $html;
```

**Output:**

```
<h1>Welcome</h1>
<p>This is generated using heredoc.</p>
```

---

# 4. Nowdoc Syntax in PHP

`Nowdoc` is similar to **single-quoted** strings.
It does **not parse variables** or escape sequences.

Use it when you want to include raw text without interpolation.

## 4.1 Basic Syntax

```php
$str = <<<'TEXT'
This is a nowdoc example.
Variables DO NOT work: $name
Escape sequences like \n are not processed.
TEXT;
```

### Rules:

* Same as Heredoc, except the identifier is wrapped in **single quotes**.
* Content is taken **literally**, nothing is parsed.

## 4.2 Example: Raw Code Block

Useful for embedding PHP, SQL, or JSON without escaping.

```php
$code = <<<'PHP'
<?php
echo "This will not run or interpolate: $variable";
?>
PHP;

echo $code;
```

---

# 5. Comparison: Heredoc vs Nowdoc

| Feature                 | Heredoc                          | Nowdoc                        |
| ----------------------- | -------------------------------- | ----------------------------- |
| Acts like               | Double-quoted string             | Single-quoted string          |
| Variable interpolation  | Yes                              | No                            |
| Escape sequence parsing | Yes                              | No                            |
| Use case                | Dynamic templates, HTML, queries | Raw code blocks, literal text |

---

# 6. Practical Use Cases

## 6.1 Creating an Email Template (Heredoc)

```php
$name = "Adam";

$emailBody = <<<EMAIL
Hello $name,

This is a notification email.

Regards,
Support Team
EMAIL;

echo $emailBody;
```

## 6.2 Embedding Raw SQL for Debugging (Nowdoc)

```php
$query = <<<'SQL'
SELECT * FROM users
WHERE username = '$username' AND active = 1;
SQL;

echo $query;
```

---

# Summary

* **Strings**: PHP supports single-quoted, double-quoted, and multi-line syntaxes.
* **Heredoc**: Multi-line string with interpolation (behaves like double-quoted).
* **Nowdoc**: Multi-line string without interpolation (behaves like single-quoted).
* Both are ideal for large text blocks without manual concatenation.
