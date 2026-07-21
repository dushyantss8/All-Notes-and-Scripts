"use strict";

/**
 * Memoizes primitive argument lists. Use a resolver for object inputs or
 * a WeakMap trie when identity-sensitive object caching is necessary.
 */
function memoize(fn, resolver = (...args) => JSON.stringify(args)) {
  if (typeof fn !== "function" || typeof resolver !== "function") throw new TypeError("Expected functions");
  const cache = new Map();
  function memoized(...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  }
  memoized.clear = () => cache.clear();
  memoized.cache = cache;
  return memoized;
}

const slowSquare = memoize(value => value * value);
console.log(slowSquare(9), slowSquare(9));
module.exports = { memoize };
