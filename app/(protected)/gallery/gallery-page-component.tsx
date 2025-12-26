"use client";
import { GalleryItem } from "@/app/generated/prisma/client";
import DataTable from "@/components/data-table";
import { GalleryForm } from "@/components/forms/gallery-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const GalleryPageComponent = ({
  galleryItems,
}: {
  galleryItems: GalleryItem[];
}) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/gallery/${id}`);
      toast.success("Gallery item deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete gallery item");
    }
  };
  return (
    <>
      <div>
        <DataTable
          data={galleryItems}
          columns={[
            {
              label: "Image",
              key: "image",
              render: (item: { url: string; altText: string }) => (
                <Image
                  src={item.url}
                  alt={item.altText}
                  width={100}
                  height={100}
                />
              ),
            },
            {
              label: "Alt Text",
              key: "altText",
              render: (item: { altText: string }) => item.altText,
            },
            {
              label: "Description",
              key: "description",
            },
            {
              label: "Actions",
              key: "actions",
              render: (item: { id: string; altText: string; url: string }) => (
                <div className="flex gap-2">
                  <GalleryForm
                    mode="update"
                    initialData={{
                      id: item.id,
                      altText: item.altText,
                      url: item.url, // Add URL here
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          loading={false}
        />
      </div>
    </>
  );
};

export default GalleryPageComponent;
