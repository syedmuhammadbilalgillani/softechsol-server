import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

// GET - List all jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    logger.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST - Create a new job
export async function POST(request: Request) {
  try {
    const {
      title,
      slug,
      description,
      requirements,
      responsibilities,
      location,
      job_type,
      salary_min,
      salary_max,
      salary_currency,
      experience_level,
      status,
      is_featured,
      application_url,
      application_email,
      publish_date,
      expiry_date,
      meta_title,
      meta_description,
      meta_keywords,
      category_ids, // Array of category IDs
    } = await request.json();

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    // Check for existing job with same slug
    const existingJob = await prisma.job.findUnique({
      where: {
        slug: slug.trim(),
      },
    });

    if (existingJob) {
      return NextResponse.json(
        { error: "Job with this slug already exists" },
        { status: 400 }
      );
    }

    // Create job with categories
    const job = await prisma.job.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        description,
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        location: location || null,
        job_type: job_type || null,
        salary_min: salary_min ? parseInt(salary_min) : null,
        salary_max: salary_max ? parseInt(salary_max) : null,
        salary_currency: salary_currency || "USD",
        experience_level: experience_level || null,
        status: status || "DRAFT",
        is_featured: is_featured || false,
        application_url: application_url || null,
        application_email: application_email || null,
        publish_date: publish_date ? new Date(publish_date) : null,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        meta_keywords: meta_keywords || null,
        categories: {
          create: (category_ids || []).map((categoryId: number) => ({
            category: {
              connect: { category_id: Number(categoryId) },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Job created successfully", job },
      { status: 201 }
    );
  } catch (error: any) {
    logger.error("Error creating job:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Job with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
