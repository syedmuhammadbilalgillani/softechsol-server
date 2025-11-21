import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

// PUT - Update a job
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    // Validate ID
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }

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
    } = await req.json();

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: {
        job_id: jobId,
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if another job with the same slug exists
    const duplicateJob = await prisma.job.findFirst({
      where: {
        slug: slug.trim(),
        job_id: {
          not: jobId,
        },
      },
    });

    if (duplicateJob) {
      return NextResponse.json(
        { error: "Job with this slug already exists" },
        { status: 400 }
      );
    }

    // Update job with transaction to handle categories
    const updatedJob = await prisma.$transaction(async (tx) => {
      // Delete existing category relations
      await tx.jobCategoryRelation.deleteMany({
        where: {
          job_id: jobId,
        },
      });

      // Update job
      const job = await tx.job.update({
        where: {
          job_id: jobId,
        },
        data: {
          title: title.trim(),
          slug: slug.trim(),
          description,
          requirements: requirements !== undefined ? requirements : null,
          responsibilities: responsibilities !== undefined ? responsibilities : null,
          location: location !== undefined ? location : null,
          job_type: job_type !== undefined ? job_type : null,
          salary_min: salary_min ? parseInt(salary_min) : null,
          salary_max: salary_max ? parseInt(salary_max) : null,
          salary_currency: salary_currency || "USD",
          experience_level: experience_level !== undefined ? experience_level : null,
          status: status || "DRAFT",
          is_featured: is_featured !== undefined ? is_featured : false,
          application_url: application_url !== undefined ? application_url : null,
          application_email: application_email !== undefined ? application_email : null,
          publish_date: publish_date ? new Date(publish_date) : null,
          expiry_date: expiry_date ? new Date(expiry_date) : null,
          meta_title: meta_title !== undefined ? meta_title : null,
          meta_description: meta_description !== undefined ? meta_description : null,
          meta_keywords: meta_keywords !== undefined ? meta_keywords : null,
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

      return job;
    });

    return NextResponse.json(
      { message: "Job updated successfully", job: updatedJob },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Error updating job:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Job with this slug already exists" },
        { status: 400 }
      );
    }

    // Handle not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a job
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    // Validate ID
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: {
        job_id: jobId,
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Delete job (cascade will handle related JobCategoryRelation records)
    await prisma.job.delete({
      where: {
        job_id: jobId,
      },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Error deleting job:", error);

    // Handle not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
