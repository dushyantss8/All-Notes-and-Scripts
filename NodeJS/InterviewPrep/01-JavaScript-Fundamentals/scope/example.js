/**
 * Scope — runnable examples
 * Run: node scope/example.js
 */
'use strict';

function demo(flag) {
  if (flag) {
    var x = 'var';
    let y = 'let';
    console.log(y);
  }
  console.log(x); // var
}
demo(true);

const theme = 'dark';
function render() {
  function button() {
    console.log(theme);
  }
  button();
}
render();

let id = 'outer';
function run() {
  let id = 'inner';
  console.log(id);
}
run();
console.log(id);

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log('let loop', i), 0);
}
