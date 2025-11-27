"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DynamicForm, FieldConfig } from "../dynamic-form";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, PlusIcon, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface PodcastFormProps {
  className?: string;
  podcast?: any;
  isUpdateMode?: boolean;
}

const PodcastsForm = ({ className, podcast, isUpdateMode = false }: PodcastFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const endpoint = isUpdateMode ? "/api/podcasts" : "/api/podcasts";
      const method = isUpdateMode ? "PUT" : "POST";
      
      const payload = isUpdateMode
        ? { ...data, id: podcast.id }
        : data;

      const res = await axios({
        method,
        url: endpoint,
        data: payload,
      });

      setLoading(false);
      if (res.status === 200 || res.status === 201) {
        toast.success(
          isUpdateMode
            ? "Podcast updated successfully"
            : "Podcast created successfully"
        );
        router.refresh();
        setOpen(false);
      } else {
        toast.error(
          isUpdateMode
            ? "Failed to update podcast"
            : "Failed to create podcast"
        );
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error?.response?.data?.error ||
        (isUpdateMode
          ? "Failed to update podcast"
          : "Failed to create podcast")
      );
    }
  };

  const defaultValues = isUpdateMode && podcast
    ? {
        title: podcast.title || "",
        description: podcast.description || "",
        url: podcast.url || "",
        image_id: podcast.image_id || "",
        status: podcast.status || "DRAFT",
        is_featured: podcast.is_featured || false,
        publish_date: podcast.publish_date
          ? new Date(podcast.publish_date).toISOString().split("T")[0]
          : "",
      }
    : {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "")}>
          {isUpdateMode ? (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4 mr-2" /> Add Podcast
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Update Podcast" : "Create Podcast"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={
            [
              {
                label: "Title",
                name: "title",
                type: "input",
                required: true,
                placeholder: "Enter podcast title",
              },
              {
                label: "Description",
                name: "description",
                type: "textarea",
                placeholder: "Enter podcast description",
              },
              {
                label: "URL",
                name: "url",
                type: "input",
                required: true,
                placeholder: "https://example.com/podcast",
                InputType: "url",
              },
              {
                label: "Podcast Image",
                name: "image_id",
                type: "media",
              },
              {
                label: "Status",
                name: "status",
                type: "select",
                required: true,
                options: [
                  { label: "Draft", value: "DRAFT" },
                  { label: "Published", value: "PUBLISHED" },
                  { label: "Archived", value: "ARCHIVED" },
                ],
              },
              {
                label: "Featured",
                name: "is_featured",
                type: "switch",
              },
              {
                label: "Publish Date",
                name: "publish_date",
                type: "input",
                InputType: "date",
                placeholder: "Select publish date",
              },
            ] as FieldConfig[]
          }
          formId="podcast-form"
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isUpdateMode={isUpdateMode}
          submitButton={
            <Button form="podcast-form" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isUpdateMode ? (
                "Update Podcast"
              ) : (
                "Create Podcast"
              )}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default PodcastsForm;
