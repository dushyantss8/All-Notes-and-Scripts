# JavaScript Challenge Bank

300 problems across three difficulty files. **Every challenge includes a matching reference solution** (title, prompt, code, and complexity align).

## Files

| Range | File | Goal |
|---|---|---|
| 1–100 | [easy.md](easy.md) | Fluency: arrays, strings, objects, maps/sets, basics |
| 101–200 | [medium.md](medium.md) | Patterns: async utilities, caches, trees/graphs, windows |
| 201–300 | [hard.md](hard.md) | Advanced: polyfills, deep equality, hard algorithms |

## Format

Each problem uses:

```text
## N. Title
**Difficulty:** ...
**Question:** ... (with I/O examples)
**Hints:** ...
**Solution:** (runnable JS)
**Time Complexity:** ...
**Space Complexity:** ...
```

## How to use

1. Start at Easy #1 unless you already clear Easy in under 15 minutes consistently.
2. For each problem: restatement → examples → brute force → optimize → code → trace.
3. After solving, write Big-O and one alternative approach in a comment or notebook.
4. Only open the reference after you have a working attempt (or after 45 minutes stuck).
5. Re-queue any problem you needed a hint for.

## Difficulty progression

```text
Week focus example:
  Days 1–4   Easy  (~8/day)     hash maps, frequency counts, two sum family
  Days 5–8   Easy→Medium bridge (~4 Medium/day)
  Days 9–14  Medium patterns    window, BFS/DFS, intervals, async utils
  Later      Hard selectively   after Medium accuracy >70% timed
```

**Promotion rule:** move up when you solve 8/10 timed Easy without hints.  
**Demotion rule:** if Medium success &lt;40%, return to Easy pattern drills for three days.

## Tips for JS interviews

- Know `Map`/`Set` vs plain objects; avoid prototype key pitfalls.
- Prefer `const`/`let`; understand closure when returning functions.
- For async-flavored JS prompts, clarify microtask vs timer ordering if relevant.
- Mutating vs non-mutating array methods — say which you choose and why.
- Sort is O(n log n); know when sorting unlocks two-pointer solutions.

## Related

- Parent index: [Coding Challenges](../README.md)
