-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('GENERAL_CLEANING', 'DEEP_CLEAN', 'OFFICE_CLEANING', 'MOVE_OUT_CLEANING', 'SANITIZATION', 'OTHER');

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "category" "ServiceCategory";

-- CreateTable
CREATE TABLE "FoodItemCategory" (
    "id" SERIAL NOT NULL,
    "foodItemId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FoodItemCategory_categoryId_idx" ON "FoodItemCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItemCategory_foodItemId_categoryId_key" ON "FoodItemCategory"("foodItemId", "categoryId");

-- AddForeignKey
ALTER TABLE "FoodItemCategory" ADD CONSTRAINT "FoodItemCategory_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItemCategory" ADD CONSTRAINT "FoodItemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FoodCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
