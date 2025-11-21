"use client";
import { cn } from "@/lib/utils";
import logger from "@/utils/logger";
import axios from "axios";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DynamicForm, FieldConfig } from "@/components/dynamic-form";

interface JobCategory {
  category_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const JobCategoryForm = ({
  category,
  className,
}: {
  category?: JobCategory;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form field configuration - only name field for job categories
  const formFields: FieldConfig[] = [
    {
      name: "name",
      label: "Category Name",
      type: "input",
      required: true,
      placeholder: "Enter job category name",
    },
  ];

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const response = category
        ? await axios.put(`/api/job-categories/${category.category_id}`, data)
        : await axios.post("/api/job-categories", data);

      if (response.status === 201 || response.status === 200) {
        toast.success(
          category
            ? "Job category updated successfully!"
            : "Job category created successfully!"
        );
        router.refresh();
        setOpen(false);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      toast.error(errorMessage);
      logger.debug(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "")}>
          {category ? (
            <PencilIcon className="w-4 h-4" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
          {category ? "" : "Add"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Update Job Category" : "Create Job Category"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={formFields}
          onSubmit={onSubmit}
          defaultValues={category}
          formId="job-category"
          isUpdateMode={!!category}
          submitButton={
            <Button type="submit" form="job-category" disabled={loading}>
              {loading
                ? "Submitting..."
                : category
                ? "Update Category"
                : "Create Category"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default JobCategoryForm;
