import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
// import { authMiddleware } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

// GET /api/vendors - List all vendors with pagination
export async function GET(request: NextRequest) {
  try {
    // Apply authentication middleware
    // const authResponse = await authMiddleware(request);
    // if (authResponse) return authResponse;

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Fetch vendors with pagination
    const vendors = await prisma.user.findMany({
      where: { role: "VENDOR" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        shopName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination info
    const total = await prisma.user.count({
      where: { role: "VENDOR" },
    });

    return NextResponse.json({
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error, "GET /api/vendors");
  }
}

// POST /api/vendors - Create a new vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const existingVendor = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: "Vendor with this email already exists" },
        { status: 409 }
      );
    }

    // Create new vendor (as a user with VENDOR role)
    const vendor = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password, // Note: You should hash this password
        phone: body.phone,
        shopName: body.shopName,
        role: "VENDOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        shopName: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Vendor created successfully",
        data: vendor,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "POST /api/vendors");
  }
}
