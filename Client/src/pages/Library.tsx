import { useState, useEffect } from "react";

// Mock data for library images
const libraryImages = [
  {
    id: 1,
    title: "Mountain Landscape",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  },
  {
    id: 2,
    title: "Ocean Waves",
    thumbnail:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop",
  },
  {
    id: 3,
    title: "City Skyline",
    thumbnail:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=800&fit=crop",
  },
  {
    id: 4,
    title: "Forest Path",
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
  },
  {
    id: 5,
    title: "Desert Dunes",
    thumbnail:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=800&fit=crop",
  },
  {
    id: 6,
    title: "Northern Lights",
    thumbnail:
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&h=800&fit=crop",
  },
  {
    id: 7,
    title: "Tropical Beach",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
  },
  {
    id: 8,
    title: "Snowy Mountains",
    thumbnail:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop",
  },
  {
    id: 9,
    title: "Autumn Forest",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    full: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  },
];

export default function Library() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof libraryImages)[0] | null
  >(null);

  const openImage = (image: (typeof libraryImages)[0]) =>
    setSelectedImage(image);

  const closeImage = () => setSelectedImage(null);

  useEffect(() => {
    if (selectedImage) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) closeImage();
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedImage]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-black">
            Library
          </h1>
          <p className="text-lg text-gray-600">
            Browse your collection of thumbnails
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {libraryImages.map((image) => (
            <div
              key={image.id}
              className="cursor-pointer overflow-hidden border border-gray-300 bg-white transition-all duration-200 hover:-translate-y-px hover:shadow-md"
              onClick={() => openImage(image)}
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-black">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 p-4"
          onClick={closeImage}
          style={{
            animation: "fadeIn 200ms ease-out",
          }}
        >
          <button
            onClick={closeImage}
            className="absolute right-6 top-6 text-4xl font-light text-black transition-opacity duration-200 hover:opacity-70"
            aria-label="Close"
          >
            ×
          </button>

          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "scaleIn 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <img
              src={selectedImage.full}
              alt={selectedImage.title}
              className="max-h-[90vh] w-auto border-4 border-white"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
