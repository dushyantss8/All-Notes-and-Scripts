// Run: node example.js
const settings = new Proxy({ theme: "dark" }, {
  get(target, key, receiver) {
    // Reflect forwards the normal property lookup correctly.
    if (!Reflect.has(target, key)) return `Missing setting: ${String(key)}`;
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    if (key === "theme" && !["dark", "light"].includes(value)) {
      throw new RangeError("theme must be dark or light");
    }
    return Reflect.set(target, key, value, receiver);
  }
});

console.log(settings.theme); // dark
console.log(settings.language); // Missing setting: language
settings.theme = "light";
console.log(settings.theme); // light
