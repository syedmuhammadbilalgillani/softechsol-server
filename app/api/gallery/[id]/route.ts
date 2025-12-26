import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImage, updateImage } from "@/lib/file-manager";
import { z } from "zod";
import { headers } from "next/headers";

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const updateSchema = z.object({
  altText: z.string().min(1),
});

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } = await params;

  // Support both multipart (with new image) and JSON (meta only)
  const contentType = (await headers()).get("content-type") || "";
  let altText: unknown,
    file: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    file = form.get("file") as File | null; // optional
    altText = form.get("altText");
    
    // Validate file size if file is provided
    if (file && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 413 }
      );
    }
  } else {
    const body = await req.json();
    altText = body.altText;
  }

  const parsed = updateSchema.safeParse({ altText });
  if (!parsed.success)
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );

  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  let newUrl = existing.url;

  if (file) {
    // Update image using file-manager (deletes old, uploads new)
    const updated = await updateImage(file, existing.url, "gallery");
    newUrl = updated.url;
  }

  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      url: newUrl,
      altText: parsed.data.altText,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } = await params;
  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    // Delete image file using file-manager
    await deleteImage(existing.url);
  } catch {
    // still attempt DB delete even if file deletion reports "not found"
  }

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
