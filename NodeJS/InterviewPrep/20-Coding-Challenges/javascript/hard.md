# JavaScript Challenges — Hard

100 hard interview problems. Each entry has a matching title, prompt, working solution, and complexity.

## 1. Promise constructor polyfill
**Difficulty:** Hard
**Question:** Implement `MyPromise` supporting `executor(resolve,reject)`, `.then`, `.catch`, and sync/async settlement like native Promises (microtask then-callbacks).

Example: `new MyPromise(r => r(1)).then(x => x+1)` → fulfills with `2`.
**Hints:** Store state/value/handlers; flush handlers via queueMicrotask on settle.
**Solution:**
```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];
    const settle = (state, value) => {
      if (this.state !== 'pending') return;
      this.state = state;
      this.value = value;
      queueMicrotask(() => this.handlers.splice(0).forEach(h => h()));
    };
    try {
      executor(
        v => settle('fulfilled', v),
        e => settle('rejected', e)
      );
    } catch (e) {
      settle('rejected', e);
    }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = () => {
        try {
          if (this.state === 'fulfilled') {
            resolve(typeof onFulfilled === 'function' ? onFulfilled(this.value) : this.value);
          } else {
            if (typeof onRejected === 'function') resolve(onRejected(this.value));
            else reject(this.value);
          }
        } catch (e) {
          reject(e);
        }
      };
      if (this.state === 'pending') this.handlers.push(run);
      else queueMicrotask(run);
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}
```
**Time Complexity:** O(1) per then
**Space Complexity:** O(h) handlers

## 2. Deep equal with cycles
**Difficulty:** Hard
**Question:** Write `deepEqual(a, b)` that compares values deeply and correctly handles cyclic object graphs (same shape of cycles → equal).

Example: `a={}; a.self=a; b={}; b.self=b` → `true`.
**Hints:** DFS with a Map of paired visited references.
**Solution:**
```js
function deepEqual(a, b, seen = new Map()) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);
  const ka = Reflect.ownKeys(a);
  const kb = Reflect.ownKeys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!deepEqual(a[k], b[k], seen)) return false;
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 3. Structured clone polyfill
**Difficulty:** Hard
**Question:** Write `structuredClonePolyfill(value)` supporting plain objects, arrays, Date, Map, Set, ArrayBuffer/TypedArray, and cyclic references (throw on functions/symbols like structuredClone).

Example: clone a Map with a cyclic object value.
**Hints:** DFS with WeakMap of clones; branch by type tag.
**Solution:**
```js
function structuredClonePolyfill(value, seen = new WeakMap()) {
  if (typeof value === 'function' || typeof value === 'symbol') {
    throw new Error('DataCloneError');
  }
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (ArrayBuffer.isView(value)) {
    const buf = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
    return new value.constructor(buf);
  }
  if (value instanceof Map) {
    const m = new Map();
    seen.set(value, m);
    for (const [k, v] of value) m.set(structuredClonePolyfill(k, seen), structuredClonePolyfill(v, seen));
    return m;
  }
  if (value instanceof Set) {
    const s = new Set();
    seen.set(value, s);
    for (const v of value) s.add(structuredClonePolyfill(v, seen));
    return s;
  }
  if (Array.isArray(value)) {
    const arr = [];
    seen.set(value, arr);
    for (const v of value) arr.push(structuredClonePolyfill(v, seen));
    return arr;
  }
  const out = {};
  seen.set(value, out);
  for (const k of Reflect.ownKeys(value)) {
    if (typeof k === 'symbol') throw new Error('DataCloneError');
    out[k] = structuredClonePolyfill(value[k], seen);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 4. Cooperative task scheduler
**Difficulty:** Hard
**Question:** Implement class `Scheduler` with `add(task, priority=0)` and `start()` where `task` is `async () => void`. Higher priority runs first; yield between tasks so the event loop stays responsive.

Example: add low then high priority; high runs first.
**Hints:** Binary heap (or sort) by priority; await each task; optional setImmediate/setTimeout(0) between.
**Solution:**
```js
class Scheduler {
  constructor() {
    this.q = [];
    this.running = false;
  }
  add(task, priority = 0) {
    this.q.push({ task, priority });
    this.q.sort((a, b) => b.priority - a.priority);
  }
  async start() {
    if (this.running) return;
    this.running = true;
    while (this.q.length) {
      const { task } = this.q.shift();
      await task();
      await new Promise(r => setTimeout(r, 0));
    }
    this.running = false;
  }
}
```
**Time Complexity:** O(n log n) inserts
**Space Complexity:** O(n)

## 5. Wildcard pub/sub
**Difficulty:** Hard
**Question:** Implement class `EventBus` with `on(pattern, handler)`, `off(pattern, handler)`, `emit(event, ...args)`. Patterns may use `*` (one segment) and `**` (rest). Segments split on `.`.

Example: `on("user.*.login", h)` matches `user.42.login`.
**Hints:** Store pattern→handlers; match by segment walk with * and **.
**Solution:**
```js
class EventBus {
  constructor() {
    this.subs = new Map();
  }
  on(pattern, handler) {
    if (!this.subs.has(pattern)) this.subs.set(pattern, new Set());
    this.subs.get(pattern).add(handler);
  }
  off(pattern, handler) {
    this.subs.get(pattern)?.delete(handler);
  }
  emit(event, ...args) {
    const parts = event.split('.');
    for (const [pattern, handlers] of this.subs) {
      if (this.match(pattern.split('.'), parts)) {
        for (const h of handlers) h(...args);
      }
    }
  }
  match(pat, ev, i = 0, j = 0) {
    if (i === pat.length) return j === ev.length;
    if (pat[i] === '**') {
      if (i === pat.length - 1) return true;
      for (let k = j; k <= ev.length; k++) if (this.match(pat, ev, i + 1, k)) return true;
      return false;
    }
    if (j === ev.length) return false;
    if (pat[i] === '*' || pat[i] === ev[j]) return this.match(pat, ev, i + 1, j + 1);
    return false;
  }
}
```
**Time Complexity:** O(p·e) per emit
**Space Complexity:** O(subscriptions)

## 6. N-Queens
**Difficulty:** Hard
**Question:** Write `solveNQueens(n)` returning all distinct board configurations placing `n` queens so none attack. Each board is an array of strings with `Q`/`.`.

Example: `solveNQueens(4)` → 2 solutions.
**Hints:** Backtrack columns; track used rows, diagonals, anti-diagonals.
**Solution:**
```js
function solveNQueens(n) {
  const boards = [];
  const cols = new Set();
  const diag = new Set();
  const anti = new Set();
  const row = Array(n).fill('.');
  const board = Array.from({ length: n }, () => row.slice());
  function bt(r) {
    if (r === n) {
      boards.push(board.map(line => line.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      board[r][c] = 'Q';
      cols.add(c); diag.add(r - c); anti.add(r + c);
      bt(r + 1);
      board[r][c] = '.';
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
  }
  bt(0);
  return boards;
}
```
**Time Complexity:** O(n!)
**Space Complexity:** O(n²)

## 7. Sudoku solver
**Difficulty:** Hard
**Question:** Write `solveSudoku(board)` that mutates a 9×9 board of chars `"1"-"9"`/`"."` in-place to a valid completed sudoku (assume unique solution).

Example: fill empty cells consistently with row/col/box rules.
**Hints:** Backtrack first empty; try digits allowed by row/col/box bitsets.
**Solution:**
```js
function solveSudoku(board) {
  const row = Array.from({ length: 9 }, () => new Set());
  const col = Array.from({ length: 9 }, () => new Set());
  const box = Array.from({ length: 9 }, () => new Set());
  const empties = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '.') empties.push([r, c]);
      else {
        const d = board[r][c];
        row[r].add(d); col[c].add(d); box[Math.floor(r / 3) * 3 + Math.floor(c / 3)].add(d);
      }
    }
  }
  function bt(i) {
    if (i === empties.length) return true;
    const [r, c] = empties[i];
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    for (let d = 1; d <= 9; d++) {
      const ch = String(d);
      if (row[r].has(ch) || col[c].has(ch) || box[b].has(ch)) continue;
      board[r][c] = ch;
      row[r].add(ch); col[c].add(ch); box[b].add(ch);
      if (bt(i + 1)) return true;
      board[r][c] = '.';
      row[r].delete(ch); col[c].delete(ch); box[b].delete(ch);
    }
    return false;
  }
  bt(0);
  return board;
}
```
**Time Complexity:** O(9^k)
**Space Complexity:** O(1) extra beyond board

## 8. Word ladder
**Difficulty:** Hard
**Question:** Write `ladderLength(beginWord, endWord, wordList)` returning the number of words in the shortest transformation sequence (change one letter at a time; each intermediate in wordList), or `0` if impossible.

Example: `hit`→`cog` via `hot,dot,dog,lot,log,cog` → `5`.
**Hints:** BFS from begin; generate neighbors by changing one char.
**Solution:**
```js
function ladderLength(beginWord, endWord, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  const seen = new Set([beginWord]);
  while (q.length) {
    const [w, d] = q.shift();
    if (w === endWord) return d;
    const arr = w.split('');
    for (let i = 0; i < arr.length; i++) {
      const orig = arr[i];
      for (let c = 97; c <= 122; c++) {
        arr[i] = String.fromCharCode(c);
        const nw = arr.join('');
        if (dict.has(nw) && !seen.has(nw)) {
          seen.add(nw);
          q.push([nw, d + 1]);
        }
      }
      arr[i] = orig;
    }
  }
  return 0;
}
```
**Time Complexity:** O(n·L·26)
**Space Complexity:** O(n·L)

## 9. Alien dictionary
**Difficulty:** Hard
**Question:** Write `alienOrder(words)` that derives a valid alien alphabet order from a sorted list of words. Return any valid string of unique letters, or `""` if invalid.

Example: `["wrt","wrf","er","ett","rftt"]` → `"wertf"`.
**Hints:** Build graph of letter precedence; Kahn topological sort; detect cycles.
**Solution:**
```js
function alienOrder(words) {
  const graph = new Map();
  const indeg = new Map();
  for (const w of words) for (const ch of w) {
    if (!graph.has(ch)) { graph.set(ch, new Set()); indeg.set(ch, 0); }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return '';
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!graph.get(a[j]).has(b[j])) {
          graph.get(a[j]).add(b[j]);
          indeg.set(b[j], indeg.get(b[j]) + 1);
        }
        break;
      }
    }
  }
  const q = [...indeg].filter(([, d]) => d === 0).map(([c]) => c);
  let order = '';
  while (q.length) {
    const c = q.shift();
    order += c;
    for (const n of graph.get(c)) {
      indeg.set(n, indeg.get(n) - 1);
      if (indeg.get(n) === 0) q.push(n);
    }
  }
  return order.length === indeg.size ? order : '';
}
```
**Time Complexity:** O(C)
**Space Complexity:** O(C)

## 10. Median of two sorted arrays
**Difficulty:** Hard
**Question:** Write `findMedianSortedArrays(nums1, nums2)` returning the median of the two sorted arrays in O(log(m+n)).

Example: `[1,3]` and `[2]` → `2`; `[1,2]` and `[3,4]` → `2.5`.
**Hints:** Binary search partition on the smaller array.
**Solution:**
```js
function findMedianSortedArrays(a, b) {
  if (a.length > b.length) return findMedianSortedArrays(b, a);
  const m = a.length, n = b.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;
    const j = ((m + n + 1) >> 1) - i;
    const aL = i === 0 ? -Infinity : a[i - 1];
    const aR = i === m ? Infinity : a[i];
    const bL = j === 0 ? -Infinity : b[j - 1];
    const bR = j === n ? Infinity : b[j];
    if (aL <= bR && bL <= aR) {
      if ((m + n) % 2) return Math.max(aL, bL);
      return (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    }
    if (aL > bR) hi = i - 1;
    else lo = i + 1;
  }
  throw new Error('unreachable');
}
```
**Time Complexity:** O(log(min(m,n)))
**Space Complexity:** O(1)

## 11. Regex matching DP
**Difficulty:** Hard
**Question:** Write `isMatch(s, p)` implementing regex where `.` matches any single char and `*` matches zero or more of the preceding element.

Example: `isMatch("aab","c*a*b")` → `true`.
**Hints:** DP boolean table; handle `*` by zero-or-more of previous.
**Solution:**
```js
function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2] ||
          ((p[j - 2] === '.' || p[j - 2] === s[i - 1]) && dp[i - 1][j]);
      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 12. Edit distance
**Difficulty:** Hard
**Question:** Write `minDistance(word1, word2)` returning the Levenshtein edit distance (insert/delete/replace).

Example: `"horse"`→`"ros"` → `3`.
**Hints:** Classic DP: dp[i][j] from prefixes.
**Solution:**
```js
function minDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 13. Longest increasing subsequence
**Difficulty:** Hard
**Question:** Write `lengthOfLIS(nums)` returning the length of the longest strictly increasing subsequence.

Example: `[10,9,2,5,3,7,101,18]` → `4`.
**Hints:** Patience sorting: maintain tails binary-searched.
**Solution:**
```js
function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 14. Binary tree max path sum
**Difficulty:** Hard
**Question:** Write `maxPathSum(root)` for a binary tree where a path can start/end anywhere; return the maximum node-sum along any path.

Example: `[−10,9,20,null,null,15,7]` → `42`.
**Hints:** DFS returning best downward gain; track global max of left+node+right.
**Solution:**
```js
function maxPathSum(root) {
  let best = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const L = Math.max(0, dfs(node.left));
    const R = Math.max(0, dfs(node.right));
    best = Math.max(best, node.val + L + R);
    return node.val + Math.max(L, R);
  }
  dfs(root);
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(h)

## 15. Serialize and deserialize binary tree
**Difficulty:** Hard
**Question:** Implement `serialize(root)` → string and `deserialize(data)` → tree using preorder with null markers.

Example: round-trip `[1,2,3,null,null,4,5]`.
**Hints:** Preorder join with commas; deserialize with queue of tokens.
**Solution:**
```js
function serialize(root) {
  const out = [];
  function dfs(n) {
    if (!n) { out.push('#'); return; }
    out.push(String(n.val));
    dfs(n.left);
    dfs(n.right);
  }
  dfs(root);
  return out.join(',');
}
function deserialize(data) {
  const tokens = data.split(',');
  let i = 0;
  function dfs() {
    const t = tokens[i++];
    if (t === '#' || t === undefined) return null;
    return { val: Number(t), left: dfs(), right: dfs() };
  }
  return dfs();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 16. LFU cache
**Difficulty:** Hard
**Question:** Implement class `LFUCache` with `constructor(capacity)`, `get(key)`, `put(key,value)`. Evict least-frequently used (tie → least recently used among that freq).

Example: capacity 2 — put/get updates frequencies correctly.
**Hints:** Map key→{value,freq}; Map freq→Map of keys in LRU order; track minFreq.
**Solution:**
```js
class LFUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.minFreq = 0;
    this.keyMap = new Map();
    this.freqMap = new Map();
  }
  _touch(key, entry) {
    const f = entry.freq;
    this.freqMap.get(f).delete(key);
    if (!this.freqMap.get(f).size) {
      this.freqMap.delete(f);
      if (this.minFreq === f) this.minFreq++;
    }
    entry.freq = f + 1;
    if (!this.freqMap.has(f + 1)) this.freqMap.set(f + 1, new Map());
    this.freqMap.get(f + 1).set(key, entry);
  }
  get(key) {
    if (!this.keyMap.has(key)) return -1;
    const e = this.keyMap.get(key);
    this._touch(key, e);
    return e.value;
  }
  put(key, value) {
    if (this.cap <= 0) return;
    if (this.keyMap.has(key)) {
      const e = this.keyMap.get(key);
      e.value = value;
      this._touch(key, e);
      return;
    }
    if (this.keyMap.size >= this.cap) {
      const bucket = this.freqMap.get(this.minFreq);
      const evictKey = bucket.keys().next().value;
      bucket.delete(evictKey);
      if (!bucket.size) this.freqMap.delete(this.minFreq);
      this.keyMap.delete(evictKey);
    }
    const entry = { value, freq: 1 };
    this.keyMap.set(key, entry);
    if (!this.freqMap.has(1)) this.freqMap.set(1, new Map());
    this.freqMap.get(1).set(key, entry);
    this.minFreq = 1;
  }
}
```
**Time Complexity:** O(1) amortized
**Space Complexity:** O(capacity)

## 17. Abortable promise map
**Difficulty:** Hard
**Question:** Write `async function mapAbortable(items, fn, { concurrency = Infinity, signal } = {})` mapping with concurrency limit; abort pending work when `signal` aborts and reject with the abort reason.

Example: abort mid-flight cancels remaining.
**Hints:** Worker pool; check signal; race each task against abort event.
**Solution:**
```js
async function mapAbortable(items, fn, { concurrency = Infinity, signal } = {}) {
  if (signal?.aborted) throw signal.reason ?? new Error('aborted');
  const results = new Array(items.length);
  let next = 0;
  const abort = new Promise((_, reject) => {
    signal?.addEventListener('abort', () => reject(signal.reason ?? new Error('aborted')), { once: true });
  });
  async function worker() {
    while (true) {
      if (signal?.aborted) throw signal.reason ?? new Error('aborted');
      const i = next++;
      if (i >= items.length) return;
      results[i] = await Promise.race([fn(items[i], i, signal), abort]);
    }
  }
  const n = Math.min(concurrency, items.length) || 0;
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}
```
**Time Complexity:** O(n) tasks
**Space Complexity:** O(concurrency)

## 18. Merge async iterators
**Difficulty:** Hard
**Question:** Write `async function* mergeAsyncIterators(...iters)` that yields values from multiple async iterables as they become available (fair race).

Example: merge two interval streams in arrival order.
**Hints:** Track pending next() per iterator; Promise.race; close finished ones.
**Solution:**
```js
async function* mergeAsyncIterators(...iters) {
  const pending = new Map();
  for (const it of iters.map(i => i[Symbol.asyncIterator]())) {
    pending.set(it, it.next().then(r => ({ it, r })));
  }
  while (pending.size) {
    const { it, r } = await Promise.race(pending.values());
    if (r.done) {
      pending.delete(it);
    } else {
      yield r.value;
      pending.set(it, it.next().then(res => ({ it, r: res })));
    }
  }
}
```
**Time Complexity:** O(n) yields
**Space Complexity:** O(k) iterators

## 19. Trapping rain water
**Difficulty:** Hard
**Question:** Write `trap(height)` returning how much water can be trapped between bars of an elevation map.

Example: `[0,1,0,2,1,0,1,3,2,1,2,1]` → `6`.
**Hints:** Two pointers with leftMax/rightMax.
**Solution:**
```js
function trap(height) {
  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      lMax = Math.max(lMax, height[l]);
      water += lMax - height[l];
      l++;
    } else {
      rMax = Math.max(rMax, height[r]);
      water += rMax - height[r];
      r--;
    }
  }
  return water;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 20. Largest rectangle in histogram
