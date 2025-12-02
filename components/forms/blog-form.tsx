"use client";
import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import logger from "@/utils/logger";
import axios from "axios";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_alt: string;
  status: string;
  tags: string[];
  publish_date: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  category_ids: string[];
};

export interface BlogInitialData {
  blog_id: number;
  title: string;
  excerpt?: string | null;
  content: string;
  featured_image_id?: string | null;
  status: string;
  publish_date?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_image_id?: string | null;
  category_ids: number[];
}

const BlogForm = ({
  className,
  categories,
  initialData,
  onSuccess,
}: {
  className?: string;
  categories: any[];
  initialData?: BlogInitialData | null;
  onSuccess?: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isUpdateMode = !!initialData?.blog_id;

  // Field configuration for DynamicForm
  const formFields: FieldConfig[] = [
    {
      name: "title",
      label: "Title",
      type: "input",
      required: true,
      placeholder: "Enter blog title",
    },
    {
      name: "excerpt",
      label: "Excerpt",
      type: "textarea",
      placeholder: "Enter blog excerpt",
    },
    {
      name: "content",
      label: "Content",
      type: "joditEditor",
      required: true,
      placeholder: "Enter blog content",
    },
    {
      name: "featured_image",
      label: "Featured Image",
      type: "media",
      required: true,
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
    },
    {
      name: "publish_date",
      label: "Publish Date",
      type: "input",
      InputType: "datetime-local",
      placeholder: "Select a publish date",
    },
    {
      name: "meta_title",
      label: "Meta Title",
      type: "input",
      placeholder: "Enter meta title",
    },
    {
      name: "meta_description",
      label: "Meta Description",
      type: "input",
      placeholder: "Enter meta description",
    },
    {
      name: "meta_keywords",
      label: "Meta Keywords",
      type: "input",
      placeholder: "Enter meta keywords",
    },
    {
      name: "og_image",
      label: "OG Image",
      type: "media",
    },
    {
      name: "category_ids",
      label: "Categories",
      type: "select",
      required: true,
      options: categories.map((category) => ({
        label: category.name,
        value: String(category.category_id),
      })),
    },
  ];

  // Format initial data for the form
  const defaultValues = {
    title: initialData?.title ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    featured_image: initialData?.featured_image_id ?? "",
    status: initialData?.status ?? "DRAFT",
    publish_date: initialData?.publish_date
      ? new Date(initialData.publish_date).toISOString().slice(0, 16)
      : "",
    meta_title: initialData?.meta_title ?? "",
    meta_description: initialData?.meta_description ?? "",
    meta_keywords: initialData?.meta_keywords ?? "",
    og_image: initialData?.og_image_id ?? "",
    category_ids: initialData?.category_ids
      ? initialData.category_ids.map((id) => String(id))
      : [],
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    logger.info(data, "blog-form data");
    const payload = {
      ...data,
      category_ids: Array.isArray(data.category_ids)
        ? data.category_ids
        : [data.category_ids],
    };

    if (isUpdateMode && initialData) {
      payload.id = initialData.blog_id;
    }

    logger.info(payload, "blog-form payload");
    try {
      const url = "/api/blogs";
      const method = isUpdateMode ? "PUT" : "POST";
      const response = await axios({
        method,
        url,
        data: payload,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(
          isUpdateMode
            ? "Blog updated successfully!"
            : "Blog created successfully!"
        );
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error(
        isUpdateMode ? "Failed to update blog" : "Failed to create blog"
      );
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "")}>
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
            {isUpdateMode ? "Edit Blog" : "Create Blog"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={formFields}
          onSubmit={onSubmit}
          formId="blog"
          defaultValues={defaultValues}
          isUpdateMode={isUpdateMode}
          submitButton={
            <Button type="submit" form="blog" disabled={loading}>
              {loading
                ? isUpdateMode
                  ? "Updating..."
                  : "Submitting..."
                : isUpdateMode
                ? "Update Blog"
                : "Create Blog"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;
