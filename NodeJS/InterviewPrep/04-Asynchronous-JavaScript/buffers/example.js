"use strict";

const greeting = Buffer.from("✓ OK", "utf8");
console.log(greeting, greeting.length, greeting.toString("utf8"));

const bytes = Buffer.alloc(4);
bytes.writeUInt32BE(0xdeadbeef);
console.log(bytes.toString("hex")); // deadbeef