**Difficulty:** Hard
**Question:** Write `largestRectangleArea(heights)` returning the area of the largest rectangle in a histogram.

Example: `[2,1,5,6,2,3]` → `10`.
**Hints:** Monotonic increasing stack of indices; pop to compute width.
**Solution:**
```js
function largestRectangleArea(heights) {
  const stack = [-1];
  let best = 0;
  const h = heights.concat([0]);
  for (let i = 0; i < h.length; i++) {
    while (stack.length > 1 && h[stack[stack.length - 1]] > h[i]) {
      const height = h[stack.pop()];
      const width = i - stack[stack.length - 1] - 1;
      best = Math.max(best, height * width);
    }
    stack.push(i);
  }
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 21. Dijkstra shortest path
**Difficulty:** Hard
**Question:** Write `dijkstra(n, edges, src)` where `edges` is `[u,v,w][]` on a directed graph with non-negative weights. Return distances array (`Infinity` if unreachable).

Example: 3 nodes, edges from 0 → dists.
**Hints:** Binary heap / sorted set of [dist,node]; relax edges.
**Solution:**
```js
function dijkstra(n, edges, src) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) g[u].push([v, w]);
  const dist = Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = [[0, src]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d !== dist[u]) continue;
    for (const [v, w] of g[u]) {
      if (dist[v] > d + w) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}
```
**Time Complexity:** O((V+E) log V) with heap
**Space Complexity:** O(V+E)

## 22. Segment tree range sum
**Difficulty:** Hard
**Question:** Implement class `SegmentTree` with `constructor(nums)`, `update(i, val)`, `query(l, r)` inclusive range sum.

Example: nums `[1,3,5]` → query(0,2)=9; update(1,2); query(0,2)=8.
**Hints:** Build full binary tree over array; push updates; combine children.
**Solution:**
```js
class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = Array(this.n * 4).fill(0);
    this._build(1, 0, this.n - 1, nums);
  }
  _build(id, l, r, nums) {
    if (l === r) { this.tree[id] = nums[l]; return; }
    const m = (l + r) >> 1;
    this._build(id * 2, l, m, nums);
    this._build(id * 2 + 1, m + 1, r, nums);
    this.tree[id] = this.tree[id * 2] + this.tree[id * 2 + 1];
  }
  update(i, val) {
    this._upd(1, 0, this.n - 1, i, val);
  }
  _upd(id, l, r, i, val) {
    if (l === r) { this.tree[id] = val; return; }
    const m = (l + r) >> 1;
    if (i <= m) this._upd(id * 2, l, m, i, val);
    else this._upd(id * 2 + 1, m + 1, r, i, val);
    this.tree[id] = this.tree[id * 2] + this.tree[id * 2 + 1];
  }
  query(L, R) {
    return this._qry(1, 0, this.n - 1, L, R);
  }
  _qry(id, l, r, L, R) {
    if (R < l || r < L) return 0;
    if (L <= l && r <= R) return this.tree[id];
    const m = (l + r) >> 1;
    return this._qry(id * 2, l, m, L, R) + this._qry(id * 2 + 1, m + 1, r, L, R);
  }
}
```
**Time Complexity:** O(log n) update/query
**Space Complexity:** O(n)

## 23. Fenwick tree (BIT)
**Difficulty:** Hard
**Question:** Implement class `FenwickTree` with `constructor(n)`, `add(i, delta)` (1-indexed), `prefixSum(i)`, and `rangeSum(l,r)`.

Example: add values then query ranges.
**Hints:** LSB navigation: i += i&-i for update; i -= i&-i for prefix.
**Solution:**
```js
class FenwickTree {
  constructor(n) {
    this.n = n;
    this.bit = Array(n + 1).fill(0);
  }
  add(i, delta) {
    for (; i <= this.n; i += i & -i) this.bit[i] += delta;
  }
  prefixSum(i) {
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.bit[i];
    return s;
  }
  rangeSum(l, r) {
    return this.prefixSum(r) - this.prefixSum(l - 1);
  }
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(n)

## 24. KMP string search
**Difficulty:** Hard
**Question:** Write `kmpSearch(text, pattern)` returning the starting index of the first occurrence of `pattern` in `text`, or `-1`.

Example: `kmpSearch("ababcabcabababd","ababd")` → `10`.
**Hints:** Build LPS array; advance text/pattern with failure links.
**Solution:**
```js
function kmpSearch(text, pattern) {
  if (!pattern) return 0;
  const lps = Array(pattern.length).fill(0);
  for (let i = 1, len = 0; i < pattern.length; ) {
    if (pattern[i] === pattern[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  for (let i = 0, j = 0; i < text.length; ) {
    if (text[i] === pattern[j]) { i++; j++; }
    if (j === pattern.length) return i - j;
    if (i < text.length && text[i] !== pattern[j]) {
      if (j) j = lps[j - 1];
      else i++;
    }
  }
  return -1;
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(m)

## 25. Aho-Corasick multi-pattern search
**Difficulty:** Hard
**Question:** Write `ahoCorasick(text, patterns)` returning Map pattern→list of start indices for all occurrences.

Example: text `"ushers"`, patterns `["he","she","hers"]`.
**Hints:** Trie + failure links; emit outputs while scanning.
**Solution:**
```js
function ahoCorasick(text, patterns) {
  const root = { next: {}, fail: null, out: [] };
  for (const p of patterns) {
    let node = root;
    for (const ch of p) {
      if (!node.next[ch]) node.next[ch] = { next: {}, fail: null, out: [] };
      node = node.next[ch];
    }
    node.out.push(p);
  }
  const q = [];
  for (const ch of Object.keys(root.next)) {
    root.next[ch].fail = root;
    q.push(root.next[ch]);
  }
  while (q.length) {
    const v = q.shift();
    for (const [ch, u] of Object.entries(v.next)) {
      let f = v.fail;
      while (f && !f.next[ch]) f = f.fail;
      u.fail = f && f.next[ch] ? f.next[ch] : root;
      u.out = u.out.concat(u.fail.out);
      q.push(u);
    }
  }
  const found = new Map(patterns.map(p => [p, []]));
  let node = root;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    while (node && !node.next[ch]) node = node.fail;
    node = node ? node.next[ch] : root;
    if (!node) node = root;
    for (const p of node.out) found.get(p).push(i - p.length + 1);
  }
  return found;
}
```
**Time Complexity:** O(n + m + z)
**Space Complexity:** O(m)

## 26. Manacher longest palindromic substring
**Difficulty:** Hard
**Question:** Write `longestPalindrome(s)` returning any longest palindromic substring using Manacher’s algorithm.

Example: `"babad"` → `"bab"` or `"aba"`.
**Hints:** Transform with separators; expand using mirror symmetry.
**Solution:**
```js
function longestPalindrome(s) {
  const t = '^#' + s.split('').join('#') + '#$';
  const p = Array(t.length).fill(0);
  let c = 0, r = 0, best = 0, center = 0;
  for (let i = 1; i < t.length - 1; i++) {
    const mirror = 2 * c - i;
    if (i < r) p[i] = Math.min(r - i, p[mirror]);
    while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) p[i]++;
    if (i + p[i] > r) { c = i; r = i + p[i]; }
    if (p[i] > best) { best = p[i]; center = i; }
  }
  const start = (center - best) >> 1;
  return s.slice(start, start + best);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 27. Suffix array construction
