'use strict';
function sum(...nums) {
  return nums.reduce((acc, n) => (Number.isFinite(n) ? acc + n : acc), 0);
}
console.log(sum(1, 2, 3));
console.log(sum(1, 'x', 2, NaN));
module.exports = { sum };
