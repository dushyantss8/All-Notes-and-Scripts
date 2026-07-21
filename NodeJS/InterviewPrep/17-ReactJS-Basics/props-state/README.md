# Props and State

Props flow down and are read-only; state belongs to the component that owns the changing value. Lift state to the nearest common owner when siblings coordinate. Use immutable updates so React can detect changes predictably.

## Fullstack interview lens
- Explain the boundary between browser state and authoritative server state.
- Identify where authentication is enforced: the backend remains the security boundary.
- Handle cancellation, retries, authorization failures, and optimistic-update rollback.

## Example
```jsx
function UserCard({ user, onRefresh }) {
  const [saving, setSaving] = useState(false);
  async function refresh() {
    setSaving(true);
    try { await onRefresh(user.id); }
    finally { setSaving(false); }
  }
  return <button disabled={saving} onClick={refresh}>{saving ? "Refreshing…" : user.name}</button>;
}
```

## Questions to answer aloud
1. Why should a derived value usually not live in state?
2. What belongs in an effect, and what should happen directly in an event handler?
3. How does the UI respond to a 401, stale response, or duplicate submit?
