import DataTable from "@/components/data-table";
// import { GalleryForm } from "@/components/gallery-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import Image from "next/image";

const GalleryPage = async () => {
  const galleryItems = await prisma.galleryItem.findMany();
  logger.debug(galleryItems, "galleryItems");

  return (
    <>
      <PageHeader heading="Gallery" paragraph="Manage your gallery images" />
      {/* <GalleryForm mode="create" /> */}
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
              render: (item: {
                id: string;
                altText: string;
                publicId: string;
                description: string | null;
                url: string;
              }) => (
                <div>
                  {/* <GalleryForm
                    mode="update"
                    initialData={{
                      altText: item.altText,
                      publicId: item.publicId,
                      description: item.description ?? "",
                      url: item.url,
                      id: item.id,
                    }}
                  /> */}
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

export default GalleryPage;
