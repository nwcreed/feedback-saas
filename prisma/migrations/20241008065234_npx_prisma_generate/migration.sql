/*
  Warnings:

  - You are about to drop the column `stripeAccessToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripeUserId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_stripeUserId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripeAccessToken",
DROP COLUMN "stripeUserId";
