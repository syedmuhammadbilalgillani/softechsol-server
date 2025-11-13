"use client";
import { DynamicForm, FieldConfig } from "@/components/dynamic-form"; // Import DynamicForm
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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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

const BlogForm = ({
  className,
  categories,
}: {
  className?: string;
  categories: any[];
}) => {
  const [loading, setLoading] = useState(false);

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
      name: "slug",
      label: "Slug",
      type: "input",
      required: true,
      placeholder: "Enter blog slug",
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
      type: "textarea",
      required: true,
      placeholder: "Enter blog content",
    },
    {
      name: "featured_image",
      label: "Featured Image",
      type: "media", // Custom media type for ImageSelector
      required: true,
    },
    {
      name: "image_alt",
      label: "Image Alt Text",
      type: "input",
      placeholder: "Enter alt text for featured image",
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
      type: "media", // Custom media type for OG Image
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

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    logger.info(data, "blog-form data");
    const payload = {
      ...data,
      category_ids: [data.category_ids],
    };
    logger.info(payload, "blog-form payload");
    try {
      const response = await axios.post("/api/blogs", payload);

      if (response.status === 201) {
        toast.success("Blog created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create blog");
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "w-full")}>
          Create Blog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Blog</DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={formFields}
          onSubmit={onSubmit}
          formId="blog"
          submitButton={
            <Button type="submit" form="blog" disabled={loading}>
              {loading ? "Submitting..." : "Create Blog"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;
