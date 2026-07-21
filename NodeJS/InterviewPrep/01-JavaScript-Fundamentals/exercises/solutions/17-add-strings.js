'use strict';
function addStrings(num1, num2) {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const out = [];
  while (i >= 0 || j >= 0 || carry) {
    const d1 = i >= 0 ? Number(num1[i]) : 0;
    const d2 = j >= 0 ? Number(num2[j]) : 0;
    const sum = d1 + d2 + carry;
    out.push(String(sum % 10));
    carry = Math.floor(sum / 10);
    i -= 1;
    j -= 1;
  }
  return out.reverse().join('');
}
console.log(addStrings('9007199254740993', '1'));
module.exports = { addStrings };
