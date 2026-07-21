# JavaScript Challenges — Easy

100 easy interview problems. Each entry has a matching title, prompt, working solution, and complexity.

## 1. Reverse a string
**Difficulty:** Easy
**Question:** Write `reverseString(s)` that returns the characters of `s` in reverse order.

Example: `reverseString("hello")` → `"olleh"`. Empty string → `""`.
**Hints:** Convert to array, reverse, join — or build with two pointers.
**Solution:**
```js
function reverseString(s) {
  return [...s].reverse().join('');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 2. Check a palindrome
**Difficulty:** Easy
**Question:** Write `isPalindrome(s)` that returns `true` if `s` reads the same forwards and backwards (case-sensitive, all characters).

Example: `isPalindrome("racecar")` → `true`; `isPalindrome("hello")` → `false`.
**Hints:** Compare characters from both ends moving inward.
**Solution:**
```js
function isPalindrome(s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++;
    j--;
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 3. Count character frequency
**Difficulty:** Easy
**Question:** Write `charFrequency(s)` that returns a plain object mapping each character to its count.

Example: `charFrequency("aab")` → `{ a: 2, b: 1 }`.
**Hints:** Iterate once and increment a Map or object.
**Solution:**
```js
function charFrequency(s) {
  const freq = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  return freq;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k) where k is unique characters

## 4. Two sum
**Difficulty:** Easy
**Question:** Write `twoSum(nums, target)` that returns indices of two numbers that add to `target` (assume exactly one solution).

Example: `twoSum([2,7,11,15], 9)` → `[0,1]`.
**Hints:** Store value→index in a Map while scanning.
**Solution:**
```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 5. FizzBuzz
**Difficulty:** Easy
**Question:** Write `fizzBuzz(n)` that returns an array of strings for 1..n: `"Fizz"` if divisible by 3, `"Buzz"` by 5, `"FizzBuzz"` by both, else the number as string.

Example: `fizzBuzz(5)` → `["1","2","Fizz","4","Buzz"]`.
**Hints:** Check 15 first, then 3, then 5.
**Solution:**
```js
function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(String(i));
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 6. Remove duplicates from sorted array
**Difficulty:** Easy
**Question:** Write `removeDuplicates(nums)` that mutates a sorted array in-place, keeping unique values at the front, and returns the new length.

Example: `nums = [1,1,2]` → length `2`, array starts `[1,2,...]`.
**Hints:** Two pointers: slow writes uniques, fast scans.
**Solution:**
```js
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 7. Valid anagram
**Difficulty:** Easy
**Question:** Write `isAnagram(a, b)` that returns whether `a` and `b` use the same characters with the same frequencies.

Example: `isAnagram("listen","silent")` → `true`.
**Hints:** Count frequencies; or sort both strings.
**Solution:**
```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const freq = {};
  for (const ch of a) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of b) {
    if (!freq[ch]) return false;
    freq[ch]--;
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 8. Flatten a nested array (one level)
**Difficulty:** Easy
**Question:** Write `flattenOne(arr)` that flattens one level of nesting.

Example: `flattenOne([1,[2,3],[4]])` → `[1,2,3,4]`.
**Hints:** Use `concat`/`spread` or `Array.prototype.flat(1)`.
**Solution:**
```js
function flattenOne(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) ? acc.concat(item) : acc.concat([item]), []);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 9. Binary search
**Difficulty:** Easy
**Question:** Write `binarySearch(sortedNums, target)` that returns the index of `target` in a sorted ascending array, or `-1` if missing.

Example: `binarySearch([1,3,5,7], 5)` → `2`.
**Hints:** Maintain low/high; mid = low + ((high-low)>>1).
**Solution:**
```js
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

## 10. Implement debounce
**Difficulty:** Easy
**Question:** Write `debounce(fn, wait)` that returns a function delaying `fn` until `wait` ms after the last call. Preserve `this` and arguments.

Example: rapid calls only invoke once after quiet period.
**Hints:** Clear previous timer on each call; setTimeout for wait.
**Solution:**
```js
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
```
**Time Complexity:** O(1) per call
**Space Complexity:** O(1)

## 11. Deep clone (JSON-safe)
**Difficulty:** Easy
**Question:** Write `deepCloneJson(value)` for plain JSON-like data (objects/arrays/primitives, no functions/Dates/circular).

Example: cloning `{a:{b:1}}` yields a deep copy.
**Hints:** `JSON.parse(JSON.stringify(value))` works for this subset.
**Solution:**
```js
function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 12. Find maximum in array
**Difficulty:** Easy
**Question:** Write `findMax(nums)` that returns the largest number. Throw if empty.

