import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { handleError } from "../../../lib/errorHandler"; // Add this import

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ GET route — Verify token, fetch user, and authorize by role
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Convert this to use error throwing for consistent handling
      const error = new Error("Authorization token missing or invalid format");
      error.name = "ValidationError";
      throw error;
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        email: string;
        role: string;
      };
    } catch {
      const error = new Error("Invalid or expired token");
      error.name = "UnauthorizedError";
      throw error;
    }

    // 🧩 Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id.toString() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      throw error;
    }

    // 🧠 Role-based access example
    if (user.role !== Role.VENDOR && user.role !== Role.ADMIN) {
      const error = new Error("Access denied. Invalid role.");
      error.name = "UnauthorizedError";
      throw error;
    }

    // ✅ Success — send user info
    return NextResponse.json(
      {
        success: true,
        message: `Access granted. Hello ${user.role === "ADMIN" ? "ADMIN" : "VENDOR"}!`,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    // Use the centralized error handler instead of manual error responses
    return handleError(error, "GET /api/users");
  } finally {
    await prisma.$disconnect();
  }
}
