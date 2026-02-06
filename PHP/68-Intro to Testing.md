# Section 3 Overview: Advanced PHP Topics

This section of the course moves beyond procedural and object-oriented PHP into **advanced, production-level concepts**. The focus shifts toward **code quality, maintainability, scalability, and real-world application practices**.

## Topics Covered in Section 3

This section will cover the following advanced PHP topics:

* Automated Testing (Unit & Integration Testing)
* PHPUnit Framework
* Dependency Injection (DI)
* Dependency Injection Containers
* API Fundamentals

  * Making API calls
  * JSON handling
* PHP Reflection and API Generators
* PHP 8+ Features

  * Attributes
* Caching Strategies
* Application Security
* Scheduled Jobs (Cron Jobs)
* Final End-to-End Project

  * Hosting setup
  * Deployment

---

# Introduction to Testing in PHP

## Why Testing Is Important

Testing is a **core best practice** in modern software development. It provides confidence when:

* Adding new features
* Refactoring existing code
* Fixing bugs
* Preventing regressions

### Problems with Manual Testing

* Time-consuming
* Error-prone
* Requires retesting large parts of the application for small changes
* Does not scale well with growing codebases

### Benefits of Automated Testing

* Immediate feedback on code changes
* Prevents bugs from reaching production
* Encourages clean, modular design
* Enables safe refactoring
* Reduces dependency on full manual QA cycles

---

# Types of Software Testing (Overview)

There are many types of testing, including:

* Accessibility Testing
* End-to-End (E2E) Testing
* Functional Testing
* Integration Testing
* Load / Performance Testing
* Regression Testing
* Unit Testing

This course focuses primarily on:

* **Unit Testing**
* **Integration Testing**

---

# Unit Testing

## What Is Unit Testing?

Unit testing validates **small, isolated units of code**, such as:

* Individual functions
* Single methods
* One class at a time

### Key Characteristics

* No database connections
* No real external dependencies
* Uses **mocks** or **stubs**
* Fast to execute
* Easy to debug

### Purpose

To ensure that each unit behaves **exactly as intended in isolation**.

---

## Example: Unit Test in PHP (PHPUnit)

### Class Under Test

```php
<?php

class Calculator
{
    public function add(int $a, int $b): int
    {
        return $a + $b;
    }
}
```

### Unit Test

```php
<?php

use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    public function testAddition()
    {
        $calculator = new Calculator();
        $result = $calculator->add(2, 3);

        $this->assertEquals(5, $result);
    }
}
```

### What This Tests

* The `add()` method
* Independent of any external dependency
* Fast and deterministic

---

# Integration Testing

## What Is Integration Testing?

Integration testing verifies that **multiple components work correctly together**.

### Key Characteristics

* Dependencies may be real
* Can connect to:

  * Databases
  * External services
  * APIs
* Slower than unit tests
* More complex setup

### Purpose

To catch issues that **unit tests cannot**, such as:

* Incorrect wiring of services
* Configuration problems
* Dependency mismatches

---

## Example: Integration Test with Database

### Service Class

```php
<?php

class UserService
{
    public function __construct(private PDO $db) {}

    public function getUserCount(): int
    {
        $stmt = $db->query("SELECT COUNT(*) FROM users");
        return (int) $stmt->fetchColumn();
    }
}
```

### Integration Test

```php
<?php

use PHPUnit\Framework\TestCase;

class UserServiceTest extends TestCase
{
    public function testUserCount()
    {
        $db = new PDO('mysql:host=localhost;dbname=test_db', 'root', '');
        $service = new UserService($db);

        $count = $service->getUserCount();

        $this->assertIsInt($count);
    }
}
```

### What This Tests

* Real database connection
* SQL query execution
* Dependency interaction

---

# Unit Tests vs Integration Tests

| Aspect       | Unit Test      | Integration Test       |
| ------------ | -------------- | ---------------------- |
| Scope        | Single unit    | Multiple units         |
| Dependencies | Mocked         | Real or partial        |
| Speed        | Very fast      | Slower                 |
| Complexity   | Low            | Medium to High         |
| Purpose      | Validate logic | Validate collaboration |

---

# Testing Framework Used: PHPUnit

* Industry-standard testing framework for PHP
* Supports:

  * Assertions
  * Test suites
  * Mocking
  * Code coverage
* Will be covered in detail in upcoming lessons

---

# Test-Driven Development (TDD)

## What Is TDD?

TDD stands for **Test-Driven Development**.

### TDD Workflow

1. Write a failing test
2. Run the test (it fails)
3. Write code to pass the test
4. Refactor code
5. Repeat

### Characteristics

* Tests are written **before** the code
* Encourages clean design
* Can be difficult to apply when requirements change frequently

---

# Behavior-Driven Development (BDD)

## What Is BDD?

BDD stands for **Behavior-Driven Development**.

### Key Differences from TDD

* Focuses on **behavior**, not implementation
* Tests are written in **human-readable language**
* Example behavior:

  > "Given a logged-in user, when they request their profile, then their data should be returned"

### Similarity to TDD

* Tests/behaviors are written before implementation
* Emphasizes expected outcomes

---

# Practical Considerations

* TDD/BDD are powerful but not mandatory
* Real-world projects often evolve rapidly
* Writing tests **after implementation** is still valid
* The critical rule:

  > **Always write meaningful tests, regardless of when they are written**

---

# Key Takeaways

* Automated testing is essential for maintainable PHP applications
* Unit tests validate isolated logic
* Integration tests validate component interaction
* PHPUnit will be the primary testing tool
* TDD and BDD are methodologies, not strict requirements
* Well-tested code enables safe refactoring and faster development

---