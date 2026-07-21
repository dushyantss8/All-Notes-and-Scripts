// Run: node example.js
// This built-in ESM module needs no separate local dependency.
async function inspectPath() {
  // import() resolves to a module namespace object.
  const path = await import("node:path");
  console.log(path.basename("/notes/example.js")); // example.js
  console.log(typeof path.join); // function
}

inspectPath().catch((error) => {
  console.error("Could not load module:", error.message);
});
