import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

// Initialize S3 client for Cloudflare R2 or MinIO (local dev)
export const r2Client = new S3Client({
  region: "auto",
  endpoint:
    env.R2_ENDPOINT ?? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? "",
  },
  forcePathStyle: !!env.R2_ENDPOINT, // Required for MinIO
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
  r2Key: string, // e.g., "characters/abc123/poster.webp"
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
    }),
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
  extension: string,
): string {
  return `characters/${characterId}/${type}.${extension}`;
}

// Get extension from URL or mime type
function getExtensionFromUrl(url: string, mimeType?: string): string {
  // Try to get extension from URL path
  const urlPath = new URL(url).pathname;
  const ext = path.extname(urlPath).toLowerCase().replace(".", "");
  if (ext) return ext;

  // Fall back to mime type
  if (mimeType) {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
    };
    return mimeToExt[mimeType] ?? "bin";
  }

  return "bin";
}

// Fetch media from URL and re-upload to R2 with a unique key
export async function fetchAndUploadToR2(
  sourceUrl: string,
  folder: string,
  type: "poster" | "video",
): Promise<{ url: string; key: string; mimeType: string; size: number }> {
  console.log(`[fetchAndUploadToR2] Starting upload for ${type}`);
  console.log(`[fetchAndUploadToR2] Source URL: ${sourceUrl}`);
  console.log(`[fetchAndUploadToR2] Folder: ${folder}`);

  // Validate source URL
  let parsedSourceUrl: URL;
  try {
    parsedSourceUrl = new URL(sourceUrl);
    console.log(
      `[fetchAndUploadToR2] Parsed source URL successfully: ${parsedSourceUrl.href}`,
    );
  } catch (error) {
    console.error(
      `[fetchAndUploadToR2] Invalid source URL: ${sourceUrl}`,
      error,
    );
    throw new Error(`Invalid source URL for ${type}: ${sourceUrl}`);
  }

  // Fetch the media from the source URL
  console.log(`[fetchAndUploadToR2] Fetching media...`);
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    console.error(
      `[fetchAndUploadToR2] Fetch failed: ${response.status} ${response.statusText}`,
    );
    throw new Error(
      `Failed to fetch media from ${sourceUrl}: ${response.statusText}`,
    );
  }

  const contentType =
    response.headers.get("content-type") ?? "application/octet-stream";
  console.log(`[fetchAndUploadToR2] Content-Type: ${contentType}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log(`[fetchAndUploadToR2] Downloaded ${buffer.length} bytes`);

  // Generate a unique key with UUID to avoid collisions
  const extension = getExtensionFromUrl(sourceUrl, contentType);
  const uniqueId = randomUUID();
  const r2Key = `${folder}/${uniqueId}/${type}.${extension}`;
  console.log(`[fetchAndUploadToR2] Generated R2 key: ${r2Key}`);

  // Upload to R2
  console.log(
    `[fetchAndUploadToR2] Uploading to R2 bucket: ${env.R2_BUCKET_NAME}`,
  );
  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: r2Key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  console.log(`[fetchAndUploadToR2] Upload complete`);

  // Return the public URL and metadata
  const publicUrl = `${env.R2_PUBLIC_URL}/${r2Key}`;
  console.log(`[fetchAndUploadToR2] Public URL: ${publicUrl}`);

  return {
    url: publicUrl,
    key: r2Key,
    mimeType: contentType,
    size: buffer.length,
  };
}

// Generate a presigned URL for direct upload to R2
export async function getPresignedUploadUrl(
  folder: string,
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  // Generate unique key with UUID to prevent collisions
  const uniqueId = randomUUID();
  const key = `${folder}/${uniqueId}/${filename}`;

  // Create presigned URL for PUT request
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client as any, command as any, {
    expiresIn: 900,
  }); // 15 minutes

  return {
    uploadUrl,
    publicUrl: `${env.R2_PUBLIC_URL}/${key}`,
    key,
  };
}
