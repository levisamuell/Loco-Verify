import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ⬅️ must await now!

  const authResponse = await authMiddleware(request, ["ADMIN"]);
  if (authResponse) return authResponse;

  const updated = await prisma.license.update({
    where: { id },
    data: {
      status: "APPROVED",
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json({ message: "License approved", data: updated });
}
