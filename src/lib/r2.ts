import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import * as fs from "fs";
import * as path from "path";

// Initialize S3 client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID!,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
  },
});

export type UploadResult = {
  key: string;
  url: string;
  mimeType: string;
  size: number;
};

/**
 * Upload a file to R2 storage
 * @param filePath - Local path to the file
 * @param key - The storage key (path in R2 bucket)
 * @returns Upload result with key, url, mimeType, and size
 */
export async function uploadToR2(
  filePath: string,
  key: string,
): Promise<UploadResult> {
  const fileBuffer = fs.readFileSync(filePath);
  const fileStats = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Determine MIME type based on extension
  const mimeTypes: Record<string, string> = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };

  const mimeType = mimeTypes[ext] ?? "application/octet-stream";

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await r2Client.send(command);

  return {
    key,
    url: `${env.R2_PUBLIC_URL}/${key}`,
    mimeType,
    size: fileStats.size,
  };
}