**Difficulty:** Hard
**Question:** Write `buildSuffixArray(s)` returning the suffix array (starting indices of suffixes in lexicographic order).

Example: `"banana"` → `[5,3,1,0,4,2]`.
**Hints:** Prefix-doubling sort of ranks.
**Solution:**
```js
function buildSuffixArray(s) {
  const n = s.length;
  let sa = Array.from({ length: n }, (_, i) => i);
  let rank = Array.from(s, ch => ch.charCodeAt(0));
  for (let k = 1; k < n; k *= 2) {
    sa.sort((a, b) => {
      if (rank[a] !== rank[b]) return rank[a] - rank[b];
      const ra = a + k < n ? rank[a + k] : -1;
      const rb = b + k < n ? rank[b + k] : -1;
      return ra - rb;
    });
    const newRank = Array(n).fill(0);
    for (let i = 1; i < n; i++) {
      const a = sa[i - 1], b = sa[i];
      const same = rank[a] === rank[b] &&
        (a + k < n ? rank[a + k] : -1) === (b + k < n ? rank[b + k] : -1);
      newRank[b] = same ? newRank[a] : newRank[a] + 1;
    }
    rank = newRank;
    if (rank[sa[n - 1]] === n - 1) break;
  }
  return sa;
}
```
**Time Complexity:** O(n log² n)
**Space Complexity:** O(n)

## 28. Z-algorithm
**Difficulty:** Hard
**Question:** Write `zAlgorithm(s)` returning the Z-array where `z[i]` is the longest substring starting at `i` that is also a prefix of `s` (`z[0]=0` by convention here).

