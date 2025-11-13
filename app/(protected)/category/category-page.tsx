"use client";
import DataTable from "@/components/data-table";
import CategoryForm from "@/components/forms/category-form";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CategoryPage = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async (category_id: number) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/category/${category_id}`);
      if (res.status === 200) {
        toast.success("Category deleted successfully");
        router.refresh();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
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
            label: "Is Active",
            key: "is_active",
            render: (row: Category) => (row.is_active ? "Active" : "Inactive"),
          },

          { label: "Meta Title", key: "meta_title" },
          { label: "Meta Description", key: "meta_description" },
          {
            label: "Created At",
            key: "created_at",
            render: (row: Category) => formatDate(row.created_at),
          },
          {
            label: "Actions",
            key: "actions",
            render: (row: Category) => (
              <div className="flex items-center gap-2">
                <CategoryForm category={row} />
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
        data={categories as unknown as Category[]}
        loading={false}
      />
    </div>
  );
};

export default CategoryPage;
