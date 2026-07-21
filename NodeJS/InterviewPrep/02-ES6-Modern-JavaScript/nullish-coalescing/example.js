// Run: node example.js
function configure(options) {
  // Keep valid falsy values such as 0 and false.
  const retries = options.retries ?? 3;
  const verbose = options.verbose ?? true;
  return { retries, verbose };
}

console.log(configure({ retries: 0, verbose: false })); // { retries: 0, verbose: false }
console.log(configure({})); // { retries: 3, verbose: true }

let timeout;
timeout ??= 5_000; // Assign only because timeout is undefined.
console.log(timeout); // 5000
