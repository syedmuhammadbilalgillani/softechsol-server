import prisma from "@/lib/prisma";
import { revalidateTag } from "@/lib/revalidate";

// SEO Keywords (to optimize for search engines)
const seoKeywords = {
  webAndMobileApp:
    "custom web app development, mobile app development, responsive design, app development services",
  aiAndMl:
    "artificial intelligence solutions, machine learning solutions, AI for business, machine learning optimization",
  cloudServices:
    "cloud infrastructure, cloud services, cloud solutions, cloud migration, IT cloud services",
  fullStackDev:
    "full-stack development, backend and frontend development, full-stack web development, web system integration",
  databaseDesign:
    "database design, database management, database optimization, scalable databases, database security",
  ecommerceSolutions:
    "e-commerce solutions, online store development, e-commerce platform, online business platforms, e-commerce website",
  consultancyIntegration:
    "IT consultancy, system integration services, IT consulting, business IT solutions, system integration",
  digitalMarketing:
    "digital marketing, SEO optimization, social media marketing, online branding, digital advertising",
  softwareLicensing:
    "software licensing, software products for businesses, enterprise software, software solutions",
  alliedServices:
    "business IT services, custom IT solutions, professional IT services, tech consultancy",
};

// Categories and Services Data
const categories = [
  {
    name: "Web and Mobile App Development",
    slug: "web-and-mobile-app-development",
  },
  {
    name: "Artificial Intelligence and Machine Learning Solutions",
    slug: "ai-and-ml-solutions",
  },
  {
    name: "IT Infrastructure and Cloud Services",
    slug: "it-infrastructure-and-cloud-services",
  },
  {
    name: "Backend and Frontend Systems Development",
    slug: "backend-and-frontend-development",
  },
  {
    name: "Database Design and Management",
    slug: "database-design-and-management",
  },
  {
    name: "Online Business Platforms and E-commerce Solutions",
    slug: "online-business-platforms",
  },
  {
    name: "IT Consultancy, System Integration, and Maintenance",
    slug: "it-consultancy-and-maintenance",
  },
  {
    name: "Digital Marketing and Online Branding Services",
    slug: "digital-marketing-and-branding",
  },
  {
    name: "Sale and Licensing of Software Products",
    slug: "sale-and-licensing-of-software",
  },
  {
    name: "Any Other Allied or Incidental Business",
    slug: "other-business-services",
  },
];

const services = [
  {
    title: "Custom Web and Mobile App Development",
    description: `We provide custom web and mobile app development services tailored to your business needs. Our services include ${seoKeywords.webAndMobileApp}`,
    categorySlug: "web-and-mobile-app-development",
  },
  {
    title: "AI Solutions for Business Optimization",
    description: `Leverage artificial intelligence and machine learning to optimize business processes and decision-making. We provide cutting-edge solutions using ${seoKeywords.aiAndMl}`,
    categorySlug: "ai-and-ml-solutions",
  },
  {
    title: "Cloud Infrastructure Solutions",
    description: `Secure and scalable IT infrastructure and cloud services to power your digital transformation. We specialize in ${seoKeywords.cloudServices}`,
    categorySlug: "it-infrastructure-and-cloud-services",
  },
  {
    title: "Full-Stack Systems Development",
    description: `End-to-end development for both front-end and back-end systems ensuring seamless integration and performance. We offer ${seoKeywords.fullStackDev}`,
    categorySlug: "backend-and-frontend-development",
  },
  {
    title: "Custom Database Design",
    description: `Design and management of databases optimized for performance, security, and scalability. Our expertise includes ${seoKeywords.databaseDesign}`,
    categorySlug: "database-design-and-management",
  },
  {
    title: "E-commerce Platform Development",
    description: `Develop feature-rich online platforms and e-commerce solutions to grow your business. We build top-tier ${seoKeywords.ecommerceSolutions}`,
    categorySlug: "online-business-platforms",
  },
  {
    title: "IT Consultancy and Integration",
    description: `Expert IT consultancy and system integration to ensure your systems work together seamlessly. Get professional ${seoKeywords.consultancyIntegration}`,
    categorySlug: "it-consultancy-and-maintenance",
  },
  {
    title: "Digital Marketing and Branding",
    description: `Comprehensive digital marketing strategies to elevate your online presence and brand awareness. Our services include ${seoKeywords.digitalMarketing}`,
    categorySlug: "digital-marketing-and-branding",
  },
  {
    title: "Software Product Sales and Licensing",
    description: `Licensing and sales of software products to boost productivity and efficiency for businesses. We offer the best in ${seoKeywords.softwareLicensing}`,
    categorySlug: "sale-and-licensing-of-software",
  },
  {
    title: "Comprehensive IT Services",
    description: `Other specialized services tailored to your unique business needs and challenges. From custom IT solutions to ${seoKeywords.alliedServices}`,
    categorySlug: "other-business-services",
  },
];

async function seedData() {
  // Create Categories
  for (const category of categories) {
    const createdCategory = await prisma.serviceCategory.create({
      data: category,
    });

    // Create Services for each category
    const categoryServices = services.filter(
      (service) => service.categorySlug === createdCategory.slug
    );

    for (const service of categoryServices) {
      await prisma.service.create({
        data: {
          title: service.title,
          description: service.description,
          categoryId: createdCategory.id, // Link service to the category
        },
      });
    }
  }
}

export async function POST(req: Request) {
  try {
    await seedData();
    await revalidateTag("categories-with-services");
    return new Response("Data seeded successfully", { status: 200 });
  } catch (error) {
    console.error("Error seeding data:", error);
    return new Response("Error seeding data", { status: 500 });
  }
}
