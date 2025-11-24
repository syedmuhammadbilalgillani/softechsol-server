import axios from "axios";
import logger from "@/utils/logger";

/**
 * Revalidates a specific tag or path in Next.js cache
 * @param tag - The cache tag to revalidate (e.g., "categories", "jobs", "blogs")
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function revalidateTag(tag: string): Promise<boolean> {
  try {
    // Get the base URL - use environment variable or default to localhost in development
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const revalidateUrl = `${baseUrl}/revalidate`;

    const revalidateRes = await axios.post(revalidateUrl, {
      tag,
    });

    logger.info(`Revalidated tag: ${tag}`, revalidateRes.data);
    return true;
  } catch (error: any) {
    logger.error(`Error revalidating tag: ${tag}`, error);
    // Don't throw error - revalidation failure shouldn't break the main operation
    return false;
  }
}

/**
 * Revalidates multiple tags at once
 * @param tags - Array of cache tags to revalidate
 * @returns Promise<boolean[]> - Returns array of success status for each tag
 */
export async function revalidateTags(tags: string[]): Promise<boolean[]> {
  const results = await Promise.all(
    tags.map((tag) => revalidateTag(tag))
  );
  return results;
}
