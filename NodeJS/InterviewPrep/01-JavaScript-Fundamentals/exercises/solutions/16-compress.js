'use strict';
function compress(str) {
  if (!str) return '';
  let out = '';
  let count = 1;
  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) count += 1;
    else {
      out += str[i - 1] + String(count);
      count = 1;
    }
  }
  return out;
}
console.log(compress('aaabbc')); // a3b2c1
module.exports = { compress };
