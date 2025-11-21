import JobCategoryForm from "@/components/forms/job-category-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import JobCategoriesPage from "./job-categories-page";
import { JobCategory } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 100;

const JobCategoriesPageComponent = async () => {
  const categories = await prisma.jobCategory.findMany({
    orderBy: {
      created_at: "asc",
    },
  });
  logger.info(categories, "job categories");

  return (
    <>
      <div className="flex justify-between items-center gap-5">
        <div>
          <PageHeader
            heading="Job Categories"
            paragraph="Manage your job categories"
          />
        </div>
        <JobCategoryForm className="w-fit" />
      </div>

      <JobCategoriesPage categories={categories as any} />
    </>
  );
};

export default JobCategoriesPageComponent;
