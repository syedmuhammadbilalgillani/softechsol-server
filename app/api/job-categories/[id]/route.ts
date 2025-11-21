import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

// PUT - Update a job category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await req.json();

    const categoryId = parseInt(id);

    // Validate ID
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.jobCategory.findUnique({
      where: {
        category_id: categoryId,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Job category not found" },
        { status: 404 }
      );
    }

    // Check if another category with the same name exists
    const duplicateCategory = await prisma.jobCategory.findFirst({
      where: {
        name: name.trim(),
        category_id: {
          not: categoryId,
        },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    // Update category
    const updatedCategory = await prisma.jobCategory.update({
      where: {
        category_id: categoryId,
      },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(
      { message: "Job category updated successfully", category: updatedCategory },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Error updating job category:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    // Handle not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Job category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update job category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a job category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    // Validate ID
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.jobCategory.findUnique({
      where: {
        category_id: categoryId,
      },
      include: {
        jobs: {
          take: 1, // Just check if there are any related jobs
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Job category not found" },
        { status: 404 }
      );
    }

    // Optional: Check if category has associated jobs
    // Note: Based on schema, JobCategoryRelation has onDelete: Cascade,
    // so related jobs will be automatically handled, but you might want to warn
    const hasJobs = existingCategory.jobs.length > 0;

    // Delete category (cascade will handle related JobCategoryRelation records)
    await prisma.jobCategory.delete({
      where: {
        category_id: categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "Job category deleted successfully",
        warning: hasJobs
          ? "Associated job relations were also removed"
          : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Error deleting job category:", error);

    // Handle not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Job category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete job category" },
      { status: 500 }
    );
  }
}
