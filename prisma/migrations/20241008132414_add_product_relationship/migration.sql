/*
  Warnings:

  - You are about to drop the column `livemode` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "livemode";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FormProducts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductSubmissions" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormProducts_AB_unique" ON "_FormProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_FormProducts_B_index" ON "_FormProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSubmissions_AB_unique" ON "_ProductSubmissions"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSubmissions_B_index" ON "_ProductSubmissions"("B");

-- AddForeignKey
ALTER TABLE "_FormProducts" ADD CONSTRAINT "_FormProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormProducts" ADD CONSTRAINT "_FormProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubmissions" ADD CONSTRAINT "_ProductSubmissions_A_fkey" FOREIGN KEY ("A") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubmissions" ADD CONSTRAINT "_ProductSubmissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
