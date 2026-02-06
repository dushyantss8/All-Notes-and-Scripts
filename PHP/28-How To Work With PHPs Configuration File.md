# PHP Configuration (php.ini) : -

## 1. Overview of `php.ini`

The `php.ini` file is the central configuration file for PHP. It allows customization of numerous PHP behaviors such as error reporting, file uploads, memory limits, and time zones.

### Key characteristics:

* **Location varies** depending on the OS and environment.
* In **XAMPP**, it can be accessed via:

  * Apache → Config → `php.ini`.

### Syntax notes:

* **Square brackets [ ]**: Section headers; ignored by PHP.
* **Semicolon (;)**: Comment indicator.
* **Directives**: Actual configuration settings.

---

## 2. Directive Metadata and Changeability

The PHP documentation lists available directives with:

* **Directive name**
* **Default value**
* **Changeability**
* **Changelog**

### Changeability:

Indicates *where* a directive may be changed:

* Some can be modified at runtime using `ini_set()`.
* Others require modification in `php.ini` only (e.g., mode: PHP_INI_SYSTEM).

### Important notes:

* `ini_set()` changes **only apply during script runtime**.
* Any changes in `php.ini` require an **Apache restart** for the new configuration to take effect.

---

# 3. Key Directives and Practical Examples

## A. Error Reporting System

### 1. `error_reporting`

Controls which type of errors should be reported by PHP.

#### Example: Check current value

```php
var_dump(ini_get('error_reporting'));
var_dump(E_ALL);
```

#### Example: Trigger a warning

```php
$array = ['a'];
echo $array[2]; // Warning: undefined offset
```

#### Hide warnings at runtime (not recommended):

```php
ini_set('error_reporting', E_ALL & ~E_WARNING);
```

### Notes:

* During development, **always use `E_ALL`**.
* Error reporting values use **bitwise operators**.

---

### 2. `display_errors`

Controls whether PHP errors should be shown in the browser.

#### Check and set:

```php
echo ini_get('display_errors'); // 1 or 0
ini_set('display_errors', 0);   // hide errors
```

**Production recommendation:** `display_errors = 0`
Errors should not leak implementation details to users.

---

### 3. `error_log`

Defines the file path where PHP should write its error logs.

Used when errors are disabled on screen but still need tracking.

---

## B. `post_max_size`

Maximum amount of data allowed in a POST request.

Relevant for:

* Forms
* File uploads
* API endpoints receiving JSON payloads

---

## C. `max_execution_time`

Maximum time a PHP script may run before being terminated.

### Example:

```php
ini_set('max_execution_time', 3);
sleep(5);
echo 'Hello World';
// Script fails after 3 seconds
```

---

## D. `memory_limit`

Maximum memory a script can consume.

### Check current value:

```php
echo ini_get('memory_limit');
```

### Trigger an out-of-memory error:

```php
$str = "x";
for ($i = 0; $i < 1000; $i++) {
    $str .= $str;
}
```

Setting:

```php
ini_set('memory_limit', '-1'); // no limit (not recommended)
```

---

## E. File Upload Settings

### 1. `file_uploads`

Enables/disables HTTP file uploads.

### 2. `upload_tmp_dir`

Temporary directory where uploaded files are stored before processing.

### 3. `upload_max_filesize`

Maximum file size allowed for uploads.

These settings matter when working with file upload forms.

---

## F. `date.timezone`

Defines the default timezone for PHP date and time functions.

Example:

```
date.timezone = "Asia/Kolkata"
```

---

## G. `include_path`

Defines directories PHP will search when using:

* `include`
* `require`
* `include_once`
* `require_once`

Useful when organizing code across directories.

---

# 4. Recommendations and Future Topics

* Modify sensitive directives (e.g., session settings, security-related settings) cautiously.
* Use `ini_set()` only for runtime experiments; persistent configuration must go into `php.ini`.
* Restart Apache after editing `php.ini`.
* More advanced directives, especially related to security and session management, should be studied separately.

---