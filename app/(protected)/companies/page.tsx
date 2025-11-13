import DataTable from "@/components/data-table";
import CompaniesForm from "@/components/forms/companies-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import Image from "next/image";
import { Suspense } from "react";
import CompanyPage from "./company-page";

const MyCompanies = async () => {
  const companies = await prisma.myCompanies.findMany({
    include: {
      featured_image: true,
    },
  });
  logger.info(companies, "companies");
  return (
    <div>
      <div className="flex justify-between items-center gap-5">
        <div>
          <PageHeader
            heading="My Companies"
            paragraph="Manage your companies"
          />
        </div>
        <CompaniesForm />
      </div>
      <Suspense>
        <CompanyPage companies={companies} />
      </Suspense>
    </div>
  );
};

export default MyCompanies;
