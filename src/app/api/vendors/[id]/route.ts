import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";
import { authMiddleware } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET /api/vendors/[id] - Get specific vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const vendorId = params.id;

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        licenses: {
          orderBy: { createdAt: "desc" },
          take: 5, // Include latest 5 licenses
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ data: vendor });
  } catch (error) {
    return errorHandler(error);
  }
}

// PUT /api/vendors/[id] - Update a vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    const vendorId = params.id;
    const body = await request.json();

    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!existingVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Update vendor
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: body.name,
        businessName: body.businessName,
        phone: body.phone,
        address: body.address,
        status: body.status,
      },
    });

    return NextResponse.json({
      message: "Vendor updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/vendors/[id] - Delete a vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware (admin only for deletion)
    const authResponse = await authMiddleware(request, ["OFFICIAL"]);
    if (authResponse) return authResponse;

    const vendorId = params.id;

    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!existingVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Delete vendor (Prisma will handle related licenses via cascade if configured)
    await prisma.vendor.delete({
      where: { id: vendorId },
    });

    return NextResponse.json({
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
