import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import * as fs from "fs";
import * as path from "path";

// Initialize S3 client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

// Get mime type from file extension
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };
  return mimeTypes[ext] ?? "application/octet-stream";
}

// Upload a file from the public directory to R2
export async function uploadPublicFileToR2(
  publicPath: string, // e.g., "/images/create-character/girls/realistic/step-1/image.webp"
  r2Key: string // e.g., "characters/abc123/poster.webp"
): Promise<{ url: string; key: string; mimeType: string; size: number }> {
  // Resolve the absolute path from the public directory
  const absolutePath = path.join(process.cwd(), "public", publicPath);

  // Read the file
  const fileBuffer = fs.readFileSync(absolutePath);
  const mimeType = getMimeType(publicPath);

  // Upload to R2
  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );

  // Return the public URL
  const url = `${env.R2_PUBLIC_URL}/${r2Key}`;

  return {
    url,
    key: r2Key,
    mimeType,
    size: fileBuffer.length,
  };
}

// Generate a unique key for character media
export function generateCharacterMediaKey(
  characterId: string,
  type: "poster" | "video",
  extension: string
): string {
  return `characters/${characterId}/${type}.${extension}`;
}