Example: `findMax([3,1,4,1,5])` → `5`.
**Hints:** Track running max in one pass.
**Solution:**
```js
function findMax(nums) {
  if (!nums.length) throw new Error('empty');
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) if (nums[i] > max) max = nums[i];
  return max;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 13. Find minimum in array
**Difficulty:** Easy
**Question:** Write `findMin(nums)` that returns the smallest number. Throw if empty.

Example: `findMin([3,1,4])` → `1`.
**Hints:** Track running min in one pass.
**Solution:**
```js
function findMin(nums) {
  if (!nums.length) throw new Error('empty');
  let min = nums[0];
  for (let i = 1; i < nums.length; i++) if (nums[i] < min) min = nums[i];
  return min;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 14. Sum of array
**Difficulty:** Easy
**Question:** Write `sum(nums)` that returns the sum of all numbers.

Example: `sum([1,2,3])` → `6`.
**Hints:** Reduce with initial 0.
**Solution:**
```js
function sum(nums) {
  return nums.reduce((a, b) => a + b, 0);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 15. Capitalize words
**Difficulty:** Easy
**Question:** Write `capitalizeWords(s)` that capitalizes the first letter of each whitespace-separated word.

Example: `capitalizeWords("hello world")` → `"Hello World"`.
**Hints:** Split, map first char toUpperCase, join.
**Solution:**
```js
function capitalizeWords(s) {
  return s.split(/\s+/).filter(Boolean).map(w =>
    w[0].toUpperCase() + w.slice(1)
  ).join(' ');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 16. Count vowels
**Difficulty:** Easy
**Question:** Write `countVowels(s)` counting aeiou (case-insensitive).

Example: `countVowels("Hello")` → `2`.
**Hints:** Lowercase and test membership in a Set.
**Solution:**
```js
function countVowels(s) {
  const vowels = new Set('aeiou');
  let count = 0;
  for (const ch of s.toLowerCase()) if (vowels.has(ch)) count++;
  return count;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 17. Reverse an array
**Difficulty:** Easy
**Question:** Write `reverseArray(arr)` that returns a new array with elements reversed (do not mutate input).

Example: `reverseArray([1,2,3])` → `[3,2,1]`.
**Hints:** Copy then reverse, or build from the end.
**Solution:**
```js
function reverseArray(arr) {
  return arr.slice().reverse();
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 18. Rotate array right by k
**Difficulty:** Easy
**Question:** Write `rotateRight(nums, k)` returning a new array rotated right by `k` (k may exceed length).

Example: `rotateRight([1,2,3,4,5], 2)` → `[4,5,1,2,3]`.
**Hints:** Normalize k with modulo; slice and concat.
**Solution:**
```js
function rotateRight(nums, k) {
  const n = nums.length;
  if (n === 0) return [];
  k = ((k % n) + n) % n;
  return nums.slice(n - k).concat(nums.slice(0, n - k));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 19. Valid parentheses
**Difficulty:** Easy
**Question:** Write `isValidParentheses(s)` for `()[]{}` only.

Example: `"([])"` → `true`; `"(]"` → `false`.
**Hints:** Stack: push opens, pop on closes matching map.
**Solution:**
```js
function isValidParentheses(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 20. Merge two sorted arrays
**Difficulty:** Easy
**Question:** Write `mergeSorted(a, b)` that merges two ascending arrays into one sorted array.

Example: `mergeSorted([1,3],[2,4])` → `[1,2,3,4]`.
**Hints:** Two pointers walking both arrays.
**Solution:**
```js
function mergeSorted(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  return out.concat(a.slice(i), b.slice(j));
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(n+m)

## 21. Find missing number 0..n
**Difficulty:** Easy
**Question:** Given `nums` containing n distinct numbers from range 0..n, write `missingNumber(nums)` returning the missing one.

Example: `[3,0,1]` → `2`.
**Hints:** XOR all indices and values, or use sum formula.
**Solution:**
```js
function missingNumber(nums) {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) xor ^= i ^ nums[i];
  return xor;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 22. Move zeros to end
**Difficulty:** Easy
**Question:** Write `moveZeroes(nums)` that mutates the array so all non-zeros keep relative order, zeros at end.

Example: `[0,1,0,3,12]` → `[1,3,12,0,0]`.
**Hints:** Two pointers: write non-zeros forward, fill rest with 0.
**Solution:**
```js
function moveZeroes(nums) {
  let w = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) nums[w++] = nums[i];
  }
  while (w < nums.length) nums[w++] = 0;
  return nums;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 23. Intersection of two arrays
**Difficulty:** Easy
**Question:** Write `intersection(a, b)` returning unique values present in both.

Example: `intersection([1,2,2,1],[2,2])` → `[2]`.
**Hints:** Put one array in a Set; filter the other.
**Solution:**
```js
function intersection(a, b) {
  const setA = new Set(a);
  const out = new Set();
  for (const x of b) if (setA.has(x)) out.add(x);
  return [...out];
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(n+m)

## 24. First unique character
**Difficulty:** Easy
**Question:** Write `firstUniqChar(s)` returning the index of the first non-repeating character, or `-1`.

Example: `"leetcode"` → `0`; `"aabb"` → `-1`.
**Hints:** Frequency map, then second pass for count===1.
**Solution:**
```js
function firstUniqChar(s) {
  const freq = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) if (freq[s[i]] === 1) return i;
  return -1;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 25. Implement throttle
**Difficulty:** Easy
**Question:** Write `throttle(fn, wait)` that invokes `fn` at most once per `wait` ms (leading edge).

Example: many calls within wait → one invocation.
**Hints:** Track last call time; ignore if too soon.
**Solution:**
```js
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      return fn.apply(this, args);
    }
  };
}
```
**Time Complexity:** O(1) per call
**Space Complexity:** O(1)

## 26. Chunk array
**Difficulty:** Easy
**Question:** Write `chunk(arr, size)` that splits `arr` into subarrays of length `size` (last may be shorter).

Example: `chunk([1,2,3,4,5], 2)` → `[[1,2],[3,4],[5]]`.
**Hints:** Slice in a loop stepping by size.
**Solution:**
```js
function chunk(arr, size) {
  if (size <= 0) throw new Error('size must be > 0');
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 27. Array unique values
**Difficulty:** Easy
**Question:** Write `unique(arr)` that returns values in first-seen order without duplicates.

Example: `unique([1,2,1,3])` → `[1,2,3]`.
**Hints:** Use a Set for seen membership.
**Solution:**
```js
function unique(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 28. Is power of two
**Difficulty:** Easy
**Question:** Write `isPowerOfTwo(n)` for positive integers.

Example: `8` → `true`; `6` → `false`.
**Hints:** n > 0 && (n & (n-1)) === 0.
**Solution:**
```js
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 29. Factorial
**Difficulty:** Easy
**Question:** Write `factorial(n)` for non-negative integers (use Number; n small).

Example: `factorial(5)` → `120`.
**Hints:** Iterative multiply 1..n.
**Solution:**
```js
function factorial(n) {
  if (n < 0) throw new Error('n >= 0');
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 30. Fibonacci nth
**Difficulty:** Easy
**Question:** Write `fib(n)` returning the nth Fibonacci number (0-indexed: fib(0)=0, fib(1)=1).

Example: `fib(6)` → `8`.
**Hints:** Iterate with two rolling variables.
**Solution:**
```js
function fib(n) {
  if (n < 0) throw new Error('n >= 0');
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 31. Title case string
**Difficulty:** Easy
**Question:** Write `titleCase(s)` lowercasing then capitalizing first letter of each word.

Example: `"jAVa sCript"` → `"Java Script"`.
**Hints:** toLowerCase then capitalize each word.
**Solution:**
```js
function titleCase(s) {
  return s.toLowerCase().split(/\s+/).filter(Boolean).map(w =>
    w[0].toUpperCase() + w.slice(1)
  ).join(' ');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 32. Palindrome ignoring non-alphanumeric
**Difficulty:** Easy
**Question:** Write `isPalindromeAlpha(s)` ignoring case and non-alphanumeric chars.

Example: `"A man, a plan, a canal: Panama"` → `true`.
**Hints:** Two pointers skipping invalid chars.
**Solution:**
```js
function isPalindromeAlpha(s) {
  const isAlnum = c => /[a-z0-9]/i.test(c);
  let i = 0, j = s.length - 1;
  while (i < j) {
    while (i < j && !isAlnum(s[i])) i++;
    while (i < j && !isAlnum(s[j])) j--;
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    i++;
    j--;
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 33. Longest common prefix
**Difficulty:** Easy
**Question:** Write `longestCommonPrefix(strs)` for an array of strings.

Example: `["flower","flow","flight"]` → `"fl"`.
**Hints:** Shrink prefix against each string.
**Solution:**
```js
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}
```
**Time Complexity:** O(S) total chars
**Space Complexity:** O(1) extra

## 34. Contains duplicate
**Difficulty:** Easy
**Question:** Write `containsDuplicate(nums)` → true if any value appears twice.

Example: `[1,2,3,1]` → `true`.
**Hints:** Set size vs array length.
**Solution:**
```js
function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 35. Plus one (digits array)
**Difficulty:** Easy
**Question:** Digits of a non-negative integer as array; write `plusOne(digits)` returning digits of number+1.

Example: `[1,2,3]` → `[1,2,4]`; `[9,9]` → `[1,0,0]`.
**Hints:** Add from the right; handle carry.
**Solution:**
```js
function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1) or O(n) if new array

## 36. Roman to integer (basic)
**Difficulty:** Easy
**Question:** Write `romanToInt(s)` for standard Roman numerals I,V,X,L,C,D,M with subtractive pairs.

Example: `"MCMXCIV"` → `1994`.
**Hints:** If value < next, subtract; else add.
**Solution:**
```js
function romanToInt(s) {
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = map[s[i]], next = map[s[i + 1]] || 0;
    total += v < next ? -v : v;
  }
  return total;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 37. Climbing stairs
**Difficulty:** Easy
**Question:** You can climb 1 or 2 steps. Write `climbStairs(n)` ways to reach the top.

Example: `n=3` → `3`.
**Hints:** Same recurrence as Fibonacci.
**Solution:**
```js
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 38. Best time to buy/sell stock once
**Difficulty:** Easy
**Question:** Write `maxProfit(prices)` max profit from one buy and one later sell (0 if none).

Example: `[7,1,5,3,6,4]` → `5`.
**Hints:** Track min price so far and max profit.
**Solution:**
```js
function maxProfit(prices) {
  let minP = Infinity, best = 0;
  for (const p of prices) {
    minP = Math.min(minP, p);
    best = Math.max(best, p - minP);
  }
  return best;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 39. Isomorphic strings
**Difficulty:** Easy
**Question:** Write `isIsomorphic(s, t)` — characters map 1:1 consistently.

Example: `"egg","add"` → `true`; `"foo","bar"` → `false`.
**Hints:** Two maps s→t and t→s.
**Solution:**
```js
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const st = new Map(), ts = new Map();
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = t[i];
    if ((st.has(a) && st.get(a) !== b) || (ts.has(b) && ts.get(b) !== a)) return false;
    st.set(a, b);
    ts.set(b, a);
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 40. Word pattern
**Difficulty:** Easy
**Question:** Write `wordPattern(pattern, s)` mapping pattern letters to words bijectively.

Example: `pattern="abba", s="dog cat cat dog"` → `true`.
**Hints:** Split words; two-way Map like isomorphic.
**Solution:**
```js
function wordPattern(pattern, s) {
  const words = s.split(' ');
  if (pattern.length !== words.length) return false;
  const p2w = new Map(), w2p = new Map();
  for (let i = 0; i < pattern.length; i++) {
    const p = pattern[i], w = words[i];
    if ((p2w.has(p) && p2w.get(p) !== w) || (w2p.has(w) && w2p.get(w) !== p)) return false;
    p2w.set(p, w);
    w2p.set(w, p);
  }
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 41. Hamming distance
**Difficulty:** Easy
**Question:** Write `hammingDistance(x, y)` — differing bits between two non-negative ints.

Example: `1,4` → `2`.
**Hints:** XOR then count set bits.
**Solution:**
```js
function hammingDistance(x, y) {
  let n = x ^ y, count = 0;
  while (n) {
    count += n & 1;
    n >>>= 1;
  }
  return count;
}
```
**Time Complexity:** O(1) for 32-bit
**Space Complexity:** O(1)

## 42. Single number (XOR)
**Difficulty:** Easy
**Question:** Every element appears twice except one. Write `singleNumber(nums)` finding it.

Example: `[4,1,2,1,2]` → `4`.
**Hints:** XOR all elements.
**Solution:**
```js
function singleNumber(nums) {
  return nums.reduce((a, b) => a ^ b, 0);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 43. Majority element
**Difficulty:** Easy
**Question:** Write `majorityElement(nums)` — element appearing > n/2 times (guaranteed).

Example: `[3,2,3]` → `3`.
**Hints:** Boyer-Moore voting.
**Solution:**
```js
function majorityElement(nums) {
  let cand = null, count = 0;
  for (const x of nums) {
    if (count === 0) cand = x;
    count += x === cand ? 1 : -1;
  }
  return cand;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 44. Pascal triangle row
**Difficulty:** Easy
**Question:** Write `getRow(rowIndex)` returning 0-indexed Pascal row.

Example: `rowIndex=3` → `[1,3,3,1]`.
**Hints:** Build row iteratively using combinations.
**Solution:**
```js
function getRow(rowIndex) {
  const row = [1];
  for (let i = 0; i < rowIndex; i++) {
    for (let j = i; j >= 1; j--) row[j] += row[j - 1];
    row.push(1);
  }
  return row;
}
```
**Time Complexity:** O(rowIndex^2)
**Space Complexity:** O(rowIndex)

## 45. Square of sorted array
**Difficulty:** Easy
**Question:** Write `sortedSquares(nums)` for sorted ints (may be negative), return squares sorted ascending.

Example: `[-4,-1,0,3,10]` → `[0,1,9,16,100]`.
**Hints:** Two pointers from ends; fill result from back.
**Solution:**
```js
function sortedSquares(nums) {
  const n = nums.length;
  const out = new Array(n);
  let lo = 0, hi = n - 1, i = n - 1;
  while (lo <= hi) {
    if (Math.abs(nums[lo]) > Math.abs(nums[hi])) {
      out[i--] = nums[lo] * nums[lo];
      lo++;
    } else {
      out[i--] = nums[hi] * nums[hi];
      hi--;
    }
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 46. Reverse words in string
**Difficulty:** Easy
**Question:** Write `reverseWords(s)` reversing word order; trim and collapse spaces.

Example: `"  hello world  "` → `"world hello"`.
**Hints:** Trim, split on whitespace, reverse, join.
**Solution:**
```js
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 47. Implement once
**Difficulty:** Easy
**Question:** Write `once(fn)` that returns a function calling `fn` only the first time (returns first result thereafter).

Example: second call returns cached value, does not re-run.
**Hints:** Closure flag + cached result.
**Solution:**
```js
function once(fn) {
  let called = false, result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
```
**Time Complexity:** O(1) after first
**Space Complexity:** O(1)

## 48. Pick object keys
**Difficulty:** Easy
**Question:** Write `pick(obj, keys)` returning a new object with only listed keys that exist.

Example: `pick({a:1,b:2}, ["a"])` → `{a:1}`.
**Hints:** Loop keys; copy if present.
**Solution:**
```js
function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
  return out;
}
```
**Time Complexity:** O(k)
**Space Complexity:** O(k)

## 49. Omit object keys
**Difficulty:** Easy
**Question:** Write `omit(obj, keys)` returning a shallow copy without listed keys.

Example: `omit({a:1,b:2}, ["b"])` → `{a:1}`.
**Hints:** Copy entries filtering keys.
**Solution:**
```js
function omit(obj, keys) {
  const ban = new Set(keys);
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (!ban.has(k)) out[k] = v;
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 50. Group by key function
**Difficulty:** Easy
**Question:** Write `groupBy(arr, fn)` grouping items by `fn(item)` string/number key.

Example: `groupBy([6.1,4.2], Math.floor)` → `{6:[6.1],4:[4.2]}`.
**Hints:** Reduce into object of arrays.
**Solution:**
```js
function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 51. Array range
**Difficulty:** Easy
**Question:** Write `range(start, end)` inclusive integers from start to end (assume start≤end).

Example: `range(3,6)` → `[3,4,5,6]`.
**Hints:** Loop push i.
**Solution:**
```js
function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 52. Clamp number
**Difficulty:** Easy
**Question:** Write `clamp(n, min, max)` constraining n into [min,max].

Example: `clamp(15,0,10)` → `10`.
**Hints:** Math.min(max, Math.max(min, n)).
**Solution:**
```js
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 53. Is empty value
**Difficulty:** Easy
**Question:** Write `isEmpty(value)` true for null/undefined, `""`, `[]`, or `{}` (no own keys).

Example: `isEmpty({})` → `true`; `isEmpty([1])` → `false`.
**Hints:** Branch on type; Object.keys for objects.
**Solution:**
```js
function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
```
**Time Complexity:** O(k) for objects
**Space Complexity:** O(1)

## 54. Sleep promise
**Difficulty:** Easy
**Question:** Write `sleep(ms)` returning a Promise that resolves after `ms` milliseconds.

Example: `await sleep(100)` then continues.
**Hints:** new Promise(r => setTimeout(r, ms)).
**Solution:**
```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 55. Parse query string
**Difficulty:** Easy
**Question:** Write `parseQuery(qs)` for `a=1&b=2` (no `?`). Values are strings; duplicate keys → last wins.

Example: `"x=1&y=hi"` → `{x:"1",y:"hi"}`.
**Hints:** Split `&` then `=`; decodeURIComponent.
**Solution:**
```js
function parseQuery(qs) {
  const out = {};
  if (!qs) return out;
  for (const part of qs.split('&')) {
    if (!part) continue;
    const [k, ...rest] = part.split('=');
    out[decodeURIComponent(k)] = decodeURIComponent(rest.join('=') || '');
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 56. Array difference
**Difficulty:** Easy
**Question:** Write `difference(a, b)` values in `a` not in `b` (preserve order, uniques from a).

Example: `difference([1,2,3],[2])` → `[1,3]`.
**Hints:** Set of b; filter a.
**Solution:**
```js
function difference(a, b) {
  const ban = new Set(b);
  return a.filter(x => !ban.has(x));
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(m)

## 57. Zip two arrays
**Difficulty:** Easy
**Question:** Write `zip(a, b)` pairing until shortest ends.

Example: `zip([1,2],["a","b","c"])` → `[[1,"a"],[2,"b"]]`.
**Hints:** Loop to Math.min lengths.
**Solution:**
```js
function zip(a, b) {
  const n = Math.min(a.length, b.length);
  const out = [];
  for (let i = 0; i < n; i++) out.push([a[i], b[i]]);
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 58. Last index of
**Difficulty:** Easy
**Question:** Write `lastIndexOf(arr, value)` without using Array#lastIndexOf.

Example: `[1,2,1], 1` → `2`.
**Hints:** Scan from the end.
**Solution:**
```js
function lastIndexOf(arr, value) {
  for (let i = arr.length - 1; i >= 0; i--) if (Object.is(arr[i], value)) return i;
  return -1;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 59. All elements truthy
**Difficulty:** Easy
**Question:** Write `everyTruthy(arr)` true if every element is truthy.

Example: `[1,"a",true]` → `true`; `[1,0]` → `false`.
**Hints:** every(Boolean) or manual loop.
**Solution:**
```js
function everyTruthy(arr) {
  for (const x of arr) if (!x) return false;
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 60. Some element matches
**Difficulty:** Easy
**Question:** Write `someMatch(arr, pred)` true if any element satisfies pred.

Example: `someMatch([1,2,3], x => x > 2)` → `true`.
**Hints:** Short-circuit on first true.
**Solution:**
```js
function someMatch(arr, pred) {
  for (const x of arr) if (pred(x)) return true;
  return false;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 61. Map object values
**Difficulty:** Easy
**Question:** Write `mapValues(obj, fn)` returning new object with values mapped.

Example: `mapValues({a:1}, x => x*2)` → `{a:2}`.
**Hints:** Object.fromEntries of mapped entries.
**Solution:**
```js
function mapValues(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 62. Invert object
**Difficulty:** Easy
**Question:** Write `invert(obj)` swapping keys and stringified values (last key wins on collision).

Example: `{a:1,b:2}` → `{"1":"a","2":"b"}`.
**Hints:** Iterate entries; out[String(v)] = k.
**Solution:**
```js
function invert(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[String(v)] = k;
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 63. Safe JSON parse
**Difficulty:** Easy
**Question:** Write `safeJsonParse(str, fallback)` returning parsed value or fallback on error.

Example: `safeJsonParse("{", null)` → `null`.
**Hints:** try/catch JSON.parse.
**Solution:**
```js
function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 64. Repeat string
**Difficulty:** Easy
**Question:** Write `repeatStr(s, n)` without String#repeat.

Example: `repeatStr("ab", 3)` → `"ababab"`.
**Hints:** Loop concatenate or array fill join.
**Solution:**
```js
function repeatStr(s, n) {
  if (n <= 0) return '';
  let out = '';
  for (let i = 0; i < n; i++) out += s;
  return out;
}
```
**Time Complexity:** O(n * |s|)
**Space Complexity:** O(n * |s|)

## 65. Trim string manually
**Difficulty:** Easy
**Question:** Write `trimManual(s)` removing leading/trailing whitespace (space/tab/newline).

Example: `"  hi\n"` → `"hi"`.
**Hints:** Find first/last non-ws indices; slice.
**Solution:**
```js
function trimManual(s) {
  const ws = c => c === ' ' || c === '\t' || c === '\n' || c === '\r';
  let i = 0, j = s.length - 1;
  while (i <= j && ws(s[i])) i++;
  while (j >= i && ws(s[j])) j--;
  return s.slice(i, j + 1);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n) for slice

## 66. Count words
**Difficulty:** Easy
**Question:** Write `countWords(s)` counting whitespace-separated words (ignore extra spaces).

Example: `"  one two  three "` → `3`.
**Hints:** trim + split /\s+/ ; empty → 0.
**Solution:**
```js
function countWords(s) {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 67. Are arrays equal shallow
**Difficulty:** Easy
**Question:** Write `arraysEqual(a, b)` comparing length and each element with Object.is.

Example: `[1,NaN],[1,NaN]` → `true`.
**Hints:** Length check then Object.is each index.
**Solution:**
```js
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
  return true;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 68. Find peak index (unimodal)
**Difficulty:** Easy
**Question:** Write `findPeakIndex(nums)` for array that increases then decreases (strict); return peak index.

Example: `[1,3,5,4,2]` → `2`.
**Hints:** Binary search: if nums[mid]<nums[mid+1] go right.
**Solution:**
```js
function findPeakIndex(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

## 69. GCD of two numbers
**Difficulty:** Easy
**Question:** Write `gcd(a, b)` Euclidean algorithm for non-negative integers.

Example: `gcd(48,18)` → `6`.
**Hints:** while b: [a,b]=[b,a%b].
**Solution:**
```js
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}
```
**Time Complexity:** O(log min(a,b))
**Space Complexity:** O(1)

## 70. LCM of two numbers
**Difficulty:** Easy
**Question:** Write `lcm(a, b)` using gcd. Return 0 if either is 0.

Example: `lcm(4,6)` → `12`.
**Hints:** abs(a/gcd)*b to reduce overflow risk.
**Solution:**
```js
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b) * b);
}
```
**Time Complexity:** O(log min(a,b))
**Space Complexity:** O(1)

## 71. Matrix transpose
**Difficulty:** Easy
**Question:** Write `transpose(matrix)` for m×n matrix → n×m.

Example: `[[1,2,3],[4,5,6]]` → `[[1,4],[2,5],[3,6]]`.
**Hints:** out[j][i] = matrix[i][j].
**Solution:**
```js
function transpose(matrix) {
  if (!matrix.length) return [];
  const m = matrix.length, n = matrix[0].length;
  const out = Array.from({ length: n }, () => Array(m));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) out[j][i] = matrix[i][j];
  return out;
}
```
**Time Complexity:** O(mn)
**Space Complexity:** O(mn)

## 72. Diagonal sum of square matrix
**Difficulty:** Easy
**Question:** Write `diagonalSum(mat)` summing primary and secondary diagonals; center counted once.

Example: `[[1,2,3],[4,5,6],[7,8,9]]` → `25`.
**Hints:** Add mat[i][i] and mat[i][n-1-i]; subtract center if n odd.
**Solution:**
```js
function diagonalSum(mat) {
  const n = mat.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += mat[i][i];
    sum += mat[i][n - 1 - i];
  }
  if (n % 2 === 1) sum -= mat[(n / 2) | 0][(n / 2) | 0];
  return sum;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 73. Running sum
**Difficulty:** Easy
**Question:** Write `runningSum(nums)` where out[i] = sum(nums[0..i]).

Example: `[1,2,3,4]` → `[1,3,6,10]`.
**Hints:** Accumulate prefix.
**Solution:**
```js
function runningSum(nums) {
  const out = [];
  let sum = 0;
  for (const x of nums) {
    sum += x;
    out.push(sum);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 74. Kids with candies
**Difficulty:** Easy
**Question:** Write `kidsWithCandies(candies, extra)` boolean array: whether kid i can have the greatest after getting extra.

Example: `[2,3,5,1,3], 3` → `[true,true,true,false,true]`.
**Hints:** Find max; compare candies[i]+extra >= max.
**Solution:**
```js
function kidsWithCandies(candies, extra) {
  const max = Math.max(...candies);
  return candies.map(c => c + extra >= max);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 75. Shuffle string by indices
**Difficulty:** Easy
**Question:** Write `restoreString(s, indices)` where result[indices[i]] = s[i].

Example: `s="codeleet", indices=[4,5,6,7,0,2,1,3]` → `"leetcode"`.
**Hints:** Allocate array; place chars; join.
**Solution:**
```js
function restoreString(s, indices) {
  const out = new Array(s.length);
  for (let i = 0; i < s.length; i++) out[indices[i]] = s[i];
  return out.join('');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 76. Number of consistent strings
**Difficulty:** Easy
**Question:** Write `countConsistent(allowed, words)` counting words whose chars all appear in allowed.

Example: `allowed="ab", words=["ad","bd","aaab","baa","badab"]` → `2`.
**Hints:** Set of allowed; every char of word in set.
**Solution:**
```js
function countConsistent(allowed, words) {
  const set = new Set(allowed);
  return words.filter(w => [...w].every(ch => set.has(ch))).length;
}
```
**Time Complexity:** O(total chars)
**Space Complexity:** O(|allowed|)

## 77. Defanging IP address
**Difficulty:** Easy
**Question:** Write `defangIPaddr(address)` replacing `.` with `[.]`.

Example: `"1.1.1.1"` → `"1[.]1[.]1[.]1"`.
**Hints:** split join or replaceAll.
**Solution:**
```js
function defangIPaddr(address) {
  return address.split('.').join('[.]');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 78. Goal parser interpretation
**Difficulty:** Easy
**Question:** Command string uses `G`, `()`, `(al)`. Write `interpret(command)`.

Example: `"G()(al)"` → `"Goal"`.
**Hints:** Scan or chained replace.
**Solution:**
```js
function interpret(command) {
  return command.replaceAll('()', 'o').replaceAll('(al)', 'al');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 79. Jewels and stones
**Difficulty:** Easy
**Question:** Write `numJewels(jewels, stones)` counting stones that are jewels.

Example: `jewels="aA", stones="aAAbbbb"` → `3`.
**Hints:** Set of jewels; count stones in set.
**Solution:**
```js
function numJewels(jewels, stones) {
  const set = new Set(jewels);
  let count = 0;
  for (const ch of stones) if (set.has(ch)) count++;
  return count;
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(k)

## 80. Shuffle array 2n
**Difficulty:** Easy
**Question:** Array is [x1..xn,y1..yn]. Write `shuffle(nums, n)` → [x1,y1,...,xn,yn].

Example: `[2,5,1,3,4,7], n=3` → `[2,3,5,4,1,7]`.
**Hints:** Interleave first half and second half.
**Solution:**
```js
function shuffle(nums, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(nums[i], nums[i + n]);
  }
  return out;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 81. Number of good pairs
**Difficulty:** Easy
**Question:** Write `numIdenticalPairs(nums)` counting pairs i<j with nums[i]===nums[j].

Example: `[1,2,3,1,1,3]` → `4`.
**Hints:** Frequency map; for each count add C(c,2).
**Solution:**
```js
function numIdenticalPairs(nums) {
  const freq = {};
  let pairs = 0;
  for (const x of nums) {
    pairs += freq[x] || 0;
    freq[x] = (freq[x] || 0) + 1;
  }
  return pairs;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(k)

## 82. Smaller numbers than current
**Difficulty:** Easy
**Question:** Write `smallerNumbersThanCurrent(nums)` where out[i] = count of nums[j] < nums[i].

Example: `[8,1,2,2,3]` → `[4,0,1,1,3]`.
**Hints:** For n≤100 nested loops OK; or sort+map.
**Solution:**
```js
function smallerNumbersThanCurrent(nums) {
  return nums.map(x => nums.filter(y => y < x).length);
}
```
**Time Complexity:** O(n^2)
**Space Complexity:** O(n)

## 83. Create target array
**Difficulty:** Easy
**Question:** Write `createTargetArray(nums, index)` inserting nums[i] at position index[i] (shift right).

Example: `nums=[0,1,2,3,4], index=[0,1,2,2,1]` → `[0,4,1,3,2]`.
**Hints:** Use splice insert.
**Solution:**
```js
function createTargetArray(nums, index) {
  const target = [];
  for (let i = 0; i < nums.length; i++) target.splice(index[i], 0, nums[i]);
  return target;
}
```
**Time Complexity:** O(n^2)
**Space Complexity:** O(n)

## 84. Decompress run-length
**Difficulty:** Easy
**Question:** Write `decompressRLElist(nums)` where pairs (freq,val) at [2i,2i+1].

Example: `[1,2,3,4]` → `[2,4,4,4]`.
**Hints:** For each pair push val freq times.
**Solution:**
```js
function decompressRLElist(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i += 2) {
    for (let f = 0; f < nums[i]; f++) out.push(nums[i + 1]);
  }
  return out;
}
```
**Time Complexity:** O(output size)
**Space Complexity:** O(output size)

## 85. XOR operation in array
**Difficulty:** Easy
**Question:** Write `xorOperation(n, start)` for nums[i]=start+2*i; return XOR of all.

Example: `n=5,start=0` → `8`.
**Hints:** Accumulate XOR in loop.
**Solution:**
```js
function xorOperation(n, start) {
  let x = 0;
  for (let i = 0; i < n; i++) x ^= start + 2 * i;
  return x;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 86. Count items matching rule
**Difficulty:** Easy
**Question:** Write `countMatches(items, ruleKey, ruleValue)` where items are [type,color,name].

Example: ruleKey `"color"`, ruleValue `"silver"` counts matching rows.
**Hints:** Map key to index 0/1/2; filter.
**Solution:**
```js
function countMatches(items, ruleKey, ruleValue) {
  const idx = { type: 0, color: 1, name: 2 }[ruleKey];
  return items.filter(it => it[idx] === ruleValue).length;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 87. Maximum product of two
**Difficulty:** Easy
**Question:** Write `maxProduct(nums)` maximum product of any two distinct-index elements.

Example: `[3,4,5,2]` → `20`.
**Hints:** Track two largest (signs matter: also two smallest).
**Solution:**
```js
function maxProduct(nums) {
  let max1 = -Infinity, max2 = -Infinity;
  let min1 = Infinity, min2 = Infinity;
  for (const x of nums) {
    if (x > max1) { max2 = max1; max1 = x; }
    else if (x > max2) max2 = x;
    if (x < min1) { min2 = min1; min1 = x; }
    else if (x < min2) min2 = x;
  }
  return Math.max(max1 * max2, min1 * min2);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 88. Average excluding min max
**Difficulty:** Easy
**Question:** Write `average(salary)` mean of salaries excluding one min and one max.

Example: `[4000,3000,1000,2000]` → `2500`.
**Hints:** Sum - min - max over n-2.
**Solution:**
```js
function average(salary) {
  let min = Infinity, max = -Infinity, sum = 0;
  for (const s of salary) {
    sum += s;
    min = Math.min(min, s);
    max = Math.max(max, s);
  }
  return (sum - min - max) / (salary.length - 2);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 89. Check if two strings equivalent
**Difficulty:** Easy
**Question:** Write `arrayStringsAreEqual(word1, word2)` where each is an array of string pieces.

Example: `["ab","c"], ["a","bc"]` → `true`.
**Hints:** Join both and compare.
**Solution:**
```js
function arrayStringsAreEqual(word1, word2) {
  return word1.join('') === word2.join('');
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 90. Maximum 69 number
**Difficulty:** Easy
**Question:** Write `maximum69Number(num)` by changing at most one digit 6→9.

Example: `9669` → `9969`.
**Hints:** Replace first 6 from the left.
**Solution:**
```js
function maximum69Number(num) {
  const s = String(num);
  const i = s.indexOf('6');
  if (i === -1) return num;
  return Number(s.slice(0, i) + '9' + s.slice(i + 1));
}
```
**Time Complexity:** O(d)
**Space Complexity:** O(d)

## 91. Subtract product and sum of digits
**Difficulty:** Easy
**Question:** Write `subtractProductAndSum(n)` = product of digits − sum of digits.

Example: `234` → `15`.
**Hints:** Loop digits with %10.
**Solution:**
```js
function subtractProductAndSum(n) {
  let prod = 1, sum = 0;
  while (n > 0) {
    const d = n % 10;
    prod *= d;
    sum += d;
    n = (n / 10) | 0;
  }
  return prod - sum;
}
```
**Time Complexity:** O(d)
**Space Complexity:** O(1)

## 92. Number of steps to zero
**Difficulty:** Easy
**Question:** Write `numberOfSteps(num)`: if even /2 else -1 until 0; return steps.

Example: `14` → `6`.
**Hints:** Simulate; or bit tricks.
**Solution:**
```js
function numberOfSteps(num) {
  let steps = 0;
  while (num > 0) {
    num = num % 2 === 0 ? num / 2 : num - 1;
    steps++;
  }
  return steps;
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

## 93. Count odd numbers in range
**Difficulty:** Easy
**Question:** Write `countOdds(low, high)` how many odds in inclusive range.

Example: `3,7` → `3`.
**Hints:** (high+1)//2 - low//2.
**Solution:**
```js
function countOdds(low, high) {
  return Math.floor((high + 1) / 2) - Math.floor(low / 2);
}
```
**Time Complexity:** O(1)
**Space Complexity:** O(1)

## 94. Average value of even divisible by 3
**Difficulty:** Easy
**Question:** Write `averageValue(nums)` average of numbers divisible by 6 (even and by 3); floor; 0 if none.

Example: `[1,3,6,10,12,15]` → `9`.
**Hints:** Filter n%6===0; average floor.
**Solution:**
```js
function averageValue(nums) {
  const xs = nums.filter(n => n % 6 === 0);
  if (!xs.length) return 0;
  return Math.floor(xs.reduce((a, b) => a + b, 0) / xs.length);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(n)

## 95. Find the difference string
**Difficulty:** Easy
**Question:** Strings t is s with one extra character. Write `findTheDifference(s, t)` returning that char.

Example: `s="abcd", t="abcde"` → `"e"`.
**Hints:** XOR char codes, or count map.
**Solution:**
```js
function findTheDifference(s, t) {
  let x = 0;
  for (const ch of s) x ^= ch.charCodeAt(0);
  for (const ch of t) x ^= ch.charCodeAt(0);
  return String.fromCharCode(x);
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)

## 96. Ransom note
**Difficulty:** Easy
**Question:** Write `canConstruct(ransomNote, magazine)` if note can be built from magazine letters (each letter once).

Example: `"aa","aab"` → `true`.
**Hints:** Count magazine; decrement for note.
**Solution:**
```js
function canConstruct(ransomNote, magazine) {
  const freq = {};
  for (const ch of magazine) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of ransomNote) {
    if (!freq[ch]) return false;
    freq[ch]--;
  }
  return true;
}
```
**Time Complexity:** O(n+m)
**Space Complexity:** O(k)

## 97. Valid perfect square
**Difficulty:** Easy
**Question:** Write `isPerfectSquare(num)` without Math.sqrt (integer binary search).

Example: `16` → `true`; `14` → `false`.
**Hints:** Binary search 1..num for mid*mid.
**Solution:**
```js
function isPerfectSquare(num) {
  let lo = 1, hi = num;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const sq = mid * mid;
    if (sq === num) return true;
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
```
**Time Complexity:** O(log n)
**Space Complexity:** O(1)

## 98. Sqrt floor
**Difficulty:** Easy
**Question:** Write `mySqrt(x)` returning floor(sqrt(x)) for non-negative int via binary search.

Example: `8` → `2`.
**Hints:** Binary search; keep last mid where mid*mid<=x.
**Solution:**
```js
function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = (x / 2) | 0, ans = 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (mid <= ((x / mid) | 0)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}
```
**Time Complexity:** O(log x)
**Space Complexity:** O(1)

## 99. Merge sorted array in-place
**Difficulty:** Easy
**Question:** Write `merge(nums1, m, nums2, n)` merging nums2 into nums1 (size m+n) in-place sorted.

Example: `nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3`.
**Hints:** Fill from the back with three pointers.
**Solution:**
```js
function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
  return nums1;
}
```
**Time Complexity:** O(m+n)
**Space Complexity:** O(1)

## 100. Remove element in-place
**Difficulty:** Easy
**Question:** Write `removeElement(nums, val)` moving all ≠val to front; return new length.

Example: `[3,2,2,3], val=3` → length 2, starts `[2,2,...]`.
**Hints:** Two pointers overwrite.
**Solution:**
```js
function removeElement(nums, val) {
  let w = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) nums[w++] = nums[i];
  }
  return w;
}
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)
