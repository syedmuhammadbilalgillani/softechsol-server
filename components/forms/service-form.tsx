"use client";

import { DynamicForm } from "@/components/dynamic-form"; // adjust path if needed
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export interface ServiceFormValues {
  title: string;
  description: string;
  categoryId: string;
}

export interface ServiceInitialData extends ServiceFormValues {
  id: string;
}

interface CategoryFromParent {
  id: string;
  name: string;
}

interface ServiceFormProps {
  categories: CategoryFromParent[];
  initialData?: ServiceInitialData | null;
  onSuccess?: (data: any) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  categories,
  initialData,
  onSuccess,
}) => {
  const router = useRouter();
  const isUpdateMode = !!initialData?.id;
  const [isOpen, setIsOpen] = useState(false);
  const defaultValues: ServiceFormValues = {
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    categoryId: initialData?.categoryId ?? "",
  };

  const fields = [
    {
      name: "title",
      label: "Service Title",
      type: "input" as const,
      required: true,
      placeholder: "Enter service title",
      className: "col-span-2",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      required: true,
      placeholder: "Describe the service",
      className: "col-span-2",
    },
    {
      name: "categoryId",
      label: "Category",
      type: "select" as const,
      required: true,
      options: categories.map((c) => ({
        label: c.name,
        value: c.id,
      })),
      placeholder: "Select a category",
      className: "col-span-2",
    },
  ];

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      const url = "/api/services";
      const method = isUpdateMode ? "PUT" : "POST";
      logger.debug(values);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isUpdateMode ? { id: initialData?.id, ...values } : { ...values }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data?.error || "Failed to save service");
        return;
      }

      onSuccess?.(data);
      router.refresh();
      toast.success("Service saved successfully");
      setIsOpen(false);
    } catch (error) {
      logger.debug(error);
      toast.error("Failed to save service");
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
            {isUpdateMode ? "Edit Service" : "Add Service"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          formId="service-form"
          // parentClassName="grid grid-cols-2 gap-4"
          defaultValues={defaultValues}
          isUpdateMode={isUpdateMode}
          submitButton={
            <Button type="submit" form="service-form">
              {isUpdateMode ? "Update Service" : "Create Service"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};
