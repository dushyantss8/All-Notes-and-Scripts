# PHP Date, Time, and Time Zone: -

This tutorial explains PHP’s procedural date/time functions, timestamp manipulation, formatting, time zone handling, and parsing utilities.

---

## 1. Working with Unix Timestamps

### 1.1 `time()`

`time()` returns the current Unix timestamp (seconds since January 1, 1970 UTC).

```php
echo time(); // e.g. 1704800000
```

### 1.2 Manipulating timestamps

You can add or subtract seconds to compute future or past times.

```php
$currentTime = time();
echo $currentTime . "<br>";

// Future time (5 days ahead)
echo $currentTime + (5 * 24 * 60 * 60) . "<br>";

// Past time (1 day ago)
echo $currentTime - (24 * 60 * 60);
```

---

## 2. Formatting Dates with `date()`

### 2.1 Basic usage

`date()` formats a timestamp into a human-readable string.

```php
echo date('m/d g:i a');
// Format: month/day, hour (12-hour), minutes, am/pm
```

### 2.2 Formatting a custom timestamp

Optional second parameter specifies the timestamp to format:

```php
echo date('m/d g:i a', $currentTime + (5 * 24 * 60 * 60));
echo date('m/d g:i a', $currentTime - (24 * 60 * 60));
```

### 2.3 Available format characters

PHP’s documentation provides all format characters, e.g.:

* `d`: day (two digits)
* `D`: textual day (Mon, Tue, etc.)
* `g`: hour 1–12 (no leading zeros)
* `i`: minutes
* `a`: am/pm

---

## 3. Time Zones

### 3.1 Default behavior

PHP uses the default time zone specified in `php.ini`.

### 3.2 Changing time zone at runtime

Use `date_default_timezone_set()`:

```php
echo date_default_timezone_get(); // current timezone

date_default_timezone_set('UTC');
echo date_default_timezone_get(); // UTC
```

**Important:**
The time zone must be set before calling time-dependent functions to affect their output.

---

## 4. Creating Timestamps with `mktime()`

`mktime()` builds a timestamp from specific date components:

```php
$timestamp = mktime(0, 0, 0, 4, 10, null);
echo date('m/d/Y', $timestamp);
```

If `null` is used for the year, PHP uses the current year.

---

## 5. Parsing Dates with `strtotime()`

`strtotime()` converts human-readable date strings into Unix timestamps.

### 5.1 Absolute dates

```php
echo strtotime("2021 January 18 7am");
```

### 5.2 Relative date strings

`strtotime()` supports powerful natural language expressions:

```php
strtotime("tomorrow");
strtotime("first day of February");
strtotime("last day of February 2020");
strtotime("second Friday of January");
```

You can then format the result:

```php
echo date('Y-m-d', strtotime("tomorrow"));
```

---

## 6. Parsing with `date_parse()` and `date_parse_from_format()`

### 6.1 `date_parse()`

Parses a date/time string into a detailed associative array:

```php
$result = date_parse("2021-01-18 07:00");
print_r($result);
```

Returns array fields like:

* year
* month
* day
* hour
* minute
* warnings
* errors

### 6.2 `date_parse_from_format()`

Parses a date based on a specified format:

```php
$result = date_parse_from_format('Y-m-d H:i', '2021-01-18 07:00');
print_r($result);
```

If the format does not match the input, warnings/errors appear in the result array.

---

# Summary

This lesson introduces PHP’s procedural date/time functions:

* `time()` for current timestamps
* Mathematical manipulation of timestamps
* `date()` for formatting
* Time zone modification with `date_default_timezone_set()`
* `mktime()` for constructing timestamps
* `strtotime()` for parsing absolute and relative date strings
* `date_parse()` and `date_parse_from_format()` for detailed date parsing

These functions allow you to compute, convert, and display dates and times reliably across different time zones and formats.

---