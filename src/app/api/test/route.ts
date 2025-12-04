import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../../../lib/errorHandler"; // ADD THIS IMPORT

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    return NextResponse.json({ message: "✅ Prisma connection successful!" });
  } catch (error) {
    return handleError(error, "GET /api/test"); // REPLACE ERROR HANDLING
  } finally {
    await prisma.$disconnect();
  }
}
