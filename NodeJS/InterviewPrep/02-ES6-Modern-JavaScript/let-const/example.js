"use strict";

const user = { name: "Ada" };
user.name = "Grace"; // const protects the binding, not object properties.

for (let index = 0; index < 3; index += 1) {
  setTimeout(() => console.log(`iteration ${index}`), 0);
}

console.log(user);
