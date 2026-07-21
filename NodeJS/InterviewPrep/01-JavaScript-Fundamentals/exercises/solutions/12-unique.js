'use strict';
function unique(arr) {
  return [...new Set(arr)];
}
console.log(unique([1, 2, 2, 3, 1]));
module.exports = { unique };
