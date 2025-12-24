import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import logger from "@/utils/logger";

// Get storage base path (same logic as file-manager.ts)
const STORAGE_BASE = process.env.STORAGE_BASE_PATH
  ? process.env.STORAGE_BASE_PATH
  : path.join(process.cwd(), "public", "storage");

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};

/**
 * Serve storage files
 * GET /api/storage/[...path]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join(path.sep);

    // Prevent directory traversal
    const normalizedPath = filePath
      .split(path.sep)
      .filter((segment) => segment && segment !== "..")
      .join(path.sep);

    const fullPath = path.join(STORAGE_BASE, normalizedPath);

    // Ensure the path is within storage base
    if (!fullPath.startsWith(STORAGE_BASE)) {
      logger.warn("Attempted access outside storage base", {
        requestedPath: filePath,
        normalizedPath,
        fullPath,
        storageBase: STORAGE_BASE,
      });
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      logger.warn("File not found in storage", {
        requestedPath: filePath,
        fullPath,
      });
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(fullPath);

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase();
    const contentType =
      MIME_TYPES[ext] || "application/octet-stream";

    // Set cache headers for images (1 year cache for images)
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    
    if (contentType.startsWith("image/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      headers.set("Cache-Control", "public, max-age=3600");
    }

    logger.debug("Serving storage file", {
      path: normalizedPath,
      contentType,
      size: fileBuffer.length,
    });

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    logger.error("Error serving storage file", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to serve file",
      },
      { status: 500 }
    );
  }
}

