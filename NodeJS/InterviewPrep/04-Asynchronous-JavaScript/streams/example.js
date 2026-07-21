"use strict";

const { Readable, Transform, Writable } = require("node:stream");
const { pipeline } = require("node:stream/promises");

const source = Readable.from(["hello\n", "streams\n"]);
const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
const output = new Writable({ write(chunk, encoding, callback) { process.stdout.write(chunk); callback(); } });

pipeline(source, uppercase, output).catch(error => console.error("Pipeline failed:", error));
