import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function authMiddleware(
  request: NextRequest,
  allowedRoles: Array<"ADMIN" | "VENDOR"> = []
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Check if user role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { message: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Attach user info to request for API routes
    request.nextUrl.searchParams.set("userId", decoded.id);
    request.nextUrl.searchParams.set("userRole", decoded.role);

    return null; // Allow API to run
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
