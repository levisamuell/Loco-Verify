import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/licenses/[id] - Get specific license by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware
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
            businessName: true,
            phone: true,
          },
        },
      },
    });

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    return NextResponse.json({ data: license });
  } catch (error) {
    return errorHandler(error);
  }
}

// PUT /api/licenses/[id] - Update a license (for status changes, approvals, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware - only officials can update licenses
    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const licenseId = params.id;
    const body = await request.json();

    // Check if license exists
    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!existingLicense) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    // Validate status if provided
    if (body.status && !Object.values(LicenseStatus).includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid license status" },
        { status: 400 }
      );
    }

    // Update license
    const updatedLicense = await prisma.license.update({
      where: { id: licenseId },
      data: {
        status: body.status,
        licenseType: body.licenseType,
        station: body.station,
        validityPeriod: body.validityPeriod,
        documents: body.documents,
        reviewedBy: body.reviewedBy,
        reviewedAt: body.status ? new Date() : undefined, // Auto-set review date on status change
      },
      include: {
        vendor: {
          select: {
            name: true,
            businessName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "License updated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/licenses/[id] - Delete a license
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware - only officials can delete
    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const licenseId = params.id;

    // Check if license exists
    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!existingLicense) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    // Delete license
    await prisma.license.delete({
      where: { id: licenseId },
    });

    return NextResponse.json({
      message: "License deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
