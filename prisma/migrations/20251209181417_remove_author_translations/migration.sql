/*
  Warnings:

  - You are about to drop the column `reading_time` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `company_size` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `inquiry_type` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `referrer` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `utm_campaign` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `utm_medium` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `utm_source` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `demo_url` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `documentation_url` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `download_count` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `download_url` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `github_url` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `license` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `og_image_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `project_type` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `project_url` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `star_count` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `Project` table. All the data in the column will be lost.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `cta_text` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `cta_url` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `deliverables` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image_id` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `ideal_for` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `is_popular` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `meta_keywords` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `og_image_id` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price_note` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price_type` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `process_steps` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `short_description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Service` table. All the data in the column will be lost.
  - The primary key for the `ServiceCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `service_count` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ActivityGallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioGallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectGallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCategoryRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ServiceCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_featured_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_og_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityGallery" DROP CONSTRAINT "ActivityGallery_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityGallery" DROP CONSTRAINT "ActivityGallery_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_client_logo_id_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_featured_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_og_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioGallery" DROP CONSTRAINT "PortfolioGallery_image_id_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioGallery" DROP CONSTRAINT "PortfolioGallery_portfolio_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_featured_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_og_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectGallery" DROP CONSTRAINT "ProjectGallery_image_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectGallery" DROP CONSTRAINT "ProjectGallery_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_featured_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_og_image_id_fkey";

-- DropForeignKey
ALTER TABLE "ServiceCategory" DROP CONSTRAINT "ServiceCategory_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "ServiceCategoryRelation" DROP CONSTRAINT "ServiceCategoryRelation_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ServiceCategoryRelation" DROP CONSTRAINT "ServiceCategoryRelation_service_id_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_avatar_id_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_company_logo_id_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_video_thumbnail_id_fkey";

-- DropIndex
DROP INDEX "ContactUs_inquiry_type_idx";

-- DropIndex
DROP INDEX "ContactUs_priority_idx";

-- DropIndex
DROP INDEX "Project_display_order_idx";

-- DropIndex
DROP INDEX "Project_featured_image_id_idx";

-- DropIndex
DROP INDEX "Project_is_featured_idx";

-- DropIndex
DROP INDEX "Project_og_image_id_idx";

-- DropIndex
DROP INDEX "Project_project_type_idx";

-- DropIndex
DROP INDEX "Project_serviceId_idx";

-- DropIndex
DROP INDEX "Project_slug_idx";

-- DropIndex
DROP INDEX "Project_status_idx";

-- DropIndex
DROP INDEX "Service_display_order_idx";

-- DropIndex
DROP INDEX "Service_featured_image_id_idx";

-- DropIndex
DROP INDEX "Service_is_featured_idx";

-- DropIndex
DROP INDEX "Service_is_popular_idx";

-- DropIndex
DROP INDEX "Service_og_image_id_idx";

-- DropIndex
DROP INDEX "Service_slug_idx";

-- DropIndex
DROP INDEX "Service_slug_key";

-- DropIndex
DROP INDEX "Service_status_idx";

-- DropIndex
DROP INDEX "ServiceCategory_display_order_idx";

-- DropIndex
DROP INDEX "ServiceCategory_name_key";

-- DropIndex
DROP INDEX "ServiceCategory_parent_id_idx";

-- DropIndex
DROP INDEX "ServiceCategory_slug_idx";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "reading_time",
DROP COLUMN "tags",
DROP COLUMN "view_count";

-- AlterTable
ALTER TABLE "ContactUs" DROP COLUMN "budget",
DROP COLUMN "company",
DROP COLUMN "company_size",
DROP COLUMN "inquiry_type",
DROP COLUMN "ip_address",
DROP COLUMN "message",
DROP COLUMN "priority",
DROP COLUMN "referrer",
DROP COLUMN "subject",
DROP COLUMN "utm_campaign",
DROP COLUMN "utm_medium",
DROP COLUMN "utm_source",
ADD COLUMN     "service_id" INTEGER;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "demo_url",
DROP COLUMN "description",
DROP COLUMN "display_order",
DROP COLUMN "documentation_url",
DROP COLUMN "download_count",
DROP COLUMN "download_url",
DROP COLUMN "featured_image_id",
DROP COLUMN "features",
DROP COLUMN "github_url",
DROP COLUMN "is_active",
DROP COLUMN "is_featured",
DROP COLUMN "license",
DROP COLUMN "og_image_id",
DROP COLUMN "project_type",
DROP COLUMN "project_url",
DROP COLUMN "serviceId",
DROP COLUMN "star_count",
DROP COLUMN "status",
DROP COLUMN "technologies",
DROP COLUMN "version",
DROP COLUMN "view_count",
ADD COLUMN     "challenges" TEXT,
ADD COLUMN     "client_name" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "timeline" TEXT,
ADD COLUMN     "url" TEXT,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "created_at",
DROP COLUMN "cta_text",
DROP COLUMN "cta_url",
DROP COLUMN "currency",
DROP COLUMN "deliverables",
DROP COLUMN "display_order",
DROP COLUMN "duration",
DROP COLUMN "featured_image_id",
DROP COLUMN "features",
DROP COLUMN "icon",
DROP COLUMN "ideal_for",
DROP COLUMN "is_featured",
DROP COLUMN "is_popular",
DROP COLUMN "meta_description",
DROP COLUMN "meta_keywords",
DROP COLUMN "meta_title",
DROP COLUMN "og_image_id",
DROP COLUMN "price",
DROP COLUMN "price_note",
DROP COLUMN "price_type",
DROP COLUMN "process_steps",
DROP COLUMN "service_id",
DROP COLUMN "short_description",
DROP COLUMN "slug",
DROP COLUMN "status",
DROP COLUMN "technologies",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "image_id" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ServiceCategory" DROP CONSTRAINT "ServiceCategory_pkey",
DROP COLUMN "category_id",
DROP COLUMN "color",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "display_order",
DROP COLUMN "icon",
DROP COLUMN "is_active",
DROP COLUMN "meta_description",
DROP COLUMN "meta_title",
DROP COLUMN "parent_id",
DROP COLUMN "service_count",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "image_id" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "ActivityGallery";

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "PortfolioGallery";

-- DropTable
DROP TABLE "ProjectGallery";

-- DropTable
DROP TABLE "ServiceCategoryRelation";

-- DropTable
DROP TABLE "Testimonial";

-- CreateTable
CREATE TABLE "MyCompanies" (
    "company_id" SERIAL NOT NULL,
    "featured_image_id" TEXT,

    CONSTRAINT "MyCompanies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "image_id" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "featured_image_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "category_id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "JobCategoryRelation" (
    "job_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobCategoryRelation_pkey" PRIMARY KEY ("job_id","category_id")
);

-- CreateTable
CREATE TABLE "Job" (
    "job_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "location" TEXT,
    "job_type" TEXT,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_currency" TEXT DEFAULT 'USD',
    "experience_level" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "application_url" TEXT,
    "application_email" TEXT,
    "publish_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "image_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "publish_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectImage_project_id_idx" ON "ProjectImage"("project_id");

-- CreateIndex
CREATE INDEX "ProjectImage_image_id_idx" ON "ProjectImage"("image_id");

-- CreateIndex
CREATE INDEX "ProjectImage_display_order_idx" ON "ProjectImage"("display_order");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectImage_project_id_image_id_key" ON "ProjectImage"("project_id", "image_id");

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_slug_key" ON "JobCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_name_key" ON "JobCategory"("name");

-- CreateIndex
CREATE INDEX "JobCategoryRelation_job_id_idx" ON "JobCategoryRelation"("job_id");

-- CreateIndex
CREATE INDEX "JobCategoryRelation_category_id_idx" ON "JobCategoryRelation"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_slug_idx" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_publish_date_idx" ON "Job"("publish_date");

-- CreateIndex
CREATE INDEX "Job_is_featured_idx" ON "Job"("is_featured");

-- CreateIndex
CREATE INDEX "Job_job_type_idx" ON "Job"("job_type");

-- CreateIndex
CREATE INDEX "Job_location_idx" ON "Job"("location");

-- CreateIndex
CREATE INDEX "Podcast_status_idx" ON "Podcast"("status");

-- CreateIndex
CREATE INDEX "Podcast_publish_date_idx" ON "Podcast"("publish_date");

-- CreateIndex
CREATE INDEX "Podcast_is_featured_idx" ON "Podcast"("is_featured");

-- CreateIndex
CREATE INDEX "Podcast_image_id_idx" ON "Podcast"("image_id");

-- CreateIndex
CREATE INDEX "ContactUs_service_id_idx" ON "ContactUs"("service_id");

-- AddForeignKey
ALTER TABLE "MyCompanies" ADD CONSTRAINT "MyCompanies_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactUs" ADD CONSTRAINT "ContactUs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCategoryRelation" ADD CONSTRAINT "JobCategoryRelation_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCategoryRelation" ADD CONSTRAINT "JobCategoryRelation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "JobCategory"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
