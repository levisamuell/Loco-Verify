import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// Helper to resolve params whether it's a Promise or an object
async function resolveParams(
  params: { id: string } | Promise<{ id: string }>
) {
  return params instanceof Promise ? await params : params;
}

// GET /api/vendors/[id]
export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: vendorId } = await resolveParams(context.params);

    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
      include: {
        licenses: {
          orderBy: { applicationDate: "desc" },
          take: 5,
        },
      },
    });

    if (!vendor || vendor.role !== "VENDOR") {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ data: vendor });
  } catch (error) {
    return handleError(error, "GET /api/vendors/[id]");
  }
}

// PUT /api/vendors/[id]
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: vendorId } = await resolveParams(context.params);

    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const body = await request.json();

    const existingVendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });

    if (!existingVendor || existingVendor.role !== "VENDOR") {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const updatedVendor = await prisma.user.update({
      where: { id: vendorId },
      data: {
        name: body.name,
        phone: body.phone,
        shopName: body.shopName,
        email: body.email,
      },
    });

    return NextResponse.json(
      {
        message: "Vendor updated successfully",
        data: updatedVendor,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "PUT /api/vendors/[id]");
  }
}

// DELETE /api/vendors/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: vendorId } = await resolveParams(context.params);

    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const existingVendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });

    if (!existingVendor || existingVendor.role !== "VENDOR") {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: vendorId },
    });

    return NextResponse.json({
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    return handleError(error, "DELETE /api/vendors/[id]");
  }
}
