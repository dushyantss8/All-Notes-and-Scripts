// Run: node example.js
function* range(start, end) {
  for (let value = start; value <= end; value += 1) {
    yield value; // Pause here and provide one value.
  }
}

const iterator = range(2, 4);
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }

// A fresh generator can be consumed by for...of or spread.
console.log([...range(2, 4)]); // [ 2, 3, 4 ]

function* askName() {
  const name = yield "Name?";
  return `Hello, ${name}`;
}

const conversation = askName();
console.log(conversation.next().value); // Name?
console.log(conversation.next("Ada").value); // Hello, Ada
