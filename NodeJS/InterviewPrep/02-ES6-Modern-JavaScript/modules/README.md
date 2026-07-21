# ES Modules

ESM uses static `import`/`export` declarations. Imports are read-only live bindings, so changes to an exported `let` are observed by importers.

```js
// math.js
export const add = (a, b) => a + b;
export default class Calculator {}
// consumer.mjs
import Calculator, { add } from "./math.js";
```

Static structure enables tooling and tree shaking. Node resolves ESM using `.mjs`, `"type": "module"`, or explicit configuration. Avoid circular dependencies; values may be uninitialized during cycle evaluation.

Interview: ESM versus CommonJS, default exports, live bindings, and module caching.
