import DataTable from "@/components/data-table";
import CompanyForm from "@/components/forms/company-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import Image from "next/image";
import React, { Suspense } from "react";

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
        <CompanyForm />
      </div>
      <Suspense>
        <DataTable
          columns={[
            {
              label: "Image",
              key: "featured_image.url",
              render: (row: any) => (
                <Image
                  src={row?.featured_image?.url}
                  alt={row.featured_image?.altText}
                  width={100}
                  height={100}
                />
              ),
            },
          ]}
          data={companies}
          loading={false}
        />
      </Suspense>
    </div>
  );
};

export default MyCompanies;
