-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "description" TEXT,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

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
CREATE TABLE "Blog" (
    "blog_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featured_image_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "reading_time" INTEGER,
    "tags" TEXT[],
    "publish_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_image_id" TEXT,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("blog_id")
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

-- CreateTable
CREATE TABLE "PortfolioGallery" (
    "id" TEXT NOT NULL,
    "portfolio_id" INTEGER NOT NULL,
    "image_id" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "portfolio_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "featured_image_id" TEXT,
    "client_name" TEXT,
    "client_logo_id" TEXT,
    "industry" TEXT,
    "project_url" TEXT,
    "case_study_url" TEXT,
    "technologies" TEXT[],
    "year_completed" INTEGER,
    "team_size" INTEGER,
    "duration" TEXT,
    "results" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_image_id" TEXT,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("portfolio_id")
);

-- CreateTable
CREATE TABLE "ProjectGallery" (
    "id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "image_id" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "featured_image_id" TEXT,
    "project_type" TEXT,
    "project_url" TEXT,
    "github_url" TEXT,
    "demo_url" TEXT,
    "documentation_url" TEXT,
    "download_url" TEXT,
    "version" TEXT,
    "license" TEXT,
    "technologies" TEXT[],
    "features" TEXT[],
    "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "star_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_image_id" TEXT,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ContactUs" (
    "contact_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "company_size" TEXT,
    "budget" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "inquiry_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "referrer" TEXT,
    "notes" TEXT,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "ActivityGallery" (
    "id" TEXT NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "image_id" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "activity_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT,
    "featured_image_id" TEXT,
    "activity_type" TEXT NOT NULL,
    "location" TEXT,
    "venue" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "activity_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "timezone" TEXT,
    "duration" TEXT,
    "max_participants" INTEGER,
    "current_participants" INTEGER NOT NULL DEFAULT 0,
    "registration_url" TEXT,
    "meeting_link" TEXT,
    "price" DECIMAL(10,2),
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "speakers" TEXT[],
    "topics" TEXT[],
    "target_audience" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_past" BOOLEAN NOT NULL DEFAULT false,
    "recording_url" TEXT,
    "slides_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_image_id" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "testimonial_id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_title" TEXT,
    "company" TEXT,
    "company_logo_id" TEXT,
    "company_website" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "avatar_id" TEXT,
    "location" TEXT,
    "industry" TEXT,
    "project_type" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_video" BOOLEAN NOT NULL DEFAULT false,
    "video_url" TEXT,
    "video_thumbnail_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("testimonial_id")
);

-- CreateTable
CREATE TABLE "Service" (
    "service_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "featured_image_id" TEXT,
    "price" DECIMAL(10,2),
    "price_type" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "price_note" TEXT,
    "features" TEXT[],
    "deliverables" TEXT[],
    "technologies" TEXT[],
    "process_steps" TEXT[],
    "duration" TEXT,
    "ideal_for" TEXT[],
    "status" "Status" NOT NULL DEFAULT 'PUBLISHED',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_image_id" TEXT,
    "cta_text" TEXT,
    "cta_url" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GalleryItem_publicId_key" ON "GalleryItem"("publicId");

-- CreateIndex
CREATE INDEX "GalleryItem_publicId_idx" ON "GalleryItem"("publicId");

-- CreateIndex
CREATE INDEX "GalleryItem_url_idx" ON "GalleryItem"("url");

-- CreateIndex
CREATE INDEX "GalleryItem_altText_idx" ON "GalleryItem"("altText");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_avatar_id_idx" ON "User"("avatar_id");

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
CREATE INDEX "Blog_featured_image_id_idx" ON "Blog"("featured_image_id");

-- CreateIndex
CREATE INDEX "Blog_og_image_id_idx" ON "Blog"("og_image_id");

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
CREATE INDEX "PortfolioGallery_portfolio_id_idx" ON "PortfolioGallery"("portfolio_id");

-- CreateIndex
CREATE INDEX "PortfolioGallery_image_id_idx" ON "PortfolioGallery"("image_id");

-- CreateIndex
CREATE INDEX "PortfolioGallery_display_order_idx" ON "PortfolioGallery"("display_order");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioGallery_portfolio_id_image_id_key" ON "PortfolioGallery"("portfolio_id", "image_id");

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
CREATE INDEX "Portfolio_featured_image_id_idx" ON "Portfolio"("featured_image_id");

-- CreateIndex
CREATE INDEX "Portfolio_client_logo_id_idx" ON "Portfolio"("client_logo_id");

-- CreateIndex
CREATE INDEX "Portfolio_og_image_id_idx" ON "Portfolio"("og_image_id");

-- CreateIndex
CREATE INDEX "ProjectGallery_project_id_idx" ON "ProjectGallery"("project_id");

-- CreateIndex
CREATE INDEX "ProjectGallery_image_id_idx" ON "ProjectGallery"("image_id");

-- CreateIndex
CREATE INDEX "ProjectGallery_display_order_idx" ON "ProjectGallery"("display_order");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectGallery_project_id_image_id_key" ON "ProjectGallery"("project_id", "image_id");

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
CREATE INDEX "Project_featured_image_id_idx" ON "Project"("featured_image_id");

-- CreateIndex
CREATE INDEX "Project_og_image_id_idx" ON "Project"("og_image_id");

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
CREATE INDEX "ActivityGallery_activity_id_idx" ON "ActivityGallery"("activity_id");

-- CreateIndex
CREATE INDEX "ActivityGallery_image_id_idx" ON "ActivityGallery"("image_id");

-- CreateIndex
CREATE INDEX "ActivityGallery_display_order_idx" ON "ActivityGallery"("display_order");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityGallery_activity_id_image_id_key" ON "ActivityGallery"("activity_id", "image_id");

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
CREATE INDEX "Activity_featured_image_id_idx" ON "Activity"("featured_image_id");

-- CreateIndex
CREATE INDEX "Activity_og_image_id_idx" ON "Activity"("og_image_id");

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
CREATE INDEX "Testimonial_avatar_id_idx" ON "Testimonial"("avatar_id");

-- CreateIndex
CREATE INDEX "Testimonial_company_logo_id_idx" ON "Testimonial"("company_logo_id");

-- CreateIndex
CREATE INDEX "Testimonial_video_thumbnail_id_idx" ON "Testimonial"("video_thumbnail_id");

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
CREATE INDEX "Service_featured_image_id_idx" ON "Service"("featured_image_id");

-- CreateIndex
CREATE INDEX "Service_og_image_id_idx" ON "Service"("og_image_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategory" ADD CONSTRAINT "BlogCategory_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "BlogCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryRelation" ADD CONSTRAINT "BlogCategoryRelation_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "Blog"("blog_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryRelation" ADD CONSTRAINT "BlogCategoryRelation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "BlogCategory"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "ServiceCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategoryRelation" ADD CONSTRAINT "ServiceCategoryRelation_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategoryRelation" ADD CONSTRAINT "ServiceCategoryRelation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ServiceCategory"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioGallery" ADD CONSTRAINT "PortfolioGallery_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "Portfolio"("portfolio_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioGallery" ADD CONSTRAINT "PortfolioGallery_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_client_logo_id_fkey" FOREIGN KEY ("client_logo_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGallery" ADD CONSTRAINT "ProjectGallery_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGallery" ADD CONSTRAINT "ProjectGallery_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityGallery" ADD CONSTRAINT "ActivityGallery_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("activity_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityGallery" ADD CONSTRAINT "ActivityGallery_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "GalleryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_company_logo_id_fkey" FOREIGN KEY ("company_logo_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_video_thumbnail_id_fkey" FOREIGN KEY ("video_thumbnail_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "GalleryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
