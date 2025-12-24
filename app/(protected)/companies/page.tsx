import CompaniesForm from "@/components/forms/companies-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { Suspense } from "react";
import CompanyPage from "./company-page";
import type { Metadata } from "next";


export const dynamic = "force-dynamic";
export const revalidate = 100

export const metadata: Metadata = {
  title: "Companies Management - Softech Solutions",
  description: "Manage company information and featured companies",
  robots: {
    index: false,
    follow: false,
  },
};

const MyCompanies = async () => {
  const companies = await prisma.myCompanies.findMany({
    include: {
      featured_image: true,
    },
  });
  logger.info(companies, "companies");
  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
        <PageHeader
          heading="My Companies"
          paragraph="Manage your companies"
        />
        <CompaniesForm />
      </div>
      <div className="mt-4">
        <Suspense>
          <CompanyPage companies={companies} />
        </Suspense>
      </div>
    </div>
  );
};

export default MyCompanies;
