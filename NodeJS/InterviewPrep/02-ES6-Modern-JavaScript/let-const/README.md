# `let` and `const`

`let` creates a reassignable block-scoped binding; `const` creates a non-reassignable block-scoped binding. Prefer `const`, then use `let` only when reassignment is required.

## Internal working

During creation of a lexical environment, JavaScript records `let` and `const` bindings but does not initialize them. Access before the declaration throws a `ReferenceError`: the temporal dead zone (TDZ). This differs from `var`, which is initialized to `undefined` and function-scoped.

```mermaid
sequenceDiagram
  participant E as Lexical environment
  E->>E: Create let/const bindings (uninitialized)
  Note over E: TDZ until declaration executes
  E->>E: Initialize declaration
  E->>E: Permit reads; const forbids reassignment
```

## Syntax and use cases

```js
const config = { retries: 3 }; // binding cannot change
config.retries = 4;            // object contents can change
let attempts = 0;
attempts += 1;

for (let index = 0; index < 3; index += 1) {
  // each iteration gets its own index binding
}
```

Use `const` for imports, configuration references, and values that will not be reassigned. Use `let` for counters and accumulators. Do not use `var` in new code unless maintaining legacy behavior deliberately.

## Common mistakes and best practices

- `const` is not deep immutability. Use `Object.freeze`, immutable updates, or a library when needed.
- Do not rely on TDZ errors as validation.
- Declare close to first use; avoid shadowing outer bindings.
- Avoid `let` when only object properties change—the binding itself is unchanged.

## Interview checks

1. Explain TDZ and why `typeof undeclaredName` differs from `typeof tdzName`.
2. Why does `let` fix the classic `var` loop callback problem?
3. Can a `const` object be mutated? How would you prevent it?

Run [example.js](example.js).
