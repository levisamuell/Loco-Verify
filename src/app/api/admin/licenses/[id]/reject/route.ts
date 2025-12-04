import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const authResponse = await authMiddleware(request, ["ADMIN"]);
  if (authResponse) return authResponse;

  const updated = await prisma.license.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ message: "License rejected", data: updated });
}
