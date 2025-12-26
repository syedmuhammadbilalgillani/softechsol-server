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
      label: "Description",
      key: "description",
      render: (row) => (
        <div className="max-w-md truncate">
          {row.description || "-"}
        </div>
      ),
    },
    {
      label: "URL",
      key: "url",
      render: (row) => (
        <a
          href={row.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline truncate max-w-xs block"
          onClick={(e) => !row.url && e.preventDefault()}
        >
          {row.url || "-"}
        </a>
      ),
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Technologies",
      key: "technologies",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.technologies && row.technologies.length > 0 ? (
            row.technologies.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
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
