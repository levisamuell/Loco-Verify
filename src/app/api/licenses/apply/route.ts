import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const vendorId = decoded.id;

    const formData = await req.formData();

    const licenseType = formData.get("licenseType") as string;
    const idProofFile = formData.get("idProof") as File | null;
    const shopPhotoFile = formData.get("shopPhoto") as File | null;

    if (!licenseType || !idProofFile || !shopPhotoFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Helper to save file locally
    async function saveFile(file: File) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, bytes);
      return `/uploads/${fileName}`;
    }

    const idProofURL = await saveFile(idProofFile);
    const shopPhotoURL = await saveFile(shopPhotoFile);

    // Create license entry
    const license = await prisma.license.create({
      data: {
        vendorId,
        licenseType,
        status: "PENDING",
        idProofLink: idProofURL,
        shopPhotoLink: shopPhotoURL,
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully", license },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("LICENSE API ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
