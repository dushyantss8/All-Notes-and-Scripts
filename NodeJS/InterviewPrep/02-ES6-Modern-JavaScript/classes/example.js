// Run: node example.js
class Account {
  #balance = 0; // Accessible only from this class body.

  constructor(owner) {
    this.owner = owner;
  }

  deposit(amount) {
    if (amount <= 0) throw new RangeError("Amount must be positive");
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }
}

class SavingsAccount extends Account {
  addInterest(rate) {
    this.deposit(this.balance * rate);
  }
}

const account = new SavingsAccount("Ada");
account.deposit(100);
account.addInterest(0.1);
console.log(`${account.owner}: ${account.balance}`); // Ada: 110
console.log(account instanceof Account); // true