Example: `"aabcaabxaaaz"` Z values.
**Hints:** Maintain [L,R] window of rightmost Z-box.
**Solution:**
```js
function zAlgorithm(s) {
  const n = s.length;
  const z = Array(n).fill(0);
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
  }
  return z;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 29. Minimum window substring
**Difficulty:** Hard
**Question:** Write `minWindow(s, t)` returning the smallest substring of `s` covering all characters in `t` (with multiplicity), or `""`.

Example: `s="ADOBECODEBANC", t="ABC"` → `"BANC"`.
**Hints:** Sliding window with need/have counts.
**Solution:**
```js
function minWindow(s, t) {
  if (!t) return '';
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let missing = t.length, best = '', bestLen = Infinity;
  for (let l = 0, r = 0; r < s.length; r++) {
    if (need[s[r]] > 0) missing--;
    need[s[r]] = (need[s[r]] || 0) - 1;
    while (missing === 0) {
      if (r - l + 1 < bestLen) {
        bestLen = r - l + 1;
        best = s.slice(l, r + 1);
      }
      need[s[l]]++;
      if (need[s[l]] > 0) missing++;
      l++;
    }
  }
  return best;
}
```
**Time Complexity:** O(|s|+|t|)
**Space Complexity:** O(Σ)

## 30. Sliding window maximum
**Difficulty:** Hard
**Question:** Write `maxSlidingWindow(nums, k)` returning max of each contiguous window of size `k`.

Example: `[1,3,-1,-3,5,3,6,7], k=3` → `[3,3,5,5,6,7]`.
**Hints:** Deque of indices in decreasing value order.
**Solution:**
```js
function maxSlidingWindow(nums, k) {
  const dq = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 31. Word break II
**Difficulty:** Hard
**Question:** Write `wordBreak(s, wordDict)` returning all ways to segment `s` into dictionary words.

Example: `"catsanddog"` with `["cat","cats","and","sand","dog"]` → `["cats and dog","cat sand dog"]`.
**Hints:** DFS + memo of remaining suffix → sentences.
**Solution:**
```js
function wordBreak(s, wordDict) {
  const dict = new Set(wordDict);
  const memo = new Map();
  function dfs(start) {
    if (memo.has(start)) return memo.get(start);
    if (start === s.length) return [''];
    const res = [];
    for (let end = start + 1; end <= s.length; end++) {
      const w = s.slice(start, end);
      if (!dict.has(w)) continue;
      for (const rest of dfs(end)) res.push(rest ? w + ' ' + rest : w);
    }
    memo.set(start, res);
    return res;
  }
  return dfs(0);
}
```
**Time Complexity:** O(n² + total output)
**Space Complexity:** O(n²)

## 32. Palindrome pairs
**Difficulty:** Hard
**Question:** Write `palindromePairs(words)` returning all index pairs `[i,j]` such that `words[i]+words[j]` is a palindrome.

Example: `["abcd","dcba","lls","s","sssll"]` → several pairs.
**Hints:** Hash word→index; check prefixes/suffixes that are palindromes.
**Solution:**
```js
function palindromePairs(words) {
  const idx = new Map(words.map((w, i) => [w, i]));
  const isPal = s => {
    let l = 0, r = s.length - 1;
    while (l < r) if (s[l++] !== s[r--]) return false;
    return true;
  };
  const res = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    for (let cut = 0; cut <= w.length; cut++) {
      const left = w.slice(0, cut), right = w.slice(cut);
      if (isPal(left)) {
        const rev = [...right].reverse().join('');
        if (idx.has(rev) && idx.get(rev) !== i) res.push([idx.get(rev), i]);
      }
      if (cut < w.length && isPal(right)) {
        const rev = [...left].reverse().join('');
        if (idx.has(rev) && idx.get(rev) !== i) res.push([i, idx.get(rev)]);
      }
    }
  }
  return res;
}
```
**Time Complexity:** O(n·k²)
**Space Complexity:** O(n·k)

## 33. Burst balloons
**Difficulty:** Hard
**Question:** Write `maxCoins(nums)` for bursting balloons DP: bursting `i` gives `nums[left]*nums[i]*nums[right]` where left/right are adjacent remaining.

Example: `[3,1,5,8]` → `167`.
**Hints:** Interval DP on padded array with 1 borders.
**Solution:**
```js
function maxCoins(nums) {
  const a = [1, ...nums, 1];
  const n = a.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let l = 0; l + len < n; l++) {
      const r = l + len;
      for (let i = l + 1; i < r; i++) {
        dp[l][r] = Math.max(dp[l][r], a[l] * a[i] * a[r] + dp[l][i] + dp[i][r]);
      }
    }
  }
  return dp[0][n - 1];
}
```
**Time Complexity:** O(n³)
**Space Complexity:** O(n²)

## 34. Russian doll envelopes
**Difficulty:** Hard
**Question:** Write `maxEnvelopes(envelopes)` where each envelope is `[w,h]`; you can nest if both dimensions strictly increase. Return max chain length.

Example: `[[5,4],[6,4],[6,7],[2,3]]` → `3`.
**Hints:** Sort by w asc, h desc; LIS on heights.
**Solution:**
```js
function maxEnvelopes(envelopes) {
  envelopes.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);
  const tails = [];
  for (const [, h] of envelopes) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = h;
  }
  return tails.length;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 35. Critical connections in a network
**Difficulty:** Hard
**Question:** Write `criticalConnections(n, connections)` returning bridges in an undirected graph (Tarjan).

Example: n=4, connections `[[0,1],[1,2],[2,0],[1,3]]` → `[[1,3]]`.
**Hints:** DFS discovery/low-link; edge is bridge if low[v]>disc[u].
**Solution:**
```js
function criticalConnections(n, connections) {
  const g = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) { g[a].push(b); g[b].push(a); }
  const disc = Array(n).fill(-1);
  const low = Array(n).fill(0);
  const bridges = [];
  let time = 0;
  function dfs(u, parent) {
    disc[u] = low[u] = time++;
    for (const v of g[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else low[u] = Math.min(low[u], disc[v]);
    }
  }
  for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i, -1);
  return bridges;
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 36. Minimum cost to connect all points
**Difficulty:** Hard
**Question:** Write `minCostConnectPoints(points)` — MST cost connecting 2D points with Manhattan distance edges (Prim).

Example: `[[0,0],[2,2],[3,10],[5,2],[7,0]]` → `20`.
**Hints:** Prim with dense O(n²) or heap; Manhattan |x1-x2|+|y1-y2|.
**Solution:**
```js
function minCostConnectPoints(points) {
  const n = points.length;
  const inMst = Array(n).fill(false);
  const dist = Array(n).fill(Infinity);
  dist[0] = 0;
  let cost = 0;
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!inMst[i] && (u === -1 || dist[i] < dist[u])) u = i;
    inMst[u] = true;
    cost += dist[u];
    for (let v = 0; v < n; v++) {
      if (inMst[v]) continue;
      const w = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      dist[v] = Math.min(dist[v], w);
    }
  }
  return cost;
}
```
**Time Complexity:** O(n²)
**Space Complexity:** O(n)

## 37. Bellman-Ford with negative cycle detect
**Difficulty:** Hard
**Question:** Write `bellmanFord(n, edges, src)` returning `{dist, hasNegativeCycle}` for directed edges `[u,v,w]`.

Example: detect reachable negative cycle.
**Hints:** Relax |V|-1 times; one more pass marks cycle-reachable.
**Solution:**
```js
function bellmanFord(n, edges, src) {
  const dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < n - 1; i++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
  }
  let hasNegativeCycle = false;
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) hasNegativeCycle = true;
  }
  return { dist, hasNegativeCycle };
}
```
**Time Complexity:** O(VE)
**Space Complexity:** O(V)

## 38. Floyd-Warshall all-pairs
**Difficulty:** Hard
**Question:** Write `floydWarshall(n, edges)` returning n×n shortest-path matrix (`Infinity` if unreachable) for directed weighted graph.

Example: small dense graph.
**Hints:** Triple loop over intermediate k.
**Solution:**
```js
function floydWarshall(n, edges) {
  const d = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) d[i][i] = 0;
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
}
```
**Time Complexity:** O(n³)
**Space Complexity:** O(n²)

## 39. Max flow Edmonds-Karp
**Difficulty:** Hard
**Question:** Write `maxFlow(n, edges, s, t)` computing maximum flow on a directed capacity graph (`edges` as `[u,v,cap]`).

Example: classic bipartite-ish network.
**Hints:** BFS residual paths; augment until no path.
**Solution:**
```js
function maxFlow(n, edges, s, t) {
  const g = Array.from({ length: n }, () => []);
  const cap = Array.from({ length: n }, () => Array(n).fill(0));
  for (const [u, v, c] of edges) {
    g[u].push(v); g[v].push(u);
    cap[u][v] += c;
  }
  function bfs() {
    const parent = Array(n).fill(-1);
    parent[s] = s;
    const q = [s];
    while (q.length) {
      const u = q.shift();
      for (const v of g[u]) {
        if (parent[v] === -1 && cap[u][v] > 0) {
          parent[v] = u;
          if (v === t) return parent;
          q.push(v);
        }
      }
    }
    return null;
  }
  let flow = 0;
  let parent;
  while ((parent = bfs())) {
    let f = Infinity;
    for (let v = t; v !== s; v = parent[v]) f = Math.min(f, cap[parent[v]][v]);
    for (let v = t; v !== s; v = parent[v]) {
      cap[parent[v]][v] -= f;
      cap[v][parent[v]] += f;
    }
    flow += f;
  }
  return flow;
}
```
**Time Complexity:** O(VE²)
**Space Complexity:** O(V²)

## 40. Strongly connected components (Tarjan)
**Difficulty:** Hard
**Question:** Write `tarjanSCC(n, edges)` returning arrays of node lists, one per strongly connected component in a directed graph.

Example: graph with 3 SCCs.
**Hints:** DFS stack + low-link; pop until root.
**Solution:**
```js
function tarjanSCC(n, edges) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) g[u].push(v);
  const disc = Array(n).fill(-1);
  const low = Array(n).fill(0);
  const on = Array(n).fill(false);
  const stack = [];
  const sccs = [];
  let time = 0;
  function dfs(u) {
    disc[u] = low[u] = time++;
    stack.push(u); on[u] = true;
    for (const v of g[u]) {
      if (disc[v] === -1) { dfs(v); low[u] = Math.min(low[u], low[v]); }
      else if (on[v]) low[u] = Math.min(low[u], disc[v]);
    }
    if (low[u] === disc[u]) {
      const comp = [];
      let x;
      do { x = stack.pop(); on[x] = false; comp.push(x); } while (x !== u);
      sccs.push(comp);
    }
  }
  for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i);
  return sccs;
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 41. Topological sort Kahn
**Difficulty:** Hard
**Question:** Write `topoSort(n, edges)` returning a valid topological order of a DAG, or `null` if a cycle exists.

Example: course-prereq style edges.
**Hints:** Indegree queue; peel zeros.
**Solution:**
```js
function topoSort(n, edges) {
  const g = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [u, v] of edges) { g[u].push(v); indeg[v]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : null;
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 42. Binary lifting LCA
**Difficulty:** Hard
**Question:** Implement `buildLCA(n, root, edges)` returning `{lca(u,v)}` for a tree (0-indexed undirected edges).

Example: query ancestors on a rooted tree.
**Hints:** Precompute up[k][v]=2^k parent; lift to same depth then jump.
**Solution:**
```js
function buildLCA(n, root, edges) {
  const LOG = Math.ceil(Math.log2(n)) + 1;
  const g = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { g[a].push(b); g[b].push(a); }
  const up = Array.from({ length: LOG }, () => Array(n).fill(-1));
  const depth = Array(n).fill(0);
  function dfs(u, p) {
    up[0][u] = p;
    for (const v of g[u]) if (v !== p) {
      depth[v] = depth[u] + 1;
      dfs(v, u);
    }
  }
  dfs(root, root);
  for (let k = 1; k < LOG; k++)
    for (let v = 0; v < n; v++) up[k][v] = up[k - 1][up[k - 1][v]];
  function lift(u, d) {
    for (let k = 0; k < LOG; k++) if (d & (1 << k)) u = up[k][u];
    return u;
  }
  function lca(u, v) {
    if (depth[u] < depth[v]) [u, v] = [v, u];
    u = lift(u, depth[u] - depth[v]);
    if (u === v) return u;
    for (let k = LOG - 1; k >= 0; k--) {
      if (up[k][u] !== up[k][v]) { u = up[k][u]; v = up[k][v]; }
    }
    return up[0][u];
  }
  return { lca };
}
```
**Time Complexity:** O(n log n) build, O(log n) query
**Space Complexity:** O(n log n)

## 43. Union-Find with rollback
**Difficulty:** Hard
**Question:** Implement class `RollbackDSU` with `find`, `union` returning whether merged, and `rollback()` undoing last successful union (for offline connectivity).

Example: union then rollback restores components.
**Hints:** Store parent/rank history stack; no path compression or undo it.
**Solution:**
```js
class RollbackDSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.history = [];
  }
  find(x) {
    while (x !== this.parent[x]) x = this.parent[x];
    return x;
  }
  union(a, b) {
    a = this.find(a); b = this.find(b);
    if (a === b) { this.history.push(null); return false; }
    if (this.rank[a] < this.rank[b]) [a, b] = [b, a];
    this.history.push([b, this.parent[b], a, this.rank[a]]);
    this.parent[b] = a;
    if (this.rank[a] === this.rank[b]) this.rank[a]++;
    return true;
  }
  rollback() {
    const h = this.history.pop();
    if (!h) return;
    const [b, pb, a, ra] = h;
    this.parent[b] = pb;
    this.rank[a] = ra;
  }
}
```
**Time Complexity:** O(α) ≈ O(log n) without compression
**Space Complexity:** O(n)

## 44. Sparse table RMQ
**Difficulty:** Hard
**Question:** Implement class `SparseTable` with `constructor(arr)` and `query(l,r)` returning minimum on inclusive range (idempotent, static array).

Example: arr `[1,3,-1,5]` query(1,3)=`-1`.
**Hints:** Precompute st[k][i]=min of 2^k starting at i.
**Solution:**
```js
class SparseTable {
  constructor(arr) {
    this.n = arr.length;
    const LOG = Math.floor(Math.log2(this.n)) + 1;
    this.st = Array.from({ length: LOG }, () => Array(this.n).fill(0));
    this.st[0] = arr.slice();
    for (let k = 1; k < LOG; k++) {
      for (let i = 0; i + (1 << k) <= this.n; i++) {
        this.st[k][i] = Math.min(this.st[k - 1][i], this.st[k - 1][i + (1 << (k - 1))]);
      }
    }
  }
  query(l, r) {
    const k = Math.floor(Math.log2(r - l + 1));
    return Math.min(this.st[k][l], this.st[k][r - (1 << k) + 1]);
  }
}
```
**Time Complexity:** O(1) query, O(n log n) build
**Space Complexity:** O(n log n)

## 45. Convex hull Andrew
**Difficulty:** Hard
**Question:** Write `convexHull(points)` returning the convex hull of 2D points in CCW order (no collinear middle points on edges).

Example: set of points → polygon vertices.
**Hints:** Monotone chain: sort by x/y; build lower/upper.
**Solution:**
```js
function convexHull(points) {
  const pts = [...points].sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
  if (pts.length <= 1) return pts;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 46. Line sweep closest pair
**Difficulty:** Hard
**Question:** Write `closestPair(points)` returning the minimum Euclidean distance between any two points.

Example: random 2D points.
**Hints:** Divide and conquer or sweep with y-sorted strip.
**Solution:**
```js
function closestPair(points) {
  const px = [...points].sort((a, b) => a[0] - b[0]);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function solve(pts) {
    const n = pts.length;
    if (n <= 3) {
      let best = Infinity;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) best = Math.min(best, dist(pts[i], pts[j]));
      return { best, py: [...pts].sort((a, b) => a[1] - b[1]) };
    }
    const mid = n >> 1;
    const midX = pts[mid][0];
    const L = solve(pts.slice(0, mid));
    const R = solve(pts.slice(mid));
    let best = Math.min(L.best, R.best);
    const py = [];
    let i = 0, j = 0;
    while (i < L.py.length || j < R.py.length) {
      if (j >= R.py.length || (i < L.py.length && L.py[i][1] <= R.py[j][1])) py.push(L.py[i++]);
      else py.push(R.py[j++]);
    }
    const strip = py.filter(p => Math.abs(p[0] - midX) < best);
    for (let a = 0; a < strip.length; a++) {
      for (let b = a + 1; b < strip.length && strip[b][1] - strip[a][1] < best; b++) {
        best = Math.min(best, dist(strip[a], strip[b]));
      }
    }
    return { best, py };
  }
  return solve(px).best;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 47. Count inversions Fenwick
**Difficulty:** Hard
**Question:** Write `countInversions(arr)` returning the number of pairs i<j with arr[i]>arr[j], using coordinate compression + Fenwick.

Example: `[2,4,1,3,5]` → `3`.
**Hints:** Scan right-to-left; query how many smaller already seen.
**Solution:**
```js
function countInversions(arr) {
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i + 1]));
  const bit = new FenwickTree(sorted.length);
  let inv = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    const r = rank.get(arr[i]);
    inv += bit.prefixSum(r - 1);
    bit.add(r, 1);
  }
  return inv;
}
class FenwickTree {
  constructor(n) { this.n = n; this.bit = Array(n + 1).fill(0); }
  add(i, d) { for (; i <= this.n; i += i & -i) this.bit[i] += d; }
  prefixSum(i) { let s = 0; for (; i > 0; i -= i & -i) s += this.bit[i]; return s; }
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 48. Heavy-light decomposition path query
**Difficulty:** Hard
**Question:** Implement a simplified HLD for a tree of values: `buildHLD(n, root, edges, values)` returning `pathSum(u,v)` assuming unit edge weights are node values summed on path.

Example: sum node values between two nodes.
**Hints:** Decompose heavy paths; reduce path to O(log n) segment queries.
**Solution:**
```js
function buildHLD(n, root, edges, values) {
  const g = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { g[a].push(b); g[b].push(a); }
  const parent = Array(n).fill(-1);
  const depth = Array(n).fill(0);
  const size = Array(n).fill(1);
  const heavy = Array(n).fill(-1);
  function dfs(u, p) {
    parent[u] = p;
    for (const v of g[u]) if (v !== p) {
      depth[v] = depth[u] + 1;
      dfs(v, u);
      size[u] += size[v];
      if (heavy[u] === -1 || size[v] > size[heavy[u]]) heavy[u] = v;
    }
  }
  dfs(root, -1);
  const head = Array(n).fill(0);
  const pos = Array(n).fill(0);
  const order = [];
  function decompose(u, h) {
    head[u] = h;
    pos[u] = order.length;
    order.push(u);
    if (heavy[u] !== -1) decompose(heavy[u], h);
    for (const v of g[u]) if (v !== parent[u] && v !== heavy[u]) decompose(v, v);
  }
  decompose(root, root);
  const arr = order.map(u => values[u]);
  const tree = new SegmentTree(arr);
  function pathSum(u, v) {
    let sum = 0;
    while (head[u] !== head[v]) {
      if (depth[head[u]] < depth[head[v]]) [u, v] = [v, u];
      sum += tree.query(pos[head[u]], pos[u]);
      u = parent[head[u]];
    }
    if (depth[u] > depth[v]) [u, v] = [v, u];
    sum += tree.query(pos[u], pos[v]);
    return sum;
  }
  return { pathSum };
}
class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = Array(this.n * 4).fill(0);
    const build = (id, l, r) => {
      if (l === r) { this.tree[id] = nums[l]; return; }
      const m = (l + r) >> 1;
      build(id * 2, l, m); build(id * 2 + 1, m + 1, r);
      this.tree[id] = this.tree[id * 2] + this.tree[id * 2 + 1];
    };
    if (this.n) build(1, 0, this.n - 1);
  }
  query(L, R) {
    const qry = (id, l, r) => {
      if (R < l || r < L) return 0;
      if (L <= l && r <= R) return this.tree[id];
      const m = (l + r) >> 1;
      return qry(id * 2, l, m) + qry(id * 2 + 1, m + 1, r);
    };
    return qry(1, 0, this.n - 1);
  }
}
```
**Time Complexity:** O(log² n) path
**Space Complexity:** O(n)

## 49. Persistent segment tree (k-th)
**Difficulty:** Hard
**Question:** Implement `buildPersistentKth(arr)` returning `kth(L,R,k)` — the k-th smallest (1-indexed) in arr[L..R] using persistent segment trees on compressed ranks.

Example: subarray order statistics.
**Hints:** Each prefix version inserts one rank; binary search on count difference.
**Solution:**
```js
function buildPersistentKth(arr) {
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i + 1]));
  const m = sorted.length;
  const nullNode = { l: null, r: null, sum: 0 };
  nullNode.l = nullNode.r = nullNode;
  function upd(prev, lo, hi, pos) {
    const node = { l: prev.l, r: prev.r, sum: prev.sum + 1 };
    if (lo === hi) return node;
    const mid = (lo + hi) >> 1;
    if (pos <= mid) node.l = upd(prev.l, lo, mid, pos);
    else node.r = upd(prev.r, mid + 1, hi, pos);
    return node;
  }
  const roots = [nullNode];
  for (const x of arr) roots.push(upd(roots[roots.length - 1], 1, m, rank.get(x)));
  function kth(L, R, k) {
    let a = roots[L], b = roots[R + 1], lo = 1, hi = m;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const cnt = b.l.sum - a.l.sum;
      if (cnt >= k) { hi = mid; a = a.l; b = b.l; }
      else { k -= cnt; lo = mid + 1; a = a.r; b = b.r; }
    }
    return sorted[lo - 1];
  }
  return { kth };
}
```
**Time Complexity:** O(n log n) build, O(log n) query
**Space Complexity:** O(n log n)

## 50. Trie autocomplete
**Difficulty:** Hard
**Question:** Implement class `AutocompleteTrie` with `insert(word)`, `suggest(prefix, limit)` returning up to `limit` lexicographically smallest words with the prefix.

Example: dictionary suggestions.
**Hints:** Trie nodes with children map; DFS collect from prefix node.
**Solution:**
```js
class AutocompleteTrie {
  constructor() {
    this.root = { kids: {}, end: false };
  }
  insert(word) {
    let n = this.root;
    for (const ch of word) {
      if (!n.kids[ch]) n.kids[ch] = { kids: {}, end: false };
      n = n.kids[ch];
    }
    n.end = true;
  }
  suggest(prefix, limit = 10) {
    let n = this.root;
    for (const ch of prefix) {
      if (!n.kids[ch]) return [];
      n = n.kids[ch];
    }
    const out = [];
    const dfs = (node, path) => {
      if (out.length >= limit) return;
      if (node.end) out.push(path);
      for (const ch of Object.keys(node.kids).sort()) dfs(node.kids[ch], path + ch);
    };
    dfs(n, prefix);
    return out;
  }
}
```
**Time Complexity:** O(L + k)
**Space Complexity:** O(total chars)

## 51. Expression add operators
**Difficulty:** Hard
**Question:** Write `addOperators(num, target)` returning all ways to insert `+`, `-`, `*` between digits of `num` (no leading zeros) to evaluate to `target`.

Example: `"123", 6` → `["1+2+3","1*2*3"]`.
**Hints:** DFS with running total and last multiplicand for `*`.
**Solution:**
```js
function addOperators(num, target) {
  const res = [];
  function dfs(i, expr, value, last) {
    if (i === num.length) {
      if (value === target) res.push(expr);
      return;
    }
    for (let j = i; j < num.length; j++) {
      if (j > i && num[i] === '0') break;
      const str = num.slice(i, j + 1);
      const n = Number(str);
      if (i === 0) dfs(j + 1, str, n, n);
      else {
        dfs(j + 1, expr + '+' + str, value + n, n);
        dfs(j + 1, expr + '-' + str, value - n, -n);
        dfs(j + 1, expr + '*' + str, value - last + last * n, last * n);
      }
    }
  }
  dfs(0, '', 0, 0);
  return res;
}
```
**Time Complexity:** O(4^n)
**Space Complexity:** O(n)

## 52. Regular expression wildcard match
**Difficulty:** Hard
**Question:** Write `isMatchWildcard(s, p)` where `?` matches one char and `*` matches any sequence (including empty).

Example: `isMatchWildcard("adceb","*a*b")` → `true`.
**Hints:** Greedy with star backtrack indices, or DP.
**Solution:**
```js
function isMatchWildcard(s, p) {
  let i = 0, j = 0, star = -1, match = 0;
  while (i < s.length) {
    if (j < p.length && (p[j] === '?' || p[j] === s[i])) { i++; j++; }
    else if (j < p.length && p[j] === '*') { star = j++; match = i; }
    else if (star !== -1) { j = star + 1; i = ++match; }
    else return false;
  }
  while (j < p.length && p[j] === '*') j++;
  return j === p.length;
}
```
**Time Complexity:** O(mn) worst
**Space Complexity:** O(1)

## 53. Interleaving string
**Difficulty:** Hard
**Question:** Write `isInterleave(s1, s2, s3)` checking if `s3` is formed by interleaving `s1` and `s2` preserving order.

Example: `"aabcc","dbbca","aadbbcbcac"` → `true`.
**Hints:** DP boolean on prefixes of s1/s2.
**Solution:**
```js
function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i > 0) dp[i][j] ||= dp[i - 1][j] && s1[i - 1] === s3[i + j - 1];
      if (j > 0) dp[i][j] ||= dp[i][j - 1] && s2[j - 1] === s3[i + j - 1];
    }
  }
  return dp[m][n];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 54. Distinct subsequences
