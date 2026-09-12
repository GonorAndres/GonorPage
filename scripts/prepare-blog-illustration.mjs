import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const [source, slug] = process.argv.slice(2);
if (!source || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error('Usage: node scripts/prepare-blog-illustration.mjs <generated-image> <post-slug>');
}

const root = fileURLToPath(new URL('../public/blog-illustrations/', import.meta.url));
await mkdir(path.join(root, 'thumbs'), { recursive: true });

// Preserve the complete diagram: resize and pad, never crop its relationships.
for (const [directory, width, height, quality] of [
  [root, 1536, 864, 86],
  [path.join(root, 'thumbs'), 640, 360, 80],
]) {
  const output = path.join(directory, `${slug}.webp`);
  const result = await sharp(source)
    .resize({ width, height, fit: 'contain', background: '#EDE6DD' })
    .webp({ quality, effort: 6 })
    .toFile(output);
  console.log(`${slug}: ${width}×${height}, ${Math.round(result.size / 1024)} KB`);
}
