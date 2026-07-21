# Node.js Challenges — Easy

50 easy Node.js problems. Each entry has a matching title, prompt, working solution, and complexity.

## 1. Create an HTTP server
**Difficulty:** Easy
**Question:** Using `node:http`, create a server that listens on port 3000 and responds `{"ok":true}` with `Content-Type: application/json` for every request.

Example: `GET /` → 200 JSON body.
**Hints:** http.createServer; res.writeHead; res.end; listen(3000).
**Solution:**
```js
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});
server.listen(3000);
```
**Time Complexity:** O(n) in input size
**Space Complexity:** O(1) to O(n) depending on buffering

## 2. Parse JSON safely
**Difficulty:** Easy
**Question:** Write `safeJsonParse(text, fallback)` that returns parsed JSON or `fallback` if parsing throws.

Example: `safeJsonParse("{", null)` → `null`.
**Hints:** try/catch around JSON.parse.
**Solution:**
```js
export function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 3. Read a file with fs/promises
**Difficulty:** Easy
**Question:** Write `async function readUtf8(filePath)` that returns file contents as a UTF-8 string using `node:fs/promises`.

Example: read `./notes.txt`.
**Hints:** fs.readFile(path, "utf8").
**Solution:**
```js
import { readFile } from 'node:fs/promises';

