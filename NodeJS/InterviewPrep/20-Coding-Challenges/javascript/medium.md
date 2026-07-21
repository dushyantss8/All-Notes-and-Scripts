# JavaScript Challenges — Medium

100 medium interview problems. Each entry has a matching title, prompt, working solution, and complexity.

## 1. Promise.allSettled polyfill
**Difficulty:** Medium
**Question:** Implement `allSettled(promises)` mirroring `Promise.allSettled`: always fulfill with `{status,value|reason}` per input.

Example: mixed resolve/reject → array of settled results.
**Hints:** Map each promise to then/catch that never rejects.
**Solution:**
```js
function allSettled(promises) {
  return Promise.all([...promises].map(p =>
    Promise.resolve(p).then(
      value => ({ status: 'fulfilled', value }),
      reason => ({ status: 'rejected', reason })
    )
  ));
}
```
**Time Complexity:** O(n) settlements
**Space Complexity:** O(n)

## 2. Promise timeout wrapper
**Difficulty:** Medium
**Question:** Write `withTimeout(promise, ms)` that rejects with `Error("timeout")` if `promise` does not settle within `ms`.

Example: slow fetch vs 100ms timeout.
**Hints:** Race the promise against a rejecting timer; clear timer on settle.
**Solution:**
```js
function withTimeout(promise, ms) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 3. Retry with exponential backoff
**Difficulty:** Medium
**Question:** Write `async function retry(fn, { retries = 3, baseMs = 100 } = {})` that retries on throw with delays baseMs * 2^attempt.

Example: flaky network call succeeds on 2nd try.
**Hints:** Loop try/catch; await sleep between attempts.
**Solution:**
```js
async function retry(fn, { retries = 3, baseMs = 100 } = {}) {
  let last;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (e) {
      last = e;
      if (i === retries) break;
      await new Promise(r => setTimeout(r, baseMs * 2 ** i));
    }
  }
  throw last;
}
```
**Time Complexity:** O(retries) attempts
**Space Complexity:** O(1)

## 4. Promise pool (concurrency limit)
**Difficulty:** Medium
**Question:** Write `async function promisePool(tasks, limit)` where `tasks` is an array of zero-arg functions returning promises. Run at most `limit` at once; return results in input order.

Example: 10 tasks, limit 3.
**Hints:** Worker loop with shared index; pre-size results array.
**Solution:**
```js
async function promisePool(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
```
**Time Complexity:** O(n) task starts
**Space Complexity:** O(limit + n)

## 5. Sequential async map
**Difficulty:** Medium
**Question:** Write `async function mapSeries(items, fn)` applying async `fn(item,i)` one after another; return array of results.

Example: ordered API calls.
**Hints:** for-loop await push.
**Solution:**
```js
async function mapSeries(items, fn) {
  const out = [];
  for (let i = 0; i < items.length; i++) out.push(await fn(items[i], i));
  return out;
}
```
**Time Complexity:** O(n) awaits
**Space Complexity:** O(n)

## 6. LRU cache
**Difficulty:** Medium
**Question:** Implement class `LRUCache` with `constructor(capacity)`, `get(key)`, `put(key,value)`. Evict least-recently used when over capacity. `get`/`put` both count as use.

Example: capacity 2 → put 1,2,3 evicts 1.
**Hints:** Map preserves insertion order in JS — delete+set to refresh.
**Solution:**
```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const v = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}
```
**Time Complexity:** O(1) amortized get/put
**Space Complexity:** O(capacity)

## 7. Curry a function
**Difficulty:** Medium
**Question:** Write `curry(fn)` that returns a curried version collecting args until `fn.length` is reached, then calls `fn`.

Example: `curry((a,b,c)=>a+b+c)(1)(2)(3)` → `6`.
**Hints:** Return nested functions accumulating args.
**Solution:**
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, args.concat(more));
  };
}
```
**Time Complexity:** O(arity) calls
**Space Complexity:** O(arity)

## 8. Compose functions right-to-left
**Difficulty:** Medium
**Question:** Write `compose(...fns)` so `compose(f,g,h)(x)` equals `f(g(h(x)))`.

Example: compose(x=>x+1, x=>x*2)(3) → 7.
**Hints:** reduceRight applying each fn.
**Solution:**
```js
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
```
**Time Complexity:** O(k) for k functions
**Space Complexity:** O(1)

## 9. Pipe functions left-to-right
**Difficulty:** Medium
**Question:** Write `pipe(...fns)` so `pipe(f,g,h)(x)` equals `h(g(f(x)))`.

Example: pipe(x=>x+1, x=>x*2)(3) → 8.
**Hints:** reduce left to right.
**Solution:**
```js
function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}
```
**Time Complexity:** O(k)
**Space Complexity:** O(1)

## 10. EventEmitter
**Difficulty:** Medium
**Question:** Implement `EventEmitter` with `on(event, listener)`, `off(event, listener)`, `emit(event, ...args)`, `once(event, listener)`.

Example: on("data") then emit delivers payload.
**Hints:** Map event → Set of listeners; once wraps off after call.
**Solution:**
```js
class EventEmitter {
  constructor() { this.events = new Map(); }
  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(listener);
    return this;
  }
  off(event, listener) {
    this.events.get(event)?.delete(listener);
    return this;
  }
  emit(event, ...args) {
    for (const fn of [...(this.events.get(event) || [])]) fn(...args);
    return this;
  }
  once(event, listener) {
    const wrap = (...args) => {
      this.off(event, wrap);
      listener(...args);
    };
    return this.on(event, wrap);
  }
}
```
**Time Complexity:** O(listeners) emit
**Space Complexity:** O(total listeners)

## 11. Deep flatten array
**Difficulty:** Medium
**Question:** Write `flattenDeep(arr)` flattening arbitrarily nested arrays.

Example: `[1,[2,[3,4]],5]` → `[1,2,3,4,5]`.
**Hints:** Recurse or use stack; Array.isArray check.
**Solution:**
```js
function flattenDeep(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flattenDeep(item));
    else out.push(item);
  }
  return out;
}
```
**Time Complexity:** O(n) elements
**Space Complexity:** O(n + depth)

## 12. Group by key
**Difficulty:** Medium
**Question:** Write `groupBy(arr, keyFn)` returning `Map` from key → array of items.

Example: group people by age.
**Hints:** Iterate; push into Map arrays.
**Solution:**
```js
function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const k = keyFn(item);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(item);
  }
  return map;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 13. Debounce with cancel
**Difficulty:** Medium
**Question:** Write `debounce(fn, wait)` returning a function with `.cancel()` that clears the pending timer.

Example: cancel before fire → fn never called.
**Hints:** Attach cancel method clearing timeout.
**Solution:**
```js
function debounce(fn, wait) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 14. Deep clone with Date and Map
**Difficulty:** Medium
**Question:** Write `deepClone(value)` supporting primitives, arrays, plain objects, Date, Map, Set. No circular refs required.

