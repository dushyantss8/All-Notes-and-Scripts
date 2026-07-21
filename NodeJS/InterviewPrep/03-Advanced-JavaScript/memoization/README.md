# Memoization

Memoization caches a pure function’s result by its inputs. It is useful for deterministic expensive calculations, selectors, parsers, and recursive dynamic programming.

The included utility uses `Map`, checks `cache.has` so cached `undefined` is valid, exposes controlled clearing, and allows a key resolver. Never use `JSON.stringify` as a universal cache key: circular data fails, property ordering and identity semantics can be wrong, and key collisions may matter.

## Best practices

- Memoize only referentially transparent work, or define invalidation.
- Bound cache size/TTL in long-lived processes.
- Use `WeakMap` for object-identity keys when entries should not retain keys.
- Cache rejected promises only when retry semantics explicitly allow it.

## Interview checks

1. Memoization versus caching?
2. How do you avoid leaks?
3. Why must `has` be used instead of truthiness?
