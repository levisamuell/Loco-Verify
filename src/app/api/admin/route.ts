import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { handleError } from "../../../lib/errorHandler"; // ADD THIS IMPORT

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authorization token missing");
      error.name = "UnauthorizedError";
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

    // ✅ Restrict to Official users only
    if (decoded.role !== "Official") {
      const error = new Error("Access denied. Officials only.");
      error.name = "UnauthorizedError";
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Welcome Official! You have full access." },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "GET /api/admin"); // REPLACE ERROR HANDLING
  }
}
