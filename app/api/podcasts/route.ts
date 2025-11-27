import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import logger from "@/utils/logger";
import { revalidateTag } from "@/lib/revalidate";

export async function POST(request: Request) {
  const {
    title,
    description,
    url,
    image_id,
    status,
    is_featured,
    publish_date,
  } = await request.json();

  try {
    // Check for existing podcast with same title or URL
    const existingPodcast = await prisma.podcast.findFirst({
      where: {
        OR: [{ title }, { url }],
      },
    });

    if (existingPodcast) {
      return NextResponse.json(
        {
          error:
            existingPodcast.title === title
              ? "Podcast title already exists"
              : "Podcast URL already exists",
        },
        { status: 400 }
      );
    }

    // Create new podcast
    const podcast = await prisma.podcast.create({
      data: {
        title,
        description,
        url,
        image_id: image_id || null,
        status: status || "DRAFT",
        is_featured: is_featured ? true : false,
        publish_date: publish_date ? new Date(publish_date) : null,
      },
      include: {
        image: true,
      },
    });

    // Revalidate podcasts cache
    await revalidateTag("podcasts");

    return NextResponse.json(
      { message: "Podcast created successfully", podcast },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating podcast:", error);
    return NextResponse.json(
      { error: "Failed to create podcast" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const {
    id,
    title,
    description,
    url,
    image_id,
    status,
    is_featured,
    publish_date,
  } = await request.json();

  try {
    // Check if podcast exists
    const existingPodcast = await prisma.podcast.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingPodcast) {
      return NextResponse.json(
        {
          error: "Podcast not found",
        },
        { status: 404 }
      );
    }

    // Check for duplicate title or URL (excluding current podcast)
    const duplicatePodcast = await prisma.podcast.findFirst({
      where: {
        AND: [
          { id: { not: Number(id) } },
          {
            OR: [{ title }, { url }],
          },
        ],
      },
    });

    if (duplicatePodcast) {
      return NextResponse.json(
        {
          error:
            duplicatePodcast.title === title
              ? "Podcast title already exists"
              : "Podcast URL already exists",
        },
        { status: 400 }
      );
    }

    // Update podcast
    const podcast = await prisma.podcast.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title || existingPodcast.title,
        description: description ?? existingPodcast.description,
        url: url || existingPodcast.url,
        image_id: image_id ?? existingPodcast.image_id,
        status: status || existingPodcast.status,
        is_featured: is_featured !== undefined ? is_featured : existingPodcast.is_featured,
        publish_date: publish_date ? new Date(publish_date) : existingPodcast.publish_date,
      },
      include: {
        image: true,
      },
    });

    // Revalidate podcasts cache
    await revalidateTag("podcasts");

    return NextResponse.json(
      { message: "Podcast updated successfully", podcast },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error updating podcast:", error);
    return NextResponse.json(
      { error: "Failed to update podcast" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    logger.debug(id, "podcast_id");

    const podcast = await prisma.podcast.delete({
      where: {
        id: Number(id),
      },
    });

    // Revalidate podcasts cache
    await revalidateTag("podcasts");

    return NextResponse.json(
      { message: "Podcast deleted successfully", podcast },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error deleting podcast:", error);
    return NextResponse.json(
      { error: "Failed to delete podcast" },
      { status: 500 }
    );
  }
}
