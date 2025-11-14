import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import GalleryPageComponent from "./gallery-page-component";
export const dynamic = "force-dynamic";
export const revalidate = 100
const GalleryPage = async () => {
  const galleryItems = await prisma.galleryItem.findMany();
  logger.debug(galleryItems, "galleryItems");

  return (
    <>
      <PageHeader heading="Gallery" paragraph="Manage your gallery images" />
      <div className="space-y-2">
        <GalleryPageComponent galleryItems={galleryItems} />
      </div>
    </>
  );
};

export default GalleryPage;
