import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { revalidateTag } from "@/lib/revalidate";

// CREATE Category
export async function POST(req: Request) {
  try {
    const { name, slug, image } = await req.json();

    logger.info(name, "name");
    logger.info(slug, "slug");
    logger.info(image, "image");

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        slug,
        image: {
          connect: { id: image },
        },
      },
    });

    await revalidateTag("categories-with-services");

    return NextResponse.json(category);
  } catch (error) {
    logger.info(error, "error");
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// UPDATE Category
export async function PUT(req: Request) {
  try {
    const { id, name, slug, image } = await req.json();

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: {
        name,
        slug,
        image: {
          connect: { id: image },
        },
      },
    });
    await revalidateTag("categories-with-services");

    return NextResponse.json(category);
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE Category
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validate ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const categoryId = Number(id);

    // Check if category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has linked services
    const linkedServices = await prisma.service.count({
      where: { categoryId: categoryId },
    });

    if (linkedServices > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category",
          message: `This category is linked to ${linkedServices} service(s). Please remove or reassign the services before deleting the category.`,
        },
        { status: 409 } // Conflict status code
      );
    }

    // Delete the category
    await prisma.serviceCategory.delete({
      where: { id: categoryId },
    });
    await revalidateTag("categories-with-services");

    logger.info(`Category deleted: ${categoryId}`);
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    logger.error(error);

    // Handle Prisma foreign key constraint error
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Cannot delete category",
          message:
            "This category is linked to one or more services. Please remove or reassign the services first.",
        },
        { status: 409 }
      );
    }

    // Handle Prisma record not found error
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to delete category",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
