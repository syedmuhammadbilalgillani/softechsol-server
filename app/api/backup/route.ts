import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import logger from "@/utils/logger";

// Create a separate Prisma client without Accelerate for backup operations
// Accelerate has limitations with long-running transactions
// Use the same DATABASE_URL from environment to ensure same connection
const getPrismaBackup = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: "postgres://postgres:daskhkasdhkjsay36248768687476dsbgbveu65&8@72.61.146.192:5432/softechsol_db?schema=public",
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

// Export endpoint - GET /api/backup
export async function GET(request: Request) {
  const startTime = Date.now();
  logger.info("[Backup API] Export request received");

  // Create client instance for this request
  const prismaBackup = getPrismaBackup();

  try {
    logger.info("[Backup API] Starting database export");

    // Export all data in dependency order
    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      exportedBy: "system",
      data: {
        // 1. Gallery Items (no dependencies)
        galleryItems: await prismaBackup.galleryItem.findMany({
          orderBy: { createdAt: "asc" },
        }),

        // 2. Users (depends on GalleryItem for avatar)
        users: await prismaBackup.user.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 3. Blog Categories (self-referential, but we'll handle it)
        blogCategories: await prismaBackup.blogCategory.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 4. Service Categories (depends on GalleryItem)
        serviceCategories: await prismaBackup.serviceCategory.findMany({
          orderBy: { createdAt: "asc" },
        }),

        // 5. Services (depends on ServiceCategory and GalleryItem)
        services: await prismaBackup.service.findMany({
          orderBy: { createdAt: "asc" },
        }),

        // 6. Teams (depends on GalleryItem)
        teams: await prismaBackup.team.findMany({
          orderBy: { createdAt: "asc" },
        }),

        // 7. Podcasts (depends on GalleryItem)
        podcasts: await prismaBackup.podcast.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 8. Companies (depends on GalleryItem)
        companies: await prismaBackup.myCompanies.findMany({
          orderBy: { company_id: "asc" },
        }),

        // 9. Projects (no dependencies)
        projects: await prismaBackup.project.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 10. Project Images (depends on Project and GalleryItem)
        projectImages: await prismaBackup.projectImage.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 11. Blogs (depends on User, GalleryItem, BlogCategory)
        blogs: await prismaBackup.blog.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 12. Blog Category Relations (depends on Blog and BlogCategory)
        blogCategoryRelations: await prismaBackup.blogCategoryRelation.findMany(
          {
            orderBy: { assigned_at: "asc" },
          }
        ),

        // 13. Job Categories (no dependencies)
        jobCategories: await prismaBackup.jobCategory.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 14. Jobs (no dependencies)
        jobs: await prismaBackup.job.findMany({
          orderBy: { created_at: "asc" },
        }),

        // 15. Job Category Relations (depends on Job and JobCategory)
        jobCategoryRelations: await prismaBackup.jobCategoryRelation.findMany({
          orderBy: { assigned_at: "asc" },
        }),

        // 16. Contact Us (depends on Service)
        contactUs: await prismaBackup.contactUs.findMany({
          orderBy: { submitted_at: "asc" },
        }),
      },
    };

    const recordCounts = {
      galleryItems: backupData.data.galleryItems.length,
      users: backupData.data.users.length,
      blogCategories: backupData.data.blogCategories.length,
      serviceCategories: backupData.data.serviceCategories.length,
      services: backupData.data.services.length,
      teams: backupData.data.teams.length,
      podcasts: backupData.data.podcasts.length,
      companies: backupData.data.companies.length,
      projects: backupData.data.projects.length,
      projectImages: backupData.data.projectImages.length,
      blogs: backupData.data.blogs.length,
      blogCategoryRelations: backupData.data.blogCategoryRelations.length,
      jobCategories: backupData.data.jobCategories.length,
      jobs: backupData.data.jobs.length,
      jobCategoryRelations: backupData.data.jobCategoryRelations.length,
      contactUs: backupData.data.contactUs.length,
    };

    const totalRecords = Object.values(recordCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    const duration = Date.now() - startTime;

    logger.info("[Backup API] Export completed successfully", {
      recordCounts,
      totalRecords,
      duration: `${duration}ms`,
    });

    // Return as JSON file download
    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="db-backup-${
          new Date().toISOString().split("T")[0]
        }.json"`,
      },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error("[Backup API] Export failed", {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        error: "Failed to export database",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    // Always disconnect the client
    await prismaBackup.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

// Import endpoint - POST /api/backup
export async function POST(request: Request) {
  const startTime = Date.now();
  logger.info("[Backup API] Import request received");

  // Create client instance for this request
  const prismaBackup = getPrismaBackup();

  try {
    // Parse request body
    let backupData;
    try {
      const body = await request.json();
      backupData = body;
      logger.info("[Backup API] Backup data received", {
        version: backupData.version,
        exportedAt: backupData.exportedAt,
      });
    } catch (parseError: any) {
      logger.error("[Backup API] Failed to parse request body", {
        error: parseError.message,
      });
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate backup data structure
    if (!backupData || !backupData.data) {
      logger.error("[Backup API] Invalid backup data structure");
      return NextResponse.json(
        { error: "Invalid backup data format" },
        { status: 400 }
      );
    }

    logger.info("[Backup API] Starting database import", {
      version: backupData.version,
      exportedAt: backupData.exportedAt,
    });

    // Use transaction with increased timeout and without Accelerate
    const result = await prismaBackup.$transaction(
      async (tx) => {
        const importResults = {
          created: {} as Record<string, number>,
          errors: [] as string[],
        };

        try {
          // Helper function to batch create items
          const batchCreate = async <T extends { id: any }>(
            model: any,
            items: T[],
            transformFn: (item: T) => any,
            batchSize: number = 100
          ) => {
            for (let i = 0; i < items.length; i += batchSize) {
              const batch = items.slice(i, i + batchSize);
              for (const item of batch) {
                try {
                  await model.create({
                    data: transformFn(item),
                  });
                } catch (itemError: any) {
                  logger.warn(`[Backup API] Failed to import item`, {
                    id: item.id,
                    error: itemError.message,
                  });
                  importResults.errors.push(
                    `${model.name} ${item.id}: ${itemError.message}`
                  );
                }
              }
            }
          };

          // 1. Import Gallery Items
          if (backupData.data.galleryItems?.length > 0) {
            logger.info("[Backup API] Importing Gallery Items", {
              count: backupData.data.galleryItems.length,
            });
            try {
              await tx.galleryItem.deleteMany({});

              for (const item of backupData.data.galleryItems) {
                try {
                  await tx.galleryItem.create({
                    data: {
                      id: item.id,
                      url: item.url,
                      altText: item.altText,
                      description: item.description,
                      publicId: item.publicId,
                      createdAt: new Date(item.createdAt),
                      updatedAt: new Date(item.updatedAt),
                    },
                  });
                } catch (itemError: any) {
                  logger.warn("[Backup API] Failed to import gallery item", {
                    id: item.id,
                    error: itemError.message,
                  });
                  importResults.errors.push(
                    `GalleryItem ${item.id}: ${itemError.message}`
                  );
                }
              }
              importResults.created.galleryItems =
                backupData.data.galleryItems.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Gallery Items", error);
              throw new Error(
                `Failed to import Gallery Items: ${error.message}`
              );
            }
          }

          // 2. Import Users
          if (backupData.data.users?.length > 0) {
            logger.info("[Backup API] Importing Users", {
              count: backupData.data.users.length,
            });
            try {
              await tx.user.deleteMany({});

              // Reset sequence for auto-increment
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "User_user_id_seq" RESTART WITH 1`
              );

              for (const user of backupData.data.users) {
                try {
                  await tx.user.create({
                    data: {
                      user_id: user.user_id,
                      username: user.username,
                      email: user.email,
                      password: user.password,
                      role: user.role,
                      first_name: user.first_name,
                      last_name: user.last_name,
                      avatar_id: user.avatar_id,
                      is_active: user.is_active,
                      last_login: user.last_login
                        ? new Date(user.last_login)
                        : null,
                      created_at: new Date(user.created_at),
                      updated_at: new Date(user.updated_at),
                    },
                  });
                } catch (userError: any) {
                  logger.warn("[Backup API] Failed to import user", {
                    id: user.user_id,
                    error: userError.message,
                  });
                  importResults.errors.push(
                    `User ${user.user_id}: ${userError.message}`
                  );
                }
              }
              importResults.created.users = backupData.data.users.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Users", error);
              throw new Error(`Failed to import Users: ${error.message}`);
            }
          }

          // 3. Import Blog Categories
          if (backupData.data.blogCategories?.length > 0) {
            logger.info("[Backup API] Importing Blog Categories", {
              count: backupData.data.blogCategories.length,
            });
            try {
              await tx.blogCategory.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "BlogCategory_category_id_seq" RESTART WITH 1`
              );

              for (const category of backupData.data.blogCategories) {
                try {
                  await tx.blogCategory.create({
                    data: {
                      category_id: category.category_id,
                      name: category.name,
                      slug: category.slug,
                      description: category.description,
                      color: category.color,
                      icon: category.icon,
                      parent_id: category.parent_id,
                      is_active: category.is_active,
                      created_at: new Date(category.created_at),
                      updated_at: new Date(category.updated_at),
                      meta_title: category.meta_title,
                      meta_description: category.meta_description,
                    },
                  });
                } catch (catError: any) {
                  logger.warn("[Backup API] Failed to import blog category", {
                    id: category.category_id,
                    error: catError.message,
                  });
                  importResults.errors.push(
                    `BlogCategory ${category.category_id}: ${catError.message}`
                  );
                }
              }
              importResults.created.blogCategories =
                backupData.data.blogCategories.length;
            } catch (error: any) {
              logger.error(
                "[Backup API] Error importing Blog Categories",
                error
              );
              throw new Error(
                `Failed to import Blog Categories: ${error.message}`
              );
            }
          }

          // 4. Import Service Categories
          if (backupData.data.serviceCategories?.length > 0) {
            logger.info("[Backup API] Importing Service Categories", {
              count: backupData.data.serviceCategories.length,
            });
            try {
              await tx.serviceCategory.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "ServiceCategory_id_seq" RESTART WITH 1`
              );

              for (const category of backupData.data.serviceCategories) {
                try {
                  await tx.serviceCategory.create({
                    data: {
                      id: category.id,
                      name: category.name,
                      slug: category.slug,
                      image_id: category.image_id,
                      createdAt: new Date(category.createdAt),
                      updatedAt: new Date(category.updatedAt),
                    },
                  });
                } catch (catError: any) {
                  logger.warn(
                    "[Backup API] Failed to import service category",
                    {
                      id: category.id,
                      error: catError.message,
                    }
                  );
                  importResults.errors.push(
                    `ServiceCategory ${category.id}: ${catError.message}`
                  );
                }
              }
              importResults.created.serviceCategories =
                backupData.data.serviceCategories.length;
            } catch (error: any) {
              logger.error(
                "[Backup API] Error importing Service Categories",
                error
              );
              throw new Error(
                `Failed to import Service Categories: ${error.message}`
              );
            }
          }

          // 5. Import Services
          if (backupData.data.services?.length > 0) {
            logger.info("[Backup API] Importing Services", {
              count: backupData.data.services.length,
            });
            try {
              await tx.service.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "Service_id_seq" RESTART WITH 1`
              );

              for (const service of backupData.data.services) {
                try {
                  await tx.service.create({
                    data: {
                      id: service.id,
                      title: service.title,
                      description: service.description,
                      image_id: service.image_id,
                      categoryId: service.categoryId,
                      createdAt: new Date(service.createdAt),
                      updatedAt: new Date(service.updatedAt),
                    },
                  });
                } catch (serviceError: any) {
                  logger.warn("[Backup API] Failed to import service", {
                    id: service.id,
                    error: serviceError.message,
                  });
                  importResults.errors.push(
                    `Service ${service.id}: ${serviceError.message}`
                  );
                }
              }
              importResults.created.services = backupData.data.services.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Services", error);
              throw new Error(`Failed to import Services: ${error.message}`);
            }
          }

          // 6. Import Teams
          if (backupData.data.teams?.length > 0) {
            logger.info("[Backup API] Importing Teams", {
              count: backupData.data.teams.length,
            });
            try {
              await tx.team.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "Team_id_seq" RESTART WITH 1`
              );

              for (const team of backupData.data.teams) {
                try {
                  await tx.team.create({
                    data: {
                      id: team.id,
                      title: team.title,
                      position: team.position,
                      linkedinUrl: team.linkedinUrl,
                      featured_image_id: team.featured_image_id,
                      createdAt: new Date(team.createdAt),
                      updatedAt: new Date(team.updatedAt),
                    },
                  });
                } catch (teamError: any) {
                  logger.warn("[Backup API] Failed to import team", {
                    id: team.id,
                    error: teamError.message,
                  });
                  importResults.errors.push(
                    `Team ${team.id}: ${teamError.message}`
                  );
                }
              }
              importResults.created.teams = backupData.data.teams.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Teams", error);
              throw new Error(`Failed to import Teams: ${error.message}`);
            }
          }

          // 7. Import Podcasts
          if (backupData.data.podcasts?.length > 0) {
            logger.info("[Backup API] Importing Podcasts", {
              count: backupData.data.podcasts.length,
            });
            try {
              await tx.podcast.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "Podcast_id_seq" RESTART WITH 1`
              );

              for (const podcast of backupData.data.podcasts) {
                try {
                  await tx.podcast.create({
                    data: {
                      id: podcast.id,
                      title: podcast.title,
                      description: podcast.description,
                      url: podcast.url,
                      image_id: podcast.image_id,
                      status: podcast.status,
                      is_featured: podcast.is_featured,
                      publish_date: podcast.publish_date
                        ? new Date(podcast.publish_date)
                        : null,
                      created_at: new Date(podcast.created_at),
                      updated_at: new Date(podcast.updated_at),
                    },
                  });
                } catch (podcastError: any) {
                  logger.warn("[Backup API] Failed to import podcast", {
                    id: podcast.id,
                    error: podcastError.message,
                  });
                  importResults.errors.push(
                    `Podcast ${podcast.id}: ${podcastError.message}`
                  );
                }
              }
              importResults.created.podcasts = backupData.data.podcasts.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Podcasts", error);
              throw new Error(`Failed to import Podcasts: ${error.message}`);
            }
          }

          // 8. Import Companies
          if (backupData.data.companies?.length > 0) {
            logger.info("[Backup API] Importing Companies", {
              count: backupData.data.companies.length,
            });
            try {
              await tx.myCompanies.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "MyCompanies_company_id_seq" RESTART WITH 1`
              );

              for (const company of backupData.data.companies) {
                try {
                  await tx.myCompanies.create({
                    data: {
                      company_id: company.company_id,
                      featured_image_id: company.featured_image_id,
                    },
                  });
                } catch (companyError: any) {
                  logger.warn("[Backup API] Failed to import company", {
                    id: company.company_id,
                    error: companyError.message,
                  });
                  importResults.errors.push(
                    `Company ${company.company_id}: ${companyError.message}`
                  );
                }
              }
              importResults.created.companies =
                backupData.data.companies.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Companies", error);
              throw new Error(`Failed to import Companies: ${error.message}`);
            }
          }

          // 9. Import Projects
          if (backupData.data.projects?.length > 0) {
            logger.info("[Backup API] Importing Projects", {
              count: backupData.data.projects.length,
            });
            try {
              await tx.project.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "Project_project_id_seq" RESTART WITH 1`
              );

              for (const project of backupData.data.projects) {
                try {
                  await tx.project.create({
                    data: {
                      project_id: project.project_id,
                      title: project.title,
                      slug: project.slug,
                      short_description: project.short_description,
                      url: project.url,
                      client_name: project.client_name,
                      year: project.year,
                      timeline: project.timeline,
                      overview: project.overview,
                      challenges: project.challenges,
                      solution: project.solution,
                      created_at: new Date(project.created_at),
                      updated_at: new Date(project.updated_at),
                      meta_title: project.meta_title,
                      meta_description: project.meta_description,
                      meta_keywords: project.meta_keywords,
                    },
                  });
                } catch (projectError: any) {
                  logger.warn("[Backup API] Failed to import project", {
                    id: project.project_id,
                    error: projectError.message,
                  });
                  importResults.errors.push(
                    `Project ${project.project_id}: ${projectError.message}`
                  );
                }
              }
              importResults.created.projects = backupData.data.projects.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Projects", error);
              throw new Error(`Failed to import Projects: ${error.message}`);
            }
          }

          // 10. Import Project Images
          if (backupData.data.projectImages?.length > 0) {
            logger.info("[Backup API] Importing Project Images", {
              count: backupData.data.projectImages.length,
            });
            try {
              await tx.projectImage.deleteMany({});

              for (const projectImage of backupData.data.projectImages) {
                try {
                  await tx.projectImage.create({
                    data: {
                      id: projectImage.id,
                      project_id: projectImage.project_id,
                      image_id: projectImage.image_id,
                      display_order: projectImage.display_order,
                      created_at: new Date(projectImage.created_at),
                    },
                  });
                } catch (imgError: any) {
                  logger.warn("[Backup API] Failed to import project image", {
                    id: projectImage.id,
                    error: imgError.message,
                  });
                  importResults.errors.push(
                    `ProjectImage ${projectImage.id}: ${imgError.message}`
                  );
                }
              }
              importResults.created.projectImages =
                backupData.data.projectImages.length;
            } catch (error: any) {
              logger.error(
                "[Backup API] Error importing Project Images",
                error
              );
              throw new Error(
                `Failed to import Project Images: ${error.message}`
              );
            }
          }

          // 11. Import Blogs
          if (backupData.data.blogs?.length > 0) {
            logger.info("[Backup API] Importing Blogs", {
              count: backupData.data.blogs.length,
            });
            try {
              await tx.blog.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "Blog_blog_id_seq" RESTART WITH 1`
              );

              for (const blog of backupData.data.blogs) {
                try {
                  await tx.blog.create({
                    data: {
                      blog_id: blog.blog_id,
                      title: blog.title,
                      slug: blog.slug,
                      excerpt: blog.excerpt,
                      content: blog.content,
                      featured_image_id: blog.featured_image_id,
                      status: blog.status,
                      is_featured: blog.is_featured,
                      publish_date: blog.publish_date
                        ? new Date(blog.publish_date)
                        : null,
                      created_at: new Date(blog.created_at),
                      updated_at: new Date(blog.updated_at),
                      meta_title: blog.meta_title,
                      meta_description: blog.meta_description,
                      meta_keywords: blog.meta_keywords,
                      og_image_id: blog.og_image_id,
                      author_id: blog.author_id,
                    },
                  });
                } catch (blogError: any) {
                  logger.warn("[Backup API] Failed to import blog", {
                    id: blog.blog_id,
                    error: blogError.message,
                  });
                  importResults.errors.push(
                    `Blog ${blog.blog_id}: ${blogError.message}`
                  );
                }
              }
              importResults.created.blogs = backupData.data.blogs.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Blogs", error);
              throw new Error(`Failed to import Blogs: ${error.message}`);
            }
          }

          // 12. Import Blog Category Relations
          if (backupData.data.blogCategoryRelations?.length > 0) {
            logger.info("[Backup API] Importing Blog Category Relations", {
              count: backupData.data.blogCategoryRelations.length,
            });
            try {
              await tx.blogCategoryRelation.deleteMany({});

              for (const relation of backupData.data.blogCategoryRelations) {
                try {
                  await tx.blogCategoryRelation.create({
                    data: {
                      blog_id: relation.blog_id,
                      category_id: relation.category_id,
                      assigned_at: new Date(relation.assigned_at),
                    },
                  });
                } catch (relError: any) {
                  logger.warn(
                    "[Backup API] Failed to import blog category relation",
                    {
                      blog_id: relation.blog_id,
                      category_id: relation.category_id,
                      error: relError.message,
                    }
                  );
                  importResults.errors.push(
                    `BlogCategoryRelation (${relation.blog_id}, ${relation.category_id}): ${relError.message}`
                  );
                }
              }
              importResults.created.blogCategoryRelations =
                backupData.data.blogCategoryRelations.length;
            } catch (error: any) {
              logger.error(
                "[Backup API] Error importing Blog Category Relations",
                error
              );
              throw new Error(
                `Failed to import Blog Category Relations: ${error.message}`
              );
            }
          }

          // 13. Import Job Categories
          if (backupData.data.jobCategories?.length > 0) {
            logger.info("[Backup API] Importing Job Categories", {
              count: backupData.data.jobCategories.length,
            });
            try {
              await tx.jobCategory.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "JobCategory_category_id_seq" RESTART WITH 1`
              );

              for (const category of backupData.data.jobCategories) {
                try {
                  await tx.jobCategory.create({
                    data: {
                      category_id: category.category_id,
                      slug: category.slug,
                      name: category.name,
                      created_at: new Date(category.created_at),
                      updated_at: new Date(category.updated_at),
                    },
                  });
                } catch (catError: any) {
                  logger.warn("[Backup API] Failed to import job category", {
                    id: category.category_id,
                    error: catError.message,
                  });
                  importResults.errors.push(
                    `JobCategory ${category.category_id}: ${catError.message}`
                  );
                }
              }
              importResults.created.jobCategories =
                backupData.data.jobCategories.length;
            } catch (error: any) {
              logger.error(
                "[Backup API] Error importing Job Categories",
                error
              );
              throw new Error(
                `Failed to import Job Categories: ${error.message}`
              );
            }
          }

          // 14. Import Jobs
          if (backupData.data.jobs?.length > 0) {
            logger.info("[Backup API] Importing Jobs", {
              count: backupData.data.jobs.length,
            });
            try {
              await tx.job.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "Job_job_id_seq" RESTART WITH 1`
              );

              for (const job of backupData.data.jobs) {
                try {
                  await tx.job.create({
                    data: {
                      job_id: job.job_id,
                      title: job.title,
                      slug: job.slug,
                      description: job.description,
                      requirements: job.requirements,
                      responsibilities: job.responsibilities,
                      location: job.location,
                      job_type: job.job_type,
                      salary_min: job.salary_min,
                      salary_max: job.salary_max,
                      salary_currency: job.salary_currency,
                      experience_level: job.experience_level,
                      status: job.status,
                      is_featured: job.is_featured,
                      application_url: job.application_url,
                      application_email: job.application_email,
                      publish_date: job.publish_date
                        ? new Date(job.publish_date)
                        : null,
                      expiry_date: job.expiry_date
                        ? new Date(job.expiry_date)
                        : null,
                      created_at: new Date(job.created_at),
                      updated_at: new Date(job.updated_at),
                      meta_title: job.meta_title,
                      meta_description: job.meta_description,
                      meta_keywords: job.meta_keywords,
                    },
                  });
                } catch (jobError: any) {
                  logger.warn("[Backup API] Failed to import job", {
                    id: job.job_id,
                    error: jobError.message,
                  });
                  importResults.errors.push(
                    `Job ${job.job_id}: ${jobError.message}`
                  );
                }
              }
              importResults.created.jobs = backupData.data.jobs.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Jobs", error);
              throw new Error(`Failed to import Jobs: ${error.message}`);
            }
          }

          // 15. Import Job Category Relations
          if (backupData.data.jobCategoryRelations?.length > 0) {
            logger.info("[Backup API] Importing Job Category Relations", {
              count: backupData.data.jobCategoryRelations.length,
            });
            try {
              await tx.jobCategoryRelation.deleteMany({});

              for (const relation of backupData.data.jobCategoryRelations) {
                try {
                  await tx.jobCategoryRelation.create({
                    data: {
                      job_id: relation.job_id,
                      category_id: relation.category_id,
                      assigned_at: new Date(relation.assigned_at),
                    },
                  });
                } catch (relError: any) {
                  logger.warn(
                    "[Backup API] Failed to import job category relation",
                    {
                      job_id: relation.job_id,
                      category_id: relation.category_id,
                      error: relError.message,
                    }
                  );
                  importResults.errors.push(
                    `JobCategoryRelation (${relation.job_id}, ${relation.category_id}): ${relError.message}`
                  );
                }
              }
              importResults.created.jobCategoryRelations =
                backupData.data.jobCategoryRelations.length;
            } catch (error: any) {
              logger.error(
                "[Backup API] Error importing Job Category Relations",
                error
              );
              throw new Error(
                `Failed to import Job Category Relations: ${error.message}`
              );
            }
          }

          // 16. Import Contact Us
          if (backupData.data.contactUs?.length > 0) {
            logger.info("[Backup API] Importing Contact Us", {
              count: backupData.data.contactUs.length,
            });
            try {
              await tx.contactUs.deleteMany({});
              await tx.$executeRawUnsafe(
                `ALTER SEQUENCE "ContactUs_contact_id_seq" RESTART WITH 1`
              );

              for (const contact of backupData.data.contactUs) {
                try {
                  await tx.contactUs.create({
                    data: {
                      contact_id: contact.contact_id,
                      name: contact.name,
                      email: contact.email,
                      phone: contact.phone,
                      service_id: contact.service_id,
                      status: contact.status,
                      submitted_at: new Date(contact.submitted_at),
                      responded_at: contact.responded_at
                        ? new Date(contact.responded_at)
                        : null,
                      notes: contact.notes,
                    },
                  });
                } catch (contactError: any) {
                  logger.warn("[Backup API] Failed to import contact", {
                    id: contact.contact_id,
                    error: contactError.message,
                  });
                  importResults.errors.push(
                    `ContactUs ${contact.contact_id}: ${contactError.message}`
                  );
                }
              }
              importResults.created.contactUs =
                backupData.data.contactUs.length;
            } catch (error: any) {
              logger.error("[Backup API] Error importing Contact Us", error);
              throw new Error(`Failed to import Contact Us: ${error.message}`);
            }
          }

          return importResults;
        } catch (error: any) {
          logger.error("[Backup API] Transaction error during import", error);
          throw error;
        }
      },
      {
        timeout: 600000, // 10 minutes timeout
        maxWait: 60000, // Wait up to 60 seconds to acquire a transaction
        isolationLevel: "ReadCommitted",
      }
    );

    const duration = Date.now() - startTime;
    const totalCreated = Object.values(result.created).reduce(
      (sum, count) => sum + count,
      0
    );

    logger.info("[Backup API] Import completed", {
      created: result.created,
      totalCreated,
      errorCount: result.errors.length,
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        message: "Database import completed",
        created: result.created,
        totalCreated,
        errors: result.errors.length > 0 ? result.errors : undefined,
        duration: `${duration}ms`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error("[Backup API] Import failed", {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });

    // Check for specific error types
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Import failed: Duplicate entry detected",
          message: "A record with the same unique identifier already exists",
        },
        { status: 409 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Import failed: Foreign key constraint violation",
          message: "A referenced record does not exist",
        },
        { status: 400 }
      );
    }

    if (
      error.message?.includes("timeout") ||
      error.message?.includes("Unable to start a transaction")
    ) {
      return NextResponse.json(
        {
          error: "Import failed: Transaction timeout",
          message:
            "The import operation timed out. The database might be under heavy load. Please try again or contact support.",
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to import database",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    // Always disconnect the client
    await prismaBackup.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}
