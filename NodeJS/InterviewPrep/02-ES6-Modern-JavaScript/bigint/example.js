// Run: node example.js
const unsafe = 9_007_199_254_740_993;
const exact = 9_007_199_254_740_993n;

// Numbers lose precision beyond MAX_SAFE_INTEGER; BigInts do not.
console.log(unsafe === unsafe + 1); // true
console.log(exact === exact + 1n); // false

// BigInt arithmetic requires BigInt operands.
const bytes = 1_000_000_000_000_000_000n;
console.log(bytes * 2n); // 2000000000000000000n
console.log(7n / 2n); // 3n

// Convert only after checking that a Number can represent the result safely.
const small = 42n;
console.log(Number(small)); // 42
