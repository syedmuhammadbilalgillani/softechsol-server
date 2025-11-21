"use client";
import DataTable from "@/components/data-table";
import JobForm from "@/components/forms/job-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface JobCategory {
  category_id: number;
  name: string;
}

interface Job {
  job_id: number;
  title: string;
  slug: string;
  description: string;
  location?: string | null;
  job_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  experience_level?: string | null;
  status: string;
  is_featured: boolean;
  publish_date?: string | null;
  expiry_date?: string | null;
  created_at: string;
  updated_at: string;
  categories?: { category: JobCategory }[];
}

const JobsPage = ({ jobs, categories }: { jobs: Job[]; categories: JobCategory[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (job_id: number) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/jobs/${job_id}`);
      if (res.status === 200) {
        toast.success("Job deleted successfully");
        router.refresh();
      } else {
        toast.error(res.data.message || "Failed to delete job");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to delete job";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <DataTable
        columns={[
          { label: "Title", key: "title" },
          {
            label: "Location",
            key: "location",
            render: (row: Job) => row.location || "N/A",
          },
          {
            label: "Job Type",
            key: "job_type",
            render: (row: Job) => row.job_type || "N/A",
          },
          {
            label: "Experience Level",
            key: "experience_level",
            render: (row: Job) => row.experience_level || "N/A",
          },
          {
            label: "Salary",
            key: "salary",
            render: (row: Job) => {
              if (row.salary_min && row.salary_max) {
                return `${row.salary_currency || "USD"} ${row.salary_min.toLocaleString()} - ${row.salary_max.toLocaleString()}`;
              } else if (row.salary_min) {
                return `${row.salary_currency || "USD"} ${row.salary_min.toLocaleString()}+`;
              }
              return "N/A";
            },
          },
          {
            label: "Status",
            key: "status",
            render: (row: Job) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  row.status === "PUBLISHED"
                    ? "bg-green-100 text-green-800"
                    : row.status === "DRAFT"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {row.status}
              </span>
            ),
          },
          {
            label: "Featured",
            key: "is_featured",
            render: (row: Job) => (
              <span
                className={`px-2 py-1 rounded text-xs ${
                  row.is_featured
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {row.is_featured ? "Yes" : "No"}
              </span>
            ),
          },
          {
            label: "Categories",
            key: "categories",
            render: (row: Job) =>
              row.categories && row.categories.length > 0
                ? row.categories.map((c) => c.category.name).join(", ")
                : "None",
          },
          {
            label: "Publish Date",
            key: "publish_date",
            render: (row: Job) =>
              row.publish_date ? formatDate(row.publish_date) : "N/A",
          },
          {
            label: "Created At",
            key: "created_at",
            render: (row: Job) => formatDate(row.created_at),
          },
          {
            label: "Actions",
            key: "actions",
            render: (row: Job) => (
              <div className="flex items-center gap-2">
                <JobForm job={row} categories={categories} />
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  size="sm"
                  onClick={async () => await handleDelete(row.job_id)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={jobs}
        loading={false}
      />
    </div>
  );
};

export default JobsPage;



