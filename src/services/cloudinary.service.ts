/**
 * Cloudinary Upload Service
 * Handles image uploads to Cloudinary with rollback support
 */

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface CloudinaryDeleteResponse {
  result?: string;
  error?: string;
}

/**
 * Upload one or more files to Cloudinary
 * @param files - Array of File objects to upload
 * @returns Array of uploaded image objects with URL and publicId
 * @throws Error if upload fails
 */
export async function uploadImagesToCloudinary(
  files: File[]
): Promise<UploadedImage[]> {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));

  const response = await fetch("/api/cloudinary", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to upload to Cloudinary");
  }

  const data = await response.json();
  
  if (!data.files || !Array.isArray(data.files)) {
    throw new Error("Invalid response format from Cloudinary");
  }

  return data.files;
}

/**
 * Delete one image from Cloudinary by public_id
 * @param publicId - The public ID of the image to delete
 * @returns Success boolean
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<boolean> {
  if (!publicId) {
    return false;
  }

  try {
    const response = await fetch("/api/cloudinary", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      console.warn(`Failed to delete image: ${publicId}`);
      return false;
    }

    const data = (await response.json()) as CloudinaryDeleteResponse;
    return !data.error;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs to delete
 * @returns Success boolean
 */
export async function deleteImagesFromCloudinary(
  publicIds: string[]
): Promise<boolean> {
  if (!publicIds || publicIds.length === 0) {
    return true;
  }

  const results = await Promise.all(
    publicIds.map((id) => deleteImageFromCloudinary(id))
  );

  // Consider success if at least one deletion succeeded or all failed gracefully
  return !results.some((result) => result === false);
}

/**
 * Upload single image (returns just the URL)
 * @param file - Single File object to upload
 * @returns The URL of the uploaded image
 */
export async function uploadSingleImage(file: File): Promise<string> {
  const [uploaded] = await uploadImagesToCloudinary([file]);
  return uploaded.url;
}

/**
 * Upload multiple images (returns array of URLs)
 * @param files - Array of File objects to upload
 * @returns Array of URLs of uploaded images
 */
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploaded = await uploadImagesToCloudinary(files);
  return uploaded.map((img) => img.url);
}

/**
 * Helper to extract public IDs from Cloudinary URLs
 * Cloudinary URLs are in format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}
 * @param url - Cloudinary image URL
 * @returns The public ID
 */
export function extractPublicIdFromUrl(url: string): string {
  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/public/id.ext
    const parts = url.split("/upload/");
    if (parts.length < 2) return "";
    
    const pathParts = parts[1].split("/");
    // Remove version part (v123) and join the rest
    const publicIdWithExt = pathParts.slice(1).join("/");
    
    // Remove file extension
    return publicIdWithExt.split(".")[0];
  } catch {
    return "";
  }
}

/**
 * Rollback helper - deletes uploaded images if form submission fails
 * @param uploadedUrls - Array of image URLs to delete
 * @param onError - Optional callback for error logging
 */
export async function rollbackUploadedImages(
  uploadedUrls: string[],
  onError?: (error: string) => void
): Promise<void> {
  if (!uploadedUrls || uploadedUrls.length === 0) {
    return;
  }

  const publicIds = uploadedUrls
    .map((url) => extractPublicIdFromUrl(url))
    .filter((id) => id.length > 0);

  if (publicIds.length === 0) {
    return;
  }

  const success = await deleteImagesFromCloudinary(publicIds);
  
  if (!success && onError) {
    onError("Failed to clean up some uploaded images");
  }
}
