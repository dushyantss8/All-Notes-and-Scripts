# Node.js Challenges — Hard

50 hard Node.js problems. Each entry has a matching title, prompt, working solution, and complexity.

## 1. HTTP/2 server push sketch
**Difficulty:** Hard
**Question:** Create an HTTP/2 secure server sketch that responds to `/` and calls `stream.pushStream` for `/app.js` when supported.

Example: h2 push asset.
**Hints:** http2.createSecureServer; stream.pushStream.
**Solution:**
```js
import http2 from 'node:http2';
import fs from 'node:fs';

const server = http2.createSecureServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
});
server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    stream.pushStream({ ':path': '/app.js' }, (err, push) => {
      if (!err) {
        push.respond({ ':status': 200, 'content-type': 'application/javascript' });
        push.end('console.log(1)');
      }
    });
    stream.respond({ ':status': 200, 'content-type': 'text/html' });
    stream.end('<script src="/app.js"></script>');
  }
});
server.listen(8443);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 2. Custom Readable producing backpressured data
**Difficulty:** Hard
**Question:** Implement Readable that generates millions of numbers but respects read() backpressure via push return value.

Example: `_read` pushes until false.
**Hints:** if (!this.push(chunk)) stop until next _read.
**Solution:**
```js
import { Readable } from 'node:stream';