Example: Map and Date clone independently.
**Hints:** Branch on type; recurse into containers.
**Solution:**
```js
function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof Map) {
    return new Map([...value].map(([k, v]) => [deepClone(k), deepClone(v)]));
  }
  if (value instanceof Set) return new Set([...value].map(deepClone));
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const [k, v] of Object.entries(value)) out[k] = deepClone(v);
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 15. Memoize function
**Difficulty:** Medium
**Question:** Write `memoize(fn)` caching results by `JSON.stringify(args)` (assume serializable args).

Example: expensive fib wrapper.
**Hints:** Map cache keyed by serialized args.
**Solution:**
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```
**Time Complexity:** O(fn) first; O(1) hit
**Space Complexity:** O(unique args)

## 16. Function.prototype.bind polyfill
**Difficulty:** Medium
**Question:** Write `myBind(fn, thisArg, ...preset)` returning a bound function (ignore `new` case).

Example: bind obj method keeps this.
**Hints:** Return (...later) => fn.apply(thisArg, preset.concat(later)).
**Solution:**
```js
function myBind(fn, thisArg, ...preset) {
  return function bound(...later) {
    return fn.apply(thisArg, preset.concat(later));
  };
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(args)

## 17. Call polyfill
**Difficulty:** Medium
**Question:** Write `myCall(fn, thisArg, ...args)` invoking fn with given this.

Example: myCall(fn, obj, 1, 2).
**Hints:** Use Symbol key on object or Reflect.apply.
**Solution:**
```js
function myCall(fn, thisArg, ...args) {
  return Reflect.apply(fn, thisArg, args);
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 18. Apply polyfill
**Difficulty:** Medium
**Question:** Write `myApply(fn, thisArg, argsArray)` like Function#apply.

Example: myApply(Math.max, null, [1,5,2]) → 5.
**Hints:** Reflect.apply with argsArray or [].
**Solution:**
```js
function myApply(fn, thisArg, argsArray) {
  return Reflect.apply(fn, thisArg, argsArray == null ? [] : [...argsArray]);
}
```
**Time Complexity:** O(n) args
**Space Complexity:** O(n)

## 19. Longest substring without repeating
**Difficulty:** Medium
**Question:** Write `lengthOfLongestSubstring(s)` — length of longest substring with unique chars.

Example: `"abcabcbb"` → `3`.
**Hints:** Sliding window + last-seen index Map.
**Solution:**
```js
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let start = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    if (last.has(s[i]) && last.get(s[i]) >= start) start = last.get(s[i]) + 1;
    last.set(s[i], i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 20. Three sum
**Difficulty:** Medium
**Question:** Write `threeSum(nums)` returning unique triplets that sum to 0.

Example: `[-1,0,1,2,-1,-4]` → `[[-1,-1,2],[-1,0,1]]`.
**Hints:** Sort; fix i; two pointers; skip duplicates.
**Solution:**
```js
function threeSum(nums) {
  nums = [...nums].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum === 0) {
        out.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++; hi--;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }
  return out;
}
```
**Time Complexity:** O(n^2)
**Space Complexity:** O(1) extra besides output

## 21. Merge intervals
**Difficulty:** Medium
**Question:** Write `merge(intervals)` merging overlapping [start,end] intervals.

Example: `[[1,3],[2,6],[8,10]]` → `[[1,6],[8,10]]`.
**Hints:** Sort by start; merge if overlap.
**Solution:**
```js
function merge(intervals) {
  if (!intervals.length) return [];
  intervals = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const last = out[out.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else out.push(intervals[i].slice());
  }
  return out;
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 22. Product of array except self
**Difficulty:** Medium
**Question:** Write `productExceptSelf(nums)` without division; O(n) time.

Example: `[1,2,3,4]` → `[24,12,8,6]`.
**Hints:** Prefix products then multiply suffix pass.
**Solution:**
```js
function productExceptSelf(nums) {
  const n = nums.length;
  const out = Array(n).fill(1);
  let pref = 1;
  for (let i = 0; i < n; i++) {
    out[i] = pref;
    pref *= nums[i];
  }
  let suf = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= suf;
    suf *= nums[i];
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1) extra besides output

## 23. Rotate matrix 90 degrees
**Difficulty:** Medium
**Question:** Write `rotate(matrix)` rotating n×n matrix 90° clockwise in-place.

Example: `[[1,2],[3,4]]` → `[[3,1],[4,2]]`.
**Hints:** Transpose then reverse each row.
**Solution:**
```js
function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
  return matrix;
}
```
**Time Complexity:** O(n^2)
**Space Complexity:** O(1)

## 24. Spiral matrix order
**Difficulty:** Medium
**Question:** Write `spiralOrder(matrix)` returning elements in spiral order.

Example: `[[1,2,3],[4,5,6],[7,8,9]]` → `[1,2,3,6,9,8,7,4,5]`.
**Hints:** Layer by layer with four bounds.
**Solution:**
```js
function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const out = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) out.push(matrix[top][j]);
    top++;
    for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) out.push(matrix[bottom][j]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);
      left++;
    }
  }
  return out;
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(1) extra

## 25. Coin change (min coins)
**Difficulty:** Medium
**Question:** Write `coinChange(coins, amount)` minimum coins to make amount, or -1.

Example: `coins=[1,2,5], amount=11` → `3`.
**Hints:** DP: dp[x] = min coins for x.
**Solution:**
```js
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```
**Time Complexity:** O(amount * coins)
**Space Complexity:** O(amount)

## 26. House robber
**Difficulty:** Medium
**Question:** Write `rob(nums)` max money without robbing adjacent houses.

