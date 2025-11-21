"use client";
import { cn } from "@/lib/utils";
import logger from "@/utils/logger";
import axios from "axios";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
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
}

interface Job {
  job_id: number;
  title: string;
  slug: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  location?: string | null;
  job_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  experience_level?: string | null;
  status: string;
  is_featured: boolean;
  application_url?: string | null;
  application_email?: string | null;
  publish_date?: string | null;
  expiry_date?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  categories?: { category: JobCategory }[];
}

const JobForm = ({
  job,
  className,
  categories = [],
}: {
  job?: Job;
  className?: string;
  categories?: JobCategory[];
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>(categories);

  // Fetch categories if not provided
  useEffect(() => {
    if (jobCategories.length === 0) {
      axios
        .get("/api/job-categories")
        .then((res) => {
          setJobCategories(res.data);
        })
        .catch((err) => {
          logger.error("Error fetching job categories:", err);
        });
    }
  }, [jobCategories.length]);

  // Form field configuration
  const formFields: FieldConfig[] = [
    {
      name: "title",
      label: "Job Title",
      type: "input",
      required: true,
      placeholder: "Enter job title",
    },
    {
      name: "slug",
      label: "Slug",
      type: "input",
      required: true,
      placeholder: "Enter job slug",
      InputType: "slug",
    },
    {
      name: "description",
      label: "Description",
      type: "joditEditor",
      required: true,
      placeholder: "Enter job description",
    },
    {
      name: "requirements",
      label: "Requirements",
      type: "joditEditor",
      placeholder: "Enter job requirements",
    },
    {
      name: "responsibilities",
      label: "Responsibilities",
      type: "joditEditor",
      placeholder: "Enter job responsibilities",
    },
    {
      name: "location",
      label: "Location",
      type: "input",
      placeholder: "e.g., Remote, New York, NY, Hybrid",
    },
    {
      name: "job_type",
      label: "Job Type",
      type: "select",
      options: [
        { label: "Full-time", value: "Full-time" },
        { label: "Part-time", value: "Part-time" },
        { label: "Contract", value: "Contract" },
        { label: "Internship", value: "Internship" },
        { label: "Freelance", value: "Freelance" },
      ],
      placeholder: "Select job type",
    },
    {
      name: "experience_level",
      label: "Experience Level",
      type: "select",
      options: [
        { label: "Entry", value: "Entry" },
        { label: "Mid", value: "Mid" },
        { label: "Senior", value: "Senior" },
        { label: "Executive", value: "Executive" },
      ],
      placeholder: "Select experience level",
    },
    {
      name: "salary_min",
      label: "Minimum Salary",
      type: "input",
      InputType: "number",
      placeholder: "Enter minimum salary",
    },
    {
      name: "salary_max",
      label: "Maximum Salary",
      type: "input",
      InputType: "number",
      placeholder: "Enter maximum salary",
    },
    {
      name: "salary_currency",
      label: "Salary Currency",
      type: "select",
      options: [
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "GBP", value: "GBP" },
        { label: "PKR", value: "PKR" },
      ],
      placeholder: "Select currency",
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
    },
    {
      name: "is_featured",
      label: "Featured Job",
      type: "switch",
    },
    {
      name: "application_url",
      label: "Application URL",
      type: "input",
      placeholder: "Enter external application URL",
    },
    {
      name: "application_email",
      label: "Application Email",
      type: "input",
      InputType: "email",
      placeholder: "Enter application email",
    },
    {
      name: "publish_date",
      label: "Publish Date",
      type: "input",
      InputType: "datetime-local",
      placeholder: "Select publish date",
    },
    {
      name: "expiry_date",
      label: "Expiry Date",
      type: "input",
      InputType: "datetime-local",
      placeholder: "Select expiry date",
    },
    {
      name: "category_ids",
      label: "Job Categories",
      type: "multiSelect",
      options: jobCategories.map((cat) => ({
        label: cat.name,
        value: cat.category_id.toString(),
      })),
      placeholder: "Select job categories",
      maxCount: 10,
    },
    {
      name: "meta_title",
      label: "Meta Title (SEO)",
      type: "input",
      placeholder: "Enter meta title for SEO",
    },
    {
      name: "meta_description",
      label: "Meta Description (SEO)",
      type: "textarea",
      placeholder: "Enter meta description for SEO",
    },
    {
      name: "meta_keywords",
      label: "Meta Keywords (SEO)",
      type: "input",
      InputType: "comma",
      placeholder: "Enter keywords separated by commas",
    },
  ];

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Convert category_ids from string array to number array
      const categoryIds = data.category_ids
        ? data.category_ids.map((id: string) => parseInt(id))
        : [];

      const payload = {
        ...data,
        category_ids: categoryIds,
        // Convert dates to ISO string if they exist
        publish_date: data.publish_date ? new Date(data.publish_date).toISOString() : null,
        expiry_date: data.expiry_date ? new Date(data.expiry_date).toISOString() : null,
      };

      const response = job
        ? await axios.put(`/api/jobs/${job.job_id}`, payload)
        : await axios.post("/api/jobs", payload);

      if (response.status === 201 || response.status === 200) {
        toast.success(
          job ? "Job updated successfully!" : "Job created successfully!"
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

  // Prepare default values for update mode
  const defaultValues = job
    ? {
        ...job,
        category_ids: job.categories
          ? job.categories.map((cat) => cat.category.category_id.toString())
          : [],
        publish_date: job.publish_date
          ? new Date(job.publish_date).toISOString().slice(0, 16)
          : "",
        expiry_date: job.expiry_date
          ? new Date(job.expiry_date).toISOString().slice(0, 16)
          : "",
      }
    : {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "")}>
          {job ? (
            <PencilIcon className="w-4 h-4" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
          {job ? "" : "Add Job"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {job ? "Update Job" : "Create Job"}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={formFields}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          formId="job-form"
          isUpdateMode={!!job}
          submitButton={
            <Button type="submit" form="job-form" disabled={loading}>
              {loading
                ? "Submitting..."
                : job
                ? "Update Job"
                : "Create Job"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
