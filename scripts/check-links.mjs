// Checks that every internal link and asset reference in the built site resolves.
//   npm run build && npm run check:links
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const pages = [];
(function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p);
  }
})(dist);

const resolves = (url) => {
  const path = decodeURI(url.split(/[?#]/)[0]);
  if (path === '' || path === '/') return existsSync(join(dist, 'index.html'));
  return [path, `${path}.html`, join(path, 'index.html')].some((c) => existsSync(join(dist, c)));
};

let broken = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith('//')) continue;
    if (!resolves(url)) {
      broken++;
      console.log(`BROKEN  ${page.replaceAll('\\', '/')}  ->  ${url}`);
    }
  }
}
console.log(`Checked ${pages.length} pages. ${broken} broken internal link(s).`);
process.exit(broken ? 1 : 0);
