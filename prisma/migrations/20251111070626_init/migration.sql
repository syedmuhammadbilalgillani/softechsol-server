/*
  Warnings:

  - You are about to drop the column `userId` on the `ContactUs` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Project` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `userId` on the `Testimonial` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activity_type` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featured_image` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featured_image` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ContactUs" DROP CONSTRAINT "ContactUs_userId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_userId_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "activity_type" TEXT NOT NULL,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "current_participants" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "featured_image" TEXT,
ADD COLUMN     "gallery" TEXT[],
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_free" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_past" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "max_participants" INTEGER,
ADD COLUMN     "meeting_link" TEXT,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "og_image" TEXT,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "recording_url" TEXT,
ADD COLUMN     "registration_url" TEXT,
ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "slides_url" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "speakers" TEXT[],
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "target_audience" TEXT,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "topics" TEXT[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "venue" TEXT;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "featured_image" TEXT,
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "og_image" TEXT,
ADD COLUMN     "publish_date" TIMESTAMP(3),
ADD COLUMN     "reading_time" INTEGER,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ContactUs" DROP COLUMN "userId",
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "company_size" TEXT,
ADD COLUMN     "inquiry_type" TEXT,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "responded_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW',
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "utm_campaign" TEXT,
ADD COLUMN     "utm_medium" TEXT,
ADD COLUMN     "utm_source" TEXT;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "image",
ADD COLUMN     "case_study_url" TEXT,
ADD COLUMN     "client_logo" TEXT,
ADD COLUMN     "client_name" TEXT,
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "featured_image" TEXT NOT NULL,
ADD COLUMN     "gallery" TEXT[],
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "og_image" TEXT,
ADD COLUMN     "project_url" TEXT,
ADD COLUMN     "results" TEXT,
ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "team_size" INTEGER,
ADD COLUMN     "technologies" TEXT[],
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "year_completed" INTEGER;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "image",
ADD COLUMN     "demo_url" TEXT,
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "documentation_url" TEXT,
ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "download_url" TEXT,
ADD COLUMN     "featured_image" TEXT NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "gallery" TEXT[],
ADD COLUMN     "github_url" TEXT,
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "og_image" TEXT,
ADD COLUMN     "project_type" TEXT,
ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "star_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "technologies" TEXT[],
ADD COLUMN     "version" TEXT,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "project_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "cta_text" TEXT,
ADD COLUMN     "cta_url" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "deliverables" TEXT[],
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "featured_image" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "ideal_for" TEXT[],
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_popular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "og_image" TEXT,
ADD COLUMN     "price_note" TEXT,
ADD COLUMN     "price_type" TEXT,
ADD COLUMN     "process_steps" TEXT[],
ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "technologies" TEXT[],
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "userId",
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "company_logo" TEXT,
ADD COLUMN     "company_website" TEXT,
ADD COLUMN     "customer_title" TEXT,
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_video" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "project_type" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "video_thumbnail" TEXT,
ADD COLUMN     "video_url" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EDITOR';

-- CreateTable
CREATE TABLE "BlogCategory" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "parent_id" INTEGER,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "post_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "BlogCategoryRelation" (
    "blog_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogCategoryRelation_pkey" PRIMARY KEY ("blog_id","category_id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "parent_id" INTEGER,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "service_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "ServiceCategoryRelation" (
    "service_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceCategoryRelation_pkey" PRIMARY KEY ("service_id","category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_name_key" ON "BlogCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_slug_idx" ON "BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_parent_id_idx" ON "BlogCategory"("parent_id");

-- CreateIndex
CREATE INDEX "BlogCategory_display_order_idx" ON "BlogCategory"("display_order");

-- CreateIndex
CREATE INDEX "BlogCategoryRelation_blog_id_idx" ON "BlogCategoryRelation"("blog_id");

-- CreateIndex
CREATE INDEX "BlogCategoryRelation_category_id_idx" ON "BlogCategoryRelation"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ServiceCategory_slug_idx" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ServiceCategory_parent_id_idx" ON "ServiceCategory"("parent_id");

-- CreateIndex
CREATE INDEX "ServiceCategory_display_order_idx" ON "ServiceCategory"("display_order");

-- CreateIndex
CREATE INDEX "ServiceCategoryRelation_service_id_idx" ON "ServiceCategoryRelation"("service_id");

-- CreateIndex
CREATE INDEX "ServiceCategoryRelation_category_id_idx" ON "ServiceCategoryRelation"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");

-- CreateIndex
CREATE INDEX "Activity_slug_idx" ON "Activity"("slug");

-- CreateIndex
CREATE INDEX "Activity_status_idx" ON "Activity"("status");

-- CreateIndex
CREATE INDEX "Activity_activity_date_idx" ON "Activity"("activity_date");

-- CreateIndex
CREATE INDEX "Activity_is_featured_idx" ON "Activity"("is_featured");

-- CreateIndex
CREATE INDEX "Activity_is_past_idx" ON "Activity"("is_past");

-- CreateIndex
CREATE INDEX "Activity_activity_type_idx" ON "Activity"("activity_type");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_slug_idx" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_status_idx" ON "Blog"("status");

-- CreateIndex
CREATE INDEX "Blog_author_id_idx" ON "Blog"("author_id");

-- CreateIndex
CREATE INDEX "Blog_publish_date_idx" ON "Blog"("publish_date");

-- CreateIndex
CREATE INDEX "Blog_is_featured_idx" ON "Blog"("is_featured");

-- CreateIndex
CREATE INDEX "ContactUs_status_idx" ON "ContactUs"("status");

-- CreateIndex
CREATE INDEX "ContactUs_priority_idx" ON "ContactUs"("priority");

-- CreateIndex
CREATE INDEX "ContactUs_submitted_at_idx" ON "ContactUs"("submitted_at");

-- CreateIndex
CREATE INDEX "ContactUs_email_idx" ON "ContactUs"("email");

-- CreateIndex
CREATE INDEX "ContactUs_inquiry_type_idx" ON "ContactUs"("inquiry_type");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_slug_key" ON "Portfolio"("slug");

-- CreateIndex
CREATE INDEX "Portfolio_slug_idx" ON "Portfolio"("slug");

-- CreateIndex
CREATE INDEX "Portfolio_status_idx" ON "Portfolio"("status");

-- CreateIndex
CREATE INDEX "Portfolio_serviceId_idx" ON "Portfolio"("serviceId");

-- CreateIndex
CREATE INDEX "Portfolio_display_order_idx" ON "Portfolio"("display_order");

-- CreateIndex
CREATE INDEX "Portfolio_is_featured_idx" ON "Portfolio"("is_featured");

-- CreateIndex
CREATE INDEX "Portfolio_industry_idx" ON "Portfolio"("industry");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_serviceId_idx" ON "Project"("serviceId");

-- CreateIndex
CREATE INDEX "Project_display_order_idx" ON "Project"("display_order");

-- CreateIndex
CREATE INDEX "Project_is_featured_idx" ON "Project"("is_featured");

-- CreateIndex
CREATE INDEX "Project_project_type_idx" ON "Project"("project_type");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_slug_idx" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_status_idx" ON "Service"("status");

-- CreateIndex
CREATE INDEX "Service_display_order_idx" ON "Service"("display_order");

-- CreateIndex
CREATE INDEX "Service_is_featured_idx" ON "Service"("is_featured");

-- CreateIndex
CREATE INDEX "Service_is_popular_idx" ON "Service"("is_popular");

-- CreateIndex
CREATE INDEX "Testimonial_status_idx" ON "Testimonial"("status");

-- CreateIndex
CREATE INDEX "Testimonial_is_featured_idx" ON "Testimonial"("is_featured");

-- CreateIndex
CREATE INDEX "Testimonial_display_order_idx" ON "Testimonial"("display_order");

-- CreateIndex
CREATE INDEX "Testimonial_rating_idx" ON "Testimonial"("rating");

-- CreateIndex
CREATE INDEX "Testimonial_industry_idx" ON "Testimonial"("industry");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- AddForeignKey
ALTER TABLE "BlogCategory" ADD CONSTRAINT "BlogCategory_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "BlogCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryRelation" ADD CONSTRAINT "BlogCategoryRelation_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "Blog"("blog_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryRelation" ADD CONSTRAINT "BlogCategoryRelation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "BlogCategory"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "ServiceCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategoryRelation" ADD CONSTRAINT "ServiceCategoryRelation_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategoryRelation" ADD CONSTRAINT "ServiceCategoryRelation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ServiceCategory"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
