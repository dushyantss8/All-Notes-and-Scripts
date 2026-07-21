# Node.js Challenges — Medium

50 medium Node.js problems. Each entry has a matching title, prompt, working solution, and complexity.

## 1. Bounded request body
**Difficulty:** Medium
**Question:** Write `readBodyLimited(req, maxBytes)` rejecting if body exceeds maxBytes.

Example: 1MB JSON limit.
**Hints:** Accumulate length; destroy/throw if over.
**Solution:**
```js
export async function readBodyLimited(req, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      req.destroy();
      const err = new Error('Payload too large');
      err.status = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 2. Multipart boundary extract
**Difficulty:** Medium
**Question:** Write `getMultipartBoundary(contentType)` parsing `multipart/form-data; boundary=----x` → boundary string or null.

Example: upload forms.
**Hints:** Regex or split on boundary=.
**Solution:**
```js
export function getMultipartBoundary(contentType) {
  if (!contentType || !contentType.includes('multipart/form-data')) return null;
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  return m ? (m[1] || m[2]).trim() : null;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 3. Retry with exponential backoff
**Difficulty:** Medium
**Question:** Write `retryBackoff(fn, { retries=3, baseMs=100 })` waiting baseMs*2^i between tries.

Example: upstream HTTP.
**Hints:** sleep between attempts.
**Solution:**
```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function retryBackoff(fn, { retries = 3, baseMs = 100 } = {}) {
  let last;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (e) {
      last = e;
      if (i === retries) break;
      await sleep(baseMs * 2 ** i);
    }
  }
  throw last;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 4. Promise pool for URLs
**Difficulty:** Medium
**Question:** Write `async mapPool(items, limit, worker)` concurrency-limited async map preserving order.

Example: fetch many URLs with limit 5.
**Hints:** Worker loop shared index.
**Solution:**
```js
export async function mapPool(items, limit, worker) {
  const out = new Array(items.length);
  let i = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => run()));
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 5. Transform CSV line splitter
**Difficulty:** Medium
**Question:** Write a Transform that buffers and emits complete lines (split on \n).

Example: parse NDJSON/CSV streams.
**Hints:** Keep remainder string between chunks.
**Solution:**
```js
import { Transform } from 'node:stream';

export function lineSplitTransform() {
  let buf = '';
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _e, cb) {
      buf += chunk.toString('utf8');
      const parts = buf.split('\n');
      buf = parts.pop();
      for (const line of parts) this.push(line);
      cb();
    },
    flush(cb) {
      if (buf) this.push(buf);
      cb();
    },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 6. Gzip compress file pipeline
**Difficulty:** Medium
**Question:** Write `async function gzipFile(src, dest)` using zlib.createGzip and pipeline.

Example: compress logs.
**Hints:** pipeline(rs, gzip, ws).
**Solution:**
```js
import fs from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

