import { ServiceForm } from "@/components/forms/service-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import React from "react";
import ServiceComponent from "./service-component";

const ServicePage = async () => {
  const categories = await prisma.serviceCategory.findMany();
  const services = await prisma.service.findMany({
    include: {
      category: true,
    },
  });
  logger.info(services);
  return (
    <main className="p-5">
      <div className="flex justify-between items-center gap-2">
        <PageHeader
          heading="Services"
          paragraph="Our services are designed to help you achieve your goals."
        />
        <ServiceForm
          categories={categories.map((category) => ({
            id: category.id.toString(),
            name: category.name,
          }))}
        />
      </div>
      <ServiceComponent services={services} />
    </main>
  );
};

export default ServicePage;
