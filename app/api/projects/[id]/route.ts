import prisma from "@/lib/prisma";
import { revalidateTag } from "@/lib/revalidate";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

type UpdateProjectBody = {
  title?: string;
  short_description?: string | null;
  url?: string | null;
  client_name?: string | null;
  year?: number | null;
  timeline?: string | null;
  overview?: string | null;
  challenges?: string | null;
  solution?: string | null;
  images?: string[]; // GalleryItem IDs to fully replace
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // if (Number(id)) {
    //   return NextResponse.json(
    //     { message: "Invalid project id" },
    //     { status: 400 }
    //   );
    // }

    const body = (await req.json()) as UpdateProjectBody;

    const {
      images,
      title,
      short_description,
      url,
      client_name,
      year,
      timeline,
      overview,
      challenges,
      solution,
    } = body;

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

    const result = await prisma.$transaction(async (tx) => {
      // If images array is provided, we fully replace them
      if (Array.isArray(images)) {
        await tx.projectImage.deleteMany({
          where: { project_id: Number(id) },
        });

        if (images.length > 0) {
          await tx.projectImage.createMany({
            data: images.map((imageId, index) => ({
              project_id: Number(id),
              image_id: imageId,
              display_order: index,
            })),
          });
        }
      }

      const updated = await tx.project.update({
        where: { project_id: Number(id) },
        data: {
          title,
          short_description,
          url,
          client_name,
          year: year ?? null,
          timeline,
          overview,
          challenges,
          solution,
        },
        include: {
          images: {
            include: { image: true },
            orderBy: { display_order: "asc" },
          },
        },
      });

      return updated;
    });
    await revalidateTag("projects-list");

    return NextResponse.json(result, { status: 200 });
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
