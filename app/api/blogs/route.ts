import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Ensure Prisma is set up correctly
import slugify from "slugify";
import { revalidateTag } from "@/lib/revalidate";

export async function POST(request: Request) {
  const {
    title,
    excerpt,
    content,
    featured_image,
    status,
    is_featured,
    publish_date,
    meta_title,
    meta_description,
    meta_keywords,
    og_image,
    category_ids,
  } = await request.json();
  logger.info(category_ids, "category_ids");
  try {
    // Upload featured image to Cloudinary

    // Create the blog entry in the database
    const blog = await prisma.blog.create({
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true, locale: "en" }),
        excerpt,
        content,
        status,
        is_featured,
        publish_date: publish_date ? new Date(publish_date) : null,
        meta_title,
        meta_description,
        meta_keywords,
        ...(featured_image
          ? {
              featured_image: {
                connect: { id: featured_image },
              },
            }
          : {}),
        ...(og_image
          ? {
              og_image: {
                connect: { id: og_image },
              },
            }
          : {}),
        author: {
          connect: { user_id: 1 },
        },
        categories: {
          create: category_ids.map((id: string) => ({
            category: { connect: { category_id: Number(id) } },
          })),
        },
      },
    });
    await revalidateTag("blogs");
    return NextResponse.json(
      { message: "Blog created successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.blog.delete({
      where: { blog_id: Number(id) },
    });
    await revalidateTag("blogs");

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
