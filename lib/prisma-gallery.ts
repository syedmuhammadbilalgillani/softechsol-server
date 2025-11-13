import prisma from "@/lib/prisma"; // import the Prisma client

export async function getGalleryItems() {
  return await prisma.galleryItem.findMany({
    select: {
      id: true,
      url: true,
      altText: true,
    },
  });
}
