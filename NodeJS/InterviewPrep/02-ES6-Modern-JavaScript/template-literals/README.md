# Template Literals

Backtick literals support multiline text and `${expression}` interpolation. Tagged templates receive literal string segments and substitutions separately, enabling safe escaping, localization, or query builders.

```js
const label = `User: ${user.name}\nRole: ${user.role}`;
function html(parts, ...values) { return parts.reduce((out, part, i) => out + part + (values[i] ?? ""), ""); }
```

Never interpolate untrusted values into HTML/SQL without context-aware escaping or parameterization. Tags are not automatic sanitizers.

Interview: explain cooked/raw strings, why tagged-template substitution is not string concatenation, and when a normal formatter is clearer.
