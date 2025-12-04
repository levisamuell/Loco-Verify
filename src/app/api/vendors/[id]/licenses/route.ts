import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/vendors/[id]/licenses
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const vendorId = params.id;

    // Check if vendor exists (User with role VENDOR)
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        name: true,
        shopName: true,
        role: true,
      },
    });

    if (!vendor || vendor.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const status = searchParams.get("status") as LicenseStatus | null;

    const where: any = { vendorId };
    if (status) where.status = status;

    // Fetch licenses
    const licenses = await prisma.license.findMany({
      skip,
      take: limit,
      where,
      orderBy: { applicationDate: "desc" },
      select: {
        id: true,
        licenseType: true,
        status: true,
        applicationDate: true,
        issueDate: true,
        expiryDate: true,
        idProofLink: true,
        shopPhotoLink: true,
      },
    });

    const total = await prisma.license.count({ where });

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        shopName: vendor.shopName,
      },
      data: licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: { status },
    });
  } catch (error) {
    return handleError(error, "GET /api/vendors/[id]/licenses");
  }
}

// POST /api/vendors/[id]/licenses
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const vendorId = params.id;
    const body = await request.json();

    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });

    if (!vendor || vendor.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    if (!body.licenseType) {
      return NextResponse.json(
        { error: "License type is required" },
        { status: 400 }
      );
    }

    const license = await prisma.license.create({
      data: {
        vendorId,
        licenseType: body.licenseType,
        status: "PENDING",
        idProofLink: body.idProofLink || null,
        shopPhotoLink: body.shopPhotoLink || null,
      },
    });

    return NextResponse.json(
      {
        message: "License created successfully",
        data: license,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "POST /api/vendors/[id]/licenses");
  }
}
