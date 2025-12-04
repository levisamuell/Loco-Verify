import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authorization token missing or invalid format");
      error.name = "ValidationError";
      throw error;
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
    } catch {
      const error = new Error("Invalid or expired token");
      error.name = "UnauthorizedError";
      throw error;
    }

    // Fetch user 
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    // Allow only VENDOR or ADMIN
    if (![Role.VENDOR, Role.ADMIN].includes(user.role)) {
      const error = new Error("Access denied. Invalid role.");
      error.name = "UnauthorizedError";
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: `Access granted. Hello ${user.role}!`,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}