Example: `[2,7,9,3,1]` → `12`.
**Hints:** DP with two variables prev/curr.
**Solution:**
```js
function rob(nums) {
  let prev = 0, curr = 0;
  for (const n of nums) {
    const next = Math.max(curr, prev + n);
    prev = curr;
    curr = next;
  }
  return curr;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 27. Word break
**Difficulty:** Medium
**Question:** Write `wordBreak(s, wordDict)` whether s can be segmented into dict words.

Example: `"leetcode", ["leet","code"]` → `true`.
**Hints:** DP boolean reachable prefixes; Set for dict.
**Solution:**
```js
function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}
```
**Time Complexity:** O(n^2 * k)
**Space Complexity:** O(n + dict)

## 28. Min stack
**Difficulty:** Medium
**Question:** Implement `MinStack` with push, pop, top, getMin all O(1).

Example: push -2,0,-3 → getMin -3; pop → getMin -2.
**Hints:** Parallel stack of running minima.
**Solution:**
```js
class MinStack {
  constructor() { this.stack = []; this.mins = []; }
  push(x) {
    this.stack.push(x);
    const m = this.mins.length ? Math.min(this.mins.at(-1), x) : x;
    this.mins.push(m);
  }
  pop() { this.stack.pop(); this.mins.pop(); }
  top() { return this.stack.at(-1); }
  getMin() { return this.mins.at(-1); }
}
```
**Time Complexity:** O(1) ops
**Space Complexity:** O(n)

## 29. Queue using stacks
**Difficulty:** Medium
**Question:** Implement `MyQueue` with two stacks: push, pop, peek, empty.

Example: push 1,2; peek → 1; pop → 1.
**Hints:** Inbox + outbox; flush inbox to outbox when outbox empty.
**Solution:**
```js
class MyQueue {
  constructor() { this.in = []; this.out = []; }
  push(x) { this.in.push(x); }
  _move() {
    if (!this.out.length) while (this.in.length) this.out.push(this.in.pop());
  }
  pop() { this._move(); return this.out.pop(); }
  peek() { this._move(); return this.out.at(-1); }
  empty() { return !this.in.length && !this.out.length; }
}
```
**Time Complexity:** Amortized O(1)
**Space Complexity:** O(n)

## 30. BST insert and search
**Difficulty:** Medium
**Question:** Implement `insert(root, val)` and `search(root, val)` for a BST node `{val,left,right}`.

Example: insert 5,3,7; search 3 → node.
**Hints:** Standard BST walk.
**Solution:**
```js
function insert(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}
function search(root, val) {
  if (!root || root.val === val) return root;
  return val < root.val ? search(root.left, val) : search(root.right, val);
}
```
**Time Complexity:** O(h)
**Space Complexity:** O(h) recursion

## 31. Binary tree level order
**Difficulty:** Medium
**Question:** Write `levelOrder(root)` BFS returning array of levels.

Example: [3,9,20,null,null,15,7] → [[3],[9,20],[15,7]].
**Hints:** Queue; process level size batches.
**Solution:**
```js
function levelOrder(root) {
  if (!root) return [];
  const out = [], q = [root];
  while (q.length) {
    const size = q.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    out.push(level);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 32. Graph BFS shortest path (unweighted)
**Difficulty:** Medium
**Question:** Adj list `graph` (Map or object of arrays). Write `bfsPath(graph, start, goal)` returning shortest path array of nodes or null.

Example: A→B→C path.
**Hints:** BFS with parent pointers; reconstruct.
**Solution:**
```js
function bfsPath(graph, start, goal) {
  const q = [start];
  const parent = new Map([[start, null]]);
  while (q.length) {
    const u = q.shift();
    if (u === goal) break;
    for (const v of graph[u] || []) {
      if (!parent.has(v)) {
        parent.set(v, u);
        q.push(v);
      }
    }
  }
  if (!parent.has(goal)) return null;
  const path = [];
  for (let cur = goal; cur != null; cur = parent.get(cur)) path.push(cur);
  return path.reverse();
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V)

## 33. Graph DFS has cycle (directed)
**Difficulty:** Medium
**Question:** Write `hasCycle(graph)` for directed adj-list object. Return true if a cycle exists.

Example: 0→1→2→0.
**Hints:** Colors: white/gray/black; gray back-edge = cycle.
**Solution:**
```js
function hasCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  for (const u of Object.keys(graph)) color[u] = WHITE;
  function dfs(u) {
    color[u] = GRAY;
    for (const v of graph[u] || []) {
      if (color[v] === GRAY) return true;
      if (color[v] === WHITE && dfs(v)) return true;
    }
    color[u] = BLACK;
    return false;
  }
  for (const u of Object.keys(graph)) if (color[u] === WHITE && dfs(u)) return true;
  return false;
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V)

## 34. Topological sort Kahn
**Difficulty:** Medium
**Question:** Write `topoSort(graph)` for DAG adj list; return node order or null if cycle.

Example: course prerequisites.
**Hints:** Indegrees + queue of zeros.
**Solution:**
```js
function topoSort(graph) {
  const nodes = Object.keys(graph);
  const indeg = Object.fromEntries(nodes.map(n => [n, 0]));
  for (const u of nodes) for (const v of graph[u]) indeg[v] = (indeg[v] || 0) + 1;
  const q = nodes.filter(n => indeg[n] === 0);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of graph[u] || []) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return order.length === nodes.length ? order : null;
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 35. Union-Find (Disjoint Set)
**Difficulty:** Medium
**Question:** Implement class `UnionFind` with `find`, `union`, `connected` for n elements 0..n-1. Use path compression + union by rank.

Example: union(0,1), connected(0,1) true.
**Hints:** parent/rank arrays.
**Solution:**
```js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}
```
**Time Complexity:** Almost O(1) find/union
**Space Complexity:** O(n)

## 36. Trie insert and search
**Difficulty:** Medium
**Question:** Implement `Trie` with insert(word), search(word), startsWith(prefix).

Example: insert apple; search app false; startsWith app true.
**Hints:** Nested objects; end flag.
**Solution:**
```js
class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      node[ch] ??= {};
      node = node[ch];
    }
    node.isEnd = true;
  }
  _walk(s) {
    let node = this.root;
    for (const ch of s) {
      if (!node[ch]) return null;
      node = node[ch];
    }
    return node;
  }
  search(word) {
    const node = this._walk(word);
    return !!(node && node.isEnd);
  }
  startsWith(prefix) { return !!this._walk(prefix); }
}
```
**Time Complexity:** O(L) per op
**Space Complexity:** O(total chars)

## 37. Sliding window maximum
**Difficulty:** Medium
**Question:** Write `maxSlidingWindow(nums, k)` returning max of each window of size k.

Example: `[1,3,-1,-3,5,3,6,7], k=3` → `[3,3,5,5,6,7]`.
**Hints:** Monotonic deque of indices.
**Solution:**
```js
function maxSlidingWindow(nums, k) {
  const dq = [], out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq.at(-1)] <= nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 38. Kth largest element
**Difficulty:** Medium
**Question:** Write `findKthLargest(nums, k)` (1-indexed largest).

Example: `[3,2,1,5,6,4], k=2` → `5`.
**Hints:** Sort descending or quickselect; sort OK for interview sizes.
**Solution:**
```js
function findKthLargest(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}
```
**Time Complexity:** O(n log n) sort
**Space Complexity:** O(n)

## 39. Valid BST
**Difficulty:** Medium
**Question:** Write `isValidBST(root)` ensuring BST invariant with strict inequalities.

Example: [2,1,3] true; [5,1,4,null,null,3,6] false.
**Hints:** DFS with low/high bounds.
**Solution:**
```js
function isValidBST(root, low = -Infinity, high = Infinity) {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(h)

## 40. Lowest common ancestor BST
**Difficulty:** Medium
**Question:** Write `lowestCommonAncestor(root, p, q)` for BST nodes p,q.

Example: root=6, p=2, q=8 → 6.
**Hints:** Walk down until split.
**Solution:**
```js
function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left;
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;
  }
  return null;
}
```
**Time Complexity:** O(h)
**Space Complexity:** O(1)

## 41. Serialize binary tree (preorder)
**Difficulty:** Medium
**Question:** Write `serialize(root)` and `deserialize(data)` using comma-separated values with `#` for null.

