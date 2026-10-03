import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Photos', description: 'A few places and moments, photographed by Kensuke.' };

const photos = [
  { title: 'Berkeley', imagePath: '/images/photos/berkeley.jpeg', alt: 'View photographed in Berkeley', width: 1478, height: 1108 },
  { title: 'Enoshima', imagePath: '/images/photos/enoshima.jpeg', alt: 'View photographed in Enoshima', width: 4032, height: 3024 },
  { title: 'Kagoshima', imagePath: '/images/photos/kagoshima.jpeg', alt: 'View photographed in Kagoshima', width: 4032, height: 3024 },
  { title: 'Tokyo', imagePath: '/images/photos/tokyo.jpeg', alt: 'View photographed in Tokyo', width: 3024, height: 4032 },
];

export default function PhotosPage() {
  return (
    <div className="site-container page-section">
      <header className="page-heading"><h1 className="page-title">Photos</h1><p className="page-description">A few places and moments along the way.</p></header>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <figure key={photo.imagePath}>
            <a href={photo.imagePath} target="_blank" rel="noopener noreferrer" className="photo-link" aria-label={`View full-size photo: ${photo.title}`}>
              <Image src={photo.imagePath} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 540px) calc(100vw - 40px), (max-width: 880px) calc(50vw - 36px), 404px" priority={index === 0} className="photo-image" />
            </a>
            <figcaption>{photo.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
