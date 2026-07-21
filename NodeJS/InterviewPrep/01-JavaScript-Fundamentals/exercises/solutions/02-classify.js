'use strict';
function classify(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}
console.log(classify(null));
console.log(classify([]));
console.log(classify(() => {}));
console.log(classify(1));
module.exports = { classify };