Example: round-trip small tree.
**Hints:** Preorder with null markers; queue on deserialize.
**Solution:**
```js
function serialize(root) {
  const out = [];
  function dfs(node) {
    if (!node) { out.push('#'); return; }
    out.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return out.join(',');
}
function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  function dfs() {
    const v = vals[i++];
    if (v === '#') return null;
    return { val: Number(v), left: dfs(), right: dfs() };
  }
  return dfs();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 42. Number of islands
**Difficulty:** Medium
**Question:** Write `numIslands(grid)` of "1" land / "0" water; count islands (4-connected).

Example: classic leetcode grid.
**Hints:** DFS/BFS flood fill marking visited.
**Solution:**
```js
function numIslands(grid) {
  if (!grid.length) return 0;
  const m = grid.length, n = grid[0].length;
  let count = 0;
  function dfs(i, j) {
    if (i < 0 || j < 0 || i >= m || j >= n || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    if (grid[i][j] === '1') { count++; dfs(i, j); }
  }
  return count;
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn) worst recursion

## 43. Clone graph
**Difficulty:** Medium
**Question:** Nodes `{val, neighbors[]}`. Write `cloneGraph(node)` deep clone.

Example: connected undirected graph.
**Hints:** DFS/BFS with Map original→clone.
**Solution:**
```js
function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  function dfs(n) {
    if (map.has(n)) return map.get(n);
    const copy = { val: n.val, neighbors: [] };
    map.set(n, copy);
    for (const nei of n.neighbors) copy.neighbors.push(dfs(nei));
    return copy;
  }
  return dfs(node);
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V)

## 44. Course schedule can finish
**Difficulty:** Medium
**Question:** Write `canFinish(numCourses, prerequisites)` where prereqs are [a,b] meaning b before a.

Example: cycle → false.
**Hints:** Build graph; Kahn topo; count visited.
**Solution:**
```js
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indeg = Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    graph[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let seen = 0;
  while (q.length) {
    const u = q.shift();
    seen++;
    for (const v of graph[u]) if (--indeg[v] === 0) q.push(v);
  }
  return seen === numCourses;
}
```
**Time Complexity:** O(V+E)
**Space Complexity:** O(V+E)

## 45. Daily temperatures
**Difficulty:** Medium
**Question:** Write `dailyTemperatures(temps)` days until a warmer temperature (0 if none).

Example: `[73,74,75,71,69,72,76,73]` → `[1,1,4,2,1,1,0,0]`.
**Hints:** Monotonic decreasing stack of indices.
**Solution:**
```js
function dailyTemperatures(temps) {
  const out = Array(temps.length).fill(0);
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const j = stack.pop();
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 46. Next greater element
**Difficulty:** Medium
**Question:** Write `nextGreaterElement(nums1, nums2)` where nums1 subset of nums2; for each in nums1 find next greater in nums2 to the right, else -1.

Example: nums1=[4,1,2], nums2=[1,3,4,2] → [-1,3,-1].
**Hints:** Monotonic stack on nums2 → map.
**Solution:**
```js
function nextGreaterElement(nums1, nums2) {
  const next = new Map();
  const stack = [];
  for (const x of nums2) {
    while (stack.length && x > stack.at(-1)) next.set(stack.pop(), x);
    stack.push(x);
  }
  return nums1.map(x => next.get(x) ?? -1);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 47. Evaluate reverse Polish notation
**Difficulty:** Medium
**Question:** Write `evalRPN(tokens)` for +, -, *, / (truncate toward zero).

Example: `["2","1","+","3","*"]` → `9`.
**Hints:** Stack of numbers.
**Solution:**
```js
function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = st.pop(), a = st.pop();
      if (t === '+') st.push(a + b);
      else if (t === '-') st.push(a - b);
      else if (t === '*') st.push(a * b);
      else st.push(Math.trunc(a / b));
    } else st.push(Number(t));
  }
  return st[0];
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 48. Simplify Unix path
**Difficulty:** Medium
**Question:** Write `simplifyPath(path)` resolving `.` and `..`.

Example: `"/a/./b/../../c/"` → `"/c"`.
**Hints:** Stack of segments.
**Solution:**
```js
function simplifyPath(path) {
  const stack = [];
  for (const part of path.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return '/' + stack.join('/');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 49. String to integer atoi
**Difficulty:** Medium
**Question:** Write `myAtoi(s)`: trim, optional sign, digits; clamp to 32-bit signed range.

Example: `"  -42"` → `-42`.
**Hints:** Scan carefully; clamp INT_MIN/MAX.
**Solution:**
```js
function myAtoi(s) {
  s = s.trimStart();
  if (!s) return 0;
  let i = 0, sign = 1;
  if (s[0] === '+' || s[0] === '-') { sign = s[0] === '-' ? -1 : 1; i++; }
  let num = 0;
  const INT_MAX = 2 ** 31 - 1, INT_MIN = -(2 ** 31);
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    num = num * 10 + (s.charCodeAt(i) - 48);
    i++;
  }
  num *= sign;
  if (num > INT_MAX) return INT_MAX;
  if (num < INT_MIN) return INT_MIN;
  return num;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 50. Add two numbers linked lists
**Difficulty:** Medium
**Question:** Lists store digits reverse order. Write `addTwoNumbers(l1, l2)` returning sum list.

Example: 2→4→3 + 5→6→4 → 7→0→8.
**Hints:** Carry while either list or carry remains.
**Solution:**
```js
function addTwoNumbers(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
    carry = (sum / 10) | 0;
    cur.next = { val: sum % 10, next: null };
    cur = cur.next;
    l1 = l1?.next; l2 = l2?.next;
  }
  return dummy.next;
}
```
**Time Complexity:** O(max(n,m))
**Space Complexity:** O(max(n,m))

## 51. Detect linked list cycle
**Difficulty:** Medium
**Question:** Write `hasCycle(head)` using Floyd tortoise/hare.

Example: cycle → true.
**Hints:** Slow/fast pointers.
**Solution:**
```js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 52. Reverse linked list
**Difficulty:** Medium
**Question:** Write `reverseList(head)` iteratively.

Example: 1→2→3 → 3→2→1.
**Hints:** prev/curr/next pointers.
**Solution:**
```js
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 53. Merge two sorted lists
**Difficulty:** Medium
**Question:** Write `mergeTwoLists(l1, l2)` merging sorted linked lists.

Example: 1→2→4 and 1→3→4.
**Hints:** Dummy head; pick smaller each step.
**Solution:**
```js
function mergeTwoLists(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
    else { cur.next = l2; l2 = l2.next; }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(1)

## 54. Find middle of linked list
**Difficulty:** Medium
**Question:** Write `middleNode(head)` returning middle (second middle if even).

Example: 1..5 → 3.
**Hints:** Slow/fast.
**Solution:**
```js
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 55. Remove nth node from end
**Difficulty:** Medium
**Question:** Write `removeNthFromEnd(head, n)` in one pass.

Example: 1→2→3→4→5, n=2 → remove 4.
**Hints:** Dummy + two pointers gap n.
**Solution:**
```js
function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}
```
**Time Complexity:** O(L)
**Space Complexity:** O(1)

## 56. Generate parentheses
**Difficulty:** Medium
**Question:** Write `generateParenthesis(n)` all valid combinations of n pairs.

