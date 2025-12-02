import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { revalidateTag } from "@/lib/revalidate";

// CREATE Service
export async function POST(req: Request) {
  try {
    const { title, description, categoryId, image } = await req.json();
    logger.info(title, "title");
    logger.info(description, "description");
    logger.info(categoryId, "categoryId");
    logger.info(image, "image");
    const service = await prisma.service.create({
      data: {
        title,
        description,
        categoryId: Number(categoryId),
        ...(image && {
          image_id: image,
        }),
      },
    });
    await revalidateTag("categories-with-services");
    return NextResponse.json(service);
  } catch (error) {
    logger.debug(error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

// UPDATE Service
export async function PUT(req: Request) {
  try {
    const { id, title, description, categoryId, image } = await req.json();

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        ...(image && {
          image_id: image,
        }),
      },
    });
    await revalidateTag("categories-with-services");

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE Service
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.service.delete({
      where: { id: Number(id) },
    });
    await revalidateTag("categories-with-services");
    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
