import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const vendorId = decoded.id;

    const licenses = await prisma.license.findMany({
      where: { vendorId },
      orderBy: { applicationDate: "desc" },
    });

    return NextResponse.json(licenses, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
