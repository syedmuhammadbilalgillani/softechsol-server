import "dotenv/config";
import prisma from "@/lib/prisma";
import { seedServiceCategories } from "@/prisma/seed/service-categories";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  console.log("Seeding service categories and services...");

  const results = await seedServiceCategories(prisma);

  console.log("Seed complete:");
  console.log(`  Categories created: ${results.categoriesCreated}`);
  console.log(`  Categories updated: ${results.categoriesUpdated}`);
  console.log(`  Services created:   ${results.servicesCreated}`);
  console.log(`  Services updated:   ${results.servicesUpdated}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
