import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Define the payload structure to resolve the 'any' error
type JwtPayload = { userId: string; role: string };

// Paths that require authentication
const protectedPaths = [
  "/api/users",
  "/api/admin",
  "/api/orders",
  "/api/products",
];

// Public paths that don't require authentication
const publicPaths = [
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/verify",
  "/api/public",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if the current path is explicitly public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Skip middleware for public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Apply authentication for protected paths
  if (isProtectedPath) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Access token required" },
        { status: 401 }
      );
    }

    try {
      // FIX 1: Cast the result to the defined type to remove the 'any' error (Line 52)
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Add user info to request headers for API routes to use
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-user-role", decoded.role);

      // Restrict admin routes to Official role only (assuming Official is the admin role)
      if (pathname.startsWith("/api/admin") && decoded.role !== "Official") {
        return NextResponse.json(
          { success: false, message: "Admin access required" },
          { status: 403 }
        );
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      // FIX 2: Precede the unused variable with an underscore (_error) (Line 72)
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    "/api/users/:path*",
    "/api/admin/:path*",
    "/api/orders/:path*",
    "/api/auth/:path*",
  ],
};