export function numberStream(max) {
  let i = 0;
  return new Readable({
    read() {
      let ok = true;
      while (ok && i < max) {
        ok = this.push(String(i++) + '\n');
      }
      if (i >= max) this.push(null);
    },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 3. Multiplex framed protocol
**Difficulty:** Hard
**Question:** Write encode/decode for length-prefixed frames: 4-byte BE length + payload. `FramedDecoder` Transform emitting Buffers.

Example: TCP RPC.
**Hints:** Buffer accumulation; readUInt32BE.
**Solution:**
```js
import { Transform } from 'node:stream';

export function encodeFrame(buf) {
  const header = Buffer.alloc(4);
  header.writeUInt32BE(buf.length, 0);
  return Buffer.concat([header, buf]);
}
export function framedDecoder() {
  let buf = Buffer.alloc(0);
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _e, cb) {
      buf = Buffer.concat([buf, chunk]);
      while (buf.length >= 4) {
        const len = buf.readUInt32BE(0);
        if (buf.length < 4 + len) break;
        this.push(buf.subarray(4, 4 + len));
        buf = buf.subarray(4 + len);
      }
      cb();
    },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 4. Worker pool with queue
**Difficulty:** Hard
**Question:** Implement `WorkerPool(script, size)` with `run(workerData)` distributing tasks to free workers.

Example: CPU jobs.
**Hints:** Pool of Workers; queue tasks; message round-trip.
**Solution:**
```js
import { Worker } from 'node:worker_threads';

export class WorkerPool {
  constructor(script, size) {
    this.script = script;
    this.idle = [];
    this.q = [];
    for (let i = 0; i < size; i++) this.idle.push(this._spawn());
  }
  _spawn() {
    return { worker: null, busy: false };
  }
  run(workerData) {
    return new Promise((resolve, reject) => {
      this.q.push({ workerData, resolve, reject });
      this._pump();
    });
  }
  _pump() {
    while (this.q.length && this.idle.length) {
      const slot = this.idle.pop();
      const job = this.q.shift();
      const worker = new Worker(this.script, { workerData: job.workerData });
      worker.on('message', (msg) => { job.resolve(msg); worker.terminate(); this.idle.push(slot); this._pump(); });
      worker.on('error', (err) => { job.reject(err); this.idle.push(slot); this._pump(); });
    }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 5. Cluster sticky session by IP
**Difficulty:** Hard
**Question:** Primary uses `net.createServer` accepting sockets and dispatching to workers via `worker.send("sticky-session:connection", socket)` based on IP hash.

Example: sticky websocket clustering sketch.
**Hints:** Hash remoteAddress % workers; send socket handle.
**Solution:**
```js
import cluster from 'node:cluster';
import net from 'node:net';
import os from 'node:os';

if (cluster.isPrimary) {
  const workers = [];
  for (let i = 0; i < os.cpus().length; i++) workers.push(cluster.fork());
  net.createServer({ pauseOnConnect: true }, (socket) => {
    const ip = socket.remoteAddress || '';
    let hash = 0;
    for (const ch of ip) hash = (hash + ch.charCodeAt(0)) % workers.length;
    workers[hash].send('sticky-session:connection', socket);
  }).listen(3000);
} else {
  process.on('message', (msg, socket) => {
    if (msg !== 'sticky-session:connection' || !socket) return;
    socket.resume();
    socket.end('hello from ' + process.pid);
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 6. Streaming multipart parser (boundary)
**Difficulty:** Hard
**Question:** Write Transform that splits multipart body into part Buffers given boundary string (simplified, no nested headers parse required beyond splitting).

Example: emit parts between boundaries.
**Hints:** Search for --boundary in buffer stream.
**Solution:**
```js
import { Transform } from 'node:stream';

export function multipartSplit(boundary) {
  const delim = Buffer.from('--' + boundary);
  let buf = Buffer.alloc(0);
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _e, cb) {
      buf = Buffer.concat([buf, chunk]);
      let idx;
      while ((idx = buf.indexOf(delim)) >= 0) {
        const part = buf.subarray(0, idx);
        if (part.length) this.push(part);
        buf = buf.subarray(idx + delim.length);
        if (buf[0] === 13 && buf[1] === 10) buf = buf.subarray(2);
      }
      cb();
    },
    flush(cb) { if (buf.length) this.push(buf); cb(); },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 7. AsyncLocalStorage + logger binding
**Difficulty:** Hard
**Question:** Middleware that runs request in ALS store; logger automatically includes request id from store.

Example: zero-arg log correlation.
**Hints:** als.run in middleware; logger reads getStore.
**Solution:**
```js
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

const als = new AsyncLocalStorage();
export function alsMiddleware(req, res, next) {
  als.run({ requestId: randomUUID() }, () => next());
}
export function log(msg) {
  console.log(JSON.stringify({ msg, requestId: als.getStore()?.requestId }));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 8. Graceful rolling restart workers
**Difficulty:** Hard
**Question:** Primary: on SIGUSR2, fork replacement workers then disconnect old ones after ready message.

Example: zero-downtime reload sketch.
**Hints:** Fork new; wait online; kill old.
**Solution:**
```js
import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  const forkOne = () => cluster.fork();
  for (let i = 0; i < os.cpus().length; i++) forkOne();
  process.on('SIGUSR2', () => {
    const old = Object.values(cluster.workers);
    let pending = old.length;
    for (let i = 0; i < old.length; i++) {
      const w = forkOne();
      w.on('listening', () => {
        old[i]?.disconnect();
        if (--pending === 0) console.log('reload done');
      });
    }
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 9. Custom promisify preserving this
**Difficulty:** Hard
**Question:** Write `promisifyMethod(obj, methodName)` returning async function calling callback-style method.

Example: redis-like client.
**Hints:** Return (...args)=> new Promise bound this.
**Solution:**
```js
export function promisifyMethod(obj, methodName) {
  return (...args) =>
    new Promise((resolve, reject) => {
      obj[methodName](...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 10. Leak-safe EventEmitter once race
**Difficulty:** Hard
**Question:** Write `onceWithTimeout(emitter, event, ms)` using events.once pattern that removes listeners on timeout.

Example: wait for connect.
**Hints:** Promise + abort/removeListener finally.
**Solution:**
```js
export function onceWithTimeout(emitter, event, ms) {
  return new Promise((resolve, reject) => {
    const onEvent = (...args) => { cleanup(); resolve(args); };
    const onError = (err) => { cleanup(); reject(err); };
    const t = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, ms);
    const cleanup = () => {
      clearTimeout(t);
      emitter.off(event, onEvent);
      emitter.off('error', onError);
    };
    emitter.on(event, onEvent);
    emitter.on('error', onError);
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 11. Streaming JSON array parser
**Difficulty:** Hard
**Question:** Write Transform that accepts chunks of a JSON array of objects and emits objects (assume well-formed, split on `},{` heuristics OK for interview sketch) OR document incremental parse with bracket depth.

Example: huge JSON array file.
**Hints:** Track depth; emit complete object substrings.
**Solution:**
```js
import { Transform } from 'node:stream';

export function jsonArrayObjectStream() {
  let buf = '';
  let depth = 0;
  let start = -1;
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _e, cb) {
      buf += chunk.toString('utf8');
      for (let i = 0; i < buf.length; i++) {
        const ch = buf[i];
        if (ch === '{') { if (depth === 0) start = i; depth++; }
        else if (ch === '}') {
          depth--;
          if (depth === 0 && start >= 0) {
            const obj = buf.slice(start, i + 1);
            this.push(JSON.parse(obj));
            buf = buf.slice(i + 1);
            i = -1; start = -1;
          }
        }
      }
      cb();
    },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 12. Priority job queue with delay
**Difficulty:** Hard
**Question:** Implement `DelayQueue` supporting `add(job, { priority, delayMs })` and async `*process(handler)` yielding due jobs by priority.

Example: scheduled emails.
**Hints:** Store {runAt,priority,job}; poll/sort.
**Solution:**
```js
export class DelayQueue {
  constructor() { this.jobs = []; }
  add(job, { priority = 0, delayMs = 0 } = {}) {
    this.jobs.push({ job, priority, runAt: Date.now() + delayMs });
  }
  async *process(handler) {
    while (this.jobs.length) {
      this.jobs.sort((a, b) => a.runAt - b.runAt || b.priority - a.priority);
      const next = this.jobs[0];
      const wait = next.runAt - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      this.jobs.shift();
      yield await handler(next.job);
    }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 13. TCP line protocol server
**Difficulty:** Hard
**Question:** net server: buffer per socket until \n; parse JSON command `{cmd,payload}`; reply JSON line.

Example: mini Redis-like.
**Hints:** socket buffer; split lines.
**Solution:**
```js
import net from 'node:net';

net.createServer((socket) => {
  let buf = '';
  socket.on('data', (chunk) => {
    buf += chunk.toString('utf8');
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx); buf = buf.slice(idx + 1);
      try {
        const msg = JSON.parse(line);
        socket.write(JSON.stringify({ ok: true, echo: msg }) + '\n');
      } catch {
        socket.write(JSON.stringify({ ok: false }) + '\n');
      }
    }
  });
}).listen(9000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 14. Resource pool (DB connections)
**Difficulty:** Hard
**Question:** Implement `Pool({ create, destroy, max })` with `acquire`/`release`; wait when exhausted.

Example: pg pool sketch.
**Hints:** free list + waiters.
**Solution:**
```js
export class Pool {
  constructor({ create, destroy, max }) {
    this.create = create; this.destroy = destroy; this.max = max;
    this.free = []; this.total = 0; this.waiters = [];
  }
  async acquire() {
    if (this.free.length) return this.free.pop();
    if (this.total < this.max) {
      this.total++;
      return this.create();
    }
    return new Promise((resolve) => this.waiters.push(resolve));
  }
  release(resource) {
    const w = this.waiters.shift();
    if (w) w(resource);
    else this.free.push(resource);
  }
  async drain() {
    for (const r of this.free.splice(0)) await this.destroy?.(r);
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 15. Streaming hash verify download
**Difficulty:** Hard
**Question:** fetch URL, pipeline body through hash Transform computing sha256 while writing to file; compare expected hex.

Example: secure download.
**Hints:** Transform updating hash; pipeline; compare.
**Solution:**
```js
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { createHash } from 'node:crypto';

export async function downloadVerify(url, dest, expectedHex) {
  const res = await fetch(url);
  const hash = createHash('sha256');
  const tap = new Transform({
    transform(chunk, _e, cb) { hash.update(chunk); cb(null, chunk); },
  });
  await pipeline(res.body, tap, fs.createWriteStream(dest));
  const actual = hash.digest('hex');
  if (actual !== expectedHex) throw new Error('checksum mismatch');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 16. Adaptive concurrency controller
**Difficulty:** Hard
**Question:** Write `AdaptivePool` starting concurrency=1, increasing on success latency ok, decreasing on errors/timeouts (AIMD).

Example: hammer API politely.
**Hints:** Track in-flight; adjust limit.
**Solution:**
```js
export class AdaptivePool {
  constructor({ min = 1, max = 20 } = {}) {
    this.limit = min; this.min = min; this.max = max;
    this.active = 0; this.q = [];
  }
  async run(fn) {
    await this._slot();
    const start = Date.now();
    try {
      const result = await fn();
      if (Date.now() - start < 200) this.limit = Math.min(this.max, this.limit + 1);
      return result;
    } catch (e) {
      this.limit = Math.max(this.min, Math.floor(this.limit / 2));
      throw e;
    } finally {
      this.active--;
      this._pump();
    }
  }
  _slot() {
    if (this.active < this.limit) { this.active++; return Promise.resolve(); }
    return new Promise((r) => this.q.push(r)).then(() => { this.active++; });
  }
  _pump() { const n = this.q.shift(); if (n) n(); }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 17. HTTP request smuggling guard
**Difficulty:** Hard
**Question:** Middleware rejecting requests that include both Content-Length and Transfer-Encoding headers.

Example: security hardening.
**Hints:** If both present → 400.
**Solution:**
```js
export function rejectAmbiguousLength(req, res, next) {
  if (req.headers['content-length'] && req.headers['transfer-encoding']) {
    res.writeHead(400);
    return res.end('ambiguous length');
  }
  next();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 18. Capability-based path jail
**Difficulty:** Hard
**Question:** Write `resolveInside(root, userPath)` resolving and ensuring result stays inside root (symlink-aware via realpath).

Example: static server jail.
**Hints:** realpath root and candidate; startsWith check.
**Solution:**
```js
import path from 'node:path';
import { realpath } from 'node:fs/promises';

export async function resolveInside(root, userPath) {
  const rootReal = await realpath(root);
  const candidate = await realpath(path.join(rootReal, userPath)).catch(() => null);
  if (!candidate || !candidate.startsWith(rootReal + path.sep) && candidate !== rootReal) {
    const err = new Error('path escapes root');
    err.status = 403;
    throw err;
  }
  return candidate;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 19. MessagePack-like binary RPC sketch
**Difficulty:** Hard
**Question:** Define encodeRequest(id, method, params) as JSON length-prefixed frame helpers and a server demuxing responses by id Map of deferreds.

Example: multiplexed client.
**Hints:** Map id→deferred; framed JSON.
**Solution:**
```js
import { encodeFrame, framedDecoder } from './framed.js'; // same pattern inline below
import { Transform } from 'node:stream';

function encodeFrameLocal(buf) {
  const h = Buffer.alloc(4); h.writeUInt32BE(buf.length); return Buffer.concat([h, buf]);
}
export class RpcClient {
  constructor(socket) {
    this.socket = socket; this.seq = 1; this.pending = new Map();
    let buf = Buffer.alloc(0);
    socket.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      while (buf.length >= 4) {
        const len = buf.readUInt32BE(0);
        if (buf.length < 4 + len) break;
        const msg = JSON.parse(buf.subarray(4, 4 + len).toString());
        buf = buf.subarray(4 + len);
        this.pending.get(msg.id)?.(msg);
        this.pending.delete(msg.id);
      }
    });
  }
  call(method, params) {
    const id = this.seq++;
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.socket.write(encodeFrameLocal(Buffer.from(JSON.stringify({ id, method, params }))));
    });
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 20. Heap snapshot trigger endpoint
**Difficulty:** Hard
**Question:** Admin-only route writing `v8.writeHeapSnapshot()` path to response (guard with token).

Example: memory debug.
**Hints:** v8.writeHeapSnapshot(); auth header.
**Solution:**
```js
import http from 'node:http';
import v8 from 'node:v8';

http.createServer((req, res) => {
  if (req.url === '/heap' && req.headers['x-admin-token'] === process.env.ADMIN_TOKEN) {
    const file = v8.writeHeapSnapshot();
    res.end(file);
  } else {
    res.writeHead(404); res.end();
  }
}).listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 21. CPU profile session
**Difficulty:** Hard
**Question:** Use `inspector` Session to start/stop CPU profile and return JSON profile.

Example: post /profile.
**Hints:** session.post Profiler.enable/start/stop.
**Solution:**
```js
import inspector from 'node:inspector';

export async function takeCpuProfile(ms) {
  const session = new inspector.Session();
  session.connect();
  await new Promise((r) => session.post('Profiler.enable', r));
  await new Promise((r) => session.post('Profiler.start', r));
  await new Promise((r) => setTimeout(r, ms));
  const profile = await new Promise((resolve, reject) => {
    session.post('Profiler.stop', (err, { profile }) => (err ? reject(err) : resolve(profile)));
  });
  session.disconnect();
  return profile;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 22. Zero-copy file send
**Difficulty:** Hard
**Question:** Use `fs.createReadStream` with highWaterMark tuning OR `res.write` from file handle; prefer `stream.pipeline` to client.

Example: large download endpoint.
**Hints:** pipeline(file, res).
**Solution:**
```js
import fs from 'node:fs';
import http from 'node:http';
import { pipeline } from 'node:stream/promises';

http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
  try {
    await pipeline(fs.createReadStream('./large.bin', { highWaterMark: 1 << 20 }), res);
  } catch {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 23. Domain-style error isolation (AsyncResource)
**Difficulty:** Hard
**Question:** Demonstrate binding a callback with `AsyncResource.bind` so errors can be attributed; or use `async_hooks` createHook counting handles.

Example: track async ops.
**Hints:** async_hooks.createHook init/destroy.
**Solution:**
```js
import async_hooks from 'node:async_hooks';

export function trackAsyncOps() {
  const active = new Map();
  const hook = async_hooks.createHook({
    init(asyncId, type) { active.set(asyncId, type); },
    destroy(asyncId) { active.delete(asyncId); },
  });
  hook.enable();
  return {
    snapshot: () => [...active.values()],
    disable: () => hook.disable(),
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 24. SharedArrayBuffer worker counter
**Difficulty:** Hard
**Question:** Main creates SharedArrayBuffer Int32Array; workers Atomically add; main reads total.

Example: parallel count.
**Hints:** Atomics.add in workers.
**Solution:**
```js
import { Worker } from 'node:worker_threads';

export async function parallelCount(nWorkers, nEach) {
  const sab = new SharedArrayBuffer(4);
  const view = new Int32Array(sab);
  const workers = Array.from({ length: nWorkers }, () => new Worker(`
    const { workerData } = require('worker_threads');
    const view = new Int32Array(workerData.sab);
    for (let i = 0; i < workerData.nEach; i++) Atomics.add(view, 0, 1);
  `, { eval: true, workerData: { sab, nEach } }));
  await Promise.all(workers.map((w) => new Promise((res, rej) => { w.on('exit', res); w.on('error', rej); })));
  return Atomics.load(view, 0);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 25. HTTP compression negotiate
**Difficulty:** Hard
**Question:** Middleware/handler: if Accept-Encoding includes gzip, pipeline body through createGzip and set Content-Encoding.

Example: compress JSON response.
**Hints:** Check header; gzip pipe.
**Solution:**
```js
import { createGzip } from 'node:zlib';
import { Readable } from 'node:stream';

export function sendGzipJson(req, res, obj) {
  const body = Buffer.from(JSON.stringify(obj));
  const ae = req.headers['accept-encoding'] || '';
  if (ae.includes('gzip')) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' });
    Readable.from([body]).pipe(createGzip()).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(body);
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 26. Idempotency key middleware
**Difficulty:** Hard
**Question:** Cache responses by Idempotency-Key header for POST; replay previous status/body within TTL.

Example: payment API.
**Hints:** Map key→{status,body,expires}; LRU optional.
**Solution:**
```js
const cache = new Map();
export function idempotency(ttlMs = 60000) {
  return async (req, res, next) => {
    if (req.method !== 'POST') return next();
    const key = req.headers['idempotency-key'];
    if (!key) return next();
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) {
      res.writeHead(hit.status, { 'Content-Type': 'application/json' });
      return res.end(hit.body);
    }
    const chunks = [];
    const origEnd = res.end.bind(res);
    res.end = (body) => {
      const buf = Buffer.isBuffer(body) ? body : Buffer.from(body || '');
      cache.set(key, { status: res.statusCode || 200, body: buf, expires: Date.now() + ttlMs });
      return origEnd(buf);
    };
    next();
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 27. Distributed lock with Redis sketch
**Difficulty:** Hard
**Question:** Write `acquireLock(redis, key, ttlMs)` using SET key token NX PX; release with compare-and-del Lua sketch as JS comments + get/del careful.

Example: leader election.
**Hints:** SET NX PX; token randomUUID.
**Solution:**
```js
import { randomUUID } from 'node:crypto';

export async function acquireLock(redis, key, ttlMs) {
  const token = randomUUID();
  const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');
  if (ok !== 'OK') return null;
  return {
    token,
    async release() {
      const v = await redis.get(key);
      if (v === token) await redis.del(key);
    },
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 28. OpenTelemetry-ish timing spans
**Difficulty:** Hard
**Question:** Write `withSpan(name, fn)` measuring hrtime, logging JSON span with durationMs and status.

Example: nested service timing.
**Hints:** try/finally duration.
**Solution:**
```js
export async function withSpan(name, fn) {
  const start = process.hrtime.bigint();
  try {
    const result = await fn();
    console.log(JSON.stringify({ span: name, status: 'ok', durationMs: Number(process.hrtime.bigint() - start) / 1e6 }));
    return result;
  } catch (err) {
    console.log(JSON.stringify({ span: name, status: 'error', durationMs: Number(process.hrtime.bigint() - start) / 1e6, error: String(err) }));
    throw err;
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 29. Sandbox vm Script timeout
**Difficulty:** Hard
**Question:** Use `node:vm` to run untrusted expression with timeout via `script.runInContext` and timeout option / separate approach with worker.

Example: runMath("1+2").
**Hints:** vm.Script + runInNewContext timeout.
**Solution:**
```js
import vm from 'node:vm';

export function runMath(expr, timeout = 50) {
  const script = new vm.Script(expr, { filename: 'math.js' });
  return script.runInNewContext(Object.create(null), { timeout });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 30. HTTP CONNECT tunnel proxy
**Difficulty:** Hard
**Question:** Implement CONNECT method handler: net.connect to target host:port and pipe client↔upstream.

Example: HTTPS proxy.
**Hints:** On CONNECT, socket.write 200; pipe both ways.
**Solution:**
```js
import http from 'node:http';
import net from 'node:net';

http.createServer((req, res) => { res.writeHead(405); res.end(); })
  .on('connect', (req, clientSocket, head) => {
    const [host, port] = req.url.split(':');
    const upstream = net.connect(Number(port) || 443, host, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (head.length) upstream.write(head);
      upstream.pipe(clientSocket);
      clientSocket.pipe(upstream);
    });
    upstream.on('error', () => clientSocket.end());
  })
  .listen(8080);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 31. File upload to disk with size cap stream
**Difficulty:** Hard
**Question:** pipeline req into write stream but destroy if too many bytes via Transform counter.

Example: avatar upload.
**Hints:** byteCount Transform; throw 413.
**Solution:**
```js
import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export async function saveUpload(req, dest, maxBytes) {
  let seen = 0;
  const limit = new Transform({
    transform(chunk, _e, cb) {
      seen += chunk.length;
      if (seen > maxBytes) cb(Object.assign(new Error('too large'), { status: 413 }));
      else cb(null, chunk);
    },
  });
  await pipeline(req, limit, fs.createWriteStream(dest));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 32. Multi-tenant header routing
**Difficulty:** Hard
**Question:** Server reads Host header and routes to different handlers map; default 404.

Example: SaaS vanity domains.
**Hints:** hostHandlers[host] || default.
**Solution:**
```js
import http from 'node:http';

const tenants = {
  'a.local': (_req, res) => res.end('tenant A'),
  'b.local': (_req, res) => res.end('tenant B'),
};
http.createServer((req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  const handler = tenants[host];
  if (!handler) { res.writeHead(404); return res.end('unknown host'); }
  handler(req, res);
}).listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 33. Deterministic JSON stringify
**Difficulty:** Hard
**Question:** Write `stableStringify(obj)` sorting object keys recursively for hashing/caching.

Example: cache key.
**Hints:** Recurse arrays/objects; sort keys.
**Solution:**
```js
export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  const keys = Object.keys(value).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 34. Shutdown barrier for in-flight requests
**Difficulty:** Hard
**Question:** Track inFlight count middleware; on SIGTERM stop listening and wait until inFlight===0 or timeout.

Example: k8s graceful.
**Hints:** Counter++/-- on finish; await waiters.
**Solution:**
```js
import http from 'node:http';

let inFlight = 0;
let accepting = true;
const server = http.createServer((req, res) => {
  if (!accepting) { res.writeHead(503); return res.end(); }
  inFlight++;
  res.on('finish', () => inFlight--);
  res.end('ok');
});
server.listen(3000);

async function shutdown() {
  accepting = false;
  server.close();
  const start = Date.now();
  while (inFlight > 0 && Date.now() - start < 10000) await new Promise((r) => setTimeout(r, 50));
  process.exit(0);
}
process.on('SIGTERM', shutdown);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 35. Custom Inspector coverage dump
**Difficulty:** Hard
**Question:** Enable Profiler or Profiler.takePreciseCoverage via inspector Session and return counts.

Example: test coverage hook.
**Hints:** Profiler.enable + takePreciseCoverage.
**Solution:**
```js
import inspector from 'node:inspector';

export async function preciseCoverage() {
  const session = new inspector.Session();
  session.connect();
  const post = (method, params) => new Promise((resolve, reject) => {
    session.post(method, params, (err, res) => (err ? reject(err) : resolve(res)));
  });
  await post('Profiler.enable');
  await post('Profiler.startPreciseCoverage', { callCount: true, detailed: true });
  // run user code externally then:
  const { result } = await post('Profiler.takePreciseCoverage');
  await post('Profiler.stopPreciseCoverage');
  session.disconnect();
  return result;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 36. Stream pipeline error propagation test harness
**Difficulty:** Hard
**Question:** Write `assertPipelineErrors()` creating Readable that errors mid-way and ensuring pipeline rejects.

Example: verify cleanup.
**Hints:** Readable push then destroy(err); await pipeline catch.
**Solution:**
```js
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export async function assertPipelineErrors() {
  const rs = new Readable({
    read() {
      this.push('x');
      this.destroy(new Error('boom'));
    },
  });
  const ws = new Writable({ write(_c, _e, cb) { cb(); } });
  try {
    await pipeline(rs, ws);
    throw new Error('should have failed');
  } catch (e) {
    if (e.message !== 'boom') throw e;
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 37. Hybrid cache stale-while-revalidate
**Difficulty:** Hard
**Question:** Implement cache get that returns stale value while refreshing in background if expired but within SWR window.

Example: CDN-like API cache.
**Hints:** Store {value, exp, softExp}; trigger refresh once.
**Solution:**
```js
export function createSWRCache({ ttlMs, swrMs, loader }) {
  const map = new Map();
  const inflight = new Map();
  async function refresh(key) {
    if (inflight.has(key)) return inflight.get(key);
    const p = loader(key).then((value) => {
      const now = Date.now();
      map.set(key, { value, exp: now + ttlMs, softExp: now + ttlMs + swrMs });
      inflight.delete(key);
      return value;
    });
    inflight.set(key, p);
    return p;
  }
  return {
    async get(key) {
      const e = map.get(key);
      const now = Date.now();
      if (!e || now > e.softExp) return refresh(key);
      if (now > e.exp) refresh(key); // background
      return e.value;
    },
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 38. Binary WebSocket frame parser (partial)
**Difficulty:** Hard
**Question:** Parse a single unmasked server→client text frame header from Buffer: fin/opcode/len; return payload slice (assume len<126).

Example: ws without library sketch.
**Hints:** Read first 2 bytes; payload offset 2.
**Solution:**
```js
export function parseWsServerTextFrame(buf) {
  const b0 = buf[0], b1 = buf[1];
  const fin = (b0 & 0x80) !== 0;
  const opcode = b0 & 0x0f;
  const masked = (b1 & 0x80) !== 0;
  const len = b1 & 0x7f;
  if (masked) throw new Error('server frames should be unmasked');
  if (len > 125) throw new Error('extended length not handled');
  const payload = buf.subarray(2, 2 + len);
  return { fin, opcode, payload: payload.toString('utf8') };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 39. Quota middleware per API key
**Difficulty:** Hard
**Question:** Track daily quotas in Map reset by UTC day string; reject 429 when exceeded.

Example: public API.
**Hints:** key → {day, count}.
**Solution:**
```js
export function dailyQuota(limit) {
  const usage = new Map();
  const day = () => new Date().toISOString().slice(0, 10);
  return (req, res, next) => {
    const key = req.headers['x-api-key'] || 'anon';
    const d = day();
    let e = usage.get(key);
    if (!e || e.day !== d) e = { day: d, count: 0 };
    e.count++;
    usage.set(key, e);
    if (e.count > limit) {
      res.writeHead(429);
      return res.end('quota');
    }
    next();
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 40. Deterministic port retry listen
**Difficulty:** Hard
**Question:** Write `async function listenFree(server, startPort)` trying ports until listen succeeds.

Example: test servers.
**Hints:** Increment port on EADDRINUSE.
**Solution:**
```js
export function listenFree(server, startPort) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    const tryListen = () => {
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') { port++; tryListen(); }
        else reject(err);
      });
      server.listen(port, () => resolve(port));
    };
    tryListen();
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 41. Structured concurrency TaskGroup
**Difficulty:** Hard
**Question:** Implement `TaskGroup` where `add(promise)` and `wait()` reject if any fail and optionally AbortController abort siblings.

Example: Promise.allSettled vs fail-fast all.
**Hints:** Track promises; AbortController.
**Solution:**
```js
export class TaskGroup {
  constructor() {
    this.tasks = [];
    this.controller = new AbortController();
  }
  get signal() { return this.controller.signal; }
  add(fn) {
    const p = Promise.resolve().then(() => fn(this.signal));
    this.tasks.push(p);
    p.catch(() => this.controller.abort());
    return p;
  }
  async wait() {
    try { return await Promise.all(this.tasks); }
    catch (e) { this.controller.abort(); throw e; }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 42. Ring buffer metrics store
**Difficulty:** Hard
**Question:** Implement fixed-size ring buffer recording latency samples; percentile() method.

Example: p99 tracking.
**Hints:** Circular array; sort copy for percentile.
**Solution:**
```js
export class RingBuffer {
  constructor(size) { this.buf = Array(size); this.size = size; this.i = 0; this.filled = 0; }
  push(x) { this.buf[this.i] = x; this.i = (this.i + 1) % this.size; this.filled = Math.min(this.filled + 1, this.size); }
  percentile(p) {
    const data = this.buf.slice(0, this.filled).sort((a, b) => a - b);
    if (!data.length) return 0;
    const idx = Math.min(data.length - 1, Math.floor((p / 100) * data.length));
    return data[idx];
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 43. Child process pool for CLI tools
**Difficulty:** Hard
**Question:** Pool of long-lived child processes communicating via stdin/stdout lines; `exec(line)` sends and waits for response line.

Example: persistent ffmpeg workers sketch simplified with node -i style.
**Hints:** spawn node; line protocol; free list.
**Solution:**
```js
import { spawn } from 'node:child_process';

export class LineProcessPool {
  constructor(size) {
    this.free = [];
    for (let i = 0; i < size; i++) this.free.push(this._spawn());
    this.q = [];
  }
  _spawn() {
    const child = spawn('node', ['-e', `
      let buf='';
      process.stdin.on('data', d => {
        buf += d;
        let i; while ((i = buf.indexOf('\\n')) >= 0) {
          const line = buf.slice(0,i); buf = buf.slice(i+1);
          process.stdout.write(line.toUpperCase()+ '\\n');
        }
      });
    `]);
    return { child, buf: '', busy: false };
  }
  exec(line) {
    return new Promise((resolve, reject) => {
      this.q.push({ line, resolve, reject });
      this._pump();
    });
  }
  _pump() {
    while (this.q.length && this.free.length) {
      const slot = this.free.pop();
      const job = this.q.shift();
      const onData = (d) => {
        slot.buf += d.toString();
        const i = slot.buf.indexOf('\n');
        if (i >= 0) {
          const out = slot.buf.slice(0, i);
          slot.buf = '';
          slot.child.stdout.off('data', onData);
          this.free.push(slot);
          job.resolve(out);
          this._pump();
        }
      };
      slot.child.stdout.on('data', onData);
      slot.child.stdin.write(job.line + '\n');
    }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 44. Content fingerprint directory
**Difficulty:** Hard
**Question:** Async walk directory, sha256 each file, return Map relativePath→hash sorted.

Example: deploy diff.
**Hints:** walk + hashFile streaming.
**Solution:**
```js
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { finished } from 'node:stream/promises';

async function hashFile(p) {
  const h = createHash('sha256');
  const s = createReadStream(p);
  s.pipe(h);
  await finished(h);
  return h.digest('hex');
}
async function* walk(dir, base = dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(full, base);
    else yield path.relative(base, full);
  }
}
export async function fingerprintDir(dir) {
  const out = new Map();
  for await (const rel of walk(dir)) out.set(rel.replace(/\\/g, '/'), await hashFile(path.join(dir, rel)));
  return new Map([...out.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 45. Request coalescing singleflight
**Difficulty:** Hard
**Question:** Write `singleflight()` returning `do(key, fn)` ensuring concurrent callers share one in-flight promise.

Example: thundering herd cache fill.
**Hints:** Map key→promise; delete finally.
**Solution:**
```js
export function singleflight() {
  const inflight = new Map();
  return async function doKey(key, fn) {
    if (inflight.has(key)) return inflight.get(key);
    const p = Promise.resolve().then(fn).finally(() => inflight.delete(key));
    inflight.set(key, p);
    return p;
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 46. HTTP/1.1 chunked response writer
**Difficulty:** Hard
**Question:** Write helper sending chunked transfer encoding manually: write hex size lines and chunks, finish with 0.\n\nExample: unknown length stream.
**Hints:** Transfer-Encoding chunked; write sizes.
**Solution:**
```js
export function beginChunked(res, headers = {}) {
  res.writeHead(200, { ...headers, 'Transfer-Encoding': 'chunked' });
  return {
    write(buf) {
      const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
      res.write(b.length.toString(16) + '\r\n');
      res.write(b);
      res.write('\r\n');
    },
    end() {
      res.end('0\r\n\r\n');
    },
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 47. Detect event loop delay
**Difficulty:** Hard
**Question:** Use `perf_hooks.monitorEventLoopDelay` histogram; expose p99 ms after interval.

Example: lag monitor.
**Hints:** monitorEventLoopDelay enable; percentile.
**Solution:**
```js
import { monitorEventLoopDelay } from 'node:perf_hooks';

export function startLagMonitor(intervalMs = 5000) {
  const h = monitorEventLoopDelay({ resolution: 20 });
  h.enable();
  const id = setInterval(() => {
    console.log(JSON.stringify({ p99ms: h.percentile(99) / 1e6 }));
    h.reset();
  }, intervalMs);
  return () => { clearInterval(id); h.disable(); };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 48. Safe eval-free expression language
**Difficulty:** Hard
**Question:** Parse tiny arithmetic AST (+,*) only for numbers/identifiers from a context object — no vm/eval.

Example: "price * qty + 1".
**Hints:** Tokenizer + recursive descent.
**Solution:**
```js
export function evalExpr(expr, ctx) {
  let i = 0;
  const peek = () => expr[i];
  const eat = () => expr[i++];
  function skip() { while (peek() === ' ') eat(); }
  function parseExpr() {
    let left = parseTerm();
    for (;;) {
      skip();
      if (peek() === '+') { eat(); left += parseTerm(); }
      else break;
    }
    return left;
  }
  function parseTerm() {
    let left = parseFactor();
    for (;;) {
      skip();
      if (peek() === '*') { eat(); left *= parseFactor(); }
      else break;
    }
    return left;
  }
  function parseFactor() {
    skip();
    if (peek() >= '0' && peek() <= '9') {
      let n = '';
      while (peek() >= '0' && peek() <= '9') n += eat();
      return Number(n);
    }
    let id = '';
    while (/[\w]/.test(peek() || '')) id += eat();
    if (!(id in ctx)) throw new Error('unknown ' + id);
    return ctx[id];
  }
  const v = parseExpr();
  skip();
  if (i !== expr.length) throw new Error('trailing');
  return v;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 49. Pipeline parallel branch tee
**Difficulty:** Hard
**Question:** Write `tee(readable, n)` returning n PassThrough branches using readable.on data / pause for slowest consumer sketch OR use stream module.

Example: log + upload.
**Hints:** PassThrough clones; manual write to all.
**Solution:**
```js
import { PassThrough } from 'node:stream';

export function tee(readable, n = 2) {
  const branches = Array.from({ length: n }, () => new PassThrough());
  readable.on('data', (chunk) => {
    for (const b of branches) {
      if (!b.write(chunk)) readable.pause();
    }
  });
  readable.on('end', () => branches.forEach((b) => b.end()));
  for (const b of branches) b.on('drain', () => readable.resume());
  return branches;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 50. Formal finalize with AbortSignal.any
**Difficulty:** Hard
**Question:** Write `raceWithAbort(promise, signal)` using AbortSignal support; if aborted reject AbortError.

Example: compose timeouts.
**Hints:** signal.aborted check; abort event once.
**Solution:**
```js
export function raceWithAbort(promise, signal) {
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      (v) => { signal.removeEventListener('abort', onAbort); resolve(v); },
      (e) => { signal.removeEventListener('abort', onAbort); reject(e); }
    );
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)
