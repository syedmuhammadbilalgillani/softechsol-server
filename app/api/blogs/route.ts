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

export async function PUT(request: Request) {
  const {
    id,
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

  logger.info({ id, category_ids }, "PUT blog update");

  try {
    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: {
        blog_id: Number(id),
      },
      include: {
        categories: true,
      },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Update the blog entry in the database
    const blog = await prisma.blog.update({
      where: {
        blog_id: Number(id),
      },
      data: {
        title: title || existingBlog.title,
        slug: title ? slugify(title, { lower: true, strict: true, locale: "en" }) : existingBlog.slug,
        excerpt: excerpt ?? existingBlog.excerpt,
        content: content || existingBlog.content,
        status: status || existingBlog.status,
        is_featured: is_featured !== undefined ? is_featured : existingBlog.is_featured,
        publish_date: publish_date ? new Date(publish_date) : existingBlog.publish_date,
        meta_title: meta_title ?? existingBlog.meta_title,
        meta_description: meta_description ?? existingBlog.meta_description,
        meta_keywords: meta_keywords ?? existingBlog.meta_keywords,
        ...(featured_image
          ? {
              featured_image: {
                connect: { id: featured_image },
              },
            }
          : featured_image === null
          ? {
              featured_image: {
                disconnect: true,
              },
            }
          : {}),
        ...(og_image
          ? {
              og_image: {
                connect: { id: og_image },
              },
            }
          : og_image === null
          ? {
              og_image: {
                disconnect: true,
              },
            }
          : {}),
        // Update categories - delete existing and create new ones
        categories: category_ids && category_ids.length > 0
          ? {
              deleteMany: {},
              create: category_ids.map((id: string) => ({
                category: { connect: { category_id: Number(id) } },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        featured_image: true,
        og_image: true,
      },
    });

    await revalidateTag("blogs");
    return NextResponse.json(
      { message: "Blog updated successfully", blog },
      { status: 200 }
    );
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: "Failed to update blog" },
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
