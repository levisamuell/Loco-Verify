import { PrismaClient, LicenseStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { handleError } from "../../../../lib/errorHandler"; // ADD THIS IMPORT

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { vendorId } = await req.json();

    const result = await prisma.license.createMany({
      data: [
        {
          vendorId,
          licenseType: "Health Clearance",
          status: LicenseStatus.APPROVED,
        },
        {
          vendorId,
          licenseType: "Fire Safety Clearance",
          status: LicenseStatus.PENDING,
        },
        {
          vendorId,
          licenseType: "Hygiene Certificate",
          status: LicenseStatus.REJECTED,
        },
      ],
    });

    return NextResponse.json(
      { success: true, count: result.count },
      { status: 201 }
    );
  } catch (error: unknown) {
    return handleError(error, "POST /api/licenses/bulk"); // REPLACE ERROR HANDLING
  }
}
