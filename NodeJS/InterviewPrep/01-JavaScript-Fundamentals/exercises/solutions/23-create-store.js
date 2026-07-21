'use strict';
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState() {
      return state;
    },
    setState(partial) {
      state = { ...state, ...partial };
      for (const listener of listeners) listener(state);
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
const store = createStore({ count: 0 });
const unsub = store.subscribe((s) => console.log('changed', s));
store.setState({ count: 1 });
unsub();
store.setState({ count: 2 }); // no log
module.exports = { createStore };
