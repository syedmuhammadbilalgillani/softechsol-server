import BlogForm from "@/components/forms/blog-form";
import DataTable from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const BlogPage = async () => {
  const categories = await prisma.blogCategory.findMany();
  const blogs = await prisma.blog.findMany();

  return (
    <div className="p-5">
      <PageHeader heading="Blogs" paragraph="Create and manage your blogs" />
      <BlogForm categories={categories} />
      <div>
        <DataTable
          columns={[
            { label: "Title", key: "title" },
            { label: "Slug", key: "slug" },
            { label: "Status", key: "status" },
            {
              label: "Created At",
              key: "created_at",
              render: (row: any) =>
                row.created_at ? formatDate(row.created_at) : "",
            },
            {
              label: "Updated At",
              key: "updated_at",
              render: (row: any) =>
                row.updated_at ? formatDate(row.updated_at) : "",
            },
          ]}
          data={blogs}
          loading={false}
        />
      </div>
    </div>
  );
};

export default BlogPage;
