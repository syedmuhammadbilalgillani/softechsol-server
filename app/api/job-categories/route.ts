import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

// GET - List all job categories
export async function GET() {
  try {
    const categories = await prisma.jobCategory.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    logger.error("Error fetching job categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch job categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new job category
export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json();

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check for existing category with same name
    const existingCategory = await prisma.jobCategory.findUnique({
      where: {
        name: name.trim(),
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const category = await prisma.jobCategory.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
      },
    });

    return NextResponse.json(
      { message: "Job category created successfully", category },
      { status: 201 }
    );
  } catch (error: any) {
    logger.error("Error creating job category:", error);
    
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create job category" },
      { status: 500 }
    );
  }
}
