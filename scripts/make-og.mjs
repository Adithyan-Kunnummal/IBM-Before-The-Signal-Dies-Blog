// Generates public/og-default.png (1200x630), the default social preview image.
// Re-run after changing the name or tagline:  node scripts/make-og.mjs
import sharp from 'sharp';

const name = process.argv[2] ?? 'Adi';
const tagline = process.argv[3] ?? 'Software engineering portfolio';

const bars = [0, 1, 2, 3]
  .map((i) => `<rect x="${80 + i * 34}" y="${180 - i * 30}" width="22" height="${30 + i * 30}" rx="6" fill="#5fd4c6"/>`)
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0f1214"/>
  <g opacity="0.08" fill="none" stroke="#5fd4c6" stroke-width="2">
    ${[160, 260, 360, 460, 560].map((r) => `<circle cx="1120" cy="630" r="${r}"/>`).join('')}
  </g>
  ${bars}
  <text x="80" y="360" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="96" font-weight="600" fill="#e8eaed">${name}</text>
  <text x="80" y="440" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="40" fill="#a2a9b1">${tagline}</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
console.log('Wrote public/og-default.png');
