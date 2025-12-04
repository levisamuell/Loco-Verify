import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../../../../node_modules/.prisma/client";
import { handleError } from "../../../../lib/errorHandler"; // ADD THIS IMPORT

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const error = new Error("Both email and password are required");
      error.name = "ValidationError";
      throw error;
    }

    // 🔍 Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.name = "UnauthorizedError";
      throw error;
    }

    // 🔐 Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.name = "UnauthorizedError";
      throw error;
    }

    // 🎟️ Generate JWT token with user role
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" } // Extended to 24h for better UX
    );

    // 🧩 Return complete user info and token
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          shopName: user.shopName,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "POST /api/auth/login"); // REPLACE ERROR HANDLING
  } finally {
    await prisma.$disconnect();
  }
}
