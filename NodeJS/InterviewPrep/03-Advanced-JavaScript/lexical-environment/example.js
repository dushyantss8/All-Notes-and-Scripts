"use strict";

/**
 * Lexical environments: outer chain lookup, block scopes, and shared
 * closed-over bindings between multiple returned functions.
 */

const globalTag = "G";

function outer(a) {
  const mid = "M";

  function middle(b) {
    {
      const blockOnly = "B";
      function inner(c) {
        // Resolves: c (inner) → blockOnly (block) → b (middle) →
        // mid/a (outer) → globalTag (global)
        return [globalTag, a, mid, b, blockOnly, c].join("-");
      }
      return inner;
    }
  }

  return middle;
}

const step = outer("A")("X");
console.log("chain:", step("Z")); // G-A-M-X-B-Z

// Shared environment record: both methods mutate the same `balance` binding.
function createWallet(initial) {
  let balance = initial;
  return {
    credit(amount) {
      if (amount < 0) throw new RangeError("amount must be >= 0");
      balance += amount;
      return balance;
    },
    debit(amount) {
      if (amount < 0) throw new RangeError("amount must be >= 0");
      if (amount > balance) throw new RangeError("insufficient funds");
      balance -= amount;
      return balance;
    },
    snapshot() {
      return balance;
    },
  };
}

const wallet = createWallet(50);
wallet.credit(20);
wallet.debit(10);
console.log("shared binding:", wallet.snapshot()); // 60

// Per-iteration environments with `let`
const makers = [];
for (let i = 0; i < 3; i += 1) {
  makers.push(() => i);
}
console.log(
  "let loop envs:",
  makers.map((fn) => fn())
); // [0, 1, 2]

module.exports = { outer, createWallet };