Example: n=3 → 5 strings.
**Hints:** Backtrack tracking open/close counts.
**Solution:**
```js
function generateParenthesis(n) {
  const out = [];
  function bt(s, open, close) {
    if (s.length === 2 * n) { out.push(s); return; }
    if (open < n) bt(s + '(', open + 1, close);
    if (close < open) bt(s + ')', open, close + 1);
  }
  bt('', 0, 0);
  return out;
}
```
**Time Complexity:** Catalan number growth
**Space Complexity:** O(n) recursion depth

## 57. Letter combinations of phone
**Difficulty:** Medium
**Question:** Write `letterCombinations(digits)` for phone keypad 2-9.

Example: `"23"` → `["ad","ae",...]`.
**Hints:** Backtracking over digit map.
**Solution:**
```js
function letterCombinations(digits) {
  if (!digits) return [];
  const map = { 2:'abc',3:'def',4:'ghi',5:'jkl',6:'mno',7:'pqrs',8:'tuv',9:'wxyz' };
  const out = [];
  function bt(i, path) {
    if (i === digits.length) { out.push(path); return; }
    for (const ch of map[digits[i]]) bt(i + 1, path + ch);
  }
  bt(0, '');
  return out;
}
```
**Time Complexity:** O(4^n * n)
**Space Complexity:** O(n)

## 58. Permutations
**Difficulty:** Medium
**Question:** Write `permute(nums)` all unique permutations (nums distinct).

Example: `[1,2,3]` → 6 perms.
**Hints:** Backtrack with used flags or swap.
**Solution:**
```js
function permute(nums) {
  const out = [], used = Array(nums.length).fill(false);
  function bt(path) {
    if (path.length === nums.length) { out.push(path.slice()); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      bt(path);
      path.pop(); used[i] = false;
    }
  }
  bt([]);
  return out;
}
```
**Time Complexity:** O(n * n!)
**Space Complexity:** O(n)

## 59. Subsets
**Difficulty:** Medium
**Question:** Write `subsets(nums)` power set (nums distinct).

Example: `[1,2]` → `[[],[1],[2],[1,2]]`.
**Hints:** Backtrack include/exclude or bit masks.
**Solution:**
```js
function subsets(nums) {
  const out = [];
  function bt(start, path) {
    out.push(path.slice());
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      bt(i + 1, path);
      path.pop();
    }
  }
  bt(0, []);
  return out;
}
```
**Time Complexity:** O(n * 2^n)
**Space Complexity:** O(n)

## 60. Combination sum
**Difficulty:** Medium
**Question:** Write `combinationSum(candidates, target)` combinations that sum to target (reuse allowed).

Example: `[2,3,6,7], 7` → `[[2,2,3],[7]]`.
**Hints:** Backtrack from index; reuse same index.
**Solution:**
```js
function combinationSum(candidates, target) {
  const out = [];
  function bt(start, remain, path) {
    if (remain === 0) { out.push(path.slice()); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) continue;
      path.push(candidates[i]);
      bt(i, remain - candidates[i], path);
      path.pop();
    }
  }
  bt(0, target, []);
  return out;
}
```
**Time Complexity:** Exponential
**Space Complexity:** O(target/min)

## 61. Search in rotated sorted array
**Difficulty:** Medium
**Question:** Write `search(nums, target)` in rotated sorted distinct array; return index or -1.

Example: `[4,5,6,7,0,1,2], 0` → `4`.
**Hints:** Binary search identifying sorted half.
**Solution:**
```js
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

## 62. Find first and last position
**Difficulty:** Medium
**Question:** Write `searchRange(nums, target)` in sorted array → [first,last] or [-1,-1].

Example: `[5,7,7,8,8,10], 8` → `[3,4]`.
**Hints:** Two binary searches for bounds.
**Solution:**
```js
function searchRange(nums, target) {
  function bound(leftBias) {
    let lo = 0, hi = nums.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (nums[mid] === target) {
        ans = mid;
        if (leftBias) hi = mid - 1; else lo = mid + 1;
      } else if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  }
  return [bound(true), bound(false)];
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

## 63. Sort colors (Dutch flag)
**Difficulty:** Medium
**Question:** Write `sortColors(nums)` sorting 0,1,2 in-place.

Example: `[2,0,2,1,1,0]` → `[0,0,1,1,2,2]`.
**Hints:** Three pointers low/mid/high.
**Solution:**
```js
function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++; mid++;
    } else if (nums[mid] === 1) mid++;
    else {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    }
  }
  return nums;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 64. Maximum subarray (Kadane)
**Difficulty:** Medium
**Question:** Write `maxSubArray(nums)` maximum contiguous sum.

Example: `[-2,1,-3,4,-1,2,1,-5,4]` → `6`.
**Hints:** Kadane: max ending here.
**Solution:**
```js
function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 65. Jump game
**Difficulty:** Medium
**Question:** Write `canJump(nums)` whether you can reach last index; nums[i] is max jump length.

Example: `[2,3,1,1,4]` → true.
**Hints:** Track farthest reachable.
**Solution:**
```js
function canJump(nums) {
  let far = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > far) return false;
    far = Math.max(far, i + nums[i]);
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 66. Unique paths grid
**Difficulty:** Medium
**Question:** Write `uniquePaths(m, n)` paths from top-left to bottom-right moving only right/down.

Example: m=3,n=7 → 28.
**Hints:** DP grid or combinatorial.
**Solution:**
```js
function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) dp[j] += dp[j - 1];
  }
  return dp[n - 1];
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(n)

## 67. Longest palindromic substring
**Difficulty:** Medium
**Question:** Write `longestPalindrome(s)` returning any longest palindromic substring.

Example: `"babad"` → `"bab"` or `"aba"`.
**Hints:** Expand around centers.
**Solution:**
```js
function longestPalindrome(s) {
  let best = '';
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    const sub = s.slice(l + 1, r);
    if (sub.length > best.length) best = sub;
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return best;
}
```
**Time Complexity:** O(n^2)
**Space Complexity:** O(1)

## 68. Container with most water
**Difficulty:** Medium
**Question:** Write `maxArea(height)` max water between two lines.

Example: `[1,8,6,2,5,4,8,3,7]` → `49`.
**Hints:** Two pointers from ends; move shorter.
**Solution:**
```js
function maxArea(height) {
  let lo = 0, hi = height.length - 1, best = 0;
  while (lo < hi) {
    best = Math.max(best, Math.min(height[lo], height[hi]) * (hi - lo));
    if (height[lo] < height[hi]) lo++; else hi--;
  }
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 69. Group anagrams
**Difficulty:** Medium
**Question:** Write `groupAnagrams(strs)` grouping anagrams together.

Example: `["eat","tea","tan","ate","nat","bat"]`.
**Hints:** Key = sorted letters.
**Solution:**
```js
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}
```
**Time Complexity:** O(n * k log k)
**Space Complexity:** O(n k)

## 70. Top K frequent elements
**Difficulty:** Medium
**Question:** Write `topKFrequent(nums, k)` k most frequent numbers (any order).

Example: `[1,1,1,2,2,3], k=2` → `[1,2]`.
**Hints:** Freq map then sort entries or bucket.
**Solution:**
```js
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([n]) => n);
}
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## 71. Decode string
**Difficulty:** Medium
**Question:** Write `decodeString(s)` for patterns like `3[a2[c]]` → `accaccacc`.

