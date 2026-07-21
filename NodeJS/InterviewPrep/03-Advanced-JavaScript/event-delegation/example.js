"use strict";

/**
 * Event delegation without a browser: a minimal parent/child event
 * simulation showing target vs currentTarget and closest-style matching.
 */

class Emitter {
  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.listeners = new Map();
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(handler);
  }

  /** Bubble from this node up to root, invoking listeners on each ancestor. */
  dispatch(type, payload = {}) {
    let node = this;
    const path = [];
    while (node) {
      path.push(node);
      node = node.parent;
    }
    const event = {
      type,
      target: this,
      payload,
      propagationStopped: false,
      stopPropagation() {
        this.propagationStopped = true;
      },
    };
    for (const current of path) {
      event.currentTarget = current;
      const set = current.listeners.get(type);
      if (set) {
        for (const handler of set) handler(event);
      }
      if (event.propagationStopped) break;
    }
  }
}

function closest(node, predicate) {
  let cur = node;
  while (cur) {
    if (predicate(cur)) return cur;
    cur = cur.parent;
  }
  return null;
}

const list = new Emitter("ul.list");
const row = new Emitter("li.row", list);
const button = new Emitter("button[data-action=save]", row);

// One delegated listener on the list — works for any nested button.
list.addEventListener("click", (event) => {
  const actionNode = closest(
    event.target,
    (n) => n.name.startsWith("button[data-action=")
  );
  if (!actionNode || !closest(actionNode, (n) => n === list)) return;
  const action = /data-action=([^\]]+)/.exec(actionNode.name)[1];
  console.log("delegated action:", action, "via", event.currentTarget.name);
});

button.dispatch("click");
// Adding a new button later needs no new listener on list:
const button2 = new Emitter("button[data-action=delete]", row);
button2.dispatch("click");

module.exports = { Emitter, closest };
