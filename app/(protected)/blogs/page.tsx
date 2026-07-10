import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import BlogPageComponent from "./blog-page-component";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Blogs Management - Softech Solutions",
  description:
    "Create and manage blog posts and articles for Softech Solutions",
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
        {/* <BlogForm categories={categories} /> */}
        <Button asChild>
          <Link href="/blogs/create?mode=create">Create Blog</Link>
        </Button>
      </div>
      <div className="mt-4">
        <BlogPageComponent blogs={blogs} categories={categories} />
      </div>
    </div>
  );
};

export default BlogPage;
