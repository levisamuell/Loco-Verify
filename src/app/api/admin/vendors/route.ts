import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/admin/vendors
export async function GET(request: NextRequest) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";

    const where: Prisma.UserWhereInput = {
      role: "VENDOR",
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive", // FIXED
                },
              },
              {
                shopName: {
                  contains: search,
                  mode: "insensitive", // FIXED
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive", // FIXED
                },
              },
            ],
          }
        : {}),
    };

    const vendors = await prisma.user.findMany({
      skip,
      take: limit,
      where,
      include: {
        licenses: {
          orderBy: { applicationDate: "desc" },
          take: 1,
          select: {
            licenseType: true,
            status: true,
            expiryDate: true,
          },
        },
        _count: {
          select: { licenses: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({ where });

    const licenseStats = await prisma.license.groupBy({
      by: ["status"],
      _count: { status: true },
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
        totalVendors: total,
        licenseStats,
      },
      filters: {
        search,
      },
    });
  } catch (error) {
    return handleError(error, "GET /api/admin/vendors");
  }
}
