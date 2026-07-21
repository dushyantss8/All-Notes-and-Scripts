# Enums

Prefer string literal unions for simple application values. `enum` emits runtime JavaScript unless declared `const enum`; this can affect bundles and tooling.

## Backend interview guidance
- Treat external input as `unknown`; validate it at runtime before narrowing.
- Keep DTOs separate from persistence models and avoid `any`, which disables safety.
- Enable `strict`, especially `strictNullChecks` and `noUncheckedIndexedAccess`, for service code.

## Example
```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function mapResult<T, U>(value: Result<T>, fn: (item: T) => U): Result<U> {
  return value.ok ? { ok: true, data: fn(value.data) } : value;
}
```
