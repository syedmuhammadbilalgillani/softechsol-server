import JobForm from "@/components/forms/job-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import JobsPage from "./jobs-page";

export const dynamic = "force-dynamic";
export const revalidate = 100;

const JobsPageComponent = async () => {
  const [jobs, categories] = await Promise.all([
    prisma.job.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.jobCategory.findMany({
      orderBy: {
        created_at: "asc",
      },
    }),
  ]);

  logger.info(jobs, "jobs");
  logger.info(categories, "job categories");

  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
        <PageHeader heading="Jobs" paragraph="Manage your job postings" />
        <JobForm className="w-fit" categories={categories} />
      </div>
      <div className="mt-4">
        <JobsPage jobs={jobs as any} categories={categories as any} />
      </div>
    </div>
  );
};

export default JobsPageComponent;
