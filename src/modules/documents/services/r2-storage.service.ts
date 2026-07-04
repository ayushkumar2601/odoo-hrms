import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(fileName: string, fileBuffer: Buffer, mimeType: string) {
  if (!process.env.R2_BUCKET_NAME) throw new Error("R2 not configured");

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  }));

  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}
