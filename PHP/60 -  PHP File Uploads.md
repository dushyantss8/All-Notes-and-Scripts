# PHP File Uploads —

## Table of Contents

1. Overview
2. Creating the File Upload Form
3. Understanding the `$_FILES` Superglobal
4. Required Form Encoding (`enctype`)
5. Validating Uploaded Files
6. Using `pathinfo()` for File Metadata
7. Temporary Upload Directory & File Lifecycle
8. Moving Uploaded Files with `move_uploaded_file()`
9. Storing Files Locally (Defining `STORAGE_PATH`)
10. Handling Multiple File Uploads
11. Handling Array-Based File Inputs
12. Relevant `php.ini` Directives
13. Complete Example Snippets

---

# 1. Overview

PHP provides a built-in mechanism for receiving uploaded files via HTTP POST using the `$_FILES` superglobal. Uploaded files are first placed in a system temporary directory and must be moved to a permanent location before the request ends.

---

# 2. Creating the File Upload Form

### Example: Basic File Upload Form

```php
public function index()
{
    return '
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="receipt">
            <button type="submit">Upload</button>
        </form>
    ';
}
```

### Route

```php
$router->post('/upload', [Home::class, 'upload']);
```

---

# 3. Understanding the `$_FILES` Superglobal

When a file is uploaded, PHP populates:

```php
$_FILES['receipt'] = [
    'name' => 'invoice.jpg',
    'type' => 'image/jpeg',
    'tmp_name' => '/tmp/php8df67a',
    'error' => 0,
    'size' => 32452
];
```

Meaning of fields:

* **name** — Original filename from the client.
* **type** — MIME type from the browser (not trusted).
* **tmp_name** — Temporary stored file path.
* **error** — Upload status (0 = OK).
* **size** — File size in bytes.

---

# 4. Required Form Encoding (`enctype`)

Uploading files requires:

```html
<form enctype="multipart/form-data">
```

Without this attribute, `$_FILES` will be empty.

---

# 5. Validating Uploaded Files

Server-side validation should always be applied:

* Accept only allowed MIME types
* Reject overly large files
* Check valid upload via `is_uploaded_file()`
* Handle `$_FILES['x']['error']` codes

Example validation check:

```php
$file = $_FILES['receipt'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    die('Upload failed.');
}

$allowed = ['image/jpeg', 'image/png', 'application/pdf'];
if (!in_array($file['type'], $allowed)) {
    die('Invalid file type.');
}
```

---

# 6. Using `pathinfo()` for File Metadata

Example:

```php
$info = pathinfo($file['tmp_name']);
var_dump($info);
```

However, using the temporary path will not reflect the original filename. Use the moved file’s path instead.

---

# 7. Temporary Upload Directory & File Lifecycle

Files uploaded via HTTP POST are stored in PHP’s temporary directory (configurable via `php.ini`).
At the end of the request, those temp files are deleted automatically unless you move them.

---

# 8. Moving Uploaded Files with `move_uploaded_file()`

```php
move_uploaded_file($file['tmp_name'], $destination);
```

This function validates:

* File originated from HTTP POST
* Secure movement to a defined location

---

# 9. Storing Files Locally (Defining `STORAGE_PATH`)

Create a storage directory:

```
/your-app
    /storage
```

Define path:

```php
define('STORAGE_PATH', __DIR__ . '/../storage');
```

Move uploaded file:

```php
$destination = STORAGE_PATH . '/' . $file['name'];

move_uploaded_file($file['tmp_name'], $destination);

$info = pathinfo($destination);
```

---

# 10. Handling Multiple File Uploads (Multiple Inputs)

HTML:

```html
<input type="file" name="receipt">
<input type="file" name="my_image">
```

Resulting `$_FILES`:

```php
[
    'receipt' => [...],
    'my_image' => [...]
]
```

Process:

```php
foreach ($_FILES as $key => $file) {
    move_uploaded_file($file['tmp_name'], STORAGE_PATH . '/' . $file['name']);
}
```

---

# 11. Handling Array-Based File Inputs

HTML:

```html
<input type="file" name="receipt[]">
<input type="file" name="receipt[]">
```

Resulting structure:

```php
$_FILES['receipt'] = [
    'name' => ['file1.jpg', 'file2.png'],
    'type' => [...],
    'tmp_name' => [...],
    'error' => [...],
    'size' => [...]
];
```

Processing:

```php
foreach ($_FILES['receipt']['tmp_name'] as $index => $tmp) {
    move_uploaded_file(
        $tmp,
        STORAGE_PATH . '/' . $_FILES['receipt']['name'][$index]
    );
}
```

---

# 12. Relevant `php.ini` Directives for Uploads

| Directive             | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `file_uploads`        | Enables or disables file uploads (`On`/`Off`)               |
| `upload_tmp_dir`      | Path where PHP stores temporary uploads                     |
| `upload_max_filesize` | Maximum size allowed per uploaded file                      |
| `max_file_uploads`    | Maximum number of files per request                         |
| `max_input_time`      | Max time a script can receive input (affects large uploads) |

Example excerpt:

```ini
file_uploads = On
upload_tmp_dir = "/var/tmp/uploads"
upload_max_filesize = 10M
max_file_uploads = 20
max_input_time = 60
```

---

# 13. Complete Example Files

## **index.php**

```php
define('STORAGE_PATH', __DIR__ . '/../storage');

$router->get('/', [Home::class, 'index']);
$router->post('/upload', [Home::class, 'upload']);
```

## **Home.php**

```php
class Home
{
    public function index()
    {
        return '
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="receipt[]" multiple>
            <button type="submit">Upload</button>
        </form>
        ';
    }

    public function upload()
    {
        foreach ($_FILES['receipt']['tmp_name'] as $i => $tmp) {

            if ($_FILES['receipt']['error'][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $original = $_FILES['receipt']['name'][$i];
            $destination = STORAGE_PATH . '/' . $original;

            move_uploaded_file($tmp, $destination);

            $meta = pathinfo($destination);
            var_dump($meta);
        }
    }
}
```

---

# End of Tutorial