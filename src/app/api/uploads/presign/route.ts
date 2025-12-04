import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const { fileName, fileType, licenseId, field } = await req.json();

    if (!fileName || !fileType || !licenseId || !field) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;
    const region = process.env.AWS_REGION!;
    const key = `licenses/${licenseId}/${field}-${Date.now()}-${fileName}`;

    const client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
      ACL: "public-read",
    });

    const uploadUrl = await client.getSignedUrl(command, { expiresIn: 60 });

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (err) {
    console.error("PRESIGN ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
