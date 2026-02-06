# **PHP Expressions —**

## **1. Introduction to Expressions in PHP**

After covering PHP fundamentals (syntax, variables, constants, data types, type casting, and embedding PHP in HTML), the next major concept is *expressions*. Expressions form the core of PHP programming, as most PHP code is built around evaluating expressions to produce values.

PHP is an **expression-oriented language**, meaning nearly everything in PHP returns a value and can be treated as an expression.

---

## **2. What Is an Expression?**

An **expression** is anything that has a value or evaluates to a value.

### **Examples of Simple Expressions**

1. **Literal Values**

   ```php
   5
   "Hello"
   true
   ```

   These values represent themselves and are expressions.

2. **Variables**

   ```php
   $x
   ```

   A variable evaluates to the value it holds.

3. **Constants**

   ```php
   PI
   ```

   Also evaluates to the value associated with the constant.

---

## **3. Expressions in Assignments**

Any value appearing on the **right-hand side** of the assignment operator (`=`) is treated as an expression.

### **Example 1: Literal Value as Expression**

```php
$x = 5;   // 5 is an expression
```

### **Example 2: Variable as Expression**

```php
$y = $x;  // $x evaluates to 5 → expression
```

### **Example 3: Chained Assignment**

```php
$z = $x = $y;
// ($x = $y) is an expression, evaluates to the value of $y
```

---

## **4. Expressions in Comparisons**

Any comparison operation returns a boolean value, making it an expression.

### **Example: Comparison Expression**

```php
$z = ($x == $y);   // ($x == $y) evaluates to true or false
```

This expression results in a boolean value assigned to `$z`.

---

## **5. Function Calls as Expressions**

Functions normally return values, so a function call qualifies as an expression.

### **Example**

```php
$z = sum($x, $y);
```

`sum($x, $y)` is an expression that returns a value.

---

## **6. Expressions Inside Control Structures**

Expressions are integral to control flow, especially conditions in `if`, `while`, `for`, and similar structures.

### **Example: Expression in an If Statement**

```php
if ($x < 5) {
    echo "Hello";
}
```

The condition `$x < 5` is an expression that evaluates to `true` or `false`.

---

## **7. Upcoming Topics Related to Expressions**

To build more advanced and useful expressions, the following topics will be covered next:

### **1. Operators**

You have already encountered some operators:

* Assignment operator (`=`)
* Comparison operators (`==`, `<`, `>`, etc.)

The next lessons will cover:

* Types of operators
* Operator precedence (order of evaluation)
* How precedence affects expression outcomes

### **2. Control Structures**

You will learn to combine expressions with:

* Loops
* Conditionals

### **3. Functions**

Using functions to build complex, reusable expressions.

Understanding operators and their precedence is critical, especially when multiple operators appear in the same expression, as incorrect assumptions can lead to unexpected results.

---

## **Conclusion**

Expressions are the foundation of PHP programming. Anything that produces a value—variables, literals, operators, function calls, or conditions—is an expression. Mastering expressions and operator behavior will enable you to construct more complex and effective PHP scripts.
