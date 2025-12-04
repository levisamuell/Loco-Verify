import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await authMiddleware(request, ["ADMIN"]);
  if (authResponse) return authResponse;

  const { id } = params;

  const updated = await prisma.license.update({
    where: { id },
    data: {
      status: "APPROVED",
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    },
  });

  return NextResponse.json({ message: "License approved", data: updated });
}