**Difficulty:** Hard
**Question:** Write `numDistinct(s, t)` counting distinct subsequences of `s` equal to `t`.

Example: `s="rabbbit", t="rabbit"` → `3`.
**Hints:** DP dp[i][j] ways using s[:i] to form t[:j].
**Solution:**
```js
function numDistinct(s, t) {
  const m = s.length, n = t.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = 1;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i - 1][j];
      if (s[i - 1] === t[j - 1]) dp[i][j] += dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 55. Longest valid parentheses
**Difficulty:** Hard
**Question:** Write `longestValidParentheses(s)` returning the length of the longest valid parentheses substring.

Example: `")()())"` → `4`.
**Hints:** Stack of indices; push -1 base; update on pop.
**Solution:**
```js
function longestValidParentheses(s) {
  const stack = [-1];
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') stack.push(i);
    else {
      stack.pop();
      if (!stack.length) stack.push(i);
      else best = Math.max(best, i - stack[stack.length - 1]);
    }
  }
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 56. Basic calculator III
**Difficulty:** Hard
**Question:** Write `calculate(s)` evaluating an expression with `+ - * /`, parentheses, and non-negative integers (integer division toward zero).

Example: `"(2+6*3+5-(3*14/7+2)*5)+3"` → `-12`.
**Hints:** Recursive descent or stack with recursive paren parse.
**Solution:**
```js
function calculate(s) {
  let i = 0;
  function parse() {
    const stack = [];
    let num = 0, op = '+';
    const apply = () => {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
    };
    while (i < s.length) {
      const c = s[i++];
      if (c === ' ') continue;
      if (c >= '0' && c <= '9') { num = num * 10 + Number(c); continue; }
      if (c === '(') { num = parse(); continue; }
      apply();
      num = 0;
      if (c === ')') break;
      op = c;
    }
    apply();
    return stack.reduce((a, b) => a + b, 0);
  }
  return parse();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 57. Serialize N-ary tree
**Difficulty:** Hard
**Question:** Implement `serializeNary(root)` and `deserializeNary(data)` for nodes `{val, children:[]}` using a format that encodes child counts.

Example: round-trip a small N-ary tree.
**Hints:** Preorder: val, childCount, then children recursively.
**Solution:**
```js
function serializeNary(root) {
  if (!root) return '';
  const out = [];
  function dfs(n) {
    out.push(String(n.val), String(n.children.length));
    for (const c of n.children) dfs(c);
  }
  dfs(root);
  return out.join(',');
}
function deserializeNary(data) {
  if (!data) return null;
  const tokens = data.split(',');
  let i = 0;
  function dfs() {
    const val = Number(tokens[i++]);
    const k = Number(tokens[i++]);
    const children = [];
    for (let j = 0; j < k; j++) children.push(dfs());
    return { val, children };
  }
  return dfs();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 58. Recover BST from swapped nodes
**Difficulty:** Hard
**Question:** Write `recoverTree(root)` that fixes a BST where exactly two nodes were swapped by values (mutate in-place).

Example: tree with two swapped values restored.
**Hints:** Inorder find two violations; swap their values.
**Solution:**
```js
function recoverTree(root) {
  let first = null, second = null, prev = null;
  function inorder(n) {
    if (!n) return;
    inorder(n.left);
    if (prev && prev.val > n.val) {
      if (!first) first = prev;
      second = n;
    }
    prev = n;
    inorder(n.right);
  }
  inorder(root);
  [first.val, second.val] = [second.val, first.val];
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(h)

## 59. Morris inorder traversal
**Difficulty:** Hard
**Question:** Write `morrisInorder(root)` returning node values in-order without recursion or stack (temporary threaded links).

Example: BST → sorted values.
**Hints:** Thread predecessor.right to current; visit then unlink.
**Solution:**
```js
function morrisInorder(root) {
  const out = [];
  let cur = root;
  while (cur) {
    if (!cur.left) {
      out.push(cur.val);
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right && pred.right !== cur) pred = pred.right;
      if (!pred.right) {
        pred.right = cur;
        cur = cur.left;
      } else {
        pred.right = null;
        out.push(cur.val);
        cur = cur.right;
      }
    }
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 60. Vertical order traversal of binary tree
**Difficulty:** Hard
**Question:** Write `verticalTraversal(root)` returning lists of node values by column left→right; within column by row then value.

Example: LeetCode-style vertical order.
**Hints:** DFS or BFS with (row,col); sort groups.
**Solution:**
```js
function verticalTraversal(root) {
  const nodes = [];
  function dfs(n, row, col) {
    if (!n) return;
    nodes.push([col, row, n.val]);
    dfs(n.left, row + 1, col - 1);
    dfs(n.right, row + 1, col + 1);
  }
  dfs(root, 0, 0);
  nodes.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const res = [];
  let prevCol = null;
  for (const [col, , val] of nodes) {
    if (col !== prevCol) { res.push([]); prevCol = col; }
    res[res.length - 1].push(val);
  }
  return res;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 61. Binary tree cameras
**Difficulty:** Hard
**Question:** Write `minCameraCover(root)` returning the minimum cameras to monitor every node (camera covers node, parent, children).

Example: small tree needing 1–2 cameras.
**Hints:** Greedy DFS states: 0=need, 1=has camera, 2=covered.
**Solution:**
```js
function minCameraCover(root) {
  let cams = 0;
  function dfs(n) {
    if (!n) return 2;
    const L = dfs(n.left), R = dfs(n.right);
    if (L === 0 || R === 0) { cams++; return 1; }
    if (L === 1 || R === 1) return 2;
    return 0;
  }
  if (dfs(root) === 0) cams++;
  return cams;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(h)

## 62. House robber III
**Difficulty:** Hard
**Question:** Write `rob(root)` for a binary tree of house values: cannot rob two adjacent nodes; return max money.

Example: tree DP of [with, without].
**Hints:** DFS returning [robThis, skipThis].
**Solution:**
```js
function rob(root) {
  function dfs(n) {
    if (!n) return [0, 0];
    const L = dfs(n.left), R = dfs(n.right);
    const take = n.val + L[1] + R[1];
    const skip = Math.max(L[0], L[1]) + Math.max(R[0], R[1]);
    return [take, skip];
  }
  const [a, b] = dfs(root);
  return Math.max(a, b);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(h)

## 63. Count unique BSTs II
**Difficulty:** Hard
**Question:** Write `generateTrees(n)` returning all structurally unique BSTs storing values 1..n.

Example: `n=3` → 5 trees.
**Hints:** Catalan recursion: choose root, cartesian product of left/right.
**Solution:**
```js
function generateTrees(n) {
  function build(lo, hi) {
    if (lo > hi) return [null];
    const trees = [];
    for (let root = lo; root <= hi; root++) {
      for (const L of build(lo, root - 1)) {
        for (const R of build(root + 1, hi)) {
          trees.push({ val: root, left: L, right: R });
        }
      }
    }
    return trees;
  }
  return n === 0 ? [] : build(1, n);
}
```
**Time Complexity:** O(C_n · n)
**Space Complexity:** O(C_n · n)

## 64. Maximum profit job scheduling
**Difficulty:** Hard
**Question:** Write `jobScheduling(startTime, endTime, profit)` returning max profit from non-overlapping jobs.

Example: classic DP + binary search previous job.
**Hints:** Sort by end; dp[i]=max(skip, take+dp[prev]).
**Solution:**
```js
function jobScheduling(startTime, endTime, profit) {
  const jobs = startTime.map((s, i) => [s, endTime[i], profit[i]]);
  jobs.sort((a, b) => a[1] - b[1]);
  const ends = jobs.map(j => j[1]);
  const dp = Array(jobs.length + 1).fill(0);
  for (let i = 0; i < jobs.length; i++) {
    let lo = 0, hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ends[mid] <= jobs[i][0]) lo = mid + 1;
      else hi = mid;
    }
    const prev = lo;
    dp[i + 1] = Math.max(dp[i], dp[prev] + jobs[i][2]);
  }
  return dp[jobs.length];
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 65. Cherry pickup
**Difficulty:** Hard
**Question:** Write `cherryPickup(grid)` for an n×n grid: collect max cherries going (0,0)→(n-1,n-1) and back (or equivalent two persons). `-1` cells blocked.

Example: LeetCode cherry pickup.
**Hints:** 3D DP on two persons moving to bottom-right simultaneously.
**Solution:**
```js
function cherryPickup(grid) {
  const n = grid.length;
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Array(n).fill(-Infinity)));
  dp[0][0][0] = grid[0][0];
  for (let t = 1; t <= 2 * (n - 1); t++) {
    for (let r1 = Math.max(0, t - (n - 1)); r1 <= Math.min(n - 1, t); r1++) {
      for (let r2 = Math.max(0, t - (n - 1)); r2 <= Math.min(n - 1, t); r2++) {
        const c1 = t - r1, c2 = t - r2;
        if (grid[r1][c1] < 0 || grid[r2][c2] < 0) continue;
        let best = -Infinity;
        for (const pr1 of [r1, r1 - 1]) {
          for (const pr2 of [r2, r2 - 1]) {
            if (pr1 < 0 || pr2 < 0 || pr1 > t - 1 || pr2 > t - 1) continue;
            const pc1 = t - 1 - pr1, pc2 = t - 1 - pr2;
            if (pc1 < 0 || pc2 < 0 || pc1 >= n || pc2 >= n) continue;
            best = Math.max(best, dp[pr1][pc1][pr2]);
          }
        }
        if (best === -Infinity) continue;
        let val = grid[r1][c1];
        if (r1 !== r2) val += grid[r2][c2];
        dp[r1][c1][r2] = best + val;
      }
    }
  }
  return Math.max(0, dp[n - 1][n - 1][n - 1]);
}
```
**Time Complexity:** O(n³)
**Space Complexity:** O(n³)

## 66. Dungeon game
**Difficulty:** Hard
**Question:** Write `calculateMinimumHP(dungeon)` — minimum initial HP to reach bottom-right from top-left with HP always ≥1 (cells add/subtract HP).

Example: classic dungeon DP.
**Hints:** DP from end: need enough to survive next cell.
**Solution:**
```js
function calculateMinimumHP(dungeon) {
  const m = dungeon.length, n = dungeon[0].length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(Infinity));
  dp[m][n - 1] = dp[m - 1][n] = 1;
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const need = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
      dp[i][j] = need <= 0 ? 1 : need;
    }
  }
  return dp[0][0];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 67. Maximal rectangle of 1s
**Difficulty:** Hard
**Question:** Write `maximalRectangle(matrix)` for a binary matrix of `"0"`/`"1"` chars returning the largest rectangle area of 1s.

Example: histogram-per-row approach.
**Hints:** Height histogram per row + largest rectangle in histogram.
**Solution:**
```js
function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  const n = matrix[0].length;
  const heights = Array(n).fill(0);
  let best = 0;
  function largestRectangleArea(h) {
    const stack = [-1];
    let area = 0;
    const arr = h.concat([0]);
    for (let i = 0; i < arr.length; i++) {
      while (stack.length > 1 && arr[stack[stack.length - 1]] > arr[i]) {
        const height = arr[stack.pop()];
        area = Math.max(area, height * (i - stack[stack.length - 1] - 1));
      }
      stack.push(i);
    }
    return area;
  }
  for (const row of matrix) {
    for (let j = 0; j < n; j++) heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
    best = Math.max(best, largestRectangleArea(heights));
  }
  return best;
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(n)

## 68. Shortest path in binary matrix
**Difficulty:** Hard
**Question:** Write `shortestPathBinaryMatrix(grid)` — length of shortest clear path from (0,0) to (n-1,n-1) in an n×n binary grid moving 8 directions (`0` open). Return `-1` if impossible.

Example: BFS 0-cells.
**Hints:** BFS with 8 neighbors; distance in queue.
**Solution:**
```js
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  while (q.length) {
    const [r, c, d] = q.shift();
    if (r === n - 1 && c === n - 1) return d;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        q.push([nr, nc, d + 1]);
      }
    }
  }
  return -1;
}
```
**Time Complexity:** O(n²)
**Space Complexity:** O(n²)

## 69. Word search II
**Difficulty:** Hard
**Question:** Write `findWords(board, words)` returning all words from the list that can be formed on the board by adjacent cells (no reuse).

Example: Boggle with trie pruning.
**Hints:** Trie of words; DFS backtrack removing found leaves.
**Solution:**
```js
function findWords(board, words) {
  const root = {};
  for (const w of words) {
    let n = root;
    for (const ch of w) { n[ch] = n[ch] || {}; n = n[ch]; }
    n.word = w;
  }
  const res = [];
  const m = board.length, n = board[0].length;
  function dfs(i, j, node) {
    const ch = board[i][j];
    const next = node[ch];
    if (!next) return;
    if (next.word) { res.push(next.word); next.word = null; }
    board[i][j] = '#';
    for (const [di, dj] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && nj >= 0 && ni < m && nj < n && board[ni][nj] !== '#') dfs(ni, nj, next);
    }
    board[i][j] = ch;
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dfs(i, j, root);
  return res;
}
```
**Time Complexity:** O(mn·4^L)
**Space Complexity:** O(total chars)

## 70. Course schedule II
**Difficulty:** Hard
**Question:** Write `findOrder(numCourses, prerequisites)` returning a valid course order (prerequisites as `[course, prereq]`), or `[]` if a cycle exists.

Example: `2, [[1,0]]` → `[0,1]`.
**Hints:** DFS coloring (0/1/2); postorder push then reverse.
**Solution:**
```js
function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) g[b].push(a);
  const state = Array(numCourses).fill(0);
  const order = [];
  function dfs(u) {
    if (state[u] === 1) return false;
    if (state[u] === 2) return true;
    state[u] = 1;
    for (const v of g[u]) if (!dfs(v)) return false;
    state[u] = 2;
    order.push(u);
    return true;
  }
  for (let i = 0; i < numCourses; i++) if (!dfs(i)) return [];
  return order.reverse();
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 71. Swim in rising water
**Difficulty:** Hard
**Question:** Write `swimInWater(grid)` — least time `t` to reach bottom-right from top-left on an n×n grid where you can enter a cell when `t >= grid[r][c]` (4-dir).

Example: binary search + BFS, or Dijkstra on max-edge.
**Hints:** Dijkstra: priority queue by max elevation on path.
**Solution:**
```js
function swimInWater(grid) {
  const n = grid.length;
  const seen = Array.from({ length: n }, () => Array(n).fill(false));
  const pq = [[grid[0][0], 0, 0]];
  seen[0][0] = true;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [t, r, c] = pq.shift();
    if (r === n - 1 && c === n - 1) return t;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || seen[nr][nc]) continue;
      seen[nr][nc] = true;
      pq.push([Math.max(t, grid[nr][nc]), nr, nc]);
    }
  }
  return -1;
}
```
**Time Complexity:** O(n² log n)
**Space Complexity:** O(n²)

## 72. Minimum obstacle removal to corner
**Difficulty:** Hard
**Question:** Write `minimumObstacles(grid)` — min number of `1` obstacles to remove to go from (0,0) to (m-1,n-1) moving 4-dir (`0` empty).

Example: 0-1 BFS (deque).
**Hints:** 0-1 BFS: cost 0 for empty, 1 for obstacle.
**Solution:**
```js
function minimumObstacles(grid) {
  const m = grid.length, n = grid[0].length;
  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
  const dq = [[0, 0]];
  dist[0][0] = 0;
  while (dq.length) {
    const [r, c] = dq.shift();
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
      const nd = dist[r][c] + grid[nr][nc];
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        if (grid[nr][nc] === 0) dq.unshift([nr, nc]);
        else dq.push([nr, nc]);
      }
    }
  }
  return dist[m - 1][n - 1];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 73. Bus routes
