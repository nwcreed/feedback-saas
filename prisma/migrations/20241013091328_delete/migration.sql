/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FormProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductSubmissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FormProducts" DROP CONSTRAINT "_FormProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormProducts" DROP CONSTRAINT "_FormProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSubmissions" DROP CONSTRAINT "_ProductSubmissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSubmissions" DROP CONSTRAINT "_ProductSubmissions_B_fkey";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "livemode" BOOLEAN;

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "_FormProducts";

-- DropTable
DROP TABLE "_ProductSubmissions";
