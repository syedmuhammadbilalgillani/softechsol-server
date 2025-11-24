import CategoryForm from "@/components/forms/category-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import { Category } from "@/lib/types";
import logger from "@/utils/logger";
import CategoryPage from "./category-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 100;

export const metadata: Metadata = {
  title: "Blog Categories Management - Softech Solutions",
  description: "Manage blog categories for organizing your blog content",
  robots: {
    index: false,
    follow: false,
  },
};

const CategoryPageComponent = async () => {
  const categories = await prisma.blogCategory.findMany({
    orderBy: {
      created_at: "asc",
    },
  });
  logger.info(categories, "categories");

  return (
    <>
      <div className="flex justify-between items-center gap-5">
        <div>
          <PageHeader heading="Category" paragraph="Manage your categories" />
        </div>
        <CategoryForm className="w-fit" />
      </div>

      <CategoryPage categories={categories as unknown as Category[]} />
    </>
  );
};

export default CategoryPageComponent;
