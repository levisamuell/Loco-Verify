import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleError } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/vendors/[id] - Get specific vendor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const vendorId = params.id;

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

// PUT /api/vendors/[id] - Update vendor information
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const vendorId = params.id;
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

// DELETE /api/vendors/[id] - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request, ["ADMIN"]);
    if (authResponse) return authResponse;

    const vendorId = params.id;

    const existingVendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });

    if (!existingVendor || existingVendor.role !== "VENDOR") {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Delete vendor (cascade will delete licenses if configured)
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
