import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET — renewal eligibility based on latest license of vendor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN", "VENDOR"]);
    if (authResponse) return authResponse;

    const { id } = await params;
    const vendorId = id;

    const latest = await prisma.license.findFirst({
      where: { vendorId },
      orderBy: { expiryDate: "desc" }
    });

    if (!latest) {
      return NextResponse.json({ error: "No licenses found for this vendor" }, { status: 404 });
    }

    const isEligible =
      latest.status === "APPROVED" || latest.status === "EXPIRED";

    const daysUntilExpiry =
      latest.expiryDate != null
        ? Math.ceil(
            (latest.expiryDate.getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

    return NextResponse.json({
      data: latest,
      renewalEligibility: {
        eligible: isEligible,
        status: latest.status,
        expiryDate: latest.expiryDate,
        daysUntilExpiry
      }
    });
  } catch (error) {
    return handleError(error, "GET /api/vendors/[id]/renew");
  }
}

// POST — vendor requests renewal of latest license
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN", "VENDOR"]);
    if (authResponse) return authResponse;

    const { id } = await params;
    const vendorId = id;

    const latest = await prisma.license.findFirst({
      where: { vendorId },
      orderBy: { expiryDate: "desc" }
    });

    if (!latest) {
      return NextResponse.json({ error: "No licenses found for this vendor" }, { status: 404 });
    }

    if (latest.status !== "APPROVED" && latest.status !== "EXPIRED") {
      return NextResponse.json(
        { error: "Only APPROVED or EXPIRED licenses can be renewed" },
        { status: 400 }
      );
    }

    const newExpiry = new Date();
    newExpiry.setMonth(newExpiry.getMonth() + 12);

    const updated = await prisma.license.update({
      where: { id: latest.id },
      data: {
        status: "PENDING",
        expiryDate: newExpiry
      }
    });

    return NextResponse.json({
      message: "License renewal submitted successfully",
      data: updated
    });
  } catch (error) {
    return handleError(error, "POST /api/vendors/[id]/renew");
  }
}
