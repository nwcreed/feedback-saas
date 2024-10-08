/*
  Warnings:

  - A unique constraint covering the columns `[stripeUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripeAccessToken" TEXT,
ADD COLUMN     "stripeUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeUserId_key" ON "users"("stripeUserId");
