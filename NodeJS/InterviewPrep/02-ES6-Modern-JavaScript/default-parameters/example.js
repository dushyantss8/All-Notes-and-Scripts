// Run: node example.js
function greet(name = "guest", punctuation = "!") {
  return `Hello, ${name}${punctuation}`;
}

console.log(greet()); // Hello, guest!
console.log(greet(undefined, "?")); // Hello, guest?
console.log(greet(null)); // Hello, null! (null is not undefined)

// The array is created anew for every call.
function addItem(item, items = []) {
  items.push(item);
  return items;
}

console.log(addItem("first")); // [ 'first' ]
console.log(addItem("second")); // [ 'second' ]
