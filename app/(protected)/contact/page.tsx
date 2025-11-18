import { ContactUsForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import React from "react";

const ContactPage = async () => {
  const servicesData = await prisma.contactUs.findMany({
    include: {
      service: true,
    },
  });
  logger.debug(servicesData, "service data");
  const services = await prisma.service.findMany({
    select: {
      id: true,
      title: true,
    },
  });
  logger.debug(services, "services");
  return (
    <main>
      <div>
        <PageHeader heading="Contact Forms" paragraph="" />
        <ContactUsForm services={[]} />
      </div>
    </main>
  );
};

export default ContactPage;
