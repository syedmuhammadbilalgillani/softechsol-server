"use client";

import { Blog } from "@/app/generated/prisma/client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const BlogPageComponent = ({ blogs }: { blogs: Blog[] }) => {
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
              <div>
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
