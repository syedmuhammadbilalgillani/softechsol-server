import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import GalleryPageComponent from "./gallery-page-component";
import type { Metadata } from "next";
import { GalleryForm } from "@/components/forms/gallery-form";

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
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
        <PageHeader heading="Gallery" paragraph="Manage your gallery images" />
        <GalleryForm mode="create" />
      </div>

      <div className="mt-4">
        <GalleryPageComponent galleryItems={galleryItems} />
      </div>
    </div>
  );
};

export default GalleryPage;
