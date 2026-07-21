/**
 * Leak-pattern demos (bounded — safe to run)
 * Run: node memory-management/example-leak-patterns.js
 */
'use strict';

// 1) Unbounded cache pattern (we cap it here)
function createBadCache(max = 5) {
  const cache = new Map();
  return {
    get(id) {
      if (!cache.has(id)) {
        if (cache.size >= max) {
          const first = cache.keys().next().value;
          cache.delete(first);
        }
        cache.set(id, { id, payload: Buffer.alloc(100) });
      }
      return cache.get(id);
    },
    size() {
      return cache.size;
    },
  };
}

const cache = createBadCache(5);
for (let i = 0; i < 20; i++) cache.get(i);
console.log('cache size capped at', cache.size());

// 2) Closure retaining large buffer
function createHandler() {
  const huge = Buffer.alloc(1_000_000);
  return function onEvent(type) {
    if (type === 'ping') return 'pong';
    return huge.length;
  };
}
const handler = createHandler();
console.log(handler('ping'), handler('size'));

// 3) Timer cleanup
let ticks = 0;
const id = setInterval(() => {
  ticks += 1;
  if (ticks >= 3) {
    clearInterval(id);
    console.log('interval cleared after', ticks);
  }
}, 10);
