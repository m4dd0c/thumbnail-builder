import { useState, useRef, useEffect } from "react";
import type { DragEvent, ChangeEvent, FormEvent } from "react";
import { thumbnailService } from "../services/thumbnail";
import { libraryService } from "../services/library";
import type { ApiError } from "../services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// LocalStorage keys
const STORAGE_KEYS = {
  PROMPT: "thumbnail_generator_prompt",
  ACTIVE_JOB: "thumbnail_generator_active_job",
  GENERATED_IMAGES: "thumbnail_generator_images",
  UPLOADED_IMAGE: "thumbnail_generator_uploaded_image",
} as const;

// Default prompt suggestions
const defaultPrompts = [
  "Create a Mr.Beast like thumbnail with bold text and shocked expression",
  "Design a gaming thumbnail with neon colors and action scene",
  "Make a cooking thumbnail with delicious food close-up",
  "Generate a tech review thumbnail with sleek product showcase",
  "Create a vlog thumbnail with vibrant background and friendly smile",
];

export default function Generate() {
  // Initialize state from localStorage
  const route = useNavigate();
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PROMPT) || "";
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.UPLOADED_IMAGE) || null;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>("");
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [savedImages, setSavedImages] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist prompt to localStorage
  useEffect(() => {
    if (prompt) {
      localStorage.setItem(STORAGE_KEYS.PROMPT, prompt);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROMPT);
    }
  }, [prompt]);

  // Persist uploaded image to localStorage
  useEffect(() => {
    if (uploadedImage) {
      localStorage.setItem(STORAGE_KEYS.UPLOADED_IMAGE, uploadedImage);
    } else {
      localStorage.removeItem(STORAGE_KEYS.UPLOADED_IMAGE);
    }
  }, [uploadedImage]);

  // Persist generated images to localStorage
  useEffect(() => {
    if (generatedImages.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.GENERATED_IMAGES,
        JSON.stringify(generatedImages),
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.GENERATED_IMAGES);
    }
  }, [generatedImages]);

  // Resume polling for active job on mount
  useEffect(() => {
    const resumeActiveJob = async () => {
      const activeJobId = localStorage.getItem(STORAGE_KEYS.ACTIVE_JOB);
      if (!activeJobId) return;

      setIsGenerating(true);
      setGenerationStatus("Resuming generation...");

      try {
        // Check current job status
        const statusResponse = await thumbnailService.getJobStatus(activeJobId);

        if (statusResponse.status === "Completed" && statusResponse.images) {
          // Immediately persist to localStorage before setting state
          localStorage.setItem(
            STORAGE_KEYS.GENERATED_IMAGES,
            JSON.stringify(statusResponse.images),
          );
          setGeneratedImages(statusResponse.images);
          setGenerationStatus("Generation complete!");
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);

          if (window.location.pathname !== "/generate") {
            toast.success("Generation completed!", {
              action: {
                label: "See Result",
                onClick: () => route("/generate"),
              },
            });
          } else {
            toast.success("Generation completed!");
          }
        } else if (statusResponse.status === "Failed") {
          setError(
            statusResponse.errorMessage ||
              "Generation failed. Please try again.",
          );
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);
          toast.error("Generation failed, Please try again.");
        } else {
          // Job still processing, continue polling
          setGenerationStatus("Processing your request...");
          const finalStatus = await thumbnailService.pollJobStatus(
            activeJobId,
            60,
            2000,
          );

          if (finalStatus.status === "Completed" && finalStatus.images) {
            // Immediately persist to localStorage before setting state
            localStorage.setItem(
              STORAGE_KEYS.GENERATED_IMAGES,
              JSON.stringify(finalStatus.images),
            );
            setGeneratedImages(finalStatus.images);
            setGenerationStatus("Generation complete!");
            localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);

            if (window.location.pathname !== "/generate") {
              toast.success("Generation completed!", {
                action: {
                  label: "See Result",
                  onClick: () => route("/generate"),
                },
              });
            } else {
              toast.success("Generation completed!");
            }
          } else if (finalStatus.status === "Failed") {
            setError(
              finalStatus.errorMessage ||
                "Generation failed. Please try again.",
            );
            localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);
            toast.error("Generation failed, Please try again.");
          }
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.message || "Failed to resume generation. Please try again.",
        );
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);
      } finally {
        setIsGenerating(false);
        setGenerationStatus("");
      }
    };

    resumeActiveJob();
  }, [route]); // Run only on mount

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
    setError(null);
    setGenerationStatus("Creating job...");

    try {
      // Create thumbnail generation job with optional image
      const jobResponse = await thumbnailService.createThumbnail(
        prompt,
        uploadedImage || undefined, // Pass the uploaded image if available
      );

      // Save job ID to localStorage so we can resume if user navigates away
      localStorage.setItem(STORAGE_KEYS.ACTIVE_JOB, jobResponse.jobId);

      setGenerationStatus("Processing your request...");

      // Poll for job completion
      const statusResponse = await thumbnailService.pollJobStatus(
        jobResponse.jobId,
        60, // max 60 attempts
        2000, // poll every 2 seconds
      );

      if (statusResponse.status === "Completed" && statusResponse.images) {
        // Immediately persist to localStorage before setting state
        localStorage.setItem(
          STORAGE_KEYS.GENERATED_IMAGES,
          JSON.stringify(statusResponse.images),
        );
        setGeneratedImages(statusResponse.images);
        setGenerationStatus("Generation complete!");
        // Clear active job from localStorage
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);

        if (window.location.pathname !== "/generate") {
          toast.success("Generation completed!", {
            action: {
              label: "See Result",
              onClick: () => route("/generate"),
            },
          });
        } else {
          toast.success("Generation completed!");
        }
      } else if (statusResponse.status === "Failed") {
        setError(
          statusResponse.errorMessage || "Generation failed. Please try again.",
        );
        toast.error("Generation failed, Please try again.");
        // Clear active job from localStorage
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.message || "Failed to generate thumbnails. Please try again.",
      );
      // Clear active job from localStorage on error
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };
  // Remove generated image
  const removeGeneratedImage = (i: number) => {
    setGeneratedImages((prev) => {
      const updated = prev.filter((_, index) => index !== i);
      // Update localStorage immediately
      if (updated.length > 0) {
        localStorage.setItem(
          STORAGE_KEYS.GENERATED_IMAGES,
          JSON.stringify(updated),
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.GENERATED_IMAGES);
      }
      return updated;
    });
  };

  // Remove uploaded image
  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Download image
  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `thumbnail-${Date.now()}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save to library
  const handleSaveToLibrary = async (imageBase64: string, index: number) => {
    setSavingIndex(index);
    try {
      await libraryService.saveImage(
        imageBase64,
        `Generated Thumbnail - ${new Date().toLocaleDateString()}`,
      );
      setSavedImages((prev) => new Set(prev).add(index));
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || "Failed to save image to library");
    } finally {
      setSavingIndex(null);
    }
  };

  // Clear all state and localStorage
  const clearAll = () => {
    setPrompt("");
    setUploadedImage(null);
    setGeneratedImages([]);
    setError(null);
    setSavedImages(new Set());
    localStorage.removeItem(STORAGE_KEYS.PROMPT);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_IMAGE);
    localStorage.removeItem(STORAGE_KEYS.GENERATED_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOB);
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

        {/* Error Message */}
        {error && (
          <div className="mb-8 border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

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

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="button flex-1"
            >
              <span className="relative z-10">
                {isGenerating ? "Generating..." : "Generate Thumbnails"}
              </span>
            </button>
            {(prompt || uploadedImage || generatedImages.length > 0) && (
              <button
                type="button"
                onClick={clearAll}
                disabled={isGenerating}
                className="border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            )}
          </div>
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
                  <button
                    type="button"
                    onClick={() => removeGeneratedImage(index)}
                    className="group-hover:block hidden absolute right-2 top-2 h-8 w-8 items-center justify-center bg-red-500/50 text-white cursor-pointer transition-opacity duration-200 hover:opacity-80"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                  <img
                    src={image}
                    alt={`Generated thumbnail ${index + 1}`}
                    className="w-full"
                  />
                  <div className="flex gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => handleDownload(image, index)}
                      className="flex-1 border border-gray-300 cursor-pointer bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:border-black hover:bg-gray-50"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveToLibrary(image, index)}
                      disabled={savingIndex === index || savedImages.has(index)}
                      className="flex-1 bg-black px-4 py-2 text-sm cursor-pointer font-medium text-white transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingIndex === index
                        ? "Saving..."
                        : savedImages.has(index)
                          ? "Saved ✓"
                          : "Save to Library"}
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
              {generationStatus || "Creating your thumbnails..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
