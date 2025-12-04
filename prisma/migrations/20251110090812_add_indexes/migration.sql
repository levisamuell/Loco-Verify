/*
  Warnings:

  - The values [VENDOR,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Vendor', 'Official');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Vendor';
COMMIT;

-- AlterTable
ALTER TABLE "License" ALTER COLUMN "idProofLink" DROP NOT NULL,
ALTER COLUMN "shopPhotoLink" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Vendor';

-- CreateIndex
CREATE INDEX "License_licenseType_idx" ON "License"("licenseType");

-- CreateIndex
CREATE INDEX "License_applicationDate_idx" ON "License"("applicationDate");