Example: `"2[abc]3[cd]ef"` → `"abcabccdcdcdef"`.
**Hints:** Two stacks: counts and strings.
**Solution:**
```js
function decodeString(s) {
  const counts = [], strs = [];
  let cur = '', k = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') k = k * 10 + Number(ch);
    else if (ch === '[') {
      counts.push(k); strs.push(cur); k = 0; cur = '';
    } else if (ch === ']') {
      const times = counts.pop();
      const prev = strs.pop();
      cur = prev + cur.repeat(times);
    } else cur += ch;
  }
  return cur;
}
```
**Time Complexity:** O(output length)
**Space Complexity:** O(output length)

## 72. Task scheduler cooldown
**Difficulty:** Medium
**Question:** Write `leastInterval(tasks, n)` least units to run tasks with same-letter cooldown n.

Example: `["A","A","A","B","B","B"], n=2` → `8`.
**Hints:** Formula with max freq idle slots.
**Solution:**
```js
function leastInterval(tasks, n) {
  const freq = Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  const maxf = Math.max(...freq);
  const maxCount = freq.filter(f => f === maxf).length;
  return Math.max(tasks.length, (maxf - 1) * (n + 1) + maxCount);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 73. Implement Promise.map with concurrency
**Difficulty:** Medium
**Question:** Write `promiseMap(items, mapper, concurrency)` mapping items with async mapper, limited concurrency, preserve order.

Example: fetch URLs with concurrency 4.
**Hints:** Same pattern as promise pool over indices.
**Solution:**
```js
async function promiseMap(items, mapper, concurrency) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await mapper(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}
```
**Time Complexity:** O(n) tasks
**Space Complexity:** O(concurrency + n)

## 74. Async reduce
**Difficulty:** Medium
**Question:** Write `async function reduceAsync(items, reducer, initial)` awaiting reducer sequentially.

Example: accumulating async fetches.
**Hints:** for-await style loop.
**Solution:**
```js
async function reduceAsync(items, reducer, initial) {
  let acc = initial;
  for (let i = 0; i < items.length; i++) acc = await reducer(acc, items[i], i);
  return acc;
}
```
**Time Complexity:** O(n) awaits
**Space Complexity:** O(1) extra

## 75. Deferred promise
**Difficulty:** Medium
**Question:** Write `createDeferred()` returning `{ promise, resolve, reject }`.

Example: resolve later from event handler.
**Hints:** Capture resolve/reject from Promise constructor.
**Solution:**
```js
function createDeferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 76. Observable-like subscription
**Difficulty:** Medium
**Question:** Write `createObservable(subscribe)` where subscribe(observer) may call next/error/complete; return `{ subscribe }` that returns unsubscribe.

