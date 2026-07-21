'use strict';
function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item));
    else out.push(item);
  }
  return out;
}
console.log(flatten([1, [2, [3, [4]], 5]]));
console.log([1, [2, [3]]].flat(Infinity));
module.exports = { flatten };
