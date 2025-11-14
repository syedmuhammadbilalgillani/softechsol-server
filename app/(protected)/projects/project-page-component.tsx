"use client";
import DataTable, { Column } from "@/components/data-table";
import { ProjectForm } from "@/components/forms/project-form";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ProjectPageComponent = ({ data }: { data: any }) => {
  const router = useRouter();
  const [loading, setloading] = useState(false)
  const handleDelete = async (id: string) => {
    logger.info("Deleting project", id);
    setloading(true);
    const result = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (result.ok) {
      router.refresh();
      toast.success("Project deleted successfully");
    } else {
      toast.error("Failed to delete project");
    }
    setloading(false);
  };
  const columns: Column<(typeof data)[number]>[] = [
    {
      label: "Title",
      key: "title",
    },
    {
      label: "Short Description",
      key: "short_description",
    },
    // {
    //   label: "URL",
    //   key: "url",
    // },
    // {
    //   label: "Client Name",
    //   key: "client_name",
    // },
    // {
    //   label: "Year",
    //   key: "year",
    // },
    // {
    //   label: "Timeline",
    //   key: "timeline",
    // },
    // {
    //   label: "Overview",
    //   key: "overview",
    // },
    // {
    //   label: "Challenges",
    //   key: "challenges",
    // },
    // {
    //   label: "Solution",
    //   key: "solution",
    // },
    // {
    //   label: "Images",
    //   key: "images",
    // },
    // {
    //   label: "Created At",
    //   key: "created_at",
    // },
    // {
    //   label: "Updated At",
    //   key: "updated_at",
    // },
    {
      label: "Actions",
      key: "actions",
      columnClassName: "overflow-visible",
      render: (row) => (
        <div className="space-x-2">
          <ProjectForm project={row} />

          <Button
            variant={"destructive"}
            onClick={() => handleDelete(row.id)}
            disabled={loading}
            size={"icon-sm"}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <DataTable
        data={data}
        columns={columns as Column<(typeof data)[number]>[]}
        loading={false}
      />
    </>
  );
};

export default ProjectPageComponent;
