import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET /api/vendors - List all vendors with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const vendors = await prisma.user.findMany({
      where: { role: Role.VENDOR },
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

    const total = await prisma.user.count({
      where: { role: Role.VENDOR },
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
    const { name, email, password, phone, shopName } = body;

    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required");
      error.name = "ValidationError";
      throw error;
    }

    const existingVendor = await prisma.user.findUnique({
      where: { email },
    });

    if (existingVendor) {
      const error = new Error("Vendor with this email already exists");
      error.name = "ValidationError";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        shopName: shopName || null,
        role: Role.VENDOR,
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
