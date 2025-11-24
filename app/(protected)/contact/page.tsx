import { ContactUsForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import React from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Contact Forms - Softech Solutions",
  description: "View and manage contact form submissions from visitors",
  robots: {
    index: false,
    follow: false,
  },
};

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
