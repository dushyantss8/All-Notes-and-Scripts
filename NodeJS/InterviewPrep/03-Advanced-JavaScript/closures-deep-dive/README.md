# Closures Deep Dive

> A closure is a function plus the lexical environments it references. Production uses: private state, partial configuration, callbacks, and module-like encapsulation.

**Difficulty:** Intermediate → Advanced  
**Related:** [Lexical Environment](../lexical-environment/) · [Execution Context](../execution-context/) · [Currying](../currying/) · [Memoization](../memoization/)

---

## Explanation

Every function closes over its lexical environment. The interesting case is when the function **outlives** the stack frame that created those bindings—the environment stays alive on the heap.

```mermaid
flowchart LR
  subgraph heap [Heap]
    Env["env: count = 0"]
    Fn[increment function]
  end
  Fn -->|[[Environment]]| Env
```

```js
function makeCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const c = makeCounter();
c(); // 1
c(); // 2 — same `count` binding
```

## Mental model

1. Defining a function captures a reference to the current lexical environment.
2. Returning / passing that function keeps the environment reachable.
3. Multiple functions from the same scope **share** the same bindings.
4. GC reclaims the environment only when no closed-over function (or other root) remains.

## Classic patterns

**Private API**

```js
function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    getState: () => state,
    setState(next) {
      state = typeof next === "function" ? next(state) : next;
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
```

**Partial configuration**

```js
const withBaseUrl = (base) => (path) => `${base}${path}`;
const api = withBaseUrl("https://api.example.com");
api("/users");
```

**Once / memo helpers** — see [Memoization](../memoization/) and exercises.

## Loop pitfall (`var` vs `let`)

```js
// Broken with var — one binding shared
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

// Fixed with let — per-iteration environment
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
```

## Memory

Closures retain **everything** in the environment that may still be referenced (engines can optimize unused bindings, but do not rely on that for large objects). Detach listeners and drop references when done.

## Common mistakes

- Expecting a copy of variables instead of a live binding.
- Creating functions inside hot loops without need (allocation + accidental capture).
- Accidental capture of DOM nodes / large arrays → retained memory.
- Using `var` in async loops.

## Best practices

- Close over the smallest state you need; pass the rest as arguments.
- Return an unsubscribe / `dispose` from subscription factories.
- Prefer modules for file-level privacy when a closure factory adds no value.
- Document mutability of closed-over state for API consumers.

## Interview questions

1. Define a closure in one sentence.
2. Why do `var` loop callbacks see the final index?
3. Do two functions from one factory share state? Prove it.
4. How can closures cause memory leaks?
5. Implement `once(fn)` with a closure.

## Run the example

```bash
node example.js
```