export async function readUtf8(filePath) {
  return readFile(filePath, 'utf8');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 4. Write a file atomically-ish
**Difficulty:** Easy
**Question:** Write `async function writeUtf8(filePath, contents)` using `fs/promises.writeFile`.

Example: write config JSON string.
**Hints:** await writeFile(path, contents, "utf8").
**Solution:**
```js
import { writeFile } from 'node:fs/promises';

export async function writeUtf8(filePath, contents) {
  await writeFile(filePath, contents, 'utf8');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 5. Join paths safely
**Difficulty:** Easy
**Question:** Write `configPath(baseDir)` returning `baseDir/config/app.json` using `node:path` (not string concat).

Example: `/app` → `/app/config/app.json` (platform separators).
**Hints:** path.join(baseDir, "config", "app.json").
**Solution:**
```js
import path from 'node:path';

export function configPath(baseDir) {
  return path.join(baseDir, 'config', 'app.json');
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 6. Buffer from string and back
**Difficulty:** Easy
**Question:** Write `encodeDecode(str)` that converts a string to Buffer (utf8) and back, returning the string.

Example: round-trip "hello".
**Hints:** Buffer.from / buf.toString("utf8").
**Solution:**
```js
export function encodeDecode(str) {
  const buf = Buffer.from(str, 'utf8');
  return buf.toString('utf8');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 7. SHA-256 hex digest
**Difficulty:** Easy
**Question:** Write `sha256Hex(input)` using `node:crypto` returning hex digest of a string.

Example: sha256 of "abc".
**Hints:** createHash("sha256").update.update.digest("hex").
**Solution:**
```js
import { createHash } from 'node:crypto';

export function sha256Hex(input) {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 8. Basic EventEmitter usage
**Difficulty:** Easy
**Question:** Write `createTicker()` that returns an EventEmitter emitting `"tick"` with incrementing integers every call to `tick()`.

Example: on("tick") receives 1,2,3...
**Hints:** new EventEmitter; emit on method.
**Solution:**
```js
import { EventEmitter } from 'node:events';

export function createTicker() {
  const ee = new EventEmitter();
  let n = 0;
  ee.tick = () => ee.emit('tick', ++n);
  return ee;
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(listeners)

## 9. Async handler wrapper
**Difficulty:** Easy
**Question:** Write Express-style `asyncHandler(fn)` that forwards promise rejections to `next`.

Example: async route errors reach error middleware.
**Hints:** Return (req,res,next)=>Promise.resolve(fn(...)).catch(next).
**Solution:**
```js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 10. Environment int with default
**Difficulty:** Easy
**Question:** Write `envInt(name, defaultValue)` reading `process.env[name]` as integer, or default if missing/NaN.

Example: PORT unset → 3000.
**Hints:** parseInt; Number.isFinite check.
**Solution:**
```js
export function envInt(name, defaultValue) {
  const raw = process.env[name];
  if (raw == null || raw === '') return defaultValue;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : defaultValue;
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 11. List directory names
**Difficulty:** Easy
**Question:** Write `async function listNames(dir)` returning entry names via `fs.readdir`.

Example: list current folder.
**Hints:** readdir from fs/promises.
**Solution:**
```js
import { readdir } from 'node:fs/promises';

export async function listNames(dir) {
  return readdir(dir);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 12. File exists check
**Difficulty:** Easy
**Question:** Write `async function fileExists(p)` using `access` or `stat`, returning boolean (no throw).

Example: missing file → false.
**Hints:** try access F_OK; catch false.
**Solution:**
```js
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';

export async function fileExists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 13. Stream file to HTTP response
**Difficulty:** Easy
**Question:** Write a small server handler that streams a file with `fs.createReadStream` into `res`, handling stream errors.

Example: GET /file downloads without buffering whole file.
**Hints:** createReadStream.pipe(res); on error → 500.
**Solution:**
```js
import fs from 'node:fs';
import http from 'node:http';

http.createServer((req, res) => {
  const stream = fs.createReadStream('./big.bin');
  stream.on('error', () => {
    res.statusCode = 500;
    res.end('error');
  });
  stream.pipe(res);
}).listen(3000);
```
**Time Complexity:** O(n) bytes
**Space Complexity:** O(1) buffers

## 14. Pipeline copy file
**Difficulty:** Easy
**Question:** Write `async function copyFileStream(src, dest)` using `stream/promises.pipeline` and createReadStream/createWriteStream.

Example: copy large file.
**Hints:** pipeline(rs, ws).
**Solution:**
```js
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

export async function copyFileStream(src, dest) {
  await pipeline(fs.createReadStream(src), fs.createWriteStream(dest));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 15. URL pathname parse
**Difficulty:** Easy
**Question:** Write `getPathname(requestUrl)` using `new URL(requestUrl, "http://localhost")` returning pathname.

Example: "/api/users?x=1" → "/api/users".
**Hints:** WHATWG URL API.
**Solution:**
```js
export function getPathname(requestUrl) {
  return new URL(requestUrl, 'http://localhost').pathname;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 16. Query param get
**Difficulty:** Easy
**Question:** Write `getQueryParam(requestUrl, key)` returning the first query value or null.

Example: "?id=5" → "5".
**Hints:** url.searchParams.get.
**Solution:**
```js
export function getQueryParam(requestUrl, key) {
  return new URL(requestUrl, 'http://localhost').searchParams.get(key);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 17. Collect request body string
**Difficulty:** Easy
**Question:** Write `async function readBody(req)` concatenating UTF-8 chunks until end (assume small body).

Example: POST JSON as string.
**Hints:** for await of req; or data/end events wrapped in Promise.
**Solution:**
```js
export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 18. Set security headers
**Difficulty:** Easy
**Question:** Write middleware `securityHeaders(req,res,next)` setting `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` then next().

Example: Express-style.
**Hints:** res.setHeader then next().
**Solution:**
```js
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 19. Request logging middleware
**Difficulty:** Easy
**Question:** Write `requestLogger(req,res,next)` logging `METHOD path` and duration on `res` finish.

Example: "GET / 12ms".
**Hints:** Date.now start; res.on("finish").
**Solution:**
```js
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${Date.now() - start}ms`);
  });
  next();
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 20. Correlation ID middleware
**Difficulty:** Easy
**Question:** Write `correlationId(req,res,next)` using incoming `x-request-id` or generate `crypto.randomUUID()`, set on req and response header.

Example: propagate id.
**Hints:** randomUUID from crypto.
**Solution:**
```js
import { randomUUID } from 'node:crypto';

export function correlationId(req, res, next) {
  const id = req.headers['x-request-id'] || randomUUID();
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 21. Central error middleware
**Difficulty:** Easy
**Question:** Write Express error middleware `(err, req, res, next)` returning JSON `{error: message}` with status err.status || 500.

Example: throw in route → JSON error.
**Hints:** 4-arg signature required.
**Solution:**
```js
export function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: err.message || 'Internal Error' }));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 22. Validate required body fields
**Difficulty:** Easy
**Question:** Write `requireFields(obj, fields)` throwing Error if any field missing/undefined/empty string.

