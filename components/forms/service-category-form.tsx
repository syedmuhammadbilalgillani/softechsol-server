"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DynamicForm, FieldConfig } from "@/components/dynamic-form"; // adjust path if different
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { PencilIcon, PlusIcon } from "lucide-react";

export interface ServiceCategoryFormValues {
  name: string;
  slug: string;
  image: string;
}

export interface ServiceCategoryInitialData {
  id: string;
  name: string;
  slug: string;
  image: {
    id: string;
    url?: string;
    altText?: string;
  };
}

interface ServiceCategoryFormProps {
  initialData?: ServiceCategoryInitialData | null;
  onSuccess?: (data: any) => void;
}

const serviceCategoryFields: FieldConfig[] = [
  {
    name: "name",
    label: "Category Name",
    type: "input" as const,
    required: true,
    placeholder: "Enter category name",
    className: "col-span-2",
  },
  {
    name: "slug",
    label: "Slug",
    type: "input" as const,
    required: true,
    InputType: "slug", // your dynamic form will auto-generate slug
    placeholder: "category-slug",
    className: "col-span-2",
  },
  {
    name: "image",
    label: "Image",
    type: "media",
    required: true,
    placeholder: "Select image",
    className: "col-span-2",
  },
];

export const ServiceCategoryForm: React.FC<ServiceCategoryFormProps> = ({
  initialData,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const isUpdateMode = !!initialData?.id;

  const defaultValues: ServiceCategoryFormValues = {
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    image: initialData?.image?.id ?? "",
  };

  const handleSubmit = async (values: ServiceCategoryFormValues) => {
    try {
      const url = "/api/services/categories";
      const method = isUpdateMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isUpdateMode ? { id: initialData?.id, ...values } : { ...values }
        ),
      });
      logger.info(res, "res");
      const data = await res.json();

      if (!res.ok) {
        logger.error(data?.error || "Failed to save category");
        return;
      }

      onSuccess?.(data);
      router.refresh();
      toast.success("Category saved successfully");
      setIsOpen(false);
    } catch (error) {
      logger.info(error, "error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
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
            {isUpdateMode ? "Edit Service Category" : "Create Service Category"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={serviceCategoryFields}
          onSubmit={handleSubmit}
          parentClassName=""
          defaultValues={defaultValues}
          formId="service-category-form"
          isUpdateMode={isUpdateMode}
          submitButton={
            <Button
              type="submit"
              //   className="col-span-2 mt-2"
              form="service-category-form"
            >
              {isUpdateMode ? "Update Category" : "Create Category"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};
