import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const region = process.env.AWS_REGION || "us-east-1";

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

    // ✅ Correct AWS SDK v3 method for presigning URLs
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 });

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
