// Wraps any "[TODO: ...]" text in Markdown content in a highlighted <mark>,
// so unfinished details are impossible to miss and nothing fake ships.
// Run `npm run todos` to list every remaining placeholder.

const TODO_RE = /\[TODO:[^\]]*\]/g;

/** @param {any} node */
function transform(node) {
  if (!node.children) return;
  if (node.type === 'element' && ['code', 'pre', 'mark'].includes(node.tagName)) return;

  const next = [];
  for (const child of node.children) {
    if (child.type !== 'text' || !TODO_RE.test(child.value)) {
      transform(child);
      next.push(child);
      continue;
    }
    TODO_RE.lastIndex = 0;
    let last = 0;
    for (const match of child.value.matchAll(TODO_RE)) {
      const start = match.index ?? 0;
      if (start > last) next.push({ type: 'text', value: child.value.slice(last, start) });
      next.push({
        type: 'element',
        tagName: 'mark',
        properties: { className: ['todo'] },
        children: [{ type: 'text', value: match[0] }],
      });
      last = start + match[0].length;
    }
    if (last < child.value.length) next.push({ type: 'text', value: child.value.slice(last) });
  }
  node.children = next;
}

export function rehypeTodo() {
  return (/** @type {any} */ tree) => transform(tree);
}
