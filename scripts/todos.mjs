// Lists every remaining "[TODO: ...]" placeholder and "TODO(Adi)" note in the site source.
//   npm run todos
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src'];
const exts = /\.(astro|md|mdx|ts|mjs|js)$/;
const re = /\[TODO:[^\]]*\]|TODO\(Adi\)[^\n]*/g;
let count = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.test(name) && !p.includes('todo.ts') && !p.includes('rehype-todo')) {
      readFileSync(p, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const m of line.matchAll(re)) {
            count++;
            console.log(`${p.replaceAll('\\', '/')}:${i + 1}  ${m[0]}`);
          }
        });
    }
  }
}

roots.forEach(walk);
console.log(`\n${count} placeholder(s) remaining.`);