**Difficulty:** Hard
**Question:** Write `numBusesToDestination(routes, source, target)` — fewest buses to take to reach `target` from `source` (each route is a cycle of stops).

Example: BFS on buses/stops.
**Hints:** Map stop→routes; BFS rides, mark used routes.
**Solution:**
```js
function numBusesToDestination(routes, source, target) {
  if (source === target) return 0;
  const stopToRoutes = new Map();
  for (let i = 0; i < routes.length; i++) {
    for (const s of routes[i]) {
      if (!stopToRoutes.has(s)) stopToRoutes.set(s, []);
      stopToRoutes.get(s).push(i);
    }
  }
  const q = [[source, 0]];
  const seenStop = new Set([source]);
  const seenRoute = new Set();
  while (q.length) {
    const [stop, buses] = q.shift();
    for (const ri of stopToRoutes.get(stop) || []) {
      if (seenRoute.has(ri)) continue;
      seenRoute.add(ri);
      for (const nxt of routes[ri]) {
        if (nxt === target) return buses + 1;
        if (!seenStop.has(nxt)) {
          seenStop.add(nxt);
          q.push([nxt, buses + 1]);
        }
      }
    }
  }
  return -1;
}
```
**Time Complexity:** O(Σ stops)
**Space Complexity:** O(Σ stops)

## 74. Cheapest flights within K stops
**Difficulty:** Hard
**Question:** Write `findCheapestPrice(n, flights, src, dst, k)` — cheapest price from src to dst with at most `k` stops (`flights` as `[u,v,price]`).

Example: Bellman-Ford k+1 relaxations.
**Hints:** Relax edges k+1 times on a copy of dist.
**Solution:**
```js
function findCheapestPrice(n, flights, src, dst, k) {
  let dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i <= k; i++) {
    const next = dist.slice();
    for (const [u, v, w] of flights) {
      if (dist[u] !== Infinity) next[v] = Math.min(next[v], dist[u] + w);
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}
```
**Time Complexity:** O(k·E)
**Space Complexity:** O(n)

## 75. Network delay time
**Difficulty:** Hard
**Question:** Write `networkDelayTime(times, n, k)` — time for all `n` nodes to receive signal from `k` (`times` as `[u,v,w]`). Return `-1` if impossible.

Example: Dijkstra from k.
**Hints:** Dijkstra; answer is max finite distance.
**Solution:**
```js
function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) g[u].push([v, w]);
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const pq = [[0, k]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d !== dist[u]) continue;
    for (const [v, w] of g[u]) {
      if (dist[v] > d + w) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    ans = Math.max(ans, dist[i]);
  }
  return ans;
}
```
**Time Complexity:** O(E log V)
**Space Complexity:** O(V+E)

## 76. Critical path in DAG (longest path)
**Difficulty:** Hard
**Question:** Write `longestPathDAG(n, edges)` returning the length of the longest path in a weighted DAG (`edges` `[u,v,w]`), or node-count style if you use unit weights.

