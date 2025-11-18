import { ServiceCategoryForm } from "@/components/forms/service-category-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import React from "react";
import ServiceCategoryComponent from "./service-category-component";

export const dynamic = "force-dynamic";

const ServiceCategoryPage = async () => {
  const categories = await prisma.serviceCategory.findMany();
  logger.info(categories);
  return (
    <>
      <main>
        <div className="flex justify-between items-center">
          <PageHeader
            heading="Service Categories"
            paragraph="Manage your service categories here"
          />
          <ServiceCategoryForm />
        </div>
        <ServiceCategoryComponent categories={categories} />
      </main>
    </>
  );
};

export default ServiceCategoryPage;
