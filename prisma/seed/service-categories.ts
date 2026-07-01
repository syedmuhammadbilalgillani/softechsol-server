import type { PrismaClient } from "@/app/generated/prisma/client";

export type ServiceCategorySeed = {
  name: string;
  slug: string;
  description: string;
  services: {
    title: string;
    description: string;
  }[];
};

export const serviceCategoriesSeed: ServiceCategorySeed[] = [
  {
    name: "Mobile Development",
    slug: "mobile-development",
    description:
      "Cross-platform mobile apps built with React Native and Flutter for iOS and Android.",
    services: [
      {
        title: "React Native Development",
        description:
          "Native-quality iOS and Android apps with a single React Native codebase — fast delivery, shared logic, and smooth user experiences.",
      },
      {
        title: "Flutter Development",
        description:
          "Beautiful, high-performance mobile apps with Flutter and Dart, from MVPs to production-ready products on both major platforms.",
      },
    ],
  },
  {
    name: "Web Development",
    slug: "web-development",
    description:
      "Full-stack web development covering modern frontends and scalable backends.",
    services: [
      {
        title: "Frontend Development",
        description:
          "Responsive, accessible interfaces with React, Next.js, and modern UI libraries — optimized for performance and SEO.",
      },
      {
        title: "Backend Development",
        description:
          "Robust APIs, databases, and server-side logic designed for security, scalability, and long-term maintainability.",
      },
    ],
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "User-centered design that turns ideas into intuitive, polished digital experiences.",
    services: [
      {
        title: "UI/UX Design",
        description:
          "Research, wireframes, prototypes, and visual design that align with your brand and help users accomplish their goals effortlessly.",
      },
    ],
  },
  {
    name: "Business Automation",
    slug: "business-automation",
    description:
      "Streamline operations and connect your tools with workflow automation powered by n8n.",
    services: [
      {
        title: "n8n Workflow Automation",
        description:
          "Custom n8n workflows that automate repetitive tasks, integrate SaaS tools, and keep your business running without manual bottlenecks.",
      },
    ],
  },
  {
    name: "Agentic AI",
    slug: "agentic-ai",
    description:
      "Intelligent agents that plan, act, and integrate with your systems to automate complex work.",
    services: [
      {
        title: "Agentic AI Solutions",
        description:
          "AI agents tailored to your workflows — from customer support and data processing to multi-step task automation with human oversight.",
      },
    ],
  },
  {
    name: "Deployment & Maintenance",
    slug: "deployment-and-maintenance",
    description:
      "Reliable hosting, deployments, and ongoing care for applications on Ubuntu servers.",
    services: [
      {
        title: "Ubuntu Server Deployment & Maintenance",
        description:
          "Server setup, CI/CD deployments, monitoring, security patches, and proactive maintenance so your apps stay online and performant.",
      },
    ],
  },
];

export async function seedServiceCategories(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"ServiceCategory"', 'id'), COALESCE((SELECT MAX(id) FROM "ServiceCategory"), 0) + 1, false)`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Service"', 'id'), COALESCE((SELECT MAX(id) FROM "Service"), 0) + 1, false)`
  );

  const results = {
    categoriesCreated: 0,
    categoriesUpdated: 0,
    servicesCreated: 0,
    servicesUpdated: 0,
  };

  for (const category of serviceCategoriesSeed) {
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { slug: category.slug },
    });

    const savedCategory = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      update: {
        name: category.name,
        description: category.description,
      },
    });

    if (existingCategory) {
      results.categoriesUpdated++;
    } else {
      results.categoriesCreated++;
    }

    for (const service of category.services) {
      const existingService = await prisma.service.findFirst({
        where: {
          title: service.title,
          categoryId: savedCategory.id,
        },
      });

      if (existingService) {
        await prisma.service.update({
          where: { id: existingService.id },
          data: { description: service.description },
        });
        results.servicesUpdated++;
      } else {
        await prisma.service.create({
          data: {
            title: service.title,
            description: service.description,
            categoryId: savedCategory.id,
          },
        });
        results.servicesCreated++;
      }
    }
  }

  return results;
}
