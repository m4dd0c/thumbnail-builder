import { apiClient } from "./api";

// Type Definitions
export interface SaveImageRequest {
  imageBase64: string;
  title?: string;
}

export interface LibraryImageResponse {
  id: string;
  url: string;
  title?: string;
  createdAt: string;
}

// Library Service
class LibraryService {
  /**
   * Save an image to the user's library
   */
  async saveImage(
    imageBase64: string,
    title?: string,
  ): Promise<LibraryImageResponse> {
    return apiClient.post<LibraryImageResponse>(
      "/library",
      { imageBase64, title } as SaveImageRequest,
      true, // requires auth
    );
  }

  /**
   * Get all images from the user's library
   */
  async getUserLibrary(): Promise<LibraryImageResponse[]> {
    return apiClient.get<LibraryImageResponse[]>("/library", true);
  }

  /**
   * Delete an image from the library
   */
  async deleteImage(id: string): Promise<void> {
    await apiClient.delete(`/library/${id}`, true);
  }
}

export const libraryService = new LibraryService();
