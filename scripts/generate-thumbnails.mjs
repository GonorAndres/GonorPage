// Generate optimized WebP card thumbnails from full-resolution screenshots.
//
// Card thumbnails render at ~243-270px but source PNGs/JPGs are 1280-1440px.
// This script resizes every image in public/screenshots/ to a max width of
// 640px WebP (quality 72) under public/screenshots/thumbs/<basename>.webp.
//
// The full-resolution originals are left untouched: the lightbox/gallery still
// uses them, and ProjectsGrid renders the WebP via <picture><source> with the
// original <img> as a graceful fallback if a thumb is missing.
//
// Usage: npm run thumbs

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'public', 'screenshots');
const outDir = path.join(srcDir, 'thumbs');

const MAX_WIDTH = 640;
const QUALITY = 72;

async function dirSize(dir) {
  let total = 0;
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return 0;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    const s = await stat(full);
    if (s.isFile()) total += s.size;
  }
  return total;
}

function fmt(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) =>
    /\.(png|jpe?g)$/i.test(f)
  );

  const before = await dirSize(srcDir); // originals only (thumbs live in subdir)
  let count = 0;
  let outBytes = 0;

  for (const file of files) {
    const base = file.replace(/\.(png|jpe?g)$/i, '');
    const inPath = path.join(srcDir, file);
    const outPath = path.join(outDir, `${base}.webp`);

    await sharp(inPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const s = await stat(outPath);
    outBytes += s.size;
    count += 1;
  }

  console.log(`Processed ${count} images`);
  console.log(`Originals total: ${fmt(before)}`);
  console.log(`Thumbnails total: ${fmt(outBytes)}`);
  console.log(`Output dir: ${path.relative(root, outDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
