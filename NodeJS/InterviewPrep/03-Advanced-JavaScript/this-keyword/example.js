"use strict";

/**
 * `this` binding rules: method call, free call, bind, new, and arrows.
 */

const account = {
  id: "A-1",
  balance: 100,
  deposit(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new TypeError("amount must be a positive number");
    }
    this.balance += amount;
    return this.balance;
  },
};

console.log("method this:", account.deposit(20)); // 120

const detached = account.deposit;
try {
  detached(5);
} catch (error) {
  console.log("free call:", error.message);
}

const depositIntoAccount = account.deposit.bind(account);
console.log("bound call:", depositIntoAccount(15)); // 135

function Person(name) {
  this.name = name;
}
const p = new Person("Ada");
console.log("new this:", p.name);

const team = {
  name: "Platform",
  members: ["A", "B"],
  rosterWrong() {
    return this.members.map(function (m) {
      // nested function: this is undefined (strict)
      return `${this?.name}:${m}`;
    });
  },
  rosterRight() {
    return this.members.map((m) => `${this.name}:${m}`);
  },
};

console.log("nested fn:", team.rosterWrong());
console.log("arrow cb:", team.rosterRight());

class Counter {
  constructor() {
    this.n = 0;
  }
  inc() {
    this.n += 1;
    return this.n;
  }
  // stable callback without manual bind in consumer
  incBound = () => {
    this.n += 1;
    return this.n;
  };
}

const counter = new Counter();
const { inc, incBound } = counter;
try {
  inc();
} catch (error) {
  console.log("class method detached:", error.message);
}
console.log("arrow field:", incBound(), incBound());

module.exports = { account, Person, Counter };
