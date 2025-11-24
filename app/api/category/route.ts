import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Ensure Prisma is set up correctly
import logger from "@/utils/logger";
import { revalidateTag } from "@/lib/revalidate";

export async function POST(request: Request) {
  const {
    name,
    slug,
    description,
    color,
    icon,
    meta_title,
    meta_description,
    is_active,
  } = await request.json();
  logger.info(is_active, "is_active from route");
  try {
    // 🔹 Check for existing category with same name or slug
    const existingCategory = await prisma.blogCategory.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          error:
            existingCategory.name === name
              ? "Category name already exists"
              : "Category slug already exists",
        },
        { status: 400 }
      );
    }

    // 🔹 Create new category
    const category = await prisma.blogCategory.create({
      data: {
        name,
        slug,
        description,
        color,
        icon,
        is_active: is_active ? true : false,
        parent_id: null,
        meta_title,
        meta_description,
      },
    });

    // Revalidate categories cache
    await revalidateTag("categories");

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const {
    category_id,
    name,
    slug,
    description,
    color,
    icon,
    meta_title,
    meta_description,
    is_active,
  } = await request.json();
  logger.info(is_active, "is_active from route");
  try {
    // 🔹 Check for existing category with same name or slug
    const existingCategory = await prisma.blogCategory.findFirst({
      where: {
        category_id: category_id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 400 }
      );
    }

    // 🔹 Create new category
    const category = await prisma.blogCategory.update({
      where: {
        category_id: category_id,
      },
      data: {
        ...existingCategory,
        name,
        slug,
        description: description || existingCategory.description,
        color: color || existingCategory.color,
        icon: icon || existingCategory.icon,
        is_active: is_active ? true : false,
        meta_title: meta_title || existingCategory.meta_title,
        meta_description: meta_description || existingCategory.meta_description,
      },
    });

    // Revalidate categories cache
    await revalidateTag("categories");

    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
