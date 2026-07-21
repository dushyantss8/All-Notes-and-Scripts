// Run: node example.js
const delay = (value, ms) => new Promise((resolve) => setTimeout(resolve, ms, value));

async function main() {
  // await unwraps a fulfilled promise inside this function.
  const greeting = await delay("Hello, async/await!", 10);
  console.log(greeting);

  // Start independent work together, then await both results.
  const first = delay(2, 5);
  const second = delay(3, 5);
  const [a, b] = await Promise.all([first, second]);
  console.log(a + b); // 5

  try {
    await Promise.reject(new Error("network unavailable"));
  } catch (error) {
    console.log(`Recovered: ${error.message}`);
  }
}

main().catch(console.error);
