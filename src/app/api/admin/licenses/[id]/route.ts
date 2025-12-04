import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 FIX IMPORTANT
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { id } = await context.params; // 👈 FIX IMPORTANT

    if (!id)
      return NextResponse.json(
        { error: "Missing license id" },
        { status: 400 }
      );

    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            shopName: true,
          },
        },
      },
    });

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    return NextResponse.json({ data: license });
  } catch (error) {
    return handleError(error, "GET /api/admin/licenses/[id]");
  }
}
