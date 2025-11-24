"use client";
import DataTable from "@/components/data-table";
import JobCategoryForm from "@/components/forms/job-category-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface JobCategory {
  category_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const JobCategoriesPage = ({ categories }: { categories: JobCategory[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async (category_id: number) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/job-categories/${category_id}`);
      if (res.status === 200) {
        toast.success("Job category deleted successfully");
        router.refresh();
      } else {
        toast.error(res.data.message || "Failed to delete category");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to delete job category";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <DataTable
        columns={[
          { label: "Name", key: "name" },
          {
            label: "Created At",
            key: "created_at",
            render: (row: JobCategory) => formatDate(row.created_at),
          },
          {
            label: "Updated At",
            key: "updated_at",
            render: (row: JobCategory) => formatDate(row.updated_at),
          },
          {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
              <div className="flex items-center gap-2">
                <JobCategoryForm category={row} />
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  size="sm"
                  onClick={async () => await handleDelete(row.category_id)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={categories}
        loading={false}
      />
    </div>
  );
};

export default JobCategoriesPage;
