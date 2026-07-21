'use strict';
function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) out[key] = obj[key];
  }
  return out;
}
console.log(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']));
module.exports = { pick };
