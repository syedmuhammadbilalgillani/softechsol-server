import prisma from "@/lib/prisma";
import { revalidateTag } from "@/lib/revalidate";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

type CreateProjectBody = {
  title: string;
  image_id?: string;
  description?: string;
  url?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  technologies?: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateProjectBody;

    if (!body.title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const {
      title,
      image_id,
      description,
      url,
      status = "DRAFT",
      technologies = [],
    } = body;

    const project = await prisma.project.create({
      data: {
        title,
        image_id: image_id || null,
        description,
        url,
        status,
        technologies,
      },
      include: {
        image: true,
      },
    });

    await revalidateTag("projects-list");
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    logger.error("Error creating project", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
