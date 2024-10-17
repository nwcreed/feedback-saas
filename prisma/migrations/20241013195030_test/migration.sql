/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductForm` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `products` to the `forms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductForm" DROP CONSTRAINT "ProductForm_formId_fkey";

-- DropForeignKey
ALTER TABLE "ProductForm" DROP CONSTRAINT "ProductForm_productId_fkey";

-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "products" TEXT NOT NULL;

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductForm";
