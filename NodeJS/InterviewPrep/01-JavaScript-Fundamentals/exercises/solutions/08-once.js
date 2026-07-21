'use strict';
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
const init = once(() => {
  console.log('init');
  return 42;
});
console.log(init(), init());
module.exports = { once };
