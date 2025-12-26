"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import { PencilIcon, PlusIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

type Props = {
  project?: any; // if provided -> update mode
  onSaved?: (project: any) => void;
};

export const ProjectForm: React.FC<Props> = ({ project, onSaved }) => {
  const isUpdateMode = Boolean(project);
  const [loading, setloading] = useState(false);
  const [open, setopen] = useState(false);
  const router = useRouter();

  logger.info(isUpdateMode, "isUpdateMode");
  const fields: FieldConfig[] = [
    {
      name: "title",
      label: "Title",
      type: "input",
      required: true,
      placeholder: "Project title",
      className: "col-span-2",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Project description",
      className: "col-span-2",
    },
    {
      name: "url",
      label: "Project URL",
      type: "input",
      placeholder: "https://example.com",
      className: "col-span-1",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Archived", value: "ARCHIVED" },
      ],
      placeholder: "Select status",
      className: "col-span-1",
    },
    {
      name: "technologies",
      label: "Technologies",
      type: "textarea",
      placeholder: "Enter technologies separated by commas (e.g., React, Node.js, TypeScript)",
      className: "col-span-2",
    },
    {
      name: "image_id",
      label: "Project Image",
      type: "media",
      multiple: false,
      className: "col-span-2",
    },
  ];
  logger.info(project, "project");
  const defaultValues = project
    ? {
        title: project.title ?? "",
        description: project.description ?? "",
        url: project.url ?? "",
        status: project.status ?? "DRAFT",
        technologies: project.technologies?.join(", ") ?? "",
        image_id: project.image_id ?? "",
      }
    : {
        title: "",
        description: "",
        url: "",
        status: "DRAFT",
        technologies: "",
        image_id: "",
      };

  logger.info(defaultValues, "defaultValues");
  const handleSubmit = useCallback(
    async (data: any) => {
      setloading(true);
      try {
        logger.info(data, "data");
        
        // Parse technologies from comma-separated string to array
        const technologies: string[] = data.technologies
          ? data.technologies
              .split(",")
              .map((tech: string) => tech.trim())
              .filter((tech: string) => tech.length > 0)
          : [];

        const payload = {
          title: data.title,
          description: data.description || null,
          url: data.url || null,
          status: data.status || "DRAFT",
          technologies,
          image_id: data.image_id || null,
        };

        const endpoint = isUpdateMode
          ? `/api/projects/${project!.project_id}`
          : "/api/projects";

        const method = isUpdateMode ? "PUT" : "POST";
        logger.info(endpoint, "endpoint");
        logger.info(method, "method");
        logger.info(payload, "payload");
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        logger.info(res, "res");

        const result = await res.json();
        logger.info(result, "result");
        if (!res.ok) {
          setloading(false);
          logger.error("Failed to save project", result);
          return;
        }
        setloading(false);
        setopen(false);
        router.refresh();
        if (onSaved) onSaved(result);
      } catch (error) {
        logger.error("Error saving project", error);
        setloading(false);
      }
    },
    [isUpdateMode, project, onSaved, router]
  );

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {isUpdateMode ? (
            <PencilIcon className="w-4 h-4" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
          {isUpdateMode ? "" : "Add"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Update Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {isUpdateMode ? "Update Project" : "Create Project"}
          </h2>
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            parentClassName="grid grid-cols-2 gap-4"
            defaultValues={defaultValues}
            isUpdateMode={isUpdateMode}
            formId="project-form"
            submitButton={
              <Button
                type="submit"
                form="project-form"
                className="col-span-2 mt-4 w-full"
              >
                {loading
                  ? "Saving..."
                  : isUpdateMode
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
