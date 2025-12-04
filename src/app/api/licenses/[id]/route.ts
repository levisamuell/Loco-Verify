import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/licenses/[id]
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
    return handleError(error, "GET /api/licenses/[id]");
  }
}

// PUT /api/licenses/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const licenseId = params.id;
    const body = await request.json();

    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!existingLicense) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    if (body.status && !Object.values(LicenseStatus).includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid license status" },
        { status: 400 }
      );
    }

    const updatedLicense = await prisma.license.update({
      where: { id: licenseId },
      data: {
        status: body.status,
        licenseType: body.licenseType,
        station: body.station,
        validityPeriod: body.validityPeriod,
        documents: body.documents,
        reviewedBy: body.reviewedBy,
        reviewedAt: body.status ? new Date() : undefined,
      },
      include: {
        vendor: {
          select: {
            name: true,
            email: true,
            shopName: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "License updated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    return handleError(error, "PUT /api/licenses/[id]");
  }
}

// DELETE /api/licenses/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const licenseId = params.id;

    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!existingLicense) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    await prisma.license.delete({
      where: { id: licenseId },
    });

    return NextResponse.json({
      message: "License deleted successfully",
    });
  } catch (error) {
    return handleError(error, "DELETE /api/licenses/[id]");
  }
}
