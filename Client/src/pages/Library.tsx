import { useState, useEffect } from "react";
import { libraryService } from "../services/library";
import type { LibraryImageResponse } from "../services/library";
import type { ApiError } from "../services/api";

export default function Library() {
  const [images, setImages] = useState<LibraryImageResponse[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<LibraryImageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch library images on mount
  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await libraryService.getUserLibrary();
      setImages(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to load library");
    } finally {
      setIsLoading(false);
    }
  };

  const openImage = (image: LibraryImageResponse) => setSelectedImage(image);

  const closeImage = () => setSelectedImage(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the image

    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setDeletingId(id);
    try {
      await libraryService.deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));

      // Close modal if the deleted image was selected
      if (selectedImage?.id === id) {
        closeImage();
      }
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

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

        {/* Error State */}
        {error && (
          <div className="mb-8 border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={fetchLibrary}
              className="mt-3 border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin border-4 border-gray-300 border-t-black"></div>
              <p className="mt-4 text-gray-600">Loading your library...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && images.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">📁</div>
              <h2 className="mb-2 text-2xl font-bold text-black">
                Your library is empty
              </h2>
              <p className="mb-6 text-gray-600">
                Start generating thumbnails to build your collection
              </p>
              <a
                href="/generate"
                className="inline-block bg-black px-6 py-3 text-white transition-all duration-200 hover:-translate-y-px hover:shadow-md"
              >
                Generate Thumbnails
              </a>
            </div>
          </div>
        )}

        {/* Image Grid */}
        {!isLoading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden border border-gray-300 bg-white transition-all duration-200 hover:-translate-y-px hover:shadow-md"
              >
                <div
                  className="aspect-video cursor-pointer overflow-hidden"
                  onClick={() => openImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.title || "Thumbnail"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <h3 className="flex-1 truncate font-medium text-black">
                    {image.title || "Untitled"}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(image.id, e)}
                    disabled={deletingId === image.id}
                    className="ml-2 flex h-8 w-8 items-center justify-center border border-gray-300 bg-white text-gray-600 transition-all duration-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Delete image"
                  >
                    {deletingId === image.id ? (
                      <div className="h-4 w-4 animate-spin border-2 border-gray-300 border-t-red-600"></div>
                    ) : (
                      "×"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
              src={selectedImage.url}
              alt={selectedImage.title || "Thumbnail"}
              className="max-h-[90vh] w-auto border-4 border-white shadow-2xl"
            />

            {/* Delete button in modal */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(selectedImage.id, e);
                }}
                disabled={deletingId === selectedImage.id}
                className="border border-red-300 bg-white px-6 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === selectedImage.id
                  ? "Deleting..."
                  : "Delete Image"}
              </button>
              <button
                onClick={closeImage}
                className="border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
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
