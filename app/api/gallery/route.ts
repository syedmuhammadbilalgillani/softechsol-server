import { uploadImage } from "@/lib/file-manager";
import prisma from "@/lib/prisma";
import { getGalleryItems } from "@/lib/prisma-gallery";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  altText: z.string().min(1),
});

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

  const parsed = bodySchema.safeParse({ altText });
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // Generate a unique publicId (cuid-like) for the file
    
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
