# The `this` Keyword

> `this` is set by the **call site** (how a function is invoked), except for arrow functions which use lexical `this` from the surrounding scope.

**Difficulty:** Intermediate → Advanced  
**Related:** [Bind / Call / Apply](../bind-call-apply/) · [Execution Context](../execution-context/) · [Prototypes](../prototypes/)

---

## Explanation

For ordinary functions, `this` is **not** bound where the function is defined. Rules of thumb:

| Call pattern | `this` (strict mode) |
|--------------|----------------------|
| `fn()` | `undefined` |
| `obj.fn()` | `obj` |
| `obj.fn.call(x)` / `.apply` / `.bind` | forced receiver |
| `new Fn()` | new instance |
| Arrow `() =>` | lexical (enclosing `this`) |
| DOM handler (browser, non-arrow) | element (often) |
| `class` method as `obj.m()` | `obj` |

```mermaid
flowchart TD
  Call[Function invoked] --> Arrow{Arrow?}
  Arrow -->|yes| Lex[Use lexical this]
  Arrow -->|no| New{new?}
  New -->|yes| Inst[this = new object]
  New -->|no| Bound{bound / call / apply?}
  Bound -->|yes| Forced[this = provided value]
  Bound -->|no| Method{obj.method()?}
  Method -->|yes| Recv[this = obj]
  Method -->|no| Undef[this = undefined in strict]
```

## Method extraction loses the receiver

```js
const user = {
  name: "Ada",
  greet() {
    return this.name;
  },
};

user.greet(); // "Ada"
const g = user.greet;
g(); // TypeError or undefined — receiver lost
```

Fix with `.bind(user)`, wrapping arrow, or calling as a method again.

## Arrows

```js
const timer = {
  count: 0,
  start() {
    setInterval(() => {
      this.count += 1; // this === timer
    }, 1000);
  },
};
```

Do **not** use arrows when you need dynamic `this` (prototype methods that rely on the receiver, or `new`).

## `class` fields and arrows

```js
class Button {
  constructor(label) {
    this.label = label;
  }
  // prototype method — this from call site
  click() {
    return this.label;
  }
  // instance arrow field — lexical this always = instance (if defined as field)
  onClick = () => this.label;
}
```

Arrow instance fields cost per-instance memory; use when you pass methods as callbacks often.

## Common mistakes

- Passing `obj.method` to `addEventListener` / `setTimeout` without binding.
- Using arrow functions for methods that should use dynamic `this`.
- Assuming `this` in a nested `function () {}` is the outer object (it is not).
- Forgetting strict mode differences (`this` is global/`window` in sloppy free calls).

## Best practices

- Prefer arrows for callbacks that should capture surrounding `this`.
- Prefer ordinary/prototype methods when polymorphism via receiver matters.
- Use `.bind` once in constructors or bind at registration sites.
- In React/class legacy code, bind handlers; in modern function components, `this` rarely appears.

## Interview questions

1. What determines `this` for a normal function?
2. Why does extracting a method break `this`?
3. How do arrow functions differ?
4. What is `this` inside a `new` constructor call?
5. How would you fix a detached class method used as a callback?

## Run the example

```bash
node example.js
```
