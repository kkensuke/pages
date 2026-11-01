// node scripts/make-photo-thumbs.mjs — runs before dev and build (see package.json).
// Writes a 1600px display copy of each public/photos/*.jpg to public/photos/thumbs/.
// The ICC profile (Display P3) is kept, so colors match the original.
// A thumbnail that already exists is left alone, so deploys never regenerate it.
// After editing an original, delete its thumbnail to rebuild it. Commit new thumbnails.
import { existsSync } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'photos');
await mkdir(path.join(dir, 'thumbs'), { recursive: true });
for (const name of await readdir(dir)) {
  const thumb = path.join(dir, 'thumbs', name);
  if (!/\.jpe?g$/i.test(name) || existsSync(thumb)) continue;
  await sharp(path.join(dir, name)).rotate()
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .keepIccProfile().jpeg({ quality: 82 })
    .toFile(thumb);
  console.log(`thumbs/${name}`);
}
