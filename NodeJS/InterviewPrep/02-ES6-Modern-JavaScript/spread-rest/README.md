# Spread and Rest

Spread expands an iterable in calls/arrays or enumerable own properties in object literals. Rest collects remaining function arguments or pattern fields.

```js
const merged = { ...defaults, ...userOptions }; // later properties win
const copy = [...items]; // shallow copy
function average(...numbers) { return numbers.reduce((a, n) => a + n, 0) / numbers.length; }
```

Object spread copies values, not descriptors or prototype, and invokes getters. Both array/object copies are shallow. Avoid huge spread argument lists and choose merge precedence consciously.

Interview: spread versus `Object.assign`, rest parameter versus `arguments`, and why shallow copies can still share nested state.
