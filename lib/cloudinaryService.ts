import logger from "@/utils/logger";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define types for Cloudinary upload and delete results
interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
}

interface CloudinaryDeleteResult {
  result: string;
}

// Function to upload an image to Cloudinary
const uploadImage = async (
  filePath: string
): Promise<CloudinaryUploadResult> => {
  logger.debug("Starting image upload...");
  logger.debug(`File path: ${filePath}`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "techsol", // Optional: specify a folder in Cloudinary
      use_filename: true, // Optional: use the original filename
    });

    logger.debug("Image uploaded successfully");
    logger.debug("Uploaded image details:", result);

    return result as CloudinaryUploadResult; // Return the upload result
  } catch (error) {
    logger.error("Error uploading image:", error);
    throw error;
  }
};

// Function to delete an image from Cloudinary
const deleteImage = async (
  publicId: string
): Promise<CloudinaryDeleteResult> => {
  logger.debug("Starting image deletion...");
  logger.debug(`Public ID of the image to delete: ${publicId}`);

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    logger.debug("Image deleted successfully");
    logger.debug("Deletion result:", result);

    return result as CloudinaryDeleteResult; // Return the delete result
  } catch (error) {
    logger.error("Error deleting image:", error);
    throw error;
  }
};

// Function to update an existing image on Cloudinary by uploading a new version with the same public_id
const updateImage = async (
  filePath: string,
  publicId: string
): Promise<CloudinaryUploadResult> => {
  logger.debug("Starting image update...");
  logger.debug(`File path: ${filePath}`);
  logger.debug(`Public ID of the image to update: ${publicId}`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId, // This will overwrite the existing image with the same public_id
      overwrite: true, // Ensures the file will be overwritten
      folder: "techsol", // Optional: specify a folder in Cloudinary
      use_filename: true, // Optional: use the original filename
    });

    logger.debug("Image updated successfully");
    logger.debug("Updated image details:", result);

    return result as CloudinaryUploadResult; // Return the upload result
  } catch (error) {
    logger.error("Error updating image:", error);
    throw error;
  }
};

export { uploadImage, deleteImage, updateImage };
