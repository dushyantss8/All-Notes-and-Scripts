'use strict';
function chunk(arr, size) {
  if (size <= 0) throw new RangeError('size must be > 0');
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
console.log(chunk([1, 2, 3, 4, 5], 2));
module.exports = { chunk };
