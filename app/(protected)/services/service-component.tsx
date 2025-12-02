"use client";
import { Service } from "@/app/generated/prisma/client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ServiceComponent = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/services`, { data: { id } });
      if (res.status === 200) {
        toast.success("Service deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };
  return (
    <DataTable
      columns={[
        { label: "Title", key: "title" },
        { label: "Description", key: "description" },
        {
          label: "Category",
          key: "category.name",
          render: (row: any) => row?.category?.name,
        },
        {
          label: "Image",
          key: "image.url",
          render: (row: any) => (
            <Image
              src={row?.image?.url}
              alt={row?.image?.alt || "Service Image"}
              width={100}
              height={100}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ),
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
            </div>
          ),
        },
      ]}
      data={services}
      loading={false}
    />
  );
};

export default ServiceComponent;
