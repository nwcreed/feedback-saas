-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
