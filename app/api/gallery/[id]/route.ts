import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImage, updateImage } from "@/lib/cloudinaryService";
import { z } from "zod";
import { headers } from "next/headers";

const updateSchema = z.object({
  altText: z.string().min(1),
  description: z.string().optional(),
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
    description: unknown,
    file: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    file = form.get("file") as File | null; // optional
    altText = form.get("altText");
    description = form.get("description") ?? undefined;
  } else {
    const body = await req.json();
    altText = body.altText;
    description = body.description;
  }

  const parsed = updateSchema.safeParse({ altText, description });
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
    // write to /tmp
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tmpPath = `/tmp/${crypto.randomUUID()}-${file.name}`;
    await import("fs/promises").then((fs) => fs.writeFile(tmpPath, buffer));

    // overwrite on Cloudinary using same publicId
    const updated = await updateImage(tmpPath, existing.publicId);
    newUrl = updated.secure_url ?? updated.url;
  }

  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      url: newUrl,
      altText: parsed.data.altText,
      description: parsed.data.description || null,
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
    await deleteImage(existing.publicId);
  } catch {
    // still attempt DB delete even if cloud deletion reports "not found"
  }

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
