import Image from 'next/image';
import type { Metadata } from 'next';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const metadata: Metadata = { title: 'Photos', description: 'A few places and moments, photographed by Kensuke.' };

// ponytail: reuse Next.js 14's bundled image-size; use a direct dependency if a Next upgrade removes it.
const imageSize: (data: Buffer) => { width: number; height: number; orientation?: number } = require('next/dist/compiled/image-size');

export default async function PhotosPage() {
  const directory = path.join(process.cwd(), 'public', 'photos');
  const entries = await readdir(directory, { withFileTypes: true });
  const photos = await Promise.all(entries
    .filter(entry => entry.isFile() && /\.(jpe?g|png|webp|gif)$/i.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map(async ({ name }) => {
      const { width, height, orientation } = imageSize(await readFile(path.join(directory, name)));
      const rotated = orientation !== undefined && orientation >= 5 && orientation <= 8;
      return {
        title: path.parse(name).name.replace(/-\d+$/, '').replace(/^./u, letter => letter.toUpperCase()),
        imagePath: `/photos/${encodeURIComponent(name)}`,
        width: rotated ? height : width,
        height: rotated ? width : height,
      };
    }));
  return (
    <div className="site-container page-section">
      <header className="page-heading"><h1 className="page-title">Photos</h1></header>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <figure key={photo.imagePath}>
            <a href={photo.imagePath} target="_blank" rel="noopener noreferrer" className="photo-link" aria-label={`View full-size photo: ${photo.title}`}>
              <Image src={photo.imagePath} alt={`View photographed in ${photo.title}`} width={photo.width} height={photo.height} unoptimized priority={index === 0} className="photo-image" />
            </a>
            <figcaption>{photo.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
