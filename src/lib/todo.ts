// Same idea as rehype-todo.mjs, for plain strings (frontmatter, site config)
// rendered from .astro components. Use with `set:html`.

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function withTodos(text: string): string {
  return escape(text).replace(/\[TODO:[^\]]*\]/g, (m) => `<mark class="todo">${m}</mark>`);
}

export const isTodo = (text: string | undefined | null) => !text || /\[TODO:/.test(text);
