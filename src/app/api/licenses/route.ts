import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// =============================
// GET /api/licenses
// =============================
export async function GET(request: NextRequest) {
  try {
    // Allow both vendor and admin to fetch licenses
    const authResponse = await authMiddleware(request, ["ADMIN", "VENDOR"]);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const status = searchParams.get("status") as LicenseStatus | null;
    const vendorId = searchParams.get("vendorId") || null;

    const where: any = {};
    if (status) where.status = status;
    if (vendorId) where.vendorId = vendorId;

    const licenses = await prisma.license.findMany({
      skip,
      take: limit,
      where,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            shopName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { applicationDate: "desc" },
    });

    const total = await prisma.license.count({ where });

    return NextResponse.json({
      data: licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: { status, vendorId },
    });
  } catch (error) {
    return handleError(error, "GET /api/licenses");
  }
}

// =============================
// POST /api/licenses
// (Simple create — NOT apply flow)
// =============================
export async function POST(request: NextRequest) {
  try {
    // Only admin can create license manually
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const body = await request.json();

    const { vendorId, licenseType, idProofLink, shopPhotoLink } = body;

    if (!vendorId || !licenseType) {
      return NextResponse.json(
        { message: "vendorId and licenseType are required" },
        { status: 400 }
      );
    }

    const license = await prisma.license.create({
      data: {
        vendorId,
        licenseType,
        status: "PENDING",
        idProofLink: idProofLink || null,
        shopPhotoLink: shopPhotoLink || null,
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            shopName: true,
            email: true,
            phone: true,
          },
        },
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
    return handleError(error, "POST /api/licenses");
  }
}
