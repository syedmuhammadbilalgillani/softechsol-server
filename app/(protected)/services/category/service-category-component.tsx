"use client";

import { ServiceCategory } from "@/app/generated/prisma/client";
import DataTable from "@/components/data-table";
import { ServiceCategoryForm } from "@/components/forms/service-category-form";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ServiceCategoryComponent = ({
  categories,
}: {
  categories: ServiceCategory[];
}) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/services/categories`, {
        data: { id },
      });
      if (response?.status === 200) {
        toast?.success("Category deleted successfully");
        router.refresh();
      } else {
        toast?.error("Failed to delete category");
      }
    } catch (error) {
      logger.debug(error);
    }
  };
  return (
    <DataTable
      columns={[
        {
          label: "Name",
          key: "name",
        },
        {
          label: "Slug",
          key: "slug",
        },
        {
          label: "Actions",
          key: "actions",
          render: (row: any) => (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => handleDelete(row?.id.toString())}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <ServiceCategoryForm initialData={row} />
            </div>
          ),
        },
      ]}
      data={categories}
      loading={false}
    />
  );
};

export default ServiceCategoryComponent;
