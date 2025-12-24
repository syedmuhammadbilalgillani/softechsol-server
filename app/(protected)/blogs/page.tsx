import BlogForm from "@/components/forms/blog-form";
import DataTable from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import BlogPageComponent from "./blog-page-component";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Blogs Management - Softech Solutions",
  description: "Create and manage blog posts and articles for Softech Solutions",
  robots: {
    index: false,
    follow: false,
  },
};


const BlogPage = async () => {
  const categories = await prisma.blogCategory.findMany();
  const blogs = await prisma.blog.findMany();

  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
        <PageHeader heading="Blogs" paragraph="Create and manage your blogs" />
        <BlogForm categories={categories} />
      </div>
      <div className="mt-4">
        <BlogPageComponent blogs={blogs} categories={categories} />
      </div>
    </div>
  );
};

export default BlogPage;
