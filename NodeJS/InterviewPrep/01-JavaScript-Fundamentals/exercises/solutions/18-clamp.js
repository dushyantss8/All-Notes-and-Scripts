'use strict';
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
console.log(clamp(120, 0, 100), clamp(-5, 0, 100), clamp(50, 0, 100));
module.exports = { clamp };
