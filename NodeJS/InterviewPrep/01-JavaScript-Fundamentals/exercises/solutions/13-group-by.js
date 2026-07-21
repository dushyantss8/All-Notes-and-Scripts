'use strict';
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}
console.log(groupBy(['one', 'two', 'three'], (s) => s.length));
module.exports = { groupBy };
