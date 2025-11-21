import BlogForm from "@/components/forms/blog-form";
import DataTable from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import BlogPageComponent from "./blog-page-component";

export const dynamic = "force-dynamic";
export const revalidate = 100;


const BlogPage = async () => {
  const categories = await prisma.blogCategory.findMany();
  const blogs = await prisma.blog.findMany();

  return (
    <div className="p-5">
      <PageHeader heading="Blogs" paragraph="Create and manage your blogs" />
      <BlogForm categories={categories} />
      <BlogPageComponent blogs={blogs} />
    </div>
  );
};

export default BlogPage;
