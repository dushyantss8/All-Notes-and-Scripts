# Prototypes

> Objects inherit via an internal `[[Prototype]]` link. Property lookup walks the chain until a hit or `null`. Classes are syntax over the same model.

**Difficulty:** Intermediate → Advanced  
**Related:** [this Keyword](../this-keyword/) · [Bind / Call / Apply](../bind-call-apply/) · [Composition](../composition/)

---

## Explanation

Almost every object has a prototype. Own properties shadow inherited ones.

```mermaid
flowchart BT
  obj["obj = { y: 2 }"] -->|[[Prototype]]| proto["proto = { x: 1, hello() }"]
  proto -->|[[Prototype]]| objProto[Object.prototype]
  objProto -->|[[Prototype]]| Null[null]
```

```js
const proto = {
  greet() {
    return `hi ${this.name}`;
  },
};
const user = Object.create(proto);
user.name = "Ada";
user.greet(); // "hi Ada" — method found on proto, this = user
```

## Key APIs

| API | Purpose |
|-----|---------|
| `Object.create(proto)` | Object with given `[[Prototype]]` |
| `Object.getPrototypeOf(o)` | Read link |
| `Object.setPrototypeOf(o, p)` | Change link (slow; avoid in hot paths) |
| `obj.__proto__` | Legacy accessor; prefer get/setPrototypeOf |
| `Constructor.prototype` | Prototype for `new Constructor()` instances |
| `instanceof` / `isPrototypeOf` | Chain checks |

## Constructor pattern vs `class`

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function speak() {
  return `${this.name} makes a noise`;
};

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

const d = new Dog("Rex");
d.speak(); // Rex barks
Object.getPrototypeOf(d) === Dog.prototype; // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
```

```mermaid
flowchart BT
  d[d instance] --> DogProto[Dog.prototype]
  DogProto --> AnimalProto[Animal.prototype]
  AnimalProto --> ObjProto[Object.prototype]
  DogCtor[Dog] -->|prototype| DogProto
  AnimalCtor[Animal] -->|prototype| AnimalProto
  DogCtor -->|[[Prototype]]| AnimalCtor
```

## Own vs inherited

```js
const o = Object.create({ inherited: 1 });
o.own = 2;
o.hasOwnProperty("own"); // true
Object.hasOwn(o, "inherited"); // false (ES2022)
"inherited" in o; // true — walks the chain
```

## Property lookup algorithm (simplified)

1. If own property exists → use it (including accessors).
2. Else follow `[[Prototype]]` and repeat.
3. If `null` → `undefined` for data get; assignment may create an own property (unless inherited setter).

## Common mistakes

- Putting per-instance mutable state on `.prototype` (shared across instances).
- Using `__proto__` in modern code reviews / libraries.
- Expecting `Object.keys` / `JSON.stringify` to include inherited enumerable props (`keys` does not).
- Breaking the chain with `Object.create(null)` then calling methods that assume `Object.prototype`.
- Mutating built-in prototypes in app code (`Array.prototype.x = …`).

## Best practices

- Prefer `class` or factory + composition over deep manual prototype graphs.
- Share methods on the prototype; keep instance data on `this`.
- Use `Object.create(null)` for pure dictionaries when prototype pollution is a risk.
- Prefer composition ([Composition](../composition/)) when inheritance hierarchies get deep.

## Interview questions

1. What is `[[Prototype]]` and how does lookup work?
2. Difference between `__proto__` and `prototype`?
3. How does `new` wire the prototype link?
4. How does `class extends` affect both instance and constructor chains?
5. Why is mutating `Object.prototype` dangerous?

## Run the example

```bash
node example.js
```
