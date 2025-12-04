import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/admin/vendors - Get vendors with admin filters and statistics
export async function GET(request: NextRequest) {
  try {
    // Apply authentication middleware - admin only
    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: {
      status?: string;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        businessName?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
      }>;
    } = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { businessName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch vendors with admin details
    const vendors = await prisma.vendor.findMany({
      skip,
      take: limit,
      where,
      include: {
        _count: {
          select: {
            licenses: true,
            // Remove the duplicate licenses line below
          },
        },
        licenses: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            status: true,
            licenseType: true,
            expiresAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get total count and statistics
    const total = await prisma.vendor.count({ where });

    const statusStats = await prisma.vendor.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    return NextResponse.json({
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: {
        byStatus: statusStats,
        totalVendors: total,
        searchQuery: search,
      },
      filters: {
        status,
        search,
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
