/*
  Warnings:

  - You are about to drop the column `stripeUserId` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "stripeUserId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripeAccountId" TEXT;
