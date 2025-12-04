import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// Helper to resolve params whether it's a Promise or an object
async function resolveParams(params: { id: string } | Promise<{ id: string }>) {
  return params instanceof Promise ? await params : params;
}

// GET /api/licenses/[id]
export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await resolveParams(context.params);

    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

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
    return handleError(error, "GET /api/licenses/[id]");
  }
}

// PUT /api/licenses/[id]
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await resolveParams(context.params);

    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const body = await request.json();

    const existingLicense = await prisma.license.findUnique({
      where: { id },
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
      where: { id },
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
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await resolveParams(context.params);

    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const existingLicense = await prisma.license.findUnique({
      where: { id },
    });

    if (!existingLicense) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    await prisma.license.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "License deleted successfully",
    });
  } catch (error) {
    return handleError(error, "DELETE /api/licenses/[id]");
  }
}
