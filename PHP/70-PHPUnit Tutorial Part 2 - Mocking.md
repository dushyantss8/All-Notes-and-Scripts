# Unit Testing with Dependencies in PHPUnit

## Test Doubles, Mocking, Stubbing, and Dependency Injection

---

## 1. Problem Overview: Unit Tests with Dependencies

In unit testing, the goal is to test a class or method **in isolation**.
However, real-world classes often depend on other services such as:

* Databases
* External APIs
* Payment gateways
* Email/SMS services

Calling real services during tests leads to:

* Slow tests (network latency, delays)
* Flaky tests (random failures, API downtime)
* Side effects (sending real emails or charging payments)

**Solution:** Replace real dependencies with **test doubles** (mocks/stubs).

---

## 2. Example Scenario: Invoice Processing

We want to test an `InvoiceService` that:

1. Calculates sales tax
2. Charges a payment gateway
3. Sends a receipt email

### Original `InvoiceService` (Problematic Design)

```php
<?php

declare(strict_types=1);

class InvoiceService
{
    public function process(array $customer, float $amount): bool
    {
        $salesTaxService = new SalesTaxService();
        $gatewayService  = new PaymentGatewayService();
        $emailService    = new EmailService();

        $tax = $salesTaxService->calculate($amount, $customer);

        $charged = $gatewayService->charge($customer, $amount, $tax);

        if (! $charged) {
            return false;
        }

        $emailService->send($customer, 'receipt');

        return true;
    }
}
```

### Issues with This Design

* Dependencies are **hard-coded**
* Tests call real services
* Execution is slow
* Results are inconsistent

---

## 3. Dependency Classes (Simulated API Calls)

```php
class SalesTaxService
{
    public function calculate(float $amount, array $customer): float
    {
        sleep(1);
        return $amount * 0.1;
    }
}
```

```php
class PaymentGatewayService
{
    public function charge(array $customer, float $amount, float $tax): bool
    {
        sleep(1);
        return (bool) random_int(0, 1);
    }
}
```

```php
class EmailService
{
    public function send(array $customer, string $template): void
    {
        sleep(1);
    }
}
```

Each dependency adds delay and unpredictability.

---

## 4. Initial Unit Test (Fails and Is Slow)

```php
public function test_it_processes_invoice(): void
{
    $invoiceService = new InvoiceService();

    $result = $invoiceService->process(
        ['name' => 'Geo'],
        150
    );

    $this->assertTrue($result);
}
```

### Problems

* Takes ~3 seconds
* Sometimes passes, sometimes fails
* Calls real implementations

---

## 5. Introducing Test Doubles (Mocks)

PHPUnit allows creating **mock objects** that replace real dependencies.

```php
$salesTaxServiceMock = $this->createMock(SalesTaxService::class);
$gatewayServiceMock  = $this->createMock(PaymentGatewayService::class);
$emailServiceMock    = $this->createMock(EmailService::class);
```

### Default Behavior of Mocks

* Methods return `null`
* If return types are declared, `null` is cast:

  * `float` → `0.0`
  * `bool` → `false`

---

## 6. Why Mocks Still Don’t Work Yet

Even after creating mocks, the test still calls real services because:

* Dependencies are created **inside the method**
* Mocks are never injected

---

## 7. Refactor Using Dependency Injection (Critical Step)

### Refactored `InvoiceService`

```php
<?php

declare(strict_types=1);

class InvoiceService
{
    public function __construct(
        protected SalesTaxService $salesTaxService,
        protected PaymentGatewayService $gatewayService,
        protected EmailService $emailService
    ) {}

    public function process(array $customer, float $amount): bool
    {
        $tax = $this->salesTaxService->calculate($amount, $customer);

        $charged = $this->gatewayService->charge($customer, $amount, $tax);

        if (! $charged) {
            return false;
        }

        $this->emailService->send($customer, 'receipt');

        return true;
    }
}
```

### Benefits

* No hard-coded dependencies
* Easy to inject mocks
* Testable in isolation

---

## 8. Testing Successful Invoice Processing (Stubbing)

### Test: Invoice Is Processed Successfully

```php
public function test_it_processes_invoice(): void
{
    $salesTaxServiceMock = $this->createMock(SalesTaxService::class);
    $gatewayServiceMock  = $this->createMock(PaymentGatewayService::class);
    $emailServiceMock    = $this->createMock(EmailService::class);

    $gatewayServiceMock
        ->method('charge')
        ->willReturn(true);

    $invoiceService = new InvoiceService(
        $salesTaxServiceMock,
        $gatewayServiceMock,
        $emailServiceMock
    );

    $result = $invoiceService->process(
        ['name' => 'Geo'],
        150
    );

    $this->assertTrue($result);
}
```

### Key Concept: **Stubbing**

* We **stub** the `charge()` method
* Force it to return `true`
* Ignore other dependencies

---

## 9. Testing Email Was Sent (Mock Expectations)

Now we want to verify **behavior**, not just return values.

### Test: Email Is Sent When Invoice Is Processed

```php
public function test_it_sends_receipt_email_when_invoice_is_processed(): void
{
    $customer = ['name' => 'Geo'];

    $salesTaxServiceMock = $this->createMock(SalesTaxService::class);
    $gatewayServiceMock  = $this->createMock(PaymentGatewayService::class);
    $emailServiceMock    = $this->createMock(EmailService::class);

    $gatewayServiceMock
        ->method('charge')
        ->willReturn(true);

    $emailServiceMock
        ->expects($this->once())
        ->method('send')
        ->with($customer, 'receipt');

    $invoiceService = new InvoiceService(
        $salesTaxServiceMock,
        $gatewayServiceMock,
        $emailServiceMock
    );

    $result = $invoiceService->process($customer, 150);

    $this->assertTrue($result);
}
```

### Key Concept: **Mock Expectations**

* `expects($this->once())`: Method must be called once
* `with(...)`: Arguments must match exactly
* Test fails if:

  * Method is not called
  * Arguments differ
  * Method is called multiple times

---

## 10. Why Argument Assertions Matter

If the implementation changes during refactoring:

```php
$this->emailService->send(
    ['name' => 'Geo', 'id' => 10],
    'receipt'
);
```

The test **fails immediately**, catching unintended behavior changes.

---

## 11. Key Takeaways

### Core Testing Concepts Covered

* **Test Doubles**: Fake replacements for real objects
* **Stubs**: Force methods to return known values
* **Mocks**: Verify interactions and method calls
* **Dependency Injection**: Essential for testable code

### Best Practices

* Never call real APIs in unit tests
* Inject dependencies instead of instantiating them
* Prefer simple tests over complex mocking setups
* If tests become too complex → refactor the code

---

## 12. Final Insight

Unit testing does more than detect bugs:

* Encourages cleaner architecture
* Enforces loose coupling
* Improves long-term maintainability

**If code is hard to test, it is usually a design problem—not a testing problem.**

---