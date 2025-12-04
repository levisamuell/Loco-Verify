/*
  Warnings:

  - The values [Vendor,Official] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `idProofLink` on table `License` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shopPhotoLink` on table `License` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('VENDOR', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VENDOR';
COMMIT;

-- AlterTable
ALTER TABLE "License" ALTER COLUMN "idProofLink" SET NOT NULL,
ALTER COLUMN "shopPhotoLink" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VENDOR';
