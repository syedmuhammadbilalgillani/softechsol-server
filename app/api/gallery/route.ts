import { uploadImage } from "@/lib/cloudinaryService";
import prisma from "@/lib/prisma";
import { getGalleryItems } from "@/lib/prisma-gallery";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  altText: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // Expect multipart/form-data with "file", "altText", "description"
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const altText = form.get("altText");
  const description = form.get("description") ?? undefined;

  if (!file)
    return NextResponse.json(
      { message: "Image file required" },
      { status: 400 }
    );

  const parsed = bodySchema.safeParse({ altText, description });
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Save file to a temp path so Cloudinary SDK can read it
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tmpPath = `/tmp/${crypto.randomUUID()}-${file.name}`;
  await import("fs/promises").then((fs) => fs.writeFile(tmpPath, buffer));

  try {
    const uploaded = await uploadImage(tmpPath); // returns { public_id, url, secure_url, ... }
    logger.debug("Uploaded gallery image:", uploaded);
    logger.debug("Parsed data:", parsed.data);
    const item = await prisma.galleryItem.create({
      data: {
        url: uploaded.secure_url ?? uploaded.url,
        altText: parsed.data.altText,
        description: parsed.data.description || null,
        publicId: uploaded.public_id,
        createdAt: new Date(),
        updatedAt: new Date(),
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
