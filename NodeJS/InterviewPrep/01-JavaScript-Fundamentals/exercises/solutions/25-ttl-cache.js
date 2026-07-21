'use strict';
function createTtlCache({ max = 100, ttlMs = 1000 } = {}) {
  const store = new Map(); // key -> { value, expiresAt }
  function evictExpired(now = Date.now()) {
    for (const [key, entry] of store) {
      if (entry.expiresAt <= now) store.delete(key);
    }
  }
  return {
    set(key, value) {
      evictExpired();
      if (store.size >= max && !store.has(key)) {
        const oldest = store.keys().next().value;
        store.delete(oldest);
      }
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    get(key) {
      evictExpired();
      const entry = store.get(key);
      return entry ? entry.value : undefined;
    },
    has(key) {
      evictExpired();
      return store.has(key);
    },
    size() {
      evictExpired();
      return store.size;
    },
  };
}
const cache = createTtlCache({ max: 2, ttlMs: 50 });
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
console.log(cache.has('a'), cache.get('b'), cache.size());
module.exports = { createTtlCache };
