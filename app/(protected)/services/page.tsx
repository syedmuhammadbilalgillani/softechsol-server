import { ServiceForm } from "@/components/forms/service-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import ServiceComponent from "./service-component";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Services Management - Softech Solutions",
  description: "Manage services and service categories offered by Softech Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

const ServicePage = async () => {
  const categories = await prisma.serviceCategory.findMany();
  const services = await prisma.service.findMany({
    include: {
      category: true,
      image: true,
    },
  });
  logger.info(services);
  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
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
      <div className="mt-4">
        <ServiceComponent services={services} />
      </div>
    </div>
  );
};

export default ServicePage;
