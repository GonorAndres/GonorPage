// Renders public/favicon.svg into public/favicon.ico and public/apple-touch-icon.png.
// Run when the mark changes: node scripts/generate-favicons.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));

function render(size) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: '#EDE6DD',
  }).render().asPng();
  return png;
}

function toIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = 6 + 16 * count;
  const parts = [header];
  for (const { png, size } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    parts.push(entry);
  }
  for (const { png } of images) parts.push(png);
  return Buffer.concat(parts);
}

const sizes = [16, 32, 48];
const icoImages = sizes.map((size) => ({ size, png: render(size) }));
const apple = render(180);

writeFileSync(new URL('../public/favicon.ico', import.meta.url), toIco(icoImages));
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), apple);
console.log('wrote public/favicon.ico and public/apple-touch-icon.png');
