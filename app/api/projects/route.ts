import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type CreateProjectBody = {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  short_description?: string;
  url?: string;
  client_name?: string;
  year?: number | null;
  timeline?: string | null;
  overview?: string | null;
  challenges?: string | null;
  solution?: string | null;
  images?: string[]; // GalleryItem IDs
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
      images = [],
      title,
      short_description,
      url,
      client_name,
      year,
      timeline,
      overview,
      meta_title,
      meta_description,
      meta_keywords,
      challenges,
      solution,
    } = body;

    const project = await prisma.project.create({
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true, locale: "en" }),
        short_description,
        url,
        client_name,
        year: year ?? null,
        timeline,
        meta_title,
        meta_description,
        meta_keywords,
        overview,
        challenges,
        solution,
        images:
          images.length > 0
            ? {
                create: images.map((imageId, index) => ({
                  image: { connect: { id: imageId } },
                  display_order: index,
                })),
              }
            : undefined,
      },
      include: {
        images: {
          include: { image: true },
          orderBy: { display_order: "asc" },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    logger.error("Error creating project", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
