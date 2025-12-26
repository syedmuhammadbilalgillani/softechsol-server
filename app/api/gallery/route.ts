import { uploadImage } from "@/lib/file-manager";
import prisma from "@/lib/prisma";
import { getGalleryItems } from "@/lib/prisma-gallery";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Ensure Node.js runtime for larger file uploads
export const runtime = 'nodejs';
export const maxDuration = 30; // Increase timeout for large uploads

const bodySchema = z.object({
  altText: z.string().min(1),
});

// Maximum file size: 10MB (adjust as needed)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export async function POST(req: NextRequest) {
  // Expect multipart/form-data with "file", "altText"
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const altText = form.get("altText");

  if (!file)
    return NextResponse.json(
      { message: "Image file required" },
      { status: 400 }
    );

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
      { status: 413 }
    );
  }

  const parsed = bodySchema.safeParse({ altText });
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // Upload image using file-manager
    const uploaded = await uploadImage(file, "gallery");
    logger.debug("Uploaded gallery image:", uploaded);
    logger.debug("Parsed data:", parsed.data);
    
    const item = await prisma.galleryItem.create({
      data: {
        url: uploaded.url,
        altText: parsed.data.altText,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    logger.error("Error uploading gallery image:", e);
    return NextResponse.json(
      { message: "Upload or DB failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const galleryItems = await getGalleryItems();
    return NextResponse.json(galleryItems, { status: 200 });
  } catch (e) {
    logger.error("Error fetching gallery items:", e);
    return NextResponse.json(
      { message: "Error fetching gallery items" },
      { status: 500 }
    );
  }
}
