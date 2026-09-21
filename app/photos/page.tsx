import React from 'react';
import { Camera } from 'lucide-react';


const photos = [
  {
    id: 1,
    title: "Berkeley",
    category: "",
    imagePath: "/images/photos/berkeley.jpeg"
  },
  {
    id: 2,
    title: "Enoshima",
    category: "",
    imagePath: "/images/photos/enoshima.jpeg"
  },
  {
    id: 3,
    title: "Kagoshima",
    category: "",
    imagePath: "/images/photos/kagoshima.jpeg"
  },
  {
    id: 4,
    title: "Tokyo",
    category: "",
    imagePath: "/images/photos/tokyo.jpeg"
  }
];

export default function PhotosPage() {
  return (
    <div className="mx-auto max-w-screen-md">
      {/* Photos Section */}
      <section className="mb-16 mt-12">
        <div className="mb-12 flex items-center gap-3">
          <Camera className="text-slate-600" size={32} />
          <h1 className="bg-clip-text text-4xl font-bold text-slate-700">
            Photos
          </h1>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-1">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative my-20 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <img
                src={photo.imagePath}
                alt={photo.title}
                className="h-full w-full object-cover"
              />
              <div
                // className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100"
                className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <h3 className="text-xl font-semibold text-white">
                  {photo.title}
                </h3>
                <p className="text-sm text-slate-200">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}