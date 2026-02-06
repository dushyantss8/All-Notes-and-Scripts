# PHP Error Handling and Error Handlers: -

Error handling in PHP allows developers to manage run-time errors gracefully, control logging, display or hide specific error types, and replace PHP’s default error mechanism with a custom handler.

PHP errors fall into multiple categories, including:

* **E_ERROR** – Fatal runtime error
* **E_WARNING** – Runtime warning (does not stop script execution)
* **E_NOTICE** – Notice about a possible issue
* **E_STRICT** – Suggests best practices
* **E_USER_ERROR / E_USER_WARNING / E_USER_NOTICE** – User-generated errors (via `trigger_error`)

---

# 1. Controlling Error Reporting: `error_reporting()`

`error_reporting()` defines which types of errors PHP should detect and process.

### Example

```php
error_reporting(E_ALL & ~E_WARNING);
```

### Explanation

* `E_ALL` enables all PHP errors.
* `~E_WARNING` excludes warnings.
* So PHP will report everything **except warnings**.

This is commonly used when some warnings are expected or harmless, and you want to reduce noise in logs or output.

---

# 2. Generating Errors Manually: `trigger_error()`

`trigger_error()` allows developers to intentionally throw errors during runtime, usually for debugging or validating conditions.

### Example 1: User-generated fatal error

```php
trigger_error("Example Error", E_USER_ERROR);
```

* Raises a **fatal user error**
* Script execution stops immediately unless caught by a custom handler

### Example 2: User-generated warning

```php
trigger_error("Example Warning", E_USER_WARNING);
```

* Produces a **warning**
* Execution continues (unless your custom handler exits)

---

# 3. Creating a Custom Error Handler: `set_error_handler()`

You can define your own function to intercept PHP errors before they're displayed.

## Basic structure

```php
function error_handler(int $type, string $msg, ?string $file = null, ?int $line = null) {
    // custom logic
}
```

### Meaning of parameters:

| Parameter | Meaning                                   |
| --------- | ----------------------------------------- |
| `$type`   | Type of error (E_WARNING, E_NOTICE, etc.) |
| `$msg`    | Error message                             |
| `$file`   | File where error occurred                 |
| `$line`   | Line number of the error                  |

---

# 4. Registering the Custom Error Handler

```php
set_error_handler("error_handler", E_ALL);
```

* `"error_handler"`: Name of the function to call
* `E_ALL`: Handle all error types
* Once registered, PHP routes **all non-fatal errors** to this handler.

---

# 5. Complete Example (Your Code Explained)

```php
error_reporting(E_ALL & ~E_WARNING);

trigger_error("Example Error", E_USER_ERROR);
trigger_error("Example Error", E_WARNING);

function error_handler(
  int $type,
  string $msg,
  ?string $file = null,
  ?int $line = null
) {
  echo $type . " => " . $msg . " in " . $file . " on line " . $line;
  exit;
}

set_error_handler("error_handler", E_ALL);

echo $x;
```

### Step-by-step flow:

1. `error_reporting(E_ALL & ~E_WARNING);`
   Warnings are suppressed from standard PHP reporting.
   However, they will still reach your custom error handler (because `set_error_handler(E_ALL)` overrides this).

2. `trigger_error("Example Error", E_USER_ERROR);`
   This is a **fatal user error**.
   PHP attempts to route it to your custom handler (if already set).

   **Important:**

   * Because the custom handler is registered *after* this call, the first user error may result in PHP’s default fatal error output and script termination before reaching `set_error_handler`.

3. `trigger_error("Example Error", E_WARNING);`
   Generates a warning.
   Execution continues unless custom handler exits.
   But again, this line never executes because the previous fatal error stops execution.

4. `set_error_handler("error_handler", E_ALL);`
   If reached, it instructs PHP to send all future errors to your handler.

5. `echo $x;`
   `$x` is undefined → **E_NOTICE**
   Your custom handler would catch this and output something like:

   ```
   8 => Undefined variable $x in /var/www/index.php on line 20
   ```

   (Error type 8 = E_NOTICE)

---

# 6. Corrected Example to Demonstrate Custom Handler

The original script stops early because of `E_USER_ERROR`.
Below is a corrected version showing full flow.

```php
error_reporting(E_ALL);

set_error_handler("error_handler", E_ALL);

function error_handler(
  int $type,
  string $msg,
  ?string $file = null,
  ?int $line = null
) {
  echo "[Custom Handler] $type => $msg in $file on line $line";
  exit;
}

trigger_error("User Warning Example", E_USER_WARNING);

echo $undefined; // produces notice
```

### Output:

```
[Custom Handler] 512 => User Warning Example in /path/test.php on line 17
```

Because the handler uses `exit`, execution never reaches `echo $undefined`.

---

# 7. Example: Custom Handler Without Stopping Script

If you want to log errors but continue execution:

```php
function log_only_handler($type, $msg, $file, $line) {
    error_log("[$type] $msg in $file:$line");
    return true; // tells PHP the error is handled
}

set_error_handler('log_only_handler', E_ALL);

echo $notDefined; // script continues
echo "Still running";
```

---

# 8. Error Levels Reference

| Constant       | Value | Meaning                                           |
| -------------- | ----- | ------------------------------------------------- |
| E_ERROR        | 1     | Fatal error                                       |
| E_WARNING      | 2     | Warning                                           |
| E_PARSE        | 4     | Compile-time parse error                          |
| E_NOTICE       | 8     | Non-critical runtime notice                       |
| E_USER_ERROR   | 256   | User-generated fatal                              |
| E_USER_WARNING | 512   | User-generated warning                            |
| E_USER_NOTICE  | 1024  | User-generated notice                             |
| E_ALL          | 32767 | All errors except deprecated dependent on version |

---

# 9. Best Practices

1. **Never show errors in production**

   ```
   ini_set('display_errors', 0);
   error_reporting(0);
   ```

2. **Always log errors**

   ```
   ini_set('log_errors', 1);
   ini_set('error_log', '/var/log/php_errors.log');
   ```

3. **Use custom handlers for:**

   * Central logging
   * Formatting API responses
   * Converting errors → exceptions

4. **Convert all errors to Exceptions**

   ```php
   set_error_handler(function($severity, $message, $file, $line) {
       throw new ErrorException($message, 0, $severity, $file, $line);
   });
   ```

This is common in modern frameworks.

---

# 10. Summary

PHP’s error handling system allows full control over:

* Which errors are reported (`error_reporting`)
* How they are displayed or logged
* How you manually trigger errors (`trigger_error`)
* How PHP routes errors to your custom function (`set_error_handler`)

With a custom handler, you can:

* Format error messages
* Log everything centrally
* Convert errors to exceptions
* Decide whether execution continues or stops

---