'use strict';
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === [...cleaned].reverse().join('');
}
console.log(isPalindrome('A man, a plan, a canal: Panama'));
console.log(isPalindrome('hello'));
module.exports = { isPalindrome };
