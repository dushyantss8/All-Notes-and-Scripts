# Generators and Iterators

An iterable can produce an iterator through `[Symbol.iterator]()`. An iterator has `next()`, returning `{ value, done }`. A generator function (`function*`) creates an iterator that can pause at `yield`.

## Syntax and internal working

```js
function* ids() {
  let id = 1;
  while (true) yield id++;
}
```

Generator execution begins only when `next()` is called. Each `yield` returns control and state is retained until the next call. `for...of`, spread, `Array.from`, and destructuring consume iterables.

## Examples

```js
function* range(start, end) {
  for (let n = start; n <= end; n++) yield n;
}
console.log([...range(2, 4)]); // [2, 3, 4]

const iterator = range(1, 2);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

function* conversation() {
  const name = yield "What is your name?";
  return `Hi ${name}`;
}
const chat = conversation();
console.log(chat.next().value); // What is your name?
console.log(chat.next("Ada").value); // Hi Ada
```

Use generators for lazy sequences, custom traversal, parsers, and controlled data production. Use async generators (`async function*`) for async streams.

## Common mistakes and best practices

- A generator function call returns an iterator; its body has not run yet.
- Iterators are usually one-shot. Materialize with `[...iterable]` only when memory use is acceptable.
- Do not use generators merely for ordinary array mapping; array methods are clearer.
- Ensure finite consumers for infinite generators with `.take`-style logic or an explicit break.

## Interview questions

**Iterable vs iterator?** An iterable can create an iterator; an iterator advances through values via `next()`.

**What does `yield` do?** It emits a value and suspends the generator while preserving local state.

**How does `yield*` differ?** It delegates to another iterable, yielding all of its values.

## References

- [MDN: Iteration protocols](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: function*](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function*)
