import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";   // ✅ FIXED IMPORT
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// POST /api/licenses/[id]/renew - Renew a specific license
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const licenseId = params.id;
    const body = await request.json();

    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
      include: {
        vendor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!existingLicense) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    if (!["APPROVED", "EXPIRED"].includes(existingLicense.status)) {
      return NextResponse.json(
        {
          error:
            "License cannot be renewed. Only APPROVED or EXPIRED licenses can be renewed.",
          currentStatus: existingLicense.status
        },
        { status: 400 }
      );
    }

    const renewalPeriod =
      body.renewalPeriod || existingLicense.validityPeriod || 12;

    const currentExpiry = existingLicense.expiresAt || new Date();
    const newExpiry = new Date(currentExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + renewalPeriod);

    const renewedLicense = await prisma.license.update({
      where: { id: licenseId },
      data: {
        status: "PENDING_RENEWAL",
        expiresAt: newExpiry,
        validityPeriod: renewalPeriod,
        renewedAt: new Date()
      },
      include: {
        vendor: { select: { name: true, businessName: true } }
      }
    });

    return NextResponse.json(
      {
        message: "License renewal submitted successfully",
        data: renewedLicense,
        renewalDetails: {
          previousExpiry: existingLicense.expiresAt,
          newExpiry,
          renewalPeriod
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "POST /api/licenses/[id]/renew"); // ✅ FIXED
  }
}

// GET /api/licenses/[id]/renew - Check renewal eligibility
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const licenseId = params.id;

    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      select: {
        id: true,
        licenseType: true,
        status: true,
        expiresAt: true,
        validityPeriod: true,
        vendor: { select: { name: true, businessName: true } }
      }
    });

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    const isEligible = ["APPROVED", "EXPIRED"].includes(license.status);

    const daysUntilExpiry = license.expiresAt
      ? Math.ceil(
          (new Date(license.expiresAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    const renewalInfo = {
      eligible: isEligible,
      currentStatus: license.status,
      expiresAt: license.expiresAt,
      daysUntilExpiry,
      canRenew:
        isEligible && (daysUntilExpiry === null || daysUntilExpiry <= 30),
      message: !isEligible
        ? `License cannot be renewed. Current status: ${license.status}`
        : daysUntilExpiry && daysUntilExpiry > 30
          ? `License can be renewed in ${daysUntilExpiry - 30} days`
          : "License is eligible for renewal"
    };

    return NextResponse.json(
      {
        data: license,
        renewalEligibility: renewalInfo
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "GET /api/licenses/[id]/renew"); // ✅ FIXED
  }
}
