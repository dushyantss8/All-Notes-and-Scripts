'use strict';
// Expected output:
// 1
// 2
// 1
let x = 1;
function f() {
  console.log(x); // 1 (outer)
  if (true) {
    let x = 2;
    console.log(x); // 2 (shadow)
  }
  console.log(x); // 1 (outer)
}
f();