Example: requireFields(body, ["email","password"]).
**Hints:** Loop fields; check nullish/"".
**Solution:**
```js
export function requireFields(obj, fields) {
  for (const f of fields) {
    if (obj == null || obj[f] == null || obj[f] === '') {
      const err = new Error(`Missing field: ${f}`);
      err.status = 400;
      throw err;
    }
  }
}
```
**Time Complexity:** O(k)
**Space Complexity:** O(1)

## 23. Sleep with promises
**Difficulty:** Easy
**Question:** Write `sleep(ms)` using setTimeout Promise for Node scripts.

Example: await sleep(100).
**Hints:** new Promise(r => setTimeout(r, ms)).
**Solution:**
```js
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 24. CLI argv flags
**Difficulty:** Easy
**Question:** Write `hasFlag(argv, name)` true if `--name` appears in argv array.

Example: process.argv includes --verbose.
**Hints:** argv.includes("--"+name).
**Solution:**
```js
export function hasFlag(argv, name) {
  return argv.includes(`--${name}`);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 25. Resolve module dirname ESM
**Difficulty:** Easy
**Question:** Write helper getting `__dirname` equivalent in ESM using `import.meta.url`.

Example: join with data file.
**Hints:** fileURLToPath + path.dirname.
**Solution:**
```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function dirnameFromMeta(metaUrl) {
  return path.dirname(fileURLToPath(metaUrl));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 26. Create readable from array
**Difficulty:** Easy
**Question:** Write `readableFromLines(lines)` using `Readable.from` yielding each line as string chunk.

Example: stream lines to consumer.
**Hints:** Readable.from(iterable).
**Solution:**
```js
import { Readable } from 'node:stream';

export function readableFromLines(lines) {
  return Readable.from(lines.map((l) => l + '\n'));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 27. Transform uppercase stream
**Difficulty:** Easy
**Question:** Write `upperCaseTransform()` Transform stream converting utf8 string chunks to uppercase.

Example: pipeline file → transform → stdout.
**Hints:** new Transform({ transform(chunk,e,cb){ cb(null, chunk.toString().toUpperCase()) } }).
**Solution:**
```js
import { Transform } from 'node:stream';

export function upperCaseTransform() {
  return new Transform({
    transform(chunk, _enc, cb) {
      cb(null, chunk.toString('utf8').toUpperCase());
    },
  });
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 28. Child process execFile version
**Difficulty:** Easy
**Question:** Write `async function nodeVersion()` running `execFile("node", ["-v"])` and returning stdout trimmed.

Example: "v22.x.x".
**Hints:** execFile from child_process/promises.
**Solution:**
```js
import { execFile } from 'node:child_process/promises';

export async function nodeVersion() {
  const { stdout } = await execFile('node', ['-v']);
  return stdout.trim();
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 29. Promisify callback API
**Difficulty:** Easy
**Question:** Given `fs.readFile(path, cb)`, show `readFileP` using `util.promisify`.

Example: await readFileP("f.txt").
**Hints:** promisify(fs.readFile).
**Solution:**
```js
import fs from 'node:fs';
import { promisify } from 'node:util';

export const readFileP = promisify(fs.readFile);
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 30. HTTP GET JSON client
**Difficulty:** Easy
**Question:** Write `async function fetchJson(url)` using global `fetch` (Node 18+) returning parsed JSON.

Example: call public API.
**Hints:** const res = await fetch(url); return res.json().
**Solution:**
```js
export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 31. Graceful shutdown stub
**Difficulty:** Easy
**Question:** Write `setupGracefulShutdown(server)` listening for SIGINT/SIGTERM to `server.close()` then exit 0.

Example: Ctrl+C drains connections.
**Hints:** process.on signals; server.close callback.
**Solution:**
```js
export function setupGracefulShutdown(server) {
  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 32. MIME type by extension
**Difficulty:** Easy
**Question:** Write `mimeFromPath(filePath)` returning content-type for .html/.json/.txt else application/octet-stream.

Example: "a.json" → application/json.
**Hints:** path.extname switch.
**Solution:**
```js
import path from 'node:path';

export function mimeFromPath(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.html': return 'text/html; charset=utf-8';
    case '.json': return 'application/json';
    case '.txt': return 'text/plain; charset=utf-8';
    default: return 'application/octet-stream';
  }
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 33. Append line to log file
**Difficulty:** Easy
**Question:** Write `async function appendLog(file, line)` appending line + newline with flag "a".

Example: audit log.
**Hints:** writeFile with flag a or appendFile.
**Solution:**
```js
import { appendFile } from 'node:fs/promises';

export async function appendLog(file, line) {
  await appendFile(file, line + '\n', 'utf8');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 34. Parse JSON body middleware
**Difficulty:** Easy
**Question:** Write async middleware that reads body, JSON.parses into `req.body`, calls next; on error next(err) with status 400.

Example: POST /api.
**Hints:** readBody + safe parse.
**Solution:**
```js
async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

export async function jsonBody(req, res, next) {
  try {
    const raw = await readBody(req);
    req.body = raw ? JSON.parse(raw) : {};
    next();
  } catch (err) {
    err.status = 400;
    next(err);
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 35. Health check route
**Difficulty:** Easy
**Question:** In a raw http server, if pathname is `/healthz` return 200 `ok`, else 404.

Example: k8s probe.
**Hints:** URL pathname check.
**Solution:**
```js
import http from 'node:http';

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  } else {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(3000);
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 36. Basic auth parse header
**Difficulty:** Easy
**Question:** Write `parseBasicAuth(header)` for `Authorization: Basic ...` returning `{user,pass}` or null.

Example: decode base64 user:pass.
**Hints:** Buffer.from(b64,"base64"); split on first :.
**Solution:**
```js
export function parseBasicAuth(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  const i = decoded.indexOf(':');
  if (i < 0) return null;
  return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 37. Rate limit map counter
**Difficulty:** Easy
**Question:** Write `createFixedWindowLimiter({ limit, windowMs })` returning `(key)=>boolean` allowing up to limit hits per window per key.

Example: IP throttle.
**Hints:** Map key→{count,reset}.
**Solution:**
```js
export function createFixedWindowLimiter({ limit, windowMs }) {
  const hits = new Map();
  return (key) => {
    const now = Date.now();
    let e = hits.get(key);
    if (!e || now >= e.reset) e = { count: 0, reset: now + windowMs };
    e.count++;
    hits.set(key, e);
    return e.count <= limit;
  };
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(keys)

## 38. TMP file path
**Difficulty:** Easy
**Question:** Write `tempPath(name)` joining `os.tmpdir()` with name.

Example: write upload temp.
**Hints:** os.tmpdir + path.join.
**Solution:**
```js
import os from 'node:os';
import path from 'node:path';

export function tempPath(name) {
  return path.join(os.tmpdir(), name);
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 39. CPU count
**Difficulty:** Easy
**Question:** Write `workerHint()` returning `os.availableParallelism?.() ?? os.cpus().length`.

Example: size thread pool.
**Hints:** os module.
**Solution:**
```js
import os from 'node:os';

export function workerHint() {
  return typeof os.availableParallelism === 'function'
    ? os.availableParallelism()
    : os.cpus().length;
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 40. Echo TCP server
**Difficulty:** Easy
**Question:** Create a TCP server with `node:net` that echoes received data back to the socket.

Example: nc localhost 9000.
**Hints:** net.createServer; socket.pipe(socket).
**Solution:**
```js
import net from 'node:net';

net.createServer((socket) => {
  socket.pipe(socket);
}).listen(9000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 41. JSON lines write
**Difficulty:** Easy
**Question:** Write `async function writeJsonl(file, rows)` writing each object as one JSON line.

Example: export events.
**Hints:** map JSON.stringify join newlines.
**Solution:**
```js
import { writeFile } from 'node:fs/promises';

export async function writeJsonl(file, rows) {
  const body = rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
  await writeFile(file, body, 'utf8');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 42. Read JSON lines
**Difficulty:** Easy
**Question:** Write `async function readJsonl(file)` reading utf8 file into array of parsed objects (skip empty lines).

Example: load events.
**Hints:** split /\r?\n/; JSON.parse.
**Solution:**
```js
import { readFile } from 'node:fs/promises';

export async function readJsonl(file) {
  const text = await readFile(file, 'utf8');
  return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 43. Assert node version
**Difficulty:** Easy
**Question:** Write `assertNodeMajor(min)` throwing if `process.versions.node` major < min.

Example: require Node 20+.
**Hints:** parse major from versions.node.
**Solution:**
```js
export function assertNodeMajor(min) {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < min) throw new Error(`Need Node >= ${min}, got ${process.versions.node}`);
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 44. Unhandled rejection log
**Difficulty:** Easy
**Question:** Write `installUnhandledRejectionLogger()` logging reason on `process.on("unhandledRejection")`.

Example: surface bugs.
**Hints:** process.on unhandledRejection.
**Solution:**
```js
export function installUnhandledRejectionLogger() {
  process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection', reason);
  });
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 45. Timeout a promise
**Difficulty:** Easy
**Question:** Write `withTimeout(promise, ms)` rejecting with Error("timeout") if slow; clear timer on settle.

Example: wrap DB call.
**Hints:** Promise.race + finally clearTimeout.
**Solution:**
```js
export function withTimeout(promise, ms) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 46. Retry async function
**Difficulty:** Easy
**Question:** Write `async function retry(fn, attempts=3)` retrying on throw with no delay.

Example: flaky disk.
**Hints:** for loop try/catch.
**Solution:**
```js
export async function retry(fn, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) { last = e; }
  }
  throw last;
}
```
**Time Complexity:** O(attempts)
**Space Complexity:** O(1)

## 47. Create hash of file
**Difficulty:** Easy
**Question:** Write `async function hashFile(path)` SHA-256 hex via streaming update from createReadStream.

Example: integrity check.
**Hints:** pipeline into hash or data events.
**Solution:**
```js
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { finished } from 'node:stream/promises';

export async function hashFile(filePath) {
  const hash = createHash('sha256');
  const stream = fs.createReadStream(filePath);
  stream.pipe(hash);
  await finished(hash);
  return hash.digest('hex');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 48. Normalize line endings
**Difficulty:** Easy
**Question:** Write `toLF(text)` converting CRLF to LF.

Example: cross-platform text.
**Hints:** replaceAll \r\n.
**Solution:**
```js
export function toLF(text) {
  return text.replaceAll('\r\n', '\n');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 49. Is absolute path
**Difficulty:** Easy
**Question:** Write `checkAbsolute(p)` wrapping `path.isAbsolute`.

Example: reject relative user paths for chroot-ish checks.
**Hints:** path.isAbsolute.
**Solution:**
```js
import path from 'node:path';

export function checkAbsolute(p) {
  return path.isAbsolute(p);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 50. Simple static file server
**Difficulty:** Easy
**Question:** HTTP server: map URL path to files under `./public` using path.join + path.normalize; reject `..` escape; stream file or 404.

Example: GET /index.html.
**Hints:** resolve under root; startsWith root check.
**Solution:**
```js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('./public');
http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('forbidden'); }
  const stream = fs.createReadStream(file);
  stream.on('error', () => { res.writeHead(404); res.end('missing'); });
  stream.pipe(res);
}).listen(3000);
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)
