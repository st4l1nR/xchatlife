/**
 * Script to upload email assets (logo, etc.) to R2 CDN
 *
 * Usage:
 *   npx tsx scripts/upload-email-assets.ts
 *
 * Make sure your .env file has the following variables:
 *   - R2_ENDPOINT (optional, for local MinIO)
 *   - R2_ACCOUNT_ID
 *   - R2_ACCESS_KEY_ID
 *   - R2_SECRET_ACCESS_KEY
 *   - R2_BUCKET_NAME
 *   - R2_PUBLIC_URL
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const {
  R2_ENDPOINT,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

// Validate required env vars
if (
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME ||
  !R2_PUBLIC_URL
) {
  console.error("Missing required environment variables:");
  console.error("  - R2_ACCESS_KEY_ID");
  console.error("  - R2_SECRET_ACCESS_KEY");
  console.error("  - R2_BUCKET_NAME");
  console.error("  - R2_PUBLIC_URL");
  process.exit(1);
}

// Initialize S3 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT ?? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: !!R2_ENDPOINT,
});

// Assets to upload
const EMAIL_ASSETS = [
  {
    localPath: "public/images/logo.png",
    r2Key: "email/logo.png",
    description: "Email logo",
  },
];

async function uploadAsset(asset: {
  localPath: string;
  r2Key: string;
  description: string;
}) {
  const absolutePath = path.join(process.cwd(), asset.localPath);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const ext = path.extname(asset.localPath).toLowerCase();

  // Determine MIME type
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  const contentType = mimeTypes[ext] ?? "application/octet-stream";

  console.log(`Uploading ${asset.description}...`);
  console.log(`  Local: ${asset.localPath}`);
  console.log(`  R2 Key: ${asset.r2Key}`);
  console.log(`  Content-Type: ${contentType}`);
  console.log(`  Size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: asset.r2Key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable", // Cache for 1 year
      }),
    );

    const publicUrl = `${R2_PUBLIC_URL}/${asset.r2Key}`;
    console.log(`  URL: ${publicUrl}`);
    console.log(`  Status: SUCCESS`);
    console.log("");

    return publicUrl;
  } catch (error) {
    console.error(`  Status: FAILED`);
    console.error(`  Error: ${error}`);
    console.log("");
    return null;
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Uploading Email Assets to R2 CDN");
  console.log("=".repeat(60));
  console.log("");

  const results: { description: string; url: string | null }[] = [];

  for (const asset of EMAIL_ASSETS) {
    const url = await uploadAsset(asset);
    results.push({ description: asset.description, url });
  }

  console.log("=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.url !== null);
  const failed = results.filter((r) => r.url === null);

  console.log(`Total: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log("");

  if (successful.length > 0) {
    console.log("Uploaded URLs:");
    for (const result of successful) {
      console.log(`  ${result.description}: ${result.url}`);
    }
    console.log("");
    console.log("Add these to your src/server/email/constants.ts:");
    console.log("");
    for (const result of successful) {
      const varName = result.description
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z_]/g, "");
      console.log(`export const ${varName}_URL = "${result.url}";`);
    }
  }

  if (failed.length > 0) {
    console.log("\nFailed uploads:");
    for (const result of failed) {
      console.log(`  - ${result.description}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
