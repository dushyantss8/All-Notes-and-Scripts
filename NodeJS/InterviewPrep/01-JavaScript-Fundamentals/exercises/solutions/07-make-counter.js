'use strict';
function makeCounter(start = 0) {
  let count = start;
  return {
    inc() {
      count += 1;
      return count;
    },
    dec() {
      count -= 1;
      return count;
    },
    value() {
      return count;
    },
  };
}
const c = makeCounter(5);
console.log(c.inc(), c.dec(), c.value());
module.exports = { makeCounter };
