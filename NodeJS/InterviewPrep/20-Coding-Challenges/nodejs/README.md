# Node.js Challenge Bank

150 backend-oriented challenges covering the runtime, HTTP/APIs, streams, error handling, concurrency, and operational thinking. **Every challenge includes a matching reference solution.**

## Files

| Difficulty | File | Emphasis |
|---|---|---|
| Easy | [easy.md](easy.md) | Core modules, promises, basic HTTP/handlers |
| Medium | [medium.md](medium.md) | Streams, concurrency limits, caching, retries |
| Hard | [hard.md](hard.md) | Deeper design-in-code, failure modes, performance |

## Format

Each problem uses:

```text
## N. Title
**Difficulty:** ...
**Question:** ... (with behavior / examples)
**Hints:** ...
**Solution:** (runnable Node.js)
**Time Complexity:** ...
**Space Complexity:** ...
```

## How to use

1. Treat prompts like mini take-homes: clarify requirements before coding.
2. Always consider: timeouts, retries, idempotency, and what happens on crash mid-operation.
3. Run code locally when possible (`node` scripts); add a couple of assertions.
4. Compare to references for structure (error handling, resource cleanup), not only the happy path.
5. Pair with conceptual notes in `05-NodeJS-Core` / `06-Express` if a topic feels thin.

## Tips for Node interviews

- Distinguish **blocking** vs async APIs; never sync `fs` on a hot path without calling it out.
- Explain the event loop at a practical level: JS → microtasks → timers → I/O / poll.
- Always propagate or handle errors; unhandled rejections are a red flag.
- Streams: when to use them (large files, proxies) vs buffering everything.
- Mention graceful shutdown: stop taking traffic, drain connections, flush logs.

## Related

- Parent index: [Coding Challenges](../README.md)
- Concepts: Interview Questions → [Node.js](../../21-Interview-Questions/nodejs/README.md)
