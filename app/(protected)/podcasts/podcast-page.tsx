"use client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import PodcastsForm from "@/components/forms/podcasts-form";
import { Badge } from "@/components/ui/badge";

const PodcastPage = ({ podcasts }: { podcasts: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this podcast?")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/podcasts`, {
        data: { id },
      });
      if (res.status === 200) {
        toast.success("Podcast deleted successfully");
        router.refresh();
      } else {
        toast.error(res.data.message || "Failed to delete podcast");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to delete podcast"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500";
      case "DRAFT":
        return "bg-yellow-500";
      case "ARCHIVED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DataTable
      columns={[
        {
          label: "Image",
          key: "image.url",
          render: (row: any) => (
            <div className="w-20 h-20 relative">
              {row?.image?.url ? (
                <Image
                  src={row.image.url}
                  alt={row.image?.altText || row.title}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          ),
        },
        {
          label: "Title",
          key: "title",
          render: (row: any) => (
            <div className="max-w-xs">
              <p className="font-medium truncate">{row.title}</p>
              {row.description && (
                <p className="text-sm text-gray-500 truncate">
                  {row.description}
                </p>
              )}
            </div>
          ),
        },
        {
          label: "URL",
          key: "url",
          render: (row: any) => (
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline truncate max-w-xs block"
            >
              {row.url}
            </a>
          ),
        },
        {
          label: "Status",
          key: "status",
          render: (row: any) => (
            <Badge
              className={`${getStatusColor(row.status)} text-white`}
            >
              {row.status}
            </Badge>
          ),
        },
        {
          label: "Featured",
          key: "is_featured",
          render: (row: any) => (
            <Badge variant={row.is_featured ? "default" : "outline"}>
              {row.is_featured ? "Yes" : "No"}
            </Badge>
          ),
        },
        {
          label: "Publish Date",
          key: "publish_date",
          render: (row: any) =>
            row.publish_date
              ? new Date(row.publish_date).toLocaleDateString()
              : "-",
        },
        {
          label: "Actions",
          key: "actions",
          render: (row: any) => (
            <div className="flex gap-2">
              <PodcastsForm podcast={row} isUpdateMode={true} />
              <Button
                onClick={() => handleDelete(row.id)}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ),
        },
      ]}
      data={podcasts}
      loading={false}
    />
  );
};

export default PodcastPage;
