import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent, FormEvent } from "react";

// Default prompt suggestions
const defaultPrompts = [
  "Create a Mr.Beast like thumbnail with bold text and shocked expression",
  "Design a gaming thumbnail with neon colors and action scene",
  "Make a cooking thumbnail with delicious food close-up",
  "Generate a tech review thumbnail with sleek product showcase",
  "Create a vlog thumbnail with vibrant background and friendly smile",
];

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      // Simulate API call - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated images - Replace with actual API response
      const mockImages = [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=450&fit=crop",
      ];

      setGeneratedImages(mockImages);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-black">
            Generate Thumbnail
          </h1>
          <p className="text-lg text-gray-600">
            Describe your vision and let AI create stunning thumbnails
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Prompt Textarea */}
          <div>
            <label htmlFor="prompt" className="label">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your thumbnail generation, e.g., Create a Mr.Beast like thumbnail"
              rows={4}
              className="w-full border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:outline-none"
              style={{
                boxShadow: prompt ? "0 0 0 3px rgba(0, 0, 0, 0.05)" : "none",
              }}
              required
            />
          </div>

          {/* Default Prompts */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Quick Prompts:
            </p>
            <div className="flex flex-wrap gap-2">
              {defaultPrompts.map((defaultPrompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPrompt(defaultPrompt)}
                  className="border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:border-black hover:bg-gray-50"
                >
                  {defaultPrompt.length > 50
                    ? defaultPrompt.substring(0, 50) + "..."
                    : defaultPrompt}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Reference Image (Optional)</label>

            {!uploadedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed bg-gray-50 px-6 py-12 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-black bg-gray-100"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {isDragging
                        ? "Drop image here"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative border border-gray-300 bg-white p-4">
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-black text-white transition-opacity duration-200 hover:opacity-80"
                  aria-label="Remove image"
                >
                  ×
                </button>
                <img
                  src={uploadedImage}
                  alt="Uploaded reference"
                  className="mx-auto max-h-64 w-auto"
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="button"
          >
            <span className="relative z-10">
              {isGenerating ? "Generating..." : "Generate Thumbnails"}
            </span>
          </button>
        </form>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-black">
              Generated Thumbnails
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden border border-gray-300 bg-white transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                >
                  <img
                    src={image}
                    alt={`Generated thumbnail ${index + 1}`}
                    className="w-full"
                  />
                  <div className="flex gap-2 p-4">
                    <button
                      type="button"
                      className="flex-1 border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:bg-gray-50"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="flex-1 bg-black px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                    >
                      Save to Library
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="mt-12 text-center">
            <div className="inline-block h-12 w-12 animate-spin border-4 border-gray-300 border-t-black"></div>
            <p className="mt-4 text-lg text-gray-600">
              Creating your thumbnails...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