Example: interval ticks then unsubscribe.
**Hints:** Thin wrapper managing cleanup function.
**Solution:**
```js
function createObservable(subscribeFn) {
  return {
    subscribe(observer) {
      let closed = false;
      const safe = {
        next: (v) => { if (!closed) observer.next?.(v); },
        error: (e) => { if (!closed) { closed = true; observer.error?.(e); } },
        complete: () => { if (!closed) { closed = true; observer.complete?.(); } },
      };
      const cleanup = subscribeFn(safe);
      return () => { closed = true; cleanup?.(); };
    },
  };
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 77. Deep merge objects
**Difficulty:** Medium
**Question:** Write `deepMerge(a, b)` recursively merging plain objects (b wins on conflicts; arrays replaced).

Example: `{a:{b:1}}` + `{a:{c:2}}` → `{a:{b:1,c:2}}`.
**Hints:** Recurse when both values are plain objects.
**Solution:**
```js
function isPlain(o) {
  return o && typeof o === 'object' && !Array.isArray(o);
}
function deepMerge(a, b) {
  if (!isPlain(a) || !isPlain(b)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = isPlain(out[k]) && isPlain(v) ? deepMerge(out[k], v) : v;
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 78. Object path get/set
**Difficulty:** Medium
**Question:** Write `getPath(obj, path)` and `setPath(obj, path, value)` for dotted paths like `"a.b.0.c"`.

Example: get/set nested.
**Hints:** Split path; walk/create objects.
**Solution:**
```js
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys.at(-1)] = value;
  return obj;
}
```
**Time Complexity:** O(depth)
**Space Complexity:** O(1)

## 79. Compare version numbers
**Difficulty:** Medium
**Question:** Write `compareVersion(v1, v2)` returning -1, 0, or 1.

Example: `"1.01"` vs `"1.001"` → 0.
**Hints:** Split on `.`; compare integer parts.
**Solution:**
```js
function compareVersion(v1, v2) {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i] || 0, y = b[i] || 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 80. Fraction to recurring decimal
**Difficulty:** Medium
**Question:** Write `fractionToDecimal(numerator, denominator)` string with repeating part in parentheses.

Example: `1,2` → `"0.5"`; `2,3` → `"0.(6)"`.
**Hints:** Long division; Map remainder→index.
**Solution:**
```js
function fractionToDecimal(numerator, denominator) {
  if (numerator === 0) return '0';
  let sign = (numerator < 0) ^ (denominator < 0) ? '-' : '';
  let n = Math.abs(numerator), d = Math.abs(denominator);
  let res = sign + Math.floor(n / d);
  let rem = n % d;
  if (!rem) return res;
  res += '.';
  const seen = new Map();
  while (rem) {
    if (seen.has(rem)) {
      const i = seen.get(rem);
      return res.slice(0, i) + '(' + res.slice(i) + ')';
    }
    seen.set(rem, res.length);
    rem *= 10;
    res += Math.floor(rem / d);
    rem %= d;
  }
  return res;
}
```
**Time Complexity:** O(denominator)
**Space Complexity:** O(denominator)

## 81. Randomized set insert delete getRandom
**Difficulty:** Medium
**Question:** Implement `RandomizedSet` with O(1) average insert, remove, getRandom (uniform).

Example: insert/remove/getRandom.
**Hints:** Array + Map value→index; swap-remove.
**Solution:**
```js
class RandomizedSet {
  constructor() { this.arr = []; this.idx = new Map(); }
  insert(val) {
    if (this.idx.has(val)) return false;
    this.idx.set(val, this.arr.length);
    this.arr.push(val);
    return true;
  }
  remove(val) {
    if (!this.idx.has(val)) return false;
    const i = this.idx.get(val);
    const last = this.arr.at(-1);
    this.arr[i] = last;
    this.idx.set(last, i);
    this.arr.pop();
    this.idx.delete(val);
    return true;
  }
  getRandom() {
    return this.arr[(Math.random() * this.arr.length) | 0];
  }
}
```
**Time Complexity:** O(1) average
**Space Complexity:** O(n)

## 82. Time-based key-value store
**Difficulty:** Medium
**Question:** Implement `TimeMap` with `set(key,value,timestamp)` and `get(key,timestamp)` returning value at largest ts ≤ timestamp.

Example: set then get by time.
**Hints:** Map key → sorted list; binary search.
**Solution:**
```js
class TimeMap {
  constructor() { this.map = new Map(); }
  set(key, value, timestamp) {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    const arr = this.map.get(key);
    if (!arr) return '';
    let lo = 0, hi = arr.length - 1, ans = '';
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (arr[mid][0] <= timestamp) { ans = arr[mid][1]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
}
```
**Time Complexity:** O(log n) get
**Space Complexity:** O(n)

## 83. Design underground system
**Difficulty:** Medium
**Question:** Implement checkIn(id,station,t), checkOut(id,station,t), getAverageTime(start,end).

Example: average travel between stations.
**Hints:** Track in-progress trips; aggregate totals/counts by pair.
**Solution:**
```js
class UndergroundSystem {
  constructor() {
    this.checkins = new Map();
    this.stats = new Map();
  }
  checkIn(id, station, t) { this.checkins.set(id, [station, t]); }
  checkOut(id, station, t) {
    const [start, t0] = this.checkins.get(id);
    this.checkins.delete(id);
    const key = start + '>' + station;
    const s = this.stats.get(key) || { sum: 0, count: 0 };
    s.sum += t - t0; s.count++;
    this.stats.set(key, s);
  }
  getAverageTime(start, end) {
    const s = this.stats.get(start + '>' + end);
    return s.sum / s.count;
  }
}
```
**Time Complexity:** O(1) ops
**Space Complexity:** O(trips + pairs)

## 84. Snapshot array
**Difficulty:** Medium
**Question:** Implement `SnapshotArray` with set(index,val), snap()→snap_id, get(index,snap_id).

Example: set, snap, set, get old snap.
**Hints:** Per index history of [snap_id, value]; binary search.
**Solution:**
```js
class SnapshotArray {
  constructor(length) {
    this.snapId = 0;
    this.data = Array.from({ length }, () => [[0, 0]]);
  }
  set(index, val) {
    const hist = this.data[index];
    if (hist.at(-1)[0] === this.snapId) hist.at(-1)[1] = val;
    else hist.push([this.snapId, val]);
  }
  snap() { return this.snapId++; }
  get(index, snap_id) {
    const hist = this.data[index];
    let lo = 0, hi = hist.length - 1, ans = 0;
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (hist[mid][0] <= snap_id) { ans = hist[mid][1]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }
}
```
**Time Complexity:** O(log S) get
**Space Complexity:** O(length + updates)

## 85. Circular queue
**Difficulty:** Medium
**Question:** Implement `MyCircularQueue(k)` with enQueue, deQueue, Front, Rear, isEmpty, isFull.

Example: capacity k ring buffer.
**Hints:** Fixed array + head + size.
**Solution:**
```js
class MyCircularQueue {
  constructor(k) { this.a = Array(k); this.k = k; this.head = 0; this.size = 0; }
  enQueue(val) {
    if (this.isFull()) return false;
    this.a[(this.head + this.size) % this.k] = val;
    this.size++;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.k;
    this.size--;
    return true;
  }
  Front() { return this.isEmpty() ? -1 : this.a[this.head]; }
  Rear() { return this.isEmpty() ? -1 : this.a[(this.head + this.size - 1) % this.k]; }
  isEmpty() { return this.size === 0; }
  isFull() { return this.size === this.k; }
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(k)

## 86. Browser history
**Difficulty:** Medium
**Question:** Implement `BrowserHistory(homepage)` with visit(url), back(steps), forward(steps).

Example: visit stack truncates forward.
**Hints:** Array + pointer; visit clears forward.
**Solution:**
```js
class BrowserHistory {
  constructor(homepage) { this.hist = [homepage]; this.i = 0; }
  visit(url) {
    this.hist = this.hist.slice(0, this.i + 1);
    this.hist.push(url);
    this.i++;
  }
  back(steps) {
    this.i = Math.max(0, this.i - steps);
    return this.hist[this.i];
  }
  forward(steps) {
    this.i = Math.min(this.hist.length - 1, this.i + steps);
    return this.hist[this.i];
  }
}
```
**Time Complexity:** O(1) amortized visit
**Space Complexity:** O(n)

## 87. Stock price fluctuator
**Difficulty:** Medium
**Question:** Implement `StockPrice` with update(timestamp,price), current(), maximum(), minimum(). Latest timestamp is current; updates can correct past.

Example: track max/min with corrections.
**Hints:** Map timestamp→price; sorted multiset via Map of price counts or scan (interview: Map + track).
**Solution:**
```js
class StockPrice {
  constructor() {
    this.timePrice = new Map();
    this.priceCount = new Map();
    this.latest = 0;
  }
  _add(price, d) {
    this.priceCount.set(price, (this.priceCount.get(price) || 0) + d);
    if (this.priceCount.get(price) === 0) this.priceCount.delete(price);
  }
  update(timestamp, price) {
    if (this.timePrice.has(timestamp)) this._add(this.timePrice.get(timestamp), -1);
    this.timePrice.set(timestamp, price);
    this._add(price, 1);
    this.latest = Math.max(this.latest, timestamp);
  }
  current() { return this.timePrice.get(this.latest); }
  maximum() { return Math.max(...this.priceCount.keys()); }
  minimum() { return Math.min(...this.priceCount.keys()); }
}
```
**Time Complexity:** O(p) max/min with Map keys
**Space Complexity:** O(n)

## 88. Flatten nested list iterator
**Difficulty:** Medium
**Question:** Given nested arrays of integers, implement iterator `NestedIterator` with hasNext/next flattening lazily.

Example: `[1,[4,[6]]]` yields 1,4,6.
**Hints:** Stack of iterators/lists; expand arrays when seen.
**Solution:**
```js
class NestedIterator {
  constructor(nestedList) {
    this.stack = [[nestedList, 0]];
  }
  hasNext() {
    while (this.stack.length) {
      const [list, i] = this.stack.at(-1);
      if (i >= list.length) { this.stack.pop(); continue; }
      if (!Array.isArray(list[i])) return true;
      this.stack.at(-1)[1]++;
      this.stack.push([list[i], 0]);
    }
    return false;
  }
  next() {
    this.hasNext();
    const top = this.stack.at(-1);
    return top[0][top[1]++];
  }
}
```
**Time Complexity:** Amortized O(1)
**Space Complexity:** O(depth)

## 89. Async semaphore
**Difficulty:** Medium
**Question:** Write class `Semaphore(n)` with `async acquire()` and `release()` limiting concurrent holders to n.

Example: n=2 for parallel downloads.
**Hints:** Counter + wait queue of resolvers.
**Solution:**
```js
class Semaphore {
  constructor(n) { this.n = n; this.waiters = []; }
  async acquire() {
    if (this.n > 0) { this.n--; return; }
    await new Promise(resolve => this.waiters.push(resolve));
  }
  release() {
    const next = this.waiters.shift();
    if (next) next();
    else this.n++;
  }
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(waiters)

## 90. Rate limiter token bucket
**Difficulty:** Medium
**Question:** Implement `TokenBucket({ capacity, refillPerSec })` with `tryRemove(tokens=1)` boolean.

Example: burst then throttle.
**Hints:** Track tokens + last refill timestamp.
**Solution:**
```js
class TokenBucket {
  constructor({ capacity, refillPerSec }) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.tokens = capacity;
    this.updated = Date.now();
  }
  _refill() {
    const now = Date.now();
    const add = ((now - this.updated) / 1000) * this.refillPerSec;
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.updated = now;
  }
  tryRemove(n = 1) {
    this._refill();
    if (this.tokens < n) return false;
    this.tokens -= n;
    return true;
  }
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 91. p-limit style limiter factory
**Difficulty:** Medium
**Question:** Write `pLimit(concurrency)` returning a function that schedules promise-returning jobs with a concurrency cap.

Example: const limit = pLimit(2); await Promise.all(urls.map(u => limit(() => fetch(u)))).
**Hints:** Queue + active count.
**Solution:**
```js
function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= concurrency || !queue.length) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve().then(fn).then(resolve, reject).finally(() => {
      active--;
      next();
    });
  };
  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    next();
  });
}
```
**Time Complexity:** O(1) schedule
**Space Complexity:** O(queued)

## 92. Cascading promise waterfall
**Difficulty:** Medium
**Question:** Write `waterfall(tasks)` where each task is `(prevResult) => Promise`; first gets undefined.

Example: chained transforms.
**Hints:** reduce with await.
**Solution:**
```js
async function waterfall(tasks) {
  let acc;
  for (const task of tasks) acc = await task(acc);
  return acc;
}
```
**Time Complexity:** O(n) tasks
**Space Complexity:** O(1)

## 93. Pub/sub with topics
**Difficulty:** Medium
**Question:** Implement `PubSub` with subscribe(topic, fn), unsubscribe, publish(topic, data). Exact topic match.

Example: "user.created" listeners.
**Hints:** Map topic → Set of fns.
**Solution:**
```js
class PubSub {
  constructor() { this.topics = new Map(); }
  subscribe(topic, fn) {
    if (!this.topics.has(topic)) this.topics.set(topic, new Set());
    this.topics.get(topic).add(fn);
    return () => this.topics.get(topic)?.delete(fn);
  }
  publish(topic, data) {
    for (const fn of this.topics.get(topic) || []) fn(data);
  }
}
```
**Time Complexity:** O(subscribers)
**Space Complexity:** O(topics+subs)

## 94. Middleware compose (Koa-style)
**Difficulty:** Medium
**Question:** Write `compose(middleware)` where each mw is `(ctx, next) => {}` and next invokes the following.

Example: logging then handler.
**Hints:** Recursive dispatch index.
**Solution:**
```js
function compose(middleware) {
  return function (ctx) {
    let index = -1;
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      const fn = middleware[i];
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
    }
    return dispatch(0);
  };
}
```
**Time Complexity:** O(n) middleware
**Space Complexity:** O(n) stack

## 95. Virtual DOM style diff keys
**Difficulty:** Medium
**Question:** Write `diffKeyedLists(oldList, newList)` where items have `.key`. Return `{ removed, added, moved }` describing key changes (simple: keys only).

Example: reorder detection.
**Hints:** Set operations on keys; compare index maps for moved.
**Solution:**
```js
function diffKeyedLists(oldList, newList) {
  const oldKeys = oldList.map(x => x.key);
  const newKeys = newList.map(x => x.key);
  const oldSet = new Set(oldKeys);
  const newSet = new Set(newKeys);
  const removed = oldKeys.filter(k => !newSet.has(k));
  const added = newKeys.filter(k => !oldSet.has(k));
  const oldIndex = new Map(oldKeys.map((k, i) => [k, i]));
  const moved = newKeys.filter(k => oldSet.has(k) && oldIndex.get(k) !== newKeys.indexOf(k));
  return { removed, added, moved };
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 96. JSON diff shallow
**Difficulty:** Medium
**Question:** Write `shallowDiff(a, b)` returning `{ added, removed, changed }` for own enumerable keys of plain objects.

Example: detect field changes.
**Hints:** Union of keys; compare with Object.is.
**Solution:**
```js
function shallowDiff(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const added = [], removed = [], changed = [];
  for (const k of keys) {
    const inA = Object.prototype.hasOwnProperty.call(a, k);
    const inB = Object.prototype.hasOwnProperty.call(b, k);
    if (!inA && inB) added.push(k);
    else if (inA && !inB) removed.push(k);
    else if (!Object.is(a[k], b[k])) changed.push(k);
  }
  return { added, removed, changed };
}
```
**Time Complexity:** O(k)
**Space Complexity:** O(k)

## 97. Immutable update helper
**Difficulty:** Medium
**Question:** Write `updateIn(obj, pathArray, updater)` returning new object with nested update (structural sharing).

Example: updateIn(state, ["user","age"], n => n+1).
**Hints:** Recreate objects along path.
**Solution:**
```js
function updateIn(obj, path, updater) {
  if (!path.length) return updater(obj);
  const [head, ...rest] = path;
  const child = obj != null ? obj[head] : undefined;
  const nextChild = updateIn(child, rest, updater);
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[head] = nextChild;
    return copy;
  }
  return { ...(obj || {}), [head]: nextChild };
}
```
**Time Complexity:** O(depth + width copy)
**Space Complexity:** O(depth)

## 98. Binary tree right side view
**Difficulty:** Medium
**Question:** Write `rightSideView(root)` listing node values visible from the right.

Example: [1,2,3,null,5,null,4] → [1,3,4].
**Hints:** BFS; last node each level.
**Solution:**
```js
function rightSideView(root) {
  if (!root) return [];
  const out = [], q = [root];
  while (q.length) {
    const size = q.length;
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      if (i === size - 1) out.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 99. Diameter of binary tree
**Difficulty:** Medium
**Question:** Write `diameterOfBinaryTree(root)` longest path between any nodes (edge count).

Example: skewed vs balanced trees.
**Hints:** DFS heights; track max left+right.
**Solution:**
```js
function diameterOfBinaryTree(root) {
  let best = 0;
  function height(node) {
    if (!node) return 0;
    const L = height(node.left), R = height(node.right);
    best = Math.max(best, L + R);
    return 1 + Math.max(L, R);
  }
  height(root);
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(h)

## 100. Path sum II
**Difficulty:** Medium
**Question:** Write `pathSum(root, targetSum)` all root-to-leaf paths summing to target.

Example: multiple paths.
**Hints:** DFS backtracking path array.
**Solution:**
```js
function pathSum(root, targetSum) {
  const out = [];
  function dfs(node, remain, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right && remain === node.val) out.push(path.slice());
    dfs(node.left, remain - node.val, path);
    dfs(node.right, remain - node.val, path);
    path.pop();
  }
  dfs(root, targetSum, []);
  return out;
}
```
**Time Complexity:** O(n^2) worst copy
**Space Complexity:** O(h)
