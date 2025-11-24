import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import GalleryPageComponent from "./gallery-page-component";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Gallery Management - Softech Solutions",
  description: "Manage gallery images and media for Softech Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

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