Example: topo DP on distances.
**Hints:** Topo order; relax max distances.
**Solution:**
```js
function longestPathDAG(n, edges) {
  const g = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [u, v, w] of edges) { g[u].push([v, w]); indeg[v]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const dist = Array(n).fill(0);
  while (q.length) {
    const u = q.shift();
    for (const [v, w] of g[u]) {
      dist[v] = Math.max(dist[v], dist[u] + w);
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return Math.max(...dist);
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 77. Minimum height trees
**Difficulty:** Hard
**Question:** Write `findMinHeightTrees(n, edges)` returning all root labels that give minimum-height trees for an undirected tree.

Example: peel leaves until 1–2 centers remain.
**Hints:** Layered leaf trimming (centroid(s) of tree).
**Solution:**
```js
function findMinHeightTrees(n, edges) {
  if (n === 1) return [0];
  const g = Array.from({ length: n }, () => new Set());
  for (const [a, b] of edges) { g[a].add(b); g[b].add(a); }
  let leaves = [];
  for (let i = 0; i < n; i++) if (g[i].size === 1) leaves.push(i);
  let remain = n;
  while (remain > 2) {
    remain -= leaves.length;
    const next = [];
    for (const leaf of leaves) {
      const nb = [...g[leaf]][0];
      g[nb].delete(leaf);
      if (g[nb].size === 1) next.push(nb);
    }
    leaves = next;
  }
  return leaves;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 78. Redundant connection II
**Difficulty:** Hard
**Question:** Write `findRedundantDirectedConnection(edges)` for a graph that was a rooted tree plus one extra edge. Return the edge that can be removed to restore a tree (prefer the later edge when ambiguous).

Example: handle double-parent and cycle cases.
**Hints:** Detect node with two parents; DSU for cycle; choose which edge to drop.
**Solution:**
```js
function findRedundantDirectedConnection(edges) {
  const n = edges.length;
  const parent = Array(n + 1).fill(0);
  let candA = null, candB = null;
  for (const e of edges) {
    const [u, v] = e;
    if (parent[v] === 0) parent[v] = u;
    else { candA = [parent[v], v]; candB = [...e]; e[0] = e[1] = -1; }
  }
  const dsu = Array.from({ length: n + 1 }, (_, i) => i);
  const find = x => (dsu[x] === x ? x : (dsu[x] = find(dsu[x])));
  for (const [u, v] of edges) {
    if (u < 0) continue;
    const pu = find(u), pv = find(v);
    if (pu === pv) return candA ? candA : [u, v];
    dsu[pv] = pu;
  }
  return candB;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 79. Serialize deserialize BST
**Difficulty:** Hard
**Question:** Implement `serializeBST(root)` and `deserializeBST(data)` using a compact preorder encoding (no null markers; bounds on deserialize).

Example: round-trip a BST.
**Hints:** Preorder join; deserialize with min/max bounds consuming tokens.
**Solution:**
```js
function serializeBST(root) {
  const out = [];
  function dfs(n) {
    if (!n) return;
    out.push(String(n.val));
    dfs(n.left);
    dfs(n.right);
  }
  dfs(root);
  return out.join(',');
}
function deserializeBST(data) {
  if (!data) return null;
  const vals = data.split(',').map(Number);
  let i = 0;
  function dfs(lo, hi) {
    if (i >= vals.length) return null;
    const v = vals[i];
    if (v < lo || v > hi) return null;
    i++;
    return { val: v, left: dfs(lo, v), right: dfs(v, hi) };
  }
  return dfs(-Infinity, Infinity);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 80. Count smaller numbers after self
**Difficulty:** Hard
**Question:** Write `countSmaller(nums)` returning for each index how many later elements are smaller.

Example: `[5,2,6,1]` → `[2,1,1,0]`.
**Hints:** Merge-sort counting or Fenwick on ranks from the right.
**Solution:**
```js
function countSmaller(nums) {
  const n = nums.length;
  const counts = Array(n).fill(0);
  const indexed = nums.map((v, i) => [v, i]);
  function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    const merged = [];
    let i = 0, j = 0;
    while (i < left.length || j < right.length) {
      if (j === right.length || (i < left.length && left[i][0] <= right[j][0])) {
        counts[left[i][1]] += j;
        merged.push(left[i++]);
      } else merged.push(right[j++]);
    }
    return merged;
  }
  mergeSort(indexed);
  return counts;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 81. Reverse pairs
**Difficulty:** Hard
**Question:** Write `reversePairs(nums)` counting pairs i<j with `nums[i] > 2*nums[j]`.

Example: `[1,3,2,3,1]` → `2`.
**Hints:** Modified merge sort: for each left value count right midpoints.
**Solution:**
```js
function reversePairs(nums) {
  let count = 0;
  function sort(arr) {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    let j = 0;
    for (const x of left) {
      while (j < right.length && x > 2 * right[j]) j++;
      count += j;
    }
    const merged = [];
    let i = 0; j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    return merged.concat(left.slice(i), right.slice(j));
  }
  sort(nums);
  return count;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 82. Skyline problem
**Difficulty:** Hard
**Question:** Write `getSkyline(buildings)` where each building is `[left,right,height]`, returning the skyline as key points `[[x,height],...]`.

Example: classic sweep with multiset of heights.
**Hints:** Events at left(+h) and right(-h); sort; track current max height.
**Solution:**
```js
function getSkyline(buildings) {
  const events = [];
  for (const [l, r, h] of buildings) {
    events.push([l, -h]);
    events.push([r, h]);
  }
  events.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
  const heights = [0];
  const res = [];
  let prev = 0;
  for (const [x, h] of events) {
    if (h < 0) heights.push(-h);
    else heights.splice(heights.indexOf(h), 1);
    const cur = Math.max(...heights);
    if (cur !== prev) {
      res.push([x, cur]);
      prev = cur;
    }
  }
  return res;
}
```
**Time Complexity:** O(n²) simple / O(n log n) with heap
**Space Complexity:** O(n)

## 83. The maze III (shortest path with directions)
**Difficulty:** Hard
**Question:** Write `findShortestWay(maze, ball, hole)` returning the lexicographically smallest instruction string (`u/d/l/r`) of a shortest path rolling until wall/hole, or `"impossible"`.

Example: BFS with rolling.
**Hints:** Dijkstra/BFS by distance then path string; roll until stop.
**Solution:**
```js
function findShortestWay(maze, ball, hole) {
  const m = maze.length, n = maze[0].length;
  const dirs = [['d', 1, 0], ['l', 0, -1], ['r', 0, 1], ['u', -1, 0]];
  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
  const path = Array.from({ length: m }, () => Array(n).fill(null));
  dist[ball[0]][ball[1]] = 0;
  path[ball[0]][ball[1]] = '';
  const pq = [[0, '', ball[0], ball[1]]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
    const [d, p, r, c] = pq.shift();
    if (d !== dist[r][c] || p !== path[r][c]) continue;
    if (r === hole[0] && c === hole[1]) return p;
    for (const [ch, dr, dc] of dirs) {
      let nr = r, nc = c, steps = 0;
      while (
        nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n &&
        maze[nr + dr][nc + dc] === 0
      ) {
        nr += dr; nc += dc; steps++;
        if (nr === hole[0] && nc === hole[1]) break;
      }
      const nd = d + steps;
      const np = p + ch;
      if (nd < dist[nr][nc] || (nd === dist[nr][nc] && np < path[nr][nc])) {
        dist[nr][nc] = nd;
        path[nr][nc] = np;
        pq.push([nd, np, nr, nc]);
      }
    }
  }
  return 'impossible';
}
```
**Time Complexity:** O(mn·(m+n) log)
**Space Complexity:** O(mn)

## 84. Cut off trees for golf event
**Difficulty:** Hard
**Question:** Write `cutOffTree(forest)` — total steps to cut trees in ascending height order (4-dir), starting at (0,0). Return `-1` if impossible. `0` is obstacle.

Example: BFS between successive trees.
**Hints:** Sort trees by height; sum BFS distances between consecutive targets.
**Solution:**
```js
function cutOffTree(forest) {
  const m = forest.length, n = forest[0].length;
  const trees = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    if (forest[i][j] > 1) trees.push([forest[i][j], i, j]);
  trees.sort((a, b) => a[0] - b[0]);
  function bfs(sr, sc, tr, tc) {
    if (sr === tr && sc === tc) return 0;
    const seen = Array.from({ length: m }, () => Array(n).fill(false));
    const q = [[sr, sc, 0]];
    seen[sr][sc] = true;
    while (q.length) {
      const [r, c, d] = q.shift();
      for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc] || forest[nr][nc] === 0) continue;
        if (nr === tr && nc === tc) return d + 1;
        seen[nr][nc] = true;
        q.push([nr, nc, d + 1]);
      }
    }
    return -1;
  }
  let sr = 0, sc = 0, total = 0;
  for (const [, tr, tc] of trees) {
    const d = bfs(sr, sc, tr, tc);
    if (d < 0) return -1;
    total += d;
    sr = tr; sc = tc;
  }
  return total;
}
```
**Time Complexity:** O(t·mn)
**Space Complexity:** O(mn)

## 85. Shortest bridge
**Difficulty:** Hard
**Question:** Write `shortestBridge(grid)` — minimum `0` flips to connect two islands in a binary grid.

Example: DFS paint one island then multi-source BFS.
**Hints:** Find first island; BFS expand water until second island.
**Solution:**
```js
function shortestBridge(grid) {
  const n = grid.length;
  const q = [];
  function dfs(i, j) {
    if (i < 0 || j < 0 || i >= n || j >= n || grid[i][j] !== 1) return;
    grid[i][j] = 2;
    q.push([i, j, 0]);
    dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
  }
  outer: for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    if (grid[i][j] === 1) { dfs(i, j); break outer; }
  while (q.length) {
    const [r, c, d] = q.shift();
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] === 2) continue;
      if (grid[nr][nc] === 1) return d;
      grid[nr][nc] = 2;
      q.push([nr, nc, d + 1]);
    }
  }
  return -1;
}
```
**Time Complexity:** O(n²)
**Space Complexity:** O(n²)

## 86. Pacific Atlantic water flow
**Difficulty:** Hard
**Question:** Write `pacificAtlantic(heights)` returning coordinates that can flow to both Pacific (top/left) and Atlantic (bottom/right).

Example: multi-source DFS/BFS from oceans.
**Hints:** Flood from both oceans uphill; intersection.
**Solution:**
```js
function pacificAtlantic(heights) {
  const m = heights.length, n = heights[0].length;
  const pac = Array.from({ length: m }, () => Array(n).fill(false));
  const atl = Array.from({ length: m }, () => Array(n).fill(false));
  function dfs(r, c, seen) {
    seen[r][c] = true;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc]) continue;
      if (heights[nr][nc] < heights[r][c]) continue;
      dfs(nr, nc, seen);
    }
  }
  for (let i = 0; i < m; i++) { dfs(i, 0, pac); dfs(i, n - 1, atl); }
  for (let j = 0; j < n; j++) { dfs(0, j, pac); dfs(m - 1, j, atl); }
  const res = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    if (pac[i][j] && atl[i][j]) res.push([i, j]);
  return res;
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 87. Trapping rain water II
**Difficulty:** Hard
**Question:** Write `trapRainWater(heightMap)` — units of water trapped in a 2D elevation map.

Example: min-heap BFS from boundary inward.
**Hints:** Priority queue of boundary cells; expand to lower neighbors.
**Solution:**
```js
function trapRainWater(heightMap) {
  const m = heightMap.length, n = heightMap[0].length;
  if (m < 3 || n < 3) return 0;
  const seen = Array.from({ length: m }, () => Array(n).fill(false));
  const pq = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    if (i === 0 || j === 0 || i === m - 1 || j === n - 1) {
      pq.push([heightMap[i][j], i, j]);
      seen[i][j] = true;
    }
  }
  let water = 0;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [h, r, c] = pq.shift();
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc]) continue;
      seen[nr][nc] = true;
      water += Math.max(0, h - heightMap[nr][nc]);
      pq.push([Math.max(h, heightMap[nr][nc]), nr, nc]);
    }
  }
  return water;
}
```
**Time Complexity:** O(mn log(mn))
**Space Complexity:** O(mn)

## 88. Sliding puzzle
**Difficulty:** Hard
**Question:** Write `slidingPuzzle(board)` — minimum moves to solve a 2×3 sliding puzzle to `[[1,2,3],[4,5,0]]`, or `-1`.

Example: BFS on board states.
**Hints:** Serialize board; BFS neighbors by swapping 0.
**Solution:**
```js
function slidingPuzzle(board) {
  const target = '123450';
  const start = board.flat().join('');
  const neighbors = [[1,3],[0,2,4],[1,5],[0,4],[1,3,5],[2,4]];
  const q = [[start, 0]];
  const seen = new Set([start]);
  while (q.length) {
    const [state, d] = q.shift();
    if (state === target) return d;
    const z = state.indexOf('0');
    for (const n of neighbors[z]) {
      const arr = state.split('');
      [arr[z], arr[n]] = [arr[n], arr[z]];
      const next = arr.join('');
      if (!seen.has(next)) { seen.add(next); q.push([next, d + 1]); }
    }
  }
  return -1;
}
```
**Time Complexity:** O(states)
**Space Complexity:** O(states)

## 89. Open the lock
**Difficulty:** Hard
**Question:** Write `openLock(deadends, target)` — minimum turns of a 4-wheel lock from `"0000"` to `target`, avoiding deadends. Return `-1` if impossible.

Example: BFS on digit strings.
**Hints:** BFS; each step rotate one wheel ±1.
**Solution:**
```js
function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has('0000')) return -1;
  const q = [['0000', 0]];
  const seen = new Set(['0000']);
  while (q.length) {
    const [cur, d] = q.shift();
    if (cur === target) return d;
    for (let i = 0; i < 4; i++) {
      for (const delta of [-1, 1]) {
        const arr = cur.split('');
        arr[i] = String((Number(arr[i]) + delta + 10) % 10);
        const next = arr.join('');
        if (!seen.has(next) && !dead.has(next)) {
          seen.add(next);
          q.push([next, d + 1]);
        }
      }
    }
  }
  return -1;
}
```
**Time Complexity:** O(10⁴)
**Space Complexity:** O(10⁴)

## 90. Word ladder II
**Difficulty:** Hard
**Question:** Write `findLadders(beginWord, endWord, wordList)` returning all shortest transformation sequences from begin to end.

Example: BFS build parents then DFS reconstruct.
**Hints:** BFS layers; record parents; DFS from end to begin.
**Solution:**
```js
function findLadders(beginWord, endWord, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return [];
  const parents = new Map();
  let layer = new Set([beginWord]);
  let found = false;
  while (layer.size && !found) {
    for (const w of layer) dict.delete(w);
    const next = new Set();
    for (const w of layer) {
      const arr = w.split('');
      for (let i = 0; i < arr.length; i++) {
        const orig = arr[i];
        for (let c = 97; c <= 122; c++) {
          arr[i] = String.fromCharCode(c);
          const nw = arr.join('');
          if (!dict.has(nw)) continue;
          next.add(nw);
          if (!parents.has(nw)) parents.set(nw, []);
          parents.get(nw).push(w);
          if (nw === endWord) found = true;
        }
        arr[i] = orig;
      }
    }
    layer = next;
  }
  const res = [];
  function dfs(word, path) {
    if (word === beginWord) { res.push([beginWord, ...path.reverse()]); path.reverse(); return; }
    for (const p of parents.get(word) || []) {
      path.push(word);
      dfs(p, path);
      path.pop();
    }
  }
  if (found) dfs(endWord, []);
  return res.map(p => { const x = p.slice(); return x; });
}
```
**Time Complexity:** O(n·L·26)
**Space Complexity:** O(n·L)

## 91. Palindrome partitioning II
**Difficulty:** Hard
**Question:** Write `minCut(s)` returning the minimum cuts needed so every substring is a palindrome.

Example: `"aab"` → `1`.
**Hints:** DP cuts + expand palindrome centers, or 2D isPal DP.
**Solution:**
```js
function minCut(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => Array(n).fill(false));
  const cuts = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = 0; j <= i; j++) {
      if (s[j] === s[i] && (i - j <= 1 || isPal[j + 1][i - 1])) {
        isPal[j][i] = true;
        min = j === 0 ? 0 : Math.min(min, cuts[j - 1] + 1);
      }
    }
    cuts[i] = min;
  }
  return cuts[n - 1];
}
```
**Time Complexity:** O(n²)
**Space Complexity:** O(n²)

## 92. Wildcard matching DP
**Difficulty:** Hard
**Question:** Write `isMatchDP(s, p)` implementing `?`/`*` wildcard matching with explicit DP table (alternate to greedy).

Example: `isMatchDP("aa","a*")` → `true`.
**Hints:** dp[i][j] for prefixes; `*` consumes zero or more.
**Solution:**
```js
function isMatchDP(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 93. Scramble string
**Difficulty:** Hard
**Question:** Write `isScramble(s1, s2)` determining if `s2` is a scramble of `s1` by recursively swapping children of a binary tree of characters.

Example: `"great"` / `"rgeat"` → `true`.
**Hints:** Memoized recursion on substrings; try splits with/without swap.
**Solution:**
```js
function isScramble(s1, s2) {
  const memo = new Map();
  function dfs(a, b) {
    const key = a + '#' + b;
    if (memo.has(key)) return memo.get(key);
    if (a === b) { memo.set(key, true); return true; }
    if ([...a].sort().join('') !== [...b].sort().join('')) { memo.set(key, false); return false; }
    for (let i = 1; i < a.length; i++) {
      if (dfs(a.slice(0, i), b.slice(0, i)) && dfs(a.slice(i), b.slice(i))) {
        memo.set(key, true); return true;
      }
      if (dfs(a.slice(0, i), b.slice(b.length - i)) && dfs(a.slice(i), b.slice(0, b.length - i))) {
        memo.set(key, true); return true;
      }
    }
    memo.set(key, false);
    return false;
  }
  return dfs(s1, s2);
}
```
**Time Complexity:** O(n⁴)
**Space Complexity:** O(n³)

## 94. Stone game VII
**Difficulty:** Hard
**Question:** Write `stoneGameVII(stones)` — optimal score difference when both players optimally remove either end pile and score the sum of remaining stones.

Example: minimax DP on intervals.
**Hints:** dp[i][j] = max score diff for subarray i..j.
**Solution:**
```js
function stoneGameVII(stones) {
  const n = stones.length;
  const prefix = Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];
  const sum = (l, r) => prefix[r + 1] - prefix[l];
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Math.max(sum(i + 1, j) - dp[i + 1][j], sum(i, j - 1) - dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}
```
**Time Complexity:** O(n²)
**Space Complexity:** O(n²)

## 95. Candy crush 1D stack
**Difficulty:** Hard
**Question:** Write `candyCrush1D(s)` repeatedly removing adjacent groups of 3+ same characters until stable (like candy crush on a string).

Example: `"aaabbbacd"` → process with stack of [char,count].
**Hints:** Stack pairs; pop when count≥3 after merge.
**Solution:**
```js
function candyCrush1D(s) {
  const stack = [];
  for (const ch of s) {
    if (stack.length && stack[stack.length - 1][0] === ch) stack[stack.length - 1][1]++;
    else stack.push([ch, 1]);
    if (stack.length && stack[stack.length - 1][1] >= 3) stack.pop();
  }
  return stack.map(([c, n]) => c.repeat(n)).join('');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 96. Remove boxes
**Difficulty:** Hard
**Question:** Write `removeBoxes(boxes)` — max points removing contiguous same-colored boxes with score `len²`, where same colors can merge after removals.

Example: 3D DP `dp[l][r][k]`.
**Hints:** Memo on interval plus trailing same-color count k.
**Solution:**
```js
function removeBoxes(boxes) {
  const n = boxes.length;
  const memo = new Map();
  function dp(l, r, k) {
    if (l > r) return 0;
    const key = l + ',' + r + ',' + k;
    if (memo.has(key)) return memo.get(key);
    while (l < r && boxes[r] === boxes[r - 1]) { r--; k++; }
    let ans = dp(l, r - 1, 0) + (k + 1) ** 2;
    for (let i = l; i < r; i++) {
      if (boxes[i] === boxes[r]) ans = Math.max(ans, dp(l, i, k + 1) + dp(i + 1, r - 1, 0));
    }
    memo.set(key, ans);
    return ans;
  }
  return dp(0, n - 1, 0);
}
```
**Time Complexity:** O(n⁴)
**Space Complexity:** O(n³)

## 97. Strange printer
**Difficulty:** Hard
**Question:** Write `strangePrinter(s)` — minimum turns for a printer that prints a contiguous same-character substring each turn to produce `s`.

Example: interval DP.
**Hints:** dp[i][j]=min turns for s[i..j]; merge when ends match.
**Solution:**
```js
function strangePrinter(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      dp[i][j] = dp[i + 1][j] + 1;
      for (let k = i + 1; k <= j; k++) {
        if (s[k] === s[i]) dp[i][j] = Math.min(dp[i][j], dp[i][k - 1] + (k + 1 <= j ? dp[k + 1][j] : 0));
      }
    }
  }
  return n ? dp[0][n - 1] : 0;
}
```
**Time Complexity:** O(n³)
**Space Complexity:** O(n²)

## 98. Minimum cost to merge stones
**Difficulty:** Hard
**Question:** Write `mergeStones(stones, k)` — min cost to merge piles into one by repeatedly merging exactly `k` consecutive piles (cost = sum). Return `-1` if impossible.

Example: interval DP with prefix sums.
**Hints:** Need (n-1)%(k-1)===0; dp on merging into (len-1)/(k-1)+1 piles.
**Solution:**
```js
function mergeStones(stones, k) {
  const n = stones.length;
  if ((n - 1) % (k - 1) !== 0) return -1;
  const prefix = Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = k; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let mid = i; mid < j; mid += k - 1) {
        dp[i][j] = Math.min(dp[i][j], dp[i][mid] + dp[mid + 1][j]);
      }
      if ((len - 1) % (k - 1) === 0) dp[i][j] += prefix[j + 1] - prefix[i];
    }
  }
  return dp[0][n - 1];
}
```
**Time Complexity:** O(n³/k)
**Space Complexity:** O(n²)

## 99. Super egg drop
**Difficulty:** Hard
**Question:** Write `superEggDrop(k, n)` — minimum moves in worst case to find critical floor with `k` eggs and `n` floors.

Example: DP moves vs eggs covering floors.
**Hints:** dp[moves][eggs] floors coverable; binary search or 1D growth.
**Solution:**
```js
function superEggDrop(k, n) {
  const dp = Array(k + 1).fill(0);
  let moves = 0;
  while (dp[k] < n) {
    moves++;
    for (let e = k; e >= 1; e--) dp[e] = dp[e] + dp[e - 1] + 1;
  }
  return moves;
}
```
**Time Complexity:** O(k·moves)
**Space Complexity:** O(k)

## 100. Freedom trail
**Difficulty:** Hard
**Question:** Write `findRotateSteps(ring, key)` — min steps to spell `key` on a rotary dial `ring` (rotate to char then press).

Example: DP over positions of each needed char.
**Hints:** For each key char, try all matching ring indices; track prev position cost.
**Solution:**
```js
function findRotateSteps(ring, key) {
  const n = ring.length;
  const pos = new Map();
  for (let i = 0; i < n; i++) {
    if (!pos.has(ring[i])) pos.set(ring[i], []);
    pos.get(ring[i]).push(i);
  }
  let prev = new Map([[0, 0]]);
  for (const ch of key) {
    const cur = new Map();
    for (const i of pos.get(ch)) {
      let best = Infinity;
      for (const [j, cost] of prev) {
        const dist = Math.min(Math.abs(i - j), n - Math.abs(i - j));
        best = Math.min(best, cost + dist + 1);
      }
      cur.set(i, best);
    }
    prev = cur;
  }
  return Math.min(...prev.values());
}
```
**Time Complexity:** O(|key|·n²)
**Space Complexity:** O(n)
