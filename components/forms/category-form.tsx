"use client";
import { cn } from "@/lib/utils";
import logger from "@/utils/logger";
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DynamicForm, FieldConfig } from "@/components/dynamic-form"; // Adjust import based on your project structure
import { Category } from "@/lib/types";

const CategoryForm = ({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form field configuration
  const formFields: FieldConfig[] = [
    {
      name: "name",
      label: "Category Name",
      type: "input",
      required: true,
      placeholder: "Enter category name",
    },
    {
      name: "slug",
      label: "Slug",
      type: "input",
      required: true,
      placeholder: "Enter category slug",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Enter category description",
    },
    {
      name: "color",
      label: "Category Color (e.g., #3B82F6)",
      type: "input",
      required: true,
      placeholder: "Enter category color",
    },
    {
      name: "icon",
      label: "Category Icon (e.g., 💻 or icon name)",
      type: "input",
      required: true,
      placeholder: "Enter category icon",
    },
    {
      name: "meta_title",
      label: "Meta Title (Optional)",
      type: "input",
      placeholder: "Enter meta title",
    },
    {
      name: "meta_description",
      label: "Meta Description (Optional)",
      type: "input",
      placeholder: "Enter meta description",
    },
    // Uncomment if parent category select is needed
    // {
    //   name: "parent_id",
    //   label: "Parent Category (Optional)",
    //   type: "select",
    //   options: categories.map((category) => ({
    //     label: category.name,
    //     value: category.category_id.toString(),
    //   })),
    //   placeholder: "Select a parent category",
    // },
  ];

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/category", data);

      if (response.status === 201) {
        toast.success("Category created successfully!");
        router.refresh();
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
      logger.debug(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "w-full")}>
          Add <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <DynamicForm
            fields={formFields}
            onSubmit={onSubmit}
            defaultValues={category}
            isUpdateMode={!!category}
            submitButton={<Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Create Category"}</Button>}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
