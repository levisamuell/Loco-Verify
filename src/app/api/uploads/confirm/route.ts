import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { licenseId, field, fileUrl } = await req.json();

    if (!licenseId || !field || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let updateData: any = {};

    if (field === "idProof") updateData.idProofLink = fileUrl;
    else if (field === "shopPhoto") updateData.shopPhotoLink = fileUrl;
    else updateData.notes = fileUrl;

    await prisma.license.update({
      where: { id: licenseId },
      data: updateData,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CONFIRM ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save file URL" },
      { status: 500 }
    );
  }
}
