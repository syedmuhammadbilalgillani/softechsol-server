import logger from "@/utils/logger";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

// Get storage configuration from environment variables
// STORAGE_BASE_PATH: Absolute path where files are stored (e.g., '/var/www/storage' for VPS)
// STORAGE_URL_PREFIX: URL prefix for accessing files (e.g., '/storage' or '/media')
// USE_API_ROUTE: Set to 'true' to serve images via API route (recommended for production)
const STORAGE_BASE = process.env.STORAGE_BASE_PATH
  ? process.env.STORAGE_BASE_PATH
  : path.join(process.cwd(), "public", "storage");

const STORAGE_URL_PREFIX = process.env.STORAGE_URL_PREFIX || "/storage";
const USE_API_ROUTE =
  process.env.USE_STORAGE_API_ROUTE === "true" ||
  process.env.NODE_ENV === "production";

logger.info("File storage initialized", {
  basePath: STORAGE_BASE,
  urlPrefix: STORAGE_URL_PREFIX,
  useApiRoute: USE_API_ROUTE,
  isCustomPath: !!process.env.STORAGE_BASE_PATH,
});

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
}

/**
 * Create a folder if it doesn't exist
 */
export async function ensureFolder(folderPath: string): Promise<string> {
  try {
    const fullPath = path.join(STORAGE_BASE, folderPath);
    logger.debug("Ensuring folder exists", { folderPath, fullPath });

    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
      logger.info("Folder created", { folderPath, fullPath });
    }

    return fullPath;
  } catch (error: unknown) {
    logger.error("Error ensuring folder", {
      folderPath,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get the public URL for a stored file
 * Uses API route in production or when USE_STORAGE_API_ROUTE is true
 * Otherwise uses direct public path
 */
export function getStorageUrl(relativePath: string): string {
  // Remove leading slash if present
  const cleanPath = relativePath.replace(/^\//, "");

  if (USE_API_ROUTE) {
    // Use API route for serving files (works in all environments)
    return `/api/storage/${cleanPath}`;
  } else {
    // Use direct public path (works in development)
    return `${STORAGE_URL_PREFIX}/${cleanPath}`;
  }
}

/**
 * Upload an image file
 * @param file - File object from FormData
 * @param folder - Folder path within storage (e.g., 'specializations', 'icons')
 * @param filename - Optional custom filename (without extension)
 * @returns URL path to the uploaded file
 */
export async function uploadImage(
  file: File,
  folder: string = "general",
  filename?: string
): Promise<UploadResult> {
  try {
    logger.info("Starting image upload", {
      originalName: file.name,
      folder,
      size: file.size,
    });

    // Ensure folder exists
    const folderPath = await ensureFolder(folder);

    // Generate filename
    const fileExt = path.extname(file.name);
    const baseName =
      filename || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const finalFilename = `${baseName}${fileExt}`;
    const filePath = path.join(folderPath, finalFilename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Generate relative path and URL
    const relativePath = `${folder}/${finalFilename}`;
    const url = getStorageUrl(relativePath);

    logger.info("Image uploaded successfully", {
      url,
      path: filePath,
      filename: finalFilename,
      size: buffer.length,
      relativePath,
    });

    return {
      url,
      path: filePath,
      filename: finalFilename,
    };
  } catch (error: unknown) {
    logger.error("Error uploading image", {
      originalName: file.name,
      folder,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : String(error),
    });
    throw new Error("Failed to upload image");
  }
}

/**
 * Delete an image file
 * @param url - URL path of the file (e.g., '/storage/specializations/image.jpg' or '/storage/specializations/image.jpg')
 * @returns true if deleted successfully
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    logger.debug("Attempting to delete image", { url });

    // Extract relative path from URL (handles both /api/storage/ and /storage/ formats)
    let relativePath: string;

    if (url.startsWith("/api/storage/")) {
      // API route format (production)
      relativePath = url.replace("/api/storage/", "");
    } else if (url.startsWith("/storage/")) {
      // Legacy API route format (for backward compatibility)
      relativePath = url.replace("/storage/", "");
    } else {
      // Direct storage format (development)
      relativePath = url.replace(new RegExp(`^${STORAGE_URL_PREFIX}/`), "");
    }

    const filePath = path.join(STORAGE_BASE, relativePath);

    logger.debug("Resolved file path for deletion", {
      url,
      relativePath,
      filePath,
    });

    if (existsSync(filePath)) {
      await unlink(filePath);
      logger.info("Image deleted successfully", { url, filePath });
      return true;
    }

    logger.warn("Image file not found for deletion", { url, filePath });
    return false;
  } catch (error: unknown) {
    logger.error("Error deleting image", {
      url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : String(error),
    });
    throw new Error("Failed to delete image");
  }
}

/**
 * Update an image (delete old, upload new)
 * @param newFile - New file object
 * @param oldUrl - Old file URL to delete
 * @param folder - Folder path
 * @param filename - Optional custom filename
 * @returns URL path to the new file
 */
export async function updateImage(
  newFile: File,
  oldUrl: string | null | undefined,
  folder: string = "general",
  filename?: string
): Promise<UploadResult> {
  try {
    logger.info("Starting image update", {
      oldUrl,
      newFileName: newFile.name,
      folder,
      filename,
    });

    // Delete old image if exists
    if (oldUrl) {
      try {
        await deleteImage(oldUrl);
      } catch (error: unknown) {
        logger.warn("Failed to delete old image during update", {
          oldUrl,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Upload new image
    const result = await uploadImage(newFile, folder, filename);

    logger.info("Image update completed", {
      oldUrl,
      newUrl: result.url,
    });

    return result;
  } catch (error: unknown) {
    logger.error("Error updating image", {
      oldUrl,
      newFileName: newFile.name,
      folder,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Extract file from FormData
 */
export async function getFileFromRequest(
  request: NextRequest,
  fieldName: string = "file"
): Promise<File | null> {
  try {
    logger.debug("Extracting file from request", { fieldName });
    const formData = await request.formData();
    const file = formData.get(fieldName) as File | null;

    if (file) {
      logger.debug("File extracted from request", {
        fieldName,
        fileName: file.name,
        size: file.size,
      });
    } else {
      logger.debug("No file found in request", { fieldName });
    }

    return file;
  } catch (error: unknown) {
    logger.error("Error extracting file from request", {
      fieldName,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
