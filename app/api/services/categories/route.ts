import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

// CREATE Category
export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();

    const category = await prisma.serviceCategory.create({
      data: { name, slug },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// UPDATE Category
export async function PUT(req: Request) {
  try {
    const { id, name, slug } = await req.json();

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(category);
  } catch (error) {
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
    logger.info(id);
    await prisma.serviceCategory.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
