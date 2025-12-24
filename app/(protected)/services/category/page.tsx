import { ServiceCategoryForm } from "@/components/forms/service-category-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import ServiceCategoryComponent from "./service-category-component";

export const dynamic = "force-dynamic";

const ServiceCategoryPage = async () => {
  const categories = await prisma.serviceCategory.findMany({
    include: {
      image: true,
    },
  });
  logger.info(categories);
  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
        <PageHeader
          heading="Service Categories"
          paragraph="Manage your service categories here"
        />
        <ServiceCategoryForm />
      </div>
      <div className="mt-4">
        <ServiceCategoryComponent categories={categories} />
      </div>
    </div>
  );
};

export default ServiceCategoryPage;
