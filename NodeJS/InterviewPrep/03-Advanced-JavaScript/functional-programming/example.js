"use strict";

/**
 * FP building blocks: pure helpers, immutable updates, pipe/compose,
 * and keeping side effects at the boundary.
 */

const pipe =
  (...fns) =>
  (input) =>
    fns.reduce((value, fn) => fn(value), input);

const compose =
  (...fns) =>
  (input) =>
    fns.reduceRight((value, fn) => fn(value), input);

const map = (fn) => (xs) => xs.map(fn);
const filter = (fn) => (xs) => xs.filter(fn);
const reduce = (fn, init) => (xs) => xs.reduce(fn, init);

function setProp(obj, key, value) {
  if (obj === null || typeof obj !== "object") {
    throw new TypeError("obj must be an object");
  }
  return { ...obj, [key]: value };
}

function push(arr, item) {
  if (!Array.isArray(arr)) throw new TypeError("arr must be an array");
  return [...arr, item];
}

const normalizeEmail = (email) => String(email).trim().toLowerCase();
const isCorporate = (email) => email.endsWith("@example.com");
const domainOf = (email) => email.split("@")[1] ?? "";

const processEmails = pipe(
  map(normalizeEmail),
  filter(isCorporate),
  map(domainOf)
);

const raw = ["  Ada@Example.com ", "bob@other.test", "Eve@Example.com"];
console.log("pipeline:", processEmails(raw));

const user = { id: 1, roles: ["reader"] };
const admin = setProp(user, "roles", push(user.roles, "admin"));
console.log("immutable user:", user);
console.log("updated copy:", admin);

// Side effects isolated
function saveUser(persist, entity) {
  if (typeof persist !== "function") throw new TypeError("persist required");
  const payload = setProp(entity, "savedAt", new Date().toISOString());
  return persist(payload);
}

const fakeDb = [];
saveUser((row) => fakeDb.push(row) && row, admin);
console.log("db rows:", fakeDb.length);

const sum = reduce((a, b) => a + b, 0);
console.log(
  "compose demo:",
  compose(
    (n) => n * 2,
    sum,
    map(Number)
  )(["1", "2", "3"])
); // (1+2+3)*2 = 12

module.exports = { pipe, compose, map, filter, reduce, setProp, push, saveUser };
