"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import { Pencil, Plus, PlusIcon } from "lucide-react";
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
      name: "short_description",
      label: "Short Description",
      type: "textarea",
      placeholder: "Short summary",
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
      name: "client_name",
      label: "Client Name",
      type: "input",
      placeholder: "Client",
      className: "col-span-1",
    },
    {
      name: "year",
      label: "Year",
      type: "input",
      placeholder: "2024",
      className: "col-span-1",
      InputType: "number",
    },
    {
      name: "timeline",
      label: "Timeline",
      type: "input",
      placeholder: "Jan 2024 – Mar 2024",
      className: "col-span-1",
    },
    {
      name: "overview",
      label: "Overview",
      type: "textarea",
      placeholder: "Project overview",
      className: "col-span-2",
    },
    {
      name: "challenges",
      label: "Challenges",
      type: "textarea",
      placeholder: "Key challenges",
      className: "col-span-2",
    },
    {
      name: "solution",
      label: "Solution",
      type: "textarea",
      placeholder: "Our solution",
      className: "col-span-2",
    },
    {
      name: "imageIds",
      label: "Project Images",
      type: "media",
      multiple: true, // <---- uses multi select
      className: "col-span-2",
    },
  ];
  logger.info(project, "project");
  const defaultValues = project
    ? {
        title: project.title,
        short_description: project.short_description ?? "",
        url: project.url ?? "",
        client_name: project.client_name ?? "",
        year: project.year ?? "",
        timeline: project.timeline ?? "",
        overview: project.overview ?? "",
        challenges: project.challenges ?? "",
        solution: project.solution ?? "",
        imageIds: project.images?.map((img: any) => img),
      }
    : {
        title: "",
        short_description: "",
        url: "",
        client_name: "",
        year: "",
        timeline: "",
        overview: "",
        challenges: "",
        solution: "",
        imageIds: [] as string[],
      };

  logger.info(defaultValues, "defaultValues");
  const handleSubmit = useCallback(
    async (data: any) => {
      setloading(true);
      try {
        logger.info(data, "data");
        logger.info(data.imageIds, "data.imageIds");
        const images: string[] = Array.isArray(data.imageIds)
          ? data.imageIds
          : data.imageIds
          ? [data.imageIds]
          : [];
        logger.info(images, "images");
        logger.info(data, "data");
        logger.info(isUpdateMode, "isUpdateMode");
        logger.info(project, "project");
        logger.info(onSaved, "onSaved");
        const payload = {
          title: data.title,
          short_description: data.short_description || null,
          url: data.url || null,
          client_name: data.client_name || null,
          year: data.year ? Number(data.year) : null,
          timeline: data.timeline || null,
          overview: data.overview || null,
          challenges: data.challenges || null,
          solution: data.solution || null,
          images,
        };

        const endpoint = isUpdateMode
          ? `/api/projects/${project!.id}`
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
    [isUpdateMode, project, onSaved]
  );

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {isUpdateMode ? (
            <Pencil className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {isUpdateMode ? `Update` : `Add`}
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
