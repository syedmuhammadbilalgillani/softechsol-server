import prisma from "@/lib/prisma";
import { revalidateTag } from "@/lib/revalidate";
import { seedServiceCategories } from "@/prisma/seed/service-categories";

export async function POST(req: Request) {
  try {
    await seedServiceCategories(prisma);
    await revalidateTag("categories-with-services");
    return new Response("Data seeded successfully", { status: 200 });
  } catch (error) {
    console.error("Error seeding data:", error);
    return new Response("Error seeding data", { status: 500 });
  }
}
