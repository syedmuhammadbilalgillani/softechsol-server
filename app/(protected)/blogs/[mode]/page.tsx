import BlogForm from "@/components/forms/blog-form";
import prisma from "@/lib/prisma";
import React from "react";

const Mode = async ({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  searchParams: Promise<{ mode: string }>;
}) => {
  const { mode } = await params;
  const searchMode = await searchParams;
  const modeCheck = mode === "create" ? searchMode.mode : mode;
  const categories = await prisma.blogCategory.findMany();

  const blogdetail =
    modeCheck !== "create"
      ? await prisma.blog.findUnique({
          where: { blog_id: Number(mode) },
        })
      : null;
  return (
    <>
      {modeCheck === "create" ? (
        <BlogForm categories={categories} initialData={null} />
      ) : (
        <BlogForm categories={categories} initialData={blogdetail as any} />
      )}
    </>
  );
};

export default Mode;
