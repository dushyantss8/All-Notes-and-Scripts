# Currying

Currying transforms `f(a, b, c)` into `f(a)(b)(c)`. It supports partial configuration and reusable specialized functions, such as `withTax(rate)` or `fetchFrom(baseUrl)`.

The `length` property counts parameters before the first default/rest parameter, so production utilities often accept an explicit arity. The example handles grouped calls (`f(1, 2)(3)`) and validates its contract.

## Distinguish

Partial application pre-fills some arguments but may still accept several later. Currying always returns unary stages conceptually.

## Pitfalls and interview checks

- Currying variadic functions needs a termination signal; arity alone is insufficient.
- Preserve `this` only if the API needs method usage.
- Explain how default parameters change `fn.length`.
- Implement a placeholder-aware curry only if the API truly needs it.
