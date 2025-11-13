"use client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const CompanyPage = ({ companies }: { companies: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async (company_id: number) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/companies`, {
        data: { company_id },
      });
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
    <DataTable
      columns={[
        {
          label: "Image",
          key: "featured_image.url",
          render: (row: any) => (
            <Image
              src={row?.featured_image?.url}
              alt={row.featured_image?.altText}
              width={100}
              height={100}
            />
          ),
        },
        {
          label: "Action",
          key: "action",
          render: (row: any) => (
            <Button
              onClick={() => handleDelete(row.company_id)}
              disabled={isLoading}
              variant={`destructive`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          ),
        },
      ]}
      data={companies}
      loading={false}
    />
  );
};

export default CompanyPage;
