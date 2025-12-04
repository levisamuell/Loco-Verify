import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/admin/licenses
export async function GET(request: NextRequest) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const status = searchParams.get("status") as LicenseStatus | null;
    const type = searchParams.get("type") || null;
    const needsAttention = searchParams.get("needsAttention") === "true";

    const where: any = {};
    if (status) where.status = status;
    if (type) where.licenseType = type;

    if (needsAttention) {
      where.OR = [
        { status: "PENDING" },
        {
          status: "APPROVED",
          expiryDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      ];
    }

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
      orderBy: needsAttention
        ? [{ status: "asc" }, { expiryDate: "asc" }]
        : { applicationDate: "desc" },
    });

    const total = await prisma.license.count({ where });

    const statusStats = await prisma.license.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const typeStats = await prisma.license.groupBy({
      by: ["licenseType"],
      _count: { licenseType: true },
    });

    const pendingCount = await prisma.license.count({
      where: { status: "PENDING" },
    });

    const expiringSoonCount = await prisma.license.count({
      where: {
        status: "APPROVED",
        expiryDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      data: licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: {
        byStatus: statusStats,
        byType: typeStats,
        pendingCount,
        expiringSoonCount,
        totalLicenses: total,
      },
    });
  } catch (error) {
    return handleError(error, "GET /api/admin/licenses");
  }
}

// POST /api/admin/licenses
export async function POST(request: NextRequest) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { licenseIds, action } = await request.json();

    if (!Array.isArray(licenseIds) || !action) {
      return NextResponse.json(
        { error: "licenseIds[] and action are required" },
        { status: 400 }
      );
    }

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be APPROVE or REJECT" },
        { status: 400 }
      );
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const result = await prisma.license.updateMany({
      where: {
        id: { in: licenseIds },
        status: "PENDING",
      },
      data: {
        status: newStatus,
      },
    });

    return NextResponse.json({
      message: `Updated ${result.count} licenses`,
      updated: result.count,
    });
  } catch (error) {
    return handleError(error, "POST /api/admin/licenses");
  }
}
