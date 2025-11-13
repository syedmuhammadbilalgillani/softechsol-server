/*
  Warnings:

  - You are about to drop the column `display_order` on the `BlogCategory` table. All the data in the column will be lost.
  - You are about to drop the column `post_count` on the `BlogCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BlogCategory_display_order_idx";

-- AlterTable
ALTER TABLE "BlogCategory" DROP COLUMN "display_order",
DROP COLUMN "post_count";
