"use client";

import { Blog } from "@/app/generated/prisma/client";
import DataTable from "@/components/data-table";
import BlogForm from "@/components/forms/blog-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const BlogPageComponent = ({ blogs, categories }: { blogs: Blog[]; categories: any[] }) => {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  
  const handleDelete = async (id: string) => {
    try {
      setloading(true);
      await axios.delete(`/api/blogs`, { data: { id } });
      toast.success("Blog deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setloading(false);
    }
  };

  // Transform blog data for the form
  const transformBlogForForm = (blog: Blog & { categories?: any[] }) => {
    return {
      blog_id: blog.blog_id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image_id: blog.featured_image_id,
      status: blog.status,
      publish_date: blog.publish_date?.toISOString() || null,
      meta_title: blog.meta_title,
      meta_description: blog.meta_description,
      meta_keywords: blog.meta_keywords,
      og_image_id: blog.og_image_id,
      category_ids: blog.categories?.map((cat: any) => cat.category_id) || [],
    };
  };

  return (
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
          {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
              <div className="flex gap-2">
                <BlogForm
                  categories={categories}
                  initialData={transformBlogForForm(row)}
                  onSuccess={() => router.refresh()}
                />
                <Button
                  variant={"destructive"}
                  onClick={() => handleDelete(row.blog_id)}
                  disabled={loading}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={blogs}
        loading={false}
      />
    </div>
  );
};

export default BlogPageComponent;
