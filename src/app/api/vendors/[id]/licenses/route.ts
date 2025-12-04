import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/vendors/[id]/licenses - Get all licenses for a specific vendor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const vendorId = params.id;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") as LicenseStatus;
    const skip = (page - 1) * limit;

    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, name: true, businessName: true },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Build where clause for filtering
    const where: {
      vendorId: string;
      status?: LicenseStatus;
    } = { vendorId };
    if (status) where.status = status;

    // Fetch vendor's licenses with pagination
    const licenses = await prisma.license.findMany({
      skip,
      take: limit,
      where,
      select: {
        id: true,
        licenseType: true,
        status: true,
        station: true,
        validityPeriod: true,
        createdAt: true,
        expiresAt: true,
        reviewedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination
    const total = await prisma.license.count({ where });

    // Get license statistics
    const stats = await prisma.license.groupBy({
      by: ["status"],
      where: { vendorId },
      _count: {
        status: true,
      },
    });

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        businessName: vendor.businessName,
      },
      data: licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: stats.reduce(
        (acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        },
        {} as Record<string, number>
      ),
      filters: { status },
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/vendors/[id]/licenses - Create a license for a specific vendor
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const vendorId = params.id;
    const body = await request.json();

    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Basic validation
    if (!body.licenseType) {
      return NextResponse.json(
        { error: "License type is required" },
        { status: 400 }
      );
    }

    // Create license for this vendor
    const license = await prisma.license.create({
      data: {
        vendorId: vendorId,
        licenseType: body.licenseType,
        station: body.station,
        validityPeriod: body.validityPeriod || 12,
        status: "PENDING",
        documents: body.documents || [],
      },
      include: {
        vendor: {
          select: {
            name: true,
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "License created for vendor successfully",
        data: license,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
