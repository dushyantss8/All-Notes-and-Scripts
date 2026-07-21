'use strict';
function compose(...fns) {
  return function (value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}
const add1 = (n) => n + 1;
const double = (n) => n * 2;
const square = (n) => n * n;
console.log(compose(square, double, add1)(3)); // ((3+1)*2)^2 = 64
module.exports = { compose };
