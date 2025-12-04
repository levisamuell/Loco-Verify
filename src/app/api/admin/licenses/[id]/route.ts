import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LicenseStatus } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

async function resolveParams(params: { id: string } | Promise<{ id: string }>) {
  return params instanceof Promise ? await params : params;
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { id } = await resolveParams(context.params);

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

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { id } = await resolveParams(context.params);
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

    // Only update fields that exist in Prisma schema
    const updatedLicense = await prisma.license.update({
      where: { id },
      data: {
        status: body.status,
        licenseType: body.licenseType,
        idProofLink: body.idProofLink,
        shopPhotoLink: body.shopPhotoLink,
        issueDate: body.issueDate,
        expiryDate: body.expiryDate,
      },
    });

    return NextResponse.json({
      message: "License updated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    return handleError(error, "PUT /api/admin/licenses/[id]");
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const { id } = await resolveParams(context.params);

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
    return handleError(error, "DELETE /api/admin/licenses/[id]");
  }
}
