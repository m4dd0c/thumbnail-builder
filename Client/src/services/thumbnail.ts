import { apiClient } from "./api";

// Type Definitions
export interface CreateThumbnailRequest {
  prompt: string;
  image?: string; // Optional base64 image for style transfer
}

export interface ThumbnailJobResponse {
  jobId: string;
  status: string;
}

export interface ThumbnailStatusResponse {
  status: string;
  images?: string[];
  errorMessage?: string;
}

// Job status constants
export const JobStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Completed: "Completed",
  Failed: "Failed",
} as const;

// Thumbnail Service
class ThumbnailService {
  /**
   * Create a new thumbnail generation job
   * @param prompt - The text prompt for generation
   * @param image - Optional base64 image for style transfer
   */
  async createThumbnail(
    prompt: string,
    image?: string,
  ): Promise<ThumbnailJobResponse> {
    return apiClient.post<ThumbnailJobResponse>(
      "/thumbnail",
      { prompt, image } as CreateThumbnailRequest,
      true, // requires auth
    );
  }

  /**
   * Get the status of a thumbnail generation job
   */
  async getJobStatus(jobId: string): Promise<ThumbnailStatusResponse> {
    return apiClient.get<ThumbnailStatusResponse>(
      `/thumbnail/${jobId}/status`,
      true, // requires auth
    );
  }

  /**
   * Poll for job completion
   * @param jobId - The job ID to poll
   * @param maxAttempts - Maximum number of polling attempts (default: 60)
   * @param intervalMs - Interval between polls in milliseconds (default: 2000)
   */
  async pollJobStatus(
    jobId: string,
    maxAttempts: number = 60,
    intervalMs: number = 2000,
  ): Promise<ThumbnailStatusResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getJobStatus(jobId);

      // If completed or failed, return immediately
      if (
        status.status === JobStatus.Completed ||
        status.status === JobStatus.Failed
      ) {
        return status;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    // Timeout
    throw new Error("Job polling timed out");
  }
}

export const thumbnailService = new ThumbnailService();
