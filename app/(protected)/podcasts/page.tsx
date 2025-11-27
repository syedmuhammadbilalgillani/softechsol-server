import PodcastsForm from "@/components/forms/podcasts-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { Suspense } from "react";
import PodcastPage from "./podcast-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Podcasts Management - Softech Solutions",
  description: "Manage podcast information and featured podcasts",
  robots: {
    index: false,
    follow: false,
  },
};

const Podcasts = async () => {
  const podcasts = await prisma.podcast.findMany({
    include: {
      image: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  logger.info(podcasts, "podcasts");
  return (
    <div>
      <div className="flex justify-between items-center gap-5">
        <div>
          <PageHeader
            heading="Podcasts"
            paragraph="Manage your podcasts"
          />
        </div>
        <PodcastsForm />
      </div>
      <Suspense>
        <PodcastPage podcasts={podcasts} />
      </Suspense>
    </div>
  );
};

export default Podcasts;
