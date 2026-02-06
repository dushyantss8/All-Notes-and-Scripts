# PHP Procedural Project: Reading CSV Transaction Files and Rendering an HTML Table

This tutorial walks through the first implementation of a small transaction-processing application using **procedural PHP**. The objective is to:

1. Read all CSV files inside a directory.
2. Parse and normalize the transaction data.
3. Format it appropriately for display.
4. Render it in an HTML table with color-coding and totals.

Later, this logic will be refactored into OOP, but this section focuses on building the procedural foundation.

---

# 1. Project Setup

You start with:

* `public/index.php` – main entry point.
* Defined constants:

  * `APP_PATH` – path to `/app`.
  * `FILES_PATH` – path to `/transaction_files`.
  * `VIEWS_PATH` – path to `/views`.
* `app.php` – where business-logic functions will be implemented.
* `views/transactions.php` – HTML template for table rendering.

---

# 2. Reading Files from a Directory

## Create `get_transaction_files()`

Purpose: read all filenames inside a directory and return them with full paths.

### Steps:

1. Use `scandir()` to list files.
2. Skip `.` and `..` (directories).
3. Ignore directories and keep only normal files.
4. Return an array containing full file paths.
5. Pass the directory path explicitly instead of using global constants.

### Example:

```php
function get_transaction_files(string $dirPath): array {
    $files = [];

    foreach (scandir($dirPath) as $file) {
        if (is_dir($dirPath . $file)) {
            continue;
        }
        $files[] = $dirPath . $file;
    }

    return $files;
}
```

Call it in `index.php`:

```php
$files = get_transaction_files(FILES_PATH);
```

---

# 3. Reading CSV Lines from a File

## Create `get_transactions()`

Purpose: open a CSV file, read rows, and return an array of raw transaction rows.

### Steps:

1. Validate that the file exists; if not, trigger an error using `trigger_error()`.
2. Open the file using `fopen()`.
3. Skip the header line.
4. Read each subsequent line with `fgetcsv()`.
5. Return all lines.

### Example:

```php
function get_transactions(string $fileName, callable $handler = null): array {
    if (!file_exists($fileName)) {
        trigger_error("File $fileName does not exist", E_USER_ERROR);
    }

    $file = fopen($fileName, 'r');
    $transactions = [];

    // Skip header
    fgetcsv($file);

    while (($transaction = fgetcsv($file)) !== false) {
        if ($handler !== null) {
            $transaction = $handler($transaction);
        }
        $transactions[] = $transaction;
    }

    return $transactions;
}
```

### Merging results from multiple files:

```php
$transactions = [];

foreach ($files as $file) {
    $transactions = array_merge(
        $transactions,
        get_transactions($file, 'extract_transaction')
    );
}
```

---

# 4. Parsing and Normalizing a Transaction Row

## Create `extract_transaction()`

Purpose: convert a CSV row into a structured associative array with normalized values.

### Steps:

1. Destructure the CSV row:

   * date
   * check number
   * description
   * amount
2. Remove non-numeric characters from the amount (dollar signs, commas).
3. Convert amount to a float.
4. Return structured data.

### Example:

```php
function extract_transaction(array $row): array {
    [$date, $checkNumber, $description, $amount] = $row;

    $amount = str_replace(['$', ','], '', $amount);
    $amount = (float) $amount;

    return [
        'date' => $date,
        'checkNumber' => $checkNumber,
        'description' => $description,
        'amount' => $amount,
    ];
}
```

---

# 5. Designing Flexible Transaction Extraction

The implementation allows `get_transactions()` to accept a callable parser function.
This makes it possible to support different formats in future:

```php
get_transactions($file, 'extract_transaction_from_bank_y');
```

---

# 6. Calculating Income, Expenses, and Net Totals

## Create `calculate_totals()`

Purpose: loop over all transactions once and compute:

* `totalIncome`
* `totalExpense`
* `netTotal`

### Example:

```php
function calculate_totals(array $transactions): array {
    $totals = [
        'netTotal' => 0,
        'totalIncome' => 0,
        'totalExpense' => 0,
    ];

    foreach ($transactions as $transaction) {
        $amount = $transaction['amount'];
        $totals['netTotal'] += $amount;

        if ($amount >= 0) {
            $totals['totalIncome'] += $amount;
        } else {
            $totals['totalExpense'] += $amount;
        }
    }

    return $totals;
}
```

---

# 7. HTML Rendering (View Layer)

Inside `transactions.php`:

### Display transaction rows:

```php
<?php foreach ($transactions as $transaction): ?>
<tr>
    <td><?= format_date($transaction['date']) ?></td>
    <td><?= $transaction['checkNumber'] ?></td>
    <td><?= htmlspecialchars($transaction['description']) ?></td>
    <td>
        <?php if ($transaction['amount'] < 0): ?>
            <span style="color: red;"><?= format_dollar_amount($transaction['amount']) ?></span>
        <?php elseif ($transaction['amount'] > 0): ?>
            <span style="color: green;"><?= format_dollar_amount($transaction['amount']) ?></span>
        <?php else: ?>
            <?= format_dollar_amount($transaction['amount']) ?>
        <?php endif; ?>
    </td>
</tr>
<?php endforeach; ?>
```

### Display totals:

```php
<tfoot>
<tr>
    <td colspan="3">Total Income</td>
    <td><?= format_dollar_amount($totals['totalIncome']) ?></td>
</tr>
<tr>
    <td colspan="3">Total Expense</td>
    <td><?= format_dollar_amount($totals['totalExpense']) ?></td>
</tr>
<tr>
    <td colspan="3">Net Total</td>
    <td><?= format_dollar_amount($totals['netTotal']) ?></td>
</tr>
</tfoot>
```

---

# 8. Formatting Helpers

Create a separate `helpers.php` containing:

## `format_dollar_amount()`

Formats a float as a USD string.

```php
function format_dollar_amount(float $amount): string {
    $isNegative = $amount < 0;
    $amount = abs($amount);

    return ($isNegative ? '-' : '') . '$' . number_format($amount, 2);
}
```

## `format_date()`

Formats dates into `M j, Y` (e.g., Jan 5, 2022).

```php
function format_date(string $date): string {
    return date('M j, Y', strtotime($date));
}
```

Both helpers are required before rendering the view:

```php
require APP_PATH . 'helpers.php';
require VIEWS_PATH . 'transactions.php';
```

---

# 9. Applying Color Coding

Color logic is directly applied in the view:

* Amount < 0 → red
* Amount > 0 → green
* Amount = 0 → default color

This can be refactored to a helper, but repeating three lines is acceptable for clarity.

---

# Summary

The tutorial covers:

* Directory scanning
* CSV file reading
* Data extraction and normalization
* Flexible callback-based parsing
* Totals calculation
* View rendering with formatting helpers
* Color-coded incomes and expenses
* Layer separation: business logic vs. view logic

---