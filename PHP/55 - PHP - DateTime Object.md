# PHP DateTime, Time Zones, Intervals, Comparisons, and DatePeriod -

This tutorial introduces the object-oriented (OOP) approach to working with dates, times, and time zones in PHP using the **DateTime**, **DateTimeImmutable**, **DateInterval**, and **DatePeriod** classes, as well as core comparison operators and formatting functions.

---

## 1. Creating DateTime Objects

The `DateTime` class accepts two optional arguments:

1. **Datetime string**
2. **Timezone** (as a `DateTimeZone` object)

### Valid Date Strings

All formats supported by `strtotime()` are accepted.

### Examples

```php
// Current date & time (default timezone)
$dt = new DateTime();

// Relative formats
new DateTime('tomorrow');
new DateTime('yesterday noon');

// Explicit formatted date
new DateTime('May 12 2021 3:30 pm');
```

### Using a Time Zone

```php
$tz = new DateTimeZone('Europe/Amsterdam');
$dt = new DateTime('May 12 2021 3:30 pm', $tz);
```

---

## 2. Changing Time Zones

### Adjusting time using `setTimezone()`

```php
$dt = new DateTime('May 12 2021 3:30 pm');  // UTC by default
echo $dt->format('H:i');                    // 15:30 UTC

$dt->setTimezone(new DateTimeZone('Europe/Amsterdam'));
echo $dt->format('H:i');                    // 17:30 (adjusted)
```

### Retrieving the timezone name

```php
echo $dt->getTimezone()->getName();  // e.g., "Europe/Amsterdam"
```

---

## 3. Modifying Date and Time

### `setDate()` and `setTime()`

```php
$dt->setDate(2021, 4, 21);   // Set Y-M-D
$dt->setTime(2, 15, 0);      // Set H-M-S
```

These methods return the `DateTime` object, enabling method chaining:

```php
$dt->setDate(2021, 4, 21)
   ->setTime(2, 15)
   ->setTimezone(new DateTimeZone('Europe/Amsterdam'));
```

### Order Matters

Changing time before or after a timezone conversion results in different outcomes, because timezone conversion adjusts the stored timestamp.

---

## 4. Creating DateTime from a Specific Format

Use `DateTime::createFromFormat()` when parsing dates that don't match PHP's default interpretation.

### Problem Example

For the input `12/05/2021`:

* PHP interprets slashes `/` as **US format (m/d/Y)**.
* European format **d/m/Y** will be misread.

### Solutions

#### A. Replace delimiters with dashes or dots (PHP treats them as d-m-Y)

```php
$date = str_replace('/', '-', '12/05/2021');
new DateTime($date);  // Interpreted as 12 May 2021
```

#### B. Use `createFromFormat()` (preferred)

```php
$dateString = '12/05/2021';   // European: 12 May 2021
$dt = DateTime::createFromFormat('d/m/Y', $dateString);
```

### Handling missing time

If time is omitted, DateTime defaults to **current time**, unlike the constructor, which defaults to midnight.

To force midnight:

```php
$dt = DateTime::createFromFormat('d/m/Y', '12/05/2021')
       ->setTime(0, 0);
```

---

## 5. Procedural Function Equivalents

PHP provides procedural aliases:

* `date_create()` → `new DateTime()`
* `date_create_from_format()` → `DateTime::createFromFormat()`
* `date_timezone_set()` → `$dt->setTimezone()`

The object-oriented API is preferred for readability and testability.

---

## 6. Comparing DateTime Objects

Comparison operators work directly:

```php
$dt1 = new DateTime('May 25 2021 9:15 am');
$dt2 = new DateTime('May 25 2021 9:14 am');

$dt1 <  $dt2;
$dt1 >  $dt2;
$dt1 == $dt2;
$dt1 <=> $dt2;    // spaceship operator
```

Interpretation of `<=>`:

* `1` → left is greater
* `-1` → left is smaller
* `0` → equal

### Comparing timestamps

```php
$dt1->getTimestamp() > $dt2->getTimestamp();
```

---

## 7. Calculating Differences with `diff()`

`DateTime::diff()` returns a `DateInterval` object.

```php
$diff = $dt1->diff($dt2);
```

### Properties exposed:

* `$diff->y` (years)
* `$diff->m` (months)
* `$diff->d` (days)
* `$diff->h`, `$diff->i`, `$diff->s`
* `$diff->days` (total days)
* `$diff->invert` (1 if negative interval)

### Formatting the interval

```php
echo $diff->format('%y years %m months %d days');
echo $diff->format('%a');   // total days
echo $diff->format('%R%a'); // signed total days
```

---

## 8. Working with DateInterval Directly

Create intervals manually:

```php
$interval = new DateInterval('P3M2D');  // 3 months, 2 days
```

Add/subtract interval:

```php
$dt->add($interval);
$dt->sub($interval);
```

If `$interval->invert = 1`, `add()` subtracts and vice-versa.

---

## 9. Mutability, Cloning, and DateTimeImmutable

### Problem: modifying one variable also modifies another

```php
$from = new DateTime();
$to = $from;               // Both point to same object
$to->add(new DateInterval('P1M'));
// $from is now modified too
```

### Solution A: Clone

```php
$to = clone $from;
$to->add(new DateInterval('P1M'));
```

### Solution B: Use `DateTimeImmutable`

```php
$from = new DateTimeImmutable();
$to = $from->add(new DateInterval('P1M'));  // returns new object
```

For immutables, always reassign:

```php
$to = $to->add(new DateInterval('P1Y'));
```

---

## 10. Iterating Over Date Ranges with DatePeriod

`DatePeriod` generates sequences of dates.

### Using Start, Interval, End

```php
$period = new DatePeriod(
    new DateTime('2021-05-01'),
    new DateInterval('P1D'),
    (new DateTime('2021-05-31'))->modify('+1 day')  // to include end date
);

foreach ($period as $date) {
    echo $date->format('Y-m-d');
}
```

### Using recurrences instead of end date

```php
$period = new DatePeriod(
    new DateTime('2021-05-01'),
    new DateInterval('P3D'),
    3   // number of recurrences
);
```

### Excluding the start date

```php
$period = new DatePeriod(
    new DateTime('2021-05-01'),
    new DateInterval('P3D'),
    3,
    DatePeriod::EXCLUDE_START_DATE
);
```

---

## 11. Carbon Library (Mentioned)

The video references **Carbon**, a popular extension of DateTime that adds many helper methods. Laravel uses Carbon by default. Consider it when you need a more expressive API.

---

# End of Tutorial