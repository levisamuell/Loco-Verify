import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "../../../../../node_modules/.prisma/client";
import { handleError } from "../../../../lib/errorHandler"; // ADD THIS IMPORT

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      shopName,
      role = Role.VENDOR, // This should work now!
    } = body;

    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required");
      error.name = "ValidationError";
      throw error;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error("User already exists");
      error.name = "ValidationError";
      throw error;
    }

    // Validate role - use Object.values() instead of direct enum values
    if (role && !Object.values(Role).includes(role)) {
      const error = new Error(
        "Invalid role. Must be either 'VENDOR' or 'ADMIN'"
      );
      error.name = "ValidationError";
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        shopName: shopName || null,
        role: role,
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
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "POST /api/auth/signup"); // REPLACE ERROR HANDLING
  } finally {
    await prisma.$disconnect();
  }
}
