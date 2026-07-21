"use strict";

/**
 * Curries a fixed-arity function while preserving its receiver on final call.
 */
function curry(fn, arity = fn.length) {
  if (typeof fn !== "function" || !Number.isInteger(arity) || arity < 0) {
    throw new TypeError("Expected a function and non-negative arity");
  }
  function collect(collected) {
    return function curried(...next) {
      const all = collected.concat(next);
      return all.length >= arity ? fn.apply(this, all) : collect(all);
    };
  }
  return collect([]);
}

const volume = curry((length, width, height) => length * width * height);
console.log(volume(2)(3)(4)); // 24
module.exports = { curry };
