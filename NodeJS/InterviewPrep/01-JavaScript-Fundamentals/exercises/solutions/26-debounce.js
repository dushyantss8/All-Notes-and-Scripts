'use strict';
function debounce(fn, waitMs) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), waitMs);
  };
}
const log = debounce((msg) => console.log(msg), 30);
log('a');
log('b');
log('c'); // only 'c' after wait
setTimeout(() => {}, 50);
module.exports = { debounce };
