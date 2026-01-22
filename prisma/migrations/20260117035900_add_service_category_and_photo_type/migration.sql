/*
  Warnings:

  - You are about to drop the column `isBefore` on the `ServicePhoto` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServicePhotoType" AS ENUM ('BEFORE', 'PROGRESS', 'AFTER');

-- AlterTable
ALTER TABLE "ServicePhoto" DROP COLUMN "isBefore",
ADD COLUMN     "type" "ServicePhotoType" NOT NULL DEFAULT 'BEFORE';
