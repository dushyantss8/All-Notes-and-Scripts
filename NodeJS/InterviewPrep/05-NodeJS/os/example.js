import { setTimeout as delay } from "node:timers/promises";

// Keep asynchronous work bounded and propagate failures.
async function retry(operation, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await operation(); }
    catch (error) {
      if (attempt === attempts) throw error;
      await delay(100 * 2 ** (attempt - 1)); // add jitter in production
    }
  }
}

const result = await retry(async () => "completed safely");
console.log(result);
