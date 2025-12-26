import prisma from "@/lib/prisma";
import { revalidateTag } from "@/lib/revalidate";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

type UpdateProjectBody = {
  title?: string;
  image_id?: string | null;
  description?: string | null;
  url?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  technologies?: string[];
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = (await req.json()) as UpdateProjectBody;

    const { title, image_id, description, url, status, technologies } = body;

    // Ensure project exists
    const existing = await prisma.project.findUnique({
      where: { project_id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Build update data object, only including fields that are provided
    const updateData: {
      title?: string;
      image_id?: string | null;
      description?: string | null;
      url?: string | null;
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      technologies?: string[];
    } = {};

    if (title !== undefined) updateData.title = title;
    if (image_id !== undefined) updateData.image_id = image_id || null;
    if (description !== undefined) updateData.description = description || null;
    if (url !== undefined) updateData.url = url || null;
    if (status !== undefined) updateData.status = status;
    if (technologies !== undefined) updateData.technologies = technologies;

    const updated = await prisma.project.update({
      where: { project_id: Number(id) },
      data: updateData,
      include: {
        image: true,
      },
    });

    await revalidateTag("projects-list");

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    logger.error("Error updating project", error);
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info("Deleting project", id);
    const result = await prisma.project.delete({
      where: { project_id: Number(id) },
    });
    logger.info("Project deleted", result);
    await revalidateTag("projects-list");

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Error deleting project", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
