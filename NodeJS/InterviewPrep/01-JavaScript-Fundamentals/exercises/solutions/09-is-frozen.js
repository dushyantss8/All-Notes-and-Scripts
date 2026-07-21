'use strict';
function isPlainFrozen(obj) {
  return Object.isFrozen(obj);
}
const a = Object.freeze({ x: 1 });
const b = { x: 1 };
console.log(isPlainFrozen(a), isPlainFrozen(b));
// Deep freeze requires recursion over own properties — Object.freeze is shallow.
module.exports = { isPlainFrozen };
