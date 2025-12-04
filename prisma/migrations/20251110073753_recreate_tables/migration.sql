-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VENDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "shopName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'VENDOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "status" "LicenseStatus" NOT NULL DEFAULT 'PENDING',
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "vendorId" TEXT NOT NULL,
    "idProofLink" TEXT,
    "shopPhotoLink" TEXT,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "License_vendorId_idx" ON "License"("vendorId");

-- CreateIndex
CREATE INDEX "License_status_idx" ON "License"("status");

-- CreateIndex
CREATE INDEX "License_licenseType_idx" ON "License"("licenseType");

-- CreateIndex
CREATE INDEX "License_applicationDate_idx" ON "License"("applicationDate");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