export async function gzipFile(src, dest) {
  await pipeline(fs.createReadStream(src), createGzip(), fs.createWriteStream(dest));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 7. HTTP proxy pipe
**Difficulty:** Medium
**Question:** Write a handler that proxies request to `targetOrigin` by forwarding method/headers/body via fetch or http.request and piping response.

Example: simple reverse proxy sketch with fetch.
**Hints:** await fetch(target+url); copy status/headers/body.
**Solution:**
```js
export async function proxyHandler(req, res, targetOrigin) {
  const url = new URL(req.url, targetOrigin);
  const headers = { ...req.headers, host: url.host };
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : req;
  const upstream = await fetch(url, { method: req.method, headers, body, duplex: 'half' });
  res.writeHead(upstream.status, Object.fromEntries(upstream.headers));
  const buf = Buffer.from(await upstream.arrayBuffer());
  res.end(buf);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 8. SSE write helper
**Difficulty:** Medium
**Question:** Write `writeEvent(res, { event, data })` formatting Server-Sent Events and flushing headers if needed.

Example: live updates.
**Hints:** text/event-stream; write event/data lines.
**Solution:**
```js
export function initSSE(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
}
export function writeEvent(res, { event, data }) {
  if (event) res.write(`event: ${event}\n`);
  res.write(`data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 9. WebSocket upgrade detect
**Difficulty:** Medium
**Question:** Write `isWebSocketUpgrade(req)` checking Connection/Upgrade headers for websocket.

Example: route upgrade.
**Hints:** headers upgrade === websocket.
**Solution:**
```js
export function isWebSocketUpgrade(req) {
  const upgrade = (req.headers.upgrade || '').toLowerCase();
  const conn = (req.headers.connection || '').toLowerCase();
  return upgrade === 'websocket' && conn.split(',').map(s=>s.trim()).includes('upgrade');
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 10. Worker thread fib
**Difficulty:** Medium
**Question:** Write `async function fibInWorker(n)` using `worker_threads` Worker with eval or inline workerData computing fib, returning result via parentPort message.

Example: offload CPU.
**Hints:** new Worker with workerData; once message.
**Solution:**
```js
import { Worker } from 'node:worker_threads';

export function fibInWorker(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(`
      const { parentPort, workerData } = require('worker_threads');
      function fib(x){ return x<=1?x:fib(x-1)+fib(x-2); }
      parentPort.postMessage(fib(workerData.n));
    `, { eval: true, workerData: { n } });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 11. Cluster primary fork
**Difficulty:** Medium
**Question:** Write a sketch: if `cluster.isPrimary`, fork `os.cpus().length` workers; else create HTTP server.

Example: multi-core listen.
**Hints:** cluster.fork loop; worker http.listen.
**Solution:**
```js
import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
  http.createServer((_req, res) => res.end('worker ' + process.pid)).listen(3000);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 12. Mutex for async critical section
**Difficulty:** Medium
**Question:** Implement `Mutex` with acquire/release for serializing async Node sections.

Example: protect file write.
**Hints:** Promise queue.
**Solution:**
```js
export class Mutex {
  constructor() { this._q = Promise.resolve(); }
  async runExclusive(fn) {
    let release;
    const wait = new Promise((r) => (release = r));
    const prev = this._q;
    this._q = this._q.then(() => wait);
    await prev;
    try { return await fn(); }
    finally { release(); }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 13. Token bucket rate limiter
**Difficulty:** Medium
**Question:** Implement `TokenBucket({ capacity, refillPerSec })` with `tryTake(n=1)`.

Example: API gateway.
**Hints:** Refill based on elapsed time.
**Solution:**
```js
export class TokenBucket {
  constructor({ capacity, refillPerSec }) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.tokens = capacity;
    this.updated = Date.now();
  }
  tryTake(n = 1) {
    const now = Date.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.updated) / 1000) * this.refillPerSec);
    this.updated = now;
    if (this.tokens < n) return false;
    this.tokens -= n;
    return true;
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 14. LRU cache for Node
**Difficulty:** Medium
**Question:** Implement `LRUCache(capacity)` Map-based get/put for caching expensive fs/db results.

Example: memoize templates.
**Hints:** Map insertion order refresh.
**Solution:**
```js
export class LRUCache {
  constructor(capacity) { this.capacity = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const v = this.map.get(key);
    this.map.delete(key); this.map.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) this.map.delete(this.map.keys().next().value);
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 15. Circuit breaker
**Difficulty:** Medium
**Question:** Implement `CircuitBreaker({ failureThreshold, coolDownMs })` wrapping async fn: open after failures, half-open after coolDown.

Example: protect downstream.
**Hints:** Track failures + state timestamps.
**Solution:**
```js
export class CircuitBreaker {
  constructor({ failureThreshold = 5, coolDownMs = 10000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.coolDownMs = coolDownMs;
    this.failures = 0;
    this.state = 'closed';
    this.openedAt = 0;
  }
  async exec(fn) {
    if (this.state === 'open') {
      if (Date.now() - this.openedAt < this.coolDownMs) throw new Error('circuit open');
      this.state = 'half';
    }
    try {
      const result = await fn();
      this.failures = 0; this.state = 'closed';
      return result;
    } catch (e) {
      this.failures++;
      if (this.failures >= this.failureThreshold) {
        this.state = 'open'; this.openedAt = Date.now();
      }
      throw e;
    }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 16. Readable async iterator consume
**Difficulty:** Medium
**Question:** Write `async function collectStream(readable)` returning Buffer of all chunks via async iteration.

Example: consume HTTP incoming.
**Hints:** for await chunk of readable.
**Solution:**
```js
export async function collectStream(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 17. Backpressure-aware write
**Difficulty:** Medium
**Question:** Write `async function writeWithBackpressure(writable, chunk)` awaiting drain if write returns false.

Example: slow disk.
**Hints:** if (!writable.write(chunk)) await once(writable, "drain").
**Solution:**
```js
import { once } from 'node:events';

export async function writeWithBackpressure(writable, chunk) {
  if (!writable.write(chunk)) await once(writable, 'drain');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 18. Custom Duplex echo
**Difficulty:** Medium
**Question:** Create a Duplex stream where _write pushes data to readable side (objectMode false).

Example: transform-like echo duplex.
**Hints:** new Duplex({ write(c,e,cb){ this.push(c); cb(); } }).
**Solution:**
```js
import { Duplex } from 'node:stream';

export function echoDuplex() {
  return new Duplex({
    write(chunk, _enc, cb) {
      this.push(chunk);
      cb();
    },
    read() {},
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 19. HTTP keep-alive agent
**Difficulty:** Medium
**Question:** Show creating `http.Agent({ keepAlive: true, maxSockets: 50 })` and using it in a request.

Example: connection reuse.
**Hints:** new http.Agent; pass agent option.
**Solution:**
```js
import http from 'node:http';

export const agent = new http.Agent({ keepAlive: true, maxSockets: 50 });

export function get(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'example.com', path, agent }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 20. Signed cookie value
**Difficulty:** Medium
**Question:** Write `sign(value, secret)` and `unsign(input, secret)` using HMAC SHA256 hex, format `value.sig`.

Example: session cookie.
**Hints:** createHmac; timingSafeEqual.
**Solution:**
```js
import { createHmac, timingSafeEqual } from 'node:crypto';

export function sign(value, secret) {
  const sig = createHmac('sha256', secret).update(value).digest('hex');
  return value + '.' + sig;
}
export function unsign(input, secret) {
  const i = input.lastIndexOf('.');
  if (i < 0) return null;
  const value = input.slice(0, i);
  const sig = input.slice(i + 1);
  const expected = createHmac('sha256', secret).update(value).digest('hex');
  try {
    const a = Buffer.from(sig); const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return value;
  } catch { return null; }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 21. Password hash scrypt
**Difficulty:** Medium
**Question:** Write `async hashPassword(password)` and `verifyPassword(password, stored)` using crypto.scrypt with random salt; stored as salt:hash hex.

Example: user signup.
**Hints:** randomBytes + scrypt + timingSafeEqual.
**Solution:**
```js
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)).toString('hex');
  return salt + ':' + hash;
}
export async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const actual = await scryptAsync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 22. Spawn capture stdout stderr
**Difficulty:** Medium
**Question:** Write `async function runCapture(cmd, args)` using spawn, returning `{ code, stdout, stderr }`.

Example: run git status.
**Hints:** child_process.spawn; collect data; await close.
**Solution:**
```js
import { spawn } from 'node:child_process';

export function runCapture(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 23. Watch file debounce reload
**Difficulty:** Medium
**Question:** Write `watchDebounced(path, ms, onChange)` using fs.watch, debouncing events.

Example: config hot reload.
**Hints:** fs.watch + debounce timer.
**Solution:**
```js
import fs from 'node:fs';

export function watchDebounced(filePath, ms, onChange) {
  let t;
  const watcher = fs.watch(filePath, () => {
    clearTimeout(t);
    t = setTimeout(() => onChange(filePath), ms);
  });
  return () => watcher.close();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 24. NDJSON HTTP response stream
**Difficulty:** Medium
**Question:** Write handler streaming an array of objects as NDJSON using Readable.from.

Example: export endpoint.
**Hints:** Readable.from map stringify; pipe res.
**Solution:**
```js
import { Readable } from 'node:stream';

export function sendNdjson(res, rows) {
  res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
  Readable.from(rows.map((r) => JSON.stringify(r) + '\n')).pipe(res);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 25. Context storage AsyncLocalStorage
**Difficulty:** Medium
**Question:** Write `requestContext` using AsyncLocalStorage: run(store, fn) and getStore() for request id.

Example: log correlation without passing args.
**Hints:** new AsyncLocalStorage().
**Solution:**
```js
import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage();
export function withRequestId(id, fn) {
  return requestContext.run({ id }, fn);
}
export function currentRequestId() {
  return requestContext.getStore()?.id;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 26. Structured JSON logger
**Difficulty:** Medium
**Question:** Write `logger.info(msg, fields)` printing one JSON line with level, msg, time, fields.

Example: production logs.
**Hints:** console.log JSON.stringify.
**Solution:**
```js
export const logger = {
  info(msg, fields = {}) {
    console.log(JSON.stringify({ level: 'info', msg, time: new Date().toISOString(), ...fields }));
  },
  error(msg, fields = {}) {
    console.error(JSON.stringify({ level: 'error', msg, time: new Date().toISOString(), ...fields }));
  },
};
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 27. Paginated fs readdir
**Difficulty:** Medium
**Question:** Write `async function* walkFiles(dir)` recursively yielding file paths using opendir/readdir.

Example: scan project.
**Hints:** async generator recurse directories.
**Solution:**
```js
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function* walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walkFiles(p);
    else yield p;
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 28. ETag static response
**Difficulty:** Medium
**Question:** Write `sendWithETag(req, res, bodyBuf)` setting ETag from sha1; if If-None-Match matches return 304.

Example: cacheable asset.
**Hints:** createHash sha1; compare header.
**Solution:**
```js
import { createHash } from 'node:crypto';

export function sendWithETag(req, res, bodyBuf) {
  const etag = '"' + createHash('sha1').update(bodyBuf).digest('hex') + '"';
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304);
    return res.end();
  }
  res.writeHead(200, { ETag: etag, 'Content-Type': 'application/octet-stream' });
  res.end(bodyBuf);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 29. DNS lookup promisify
**Difficulty:** Medium
**Question:** Write `lookupHost(hostname)` using dns.promises.lookup returning address.

Example: resolve before connect.
**Hints:** dns.promises.lookup.
**Solution:**
```js
import dns from 'node:dns/promises';

export async function lookupHost(hostname) {
  const { address } = await dns.lookup(hostname);
  return address;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 30. TLS self-signed server sketch
**Difficulty:** Medium
**Question:** Create HTTPS server with `https.createServer({ key, cert }, handler)` reading key/cert from files.

Example: local HTTPS.
**Hints:** readFileSync key/cert; https.createServer.
**Solution:**
```js
import https from 'node:https';
import fs from 'node:fs';

const server = https.createServer(
  {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  },
  (_req, res) => res.end('secure')
);
server.listen(3443);
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 31. Idle timeout sockets
**Difficulty:** Medium
**Question:** Write HTTP server setting `server.headersTimeout` and `requestTimeout` (ms) and document purpose.

Example: mitigate slowloris.
**Hints:** Assign timeouts on server object.
**Solution:**
```js
import http from 'node:http';

const server = http.createServer((req, res) => res.end('ok'));
server.headersTimeout = 10_000;
server.requestTimeout = 30_000;
server.listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 32. Compose Connect middleware
**Difficulty:** Medium
**Question:** Write `compose(mws)` running Express/Connect middleware array with next err handling.

Example: stack logger+auth+route.
**Hints:** Recursive next(i).
**Solution:**
```js
export function compose(mws) {
  return (req, res, done) => {
    let i = 0;
    function next(err) {
      if (err) return done(err);
      const fn = mws[i++];
      if (!fn) return done();
      try { fn(req, res, next); }
      catch (e) { next(e); }
    }
    next();
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 33. Content-Range for partial file
**Difficulty:** Medium
**Question:** Write handler supporting `Range: bytes=start-end` for a file using createReadStream({start,end}) and 206.

Example: video seek.
**Hints:** Parse Range; stat size; 206 Content-Range.
**Solution:**
```js
import fs from 'node:fs';
import { stat } from 'node:fs/promises';

export async function sendRange(req, res, filePath) {
  const st = await stat(filePath);
  const range = req.headers.range;
  if (!range) {
    res.writeHead(200, { 'Content-Length': st.size });
    return fs.createReadStream(filePath).pipe(res);
  }
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m[1] ? Number(m[1]) : 0;
  const end = m[2] ? Number(m[2]) : st.size - 1;
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${st.size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 34. Queue with concurrency
**Difficulty:** Medium
**Question:** Implement `TaskQueue(concurrency)` with `add(fn)` returning promise; run at most concurrency tasks.

Example: thumbnail jobs.
**Hints:** Same as p-limit.
**Solution:**
```js
export function TaskQueue(concurrency) {
  let active = 0;
  const q = [];
  const pump = () => {
    while (active < concurrency && q.length) {
      active++;
      const { fn, resolve, reject } = q.shift();
      Promise.resolve()
        .then(fn)
        .then(resolve, reject)
        .finally(() => { active--; pump(); });
    }
  };
  return {
    add(fn) {
      return new Promise((resolve, reject) => {
        q.push({ fn, resolve, reject });
        pump();
      });
    },
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 35. Parse cookies header
**Difficulty:** Medium
**Question:** Write `parseCookies(header)` → object of name→value (first wins).

Example: "a=1; b=2".
**Hints:** split ; then =.
**Solution:**
```js
export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (!(k in out)) out[k] = decodeURIComponent(v);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 36. Set-Cookie serialize
**Difficulty:** Medium
**Question:** Write `serializeCookie(name, value, { httpOnly, secure, sameSite, maxAge, path })`.

Example: session cookie.
**Hints:** Build attribute string.
**Solution:**
```js
export function serializeCookie(name, value, opts = {}) {
  let s = `${name}=${encodeURIComponent(value)}`;
  if (opts.maxAge != null) s += `; Max-Age=${opts.maxAge}`;
  if (opts.path) s += `; Path=${opts.path}`;
  if (opts.httpOnly) s += '; HttpOnly';
  if (opts.secure) s += '; Secure';
  if (opts.sameSite) s += `; SameSite=${opts.sameSite}`;
  return s;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 37. Helmet-like CSP header
**Difficulty:** Medium
**Question:** Write middleware setting Content-Security-Policy default-src self.

Example: XSS mitigation header.
**Hints:** res.setHeader CSP.
**Solution:**
```js
export function cspSelf(req, res, next) {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 38. Graceful drain with timeout
**Difficulty:** Medium
**Question:** Write `async function closeServer(server, timeoutMs)` racing server.close vs timeout then closeAllConnections if available.

Example: k8s terminationGracePeriod.
**Hints:** Promise race; server.closeAllConnections?.().
**Solution:**
```js
export function closeServer(server, timeoutMs) {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      server.closeAllConnections?.();
      resolve('timeout');
    }, timeoutMs);
    server.close(() => {
      clearTimeout(t);
      resolve('closed');
    });
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 39. IP from X-Forwarded-For
**Difficulty:** Medium
**Question:** Write `clientIp(req)` taking first address from x-forwarded-for or socket.remoteAddress.

Example: behind proxy.
**Hints:** split comma trim.
**Solution:**
```js
export function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || '';
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 40. Method override middleware
**Difficulty:** Medium
**Question:** Write middleware allowing POST with `_method=PUT` query/body to change req.method.

Example: HTML forms.
**Hints:** Check query then body.
**Solution:**
```js
export function methodOverride(req, res, next) {
  if (req.method === 'POST') {
    const url = new URL(req.url, 'http://localhost');
    const m = url.searchParams.get('_method') || req.body?._method;
    if (m) req.method = m.toUpperCase();
  }
  next();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 41. JSON schema-ish validate types
**Difficulty:** Medium
**Question:** Write `validateTypes(obj, shape)` where shape maps key→"string"|"number"|"boolean"; throw 400 on mismatch.

Example: API boundary.
**Hints:** typeof checks.
**Solution:**
```js
export function validateTypes(obj, shape) {
  for (const [k, t] of Object.entries(shape)) {
    if (typeof obj[k] !== t) {
      const err = new Error(`Field ${k} must be ${t}`);
      err.status = 400;
      throw err;
    }
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 42. Metrics counter middleware
**Difficulty:** Medium
**Question:** Write middleware incrementing `Map` counts by `METHOD path` on finish.

Example: simple telemetry.
**Hints:** res.on finish; metrics.set.
**Solution:**
```js
export function createMetrics() {
  const counts = new Map();
  function middleware(req, res, next) {
    res.on('finish', () => {
      const key = req.method + ' ' + new URL(req.url, 'http://x').pathname;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    next();
  }
  return { middleware, counts };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 43. Hot-swap handler
**Difficulty:** Medium
**Question:** Create server whose request listener can be replaced via `setHandler(fn)` without restarting listen.

Example: reload routes.
**Hints:** Mutable handler ref.
**Solution:**
```js
import http from 'node:http';

let handler = (req, res) => res.end('v1');
export function setHandler(fn) { handler = fn; }
export const server = http.createServer((req, res) => handler(req, res));
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 44. Stdout progress bar
**Difficulty:** Medium
**Question:** Write `renderProgress(done, total)` writing `\r`-based progress to stdout without newline.

Example: CLI download.
**Hints:** process.stdout.write.
**Solution:**
```js
export function renderProgress(done, total) {
  const pct = total ? Math.floor((done / total) * 100) : 100;
  process.stdout.write(`\r[${'='.repeat(pct/5)}${' '.repeat(20-pct/5)}] ${pct}%`);
  if (done >= total) process.stdout.write('\n');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 45. Abortable fetch wrapper
**Difficulty:** Medium
**Question:** Write `fetchWithAbort(url, ms)` aborting via AbortController after ms.

Example: outbound timeout.
**Hints:** AbortController + setTimeout abort.
**Solution:**
```js
export async function fetchWithAbort(url, ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { signal: c.signal });
  } finally {
    clearTimeout(t);
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 46. Pipe process stdout to HTTP
**Difficulty:** Medium
**Question:** HTTP handler that spawns `ls` (or `dir`) and pipes child.stdout to res.

Example: stream command output.
**Hints:** spawn; stdout.pipe(res); handle error.
**Solution:**
```js
import { spawn } from 'node:child_process';
import http from 'node:http';

http.createServer((_req, res) => {
  const child = spawn(process.platform === 'win32' ? 'cmd' : 'ls', process.platform === 'win32' ? ['/c', 'dir'] : []);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  child.stdout.pipe(res);
  child.on('error', () => { res.statusCode = 500; res.end('fail'); });
}).listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 47. ObjectMode transform map
**Difficulty:** Medium
**Question:** Write `mapTransform(fn)` objectMode Transform mapping objects.

Example: ETL pipeline.
**Hints:** objectMode true both sides.
**Solution:**
```js
import { Transform } from 'node:stream';

export function mapTransform(fn) {
  return new Transform({
    objectMode: true,
    transform(item, _e, cb) {
      try { cb(null, fn(item)); }
      catch (err) { cb(err); }
    },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 48. Batch DB writes buffer
**Difficulty:** Medium
**Question:** Write `createBatcher({ max, flushMs, flush })` collecting items and flushing by size or timer.

Example: bulk insert.
**Hints:** Array buffer + timers.
**Solution:**
```js
export function createBatcher({ max, flushMs, flush }) {
  let buf = [];
  let timer;
  const run = async () => {
    clearTimeout(timer); timer = undefined;
    const batch = buf; buf = [];
    if (batch.length) await flush(batch);
  };
  return {
    async push(item) {
      buf.push(item);
      if (buf.length >= max) await run();
      else if (!timer) timer = setTimeout(run, flushMs);
    },
    flush: run,
  };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 49. Secure filename sanitize
**Difficulty:** Medium
**Question:** Write `safeBaseName(name)` stripping path segments and replacing unsafe chars.

Example: uploads.
**Hints:** path.basename; replace non [\w.-].
**Solution:**
```js
import path from 'node:path';

export function safeBaseName(name) {
  return path.basename(name).replace(/[^\w.-]/g, '_');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)

## 50. HTTP HEAD vs GET body
**Difficulty:** Medium
**Question:** Server: for GET return body; for HEAD return same headers/Content-Length but empty body.

Example: correct HEAD.
**Hints:** Compute body; if HEAD end without body.
**Solution:**
```js
import http from 'node:http';

const body = Buffer.from('hello');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': body.length });
  if (req.method === 'HEAD') return res.end();
  res.end(body);
}).listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)–O(n)
