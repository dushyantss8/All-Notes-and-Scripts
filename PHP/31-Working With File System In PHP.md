# PHP File System Operations: -

## 1. Listing Files and Directories

### `scandir()`

The `scandir()` function lists files and directories within a given path.

**Example:**

```php
$dir = scandir(__DIR__);
var_dump($dir);
```

**Output sample:**

* `.` (current directory)
* `..` (parent directory)
* `index.php` (file inside directory)

You can loop through the returned array and identify items using:

* `is_file($path)`
* `is_dir($path)`

**Example:**

```php
$item = $dir[2]; // index.php
echo is_file($item);  // true
echo is_dir($item);   // false
```

---

## 2. Creating and Deleting Directories

### Creating a directory: `mkdir()`

```php
mkdir('foo', 0777, false);  // name, permissions, recursive
```

### Creating nested directories:

```php
mkdir('foo/bar', recursive: true);
```

### Removing a directory: `rmdir()`

```php
rmdir('foo'); // directory must be empty
```

---

## 3. Checking File/Directory Existence

### `file_exists()`

```php
if (file_exists('foo.txt')) {
    echo filesize('foo.txt');
} else {
    echo "File not found";
}
```

---

## 4. PHP File System Caching

Some file functions (e.g., `filesize`) return cached values.
Use `clearstatcache()` to refresh cache.

### Demonstration:

```php
clearstatcache();
echo filesize('foo.txt');
```

---

## 5. File Reading with `fopen()` and `fgets()`

### Opening a file:

```php
$file = fopen('foo.txt', 'r'); // mode "r" = read
```

`fopen()` returns a **resource**. If opening fails, it returns `false` and emits a warning.

### Avoid suppressing warnings

Instead of using the error control operator (`@fopen()`), always check existence first.

### Reading a file line by line:

```php
$file = fopen('foo.txt', 'r');

while (($line = fgets($file)) !== false) {
    echo $line . "<br>";
}

fclose($file);
```

Strict comparison (`!== false`) is required because lines may contain values that loosely evaluate to false.

---

## 6. Reading CSV Files with `fgetcsv()`

`fgetcsv()` reads and parses CSV rows into arrays.

### Example:

```php
$file = fopen('foo.csv', 'r');

while (($row = fgetcsv($file, separator: ',')) !== false) {
    print_r($row);
}

fclose($file);
```

**Output example:**

```
Array ( [0] => a [1] => b [2] => c )
Array ( [0] => d [1] => e [2] => f )
```

---

## 7. Reading Complete File Content

### `file_get_contents()`

Reads entire file into a string.

```php
$content = file_get_contents('foo.txt');
echo $content;
```

You can specify offset and length:

```php
$content = file_get_contents('foo.txt', offset: 3, length: 2);
```

Remote URLs may work depending on server configuration, but `curl` is recommended for HTTP requests.

---

## 8. Writing to Files

### `file_put_contents()`

Writes data to a file (creates or overwrites by default).

```php
file_put_contents('bar.txt', 'hello');
```

Appending instead of overwriting:

```php
file_put_contents('bar.txt', 'hello', FILE_APPEND);
```

---

## 9. Deleting, Copying, and Moving Files

### Delete a file: `unlink()`

```php
unlink('bar.txt');
```

### Copy a file: `copy()`

```php
copy('foo.txt', 'bar.txt');
```

### Move or rename a file/directory: `rename()`

```php
rename('foo.txt', 'bar.txt');
```

---

## 10. File Path Information

### `pathinfo()`

Retrieve metadata such as name, extension, basename, directory, etc.

```php
$info = pathinfo('foo.txt');
print_r($info);
```

---

# Summary

This tutorial covers the essential PHP file system operations:

* Listing files (`scandir`)
* Checking file types (`is_file`, `is_dir`)
* Creating/removing directories (`mkdir`, `rmdir`)
* Checking existence (`file_exists`)
* Handling file metadata with cache considerations (`filesize`, `clearstatcache`)
* Using streams (`fopen`, `fgets`, `fgetcsv`)
* Reading full file content (`file_get_contents`)
* Writing or appending (`file_put_contents`)
* Copying, renaming, and deleting files (`copy`, `rename`, `unlink`)
* Extracting path details (`pathinfo`)

All examples illustrate practical and safe ways to interact with the filesystem in PHP.