# Classes

Classes provide declarative syntax for constructor functions and prototypes. They are not a separate inheritance model: instance methods live on `Class.prototype`.

## Syntax and internal working

```js
class Account {
  #balance = 0; // private field
  constructor(owner) { this.owner = owner; }
  deposit(amount) { this.#balance += amount; }
  get balance() { return this.#balance; }
  static type = "account";
}
```

`new Account("Ada")` creates an object whose prototype is `Account.prototype`, then calls the constructor. `extends` links child and parent prototypes; a derived constructor must call `super()` before using `this`.

## Examples

```js
const account = new Account("Ada");
account.deposit(50);
console.log(account.balance); // 50
console.log(account instanceof Account); // true

class SavingsAccount extends Account {
  addInterest(rate) { this.deposit(this.balance * rate); }
}
const savings = new SavingsAccount("Lin");
savings.deposit(100);
savings.addInterest(0.1);
console.log(savings.balance); // 110
```

Use classes for cohesive state plus behavior, domain models, framework components, and custom error types. Prefer composition when a type does not truly satisfy an “is-a” relationship.

## Common mistakes and best practices

- Class bodies are strict mode and class declarations are in the temporal dead zone.
- Do not use arrow fields for prototype methods unless lexical `this` is specifically needed; each instance gets a new function.
- Keep constructors small and validate inputs; avoid calling overridable methods from constructors.
- Private `#fields` are enforced by the language, unlike naming conventions such as `_field`.
- Do not mistake getters for free properties: complex/side-effecting work in getters is surprising.

## Interview questions

**Are JavaScript classes “real” classes?** They are syntax over prototype delegation, with additional semantics such as strict mode and private fields.

**Where are instance methods stored?** On the prototype, so normal methods are shared between instances.

**What does `super()` do?** In a derived constructor it initializes the parent portion of the instance; it is required before accessing `this`.

**Class vs factory function?** Classes express a prototype-based type; factories can close over private state and compose behavior without inheritance.

## References

- [MDN: Classes](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes)
- [MDN: private elements](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Private_elements)
