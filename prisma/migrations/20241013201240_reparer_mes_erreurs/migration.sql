/*
  Warnings:

  - You are about to drop the column `scope` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `forms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "scope";

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "products";
