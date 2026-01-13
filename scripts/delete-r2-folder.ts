import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import "dotenv/config";

const FOLDER_PREFIX = "characters/"; // Change this to target a different folder

async function deleteR2Folder() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing R2 environment variables:");
    console.error("  R2_ACCOUNT_ID:", accountId ? "set" : "missing");
    console.error("  R2_ACCESS_KEY_ID:", accessKeyId ? "set" : "missing");
    console.error(
      "  R2_SECRET_ACCESS_KEY:",
      secretAccessKey ? "set" : "missing",
    );
    console.error("  R2_BUCKET_NAME:", bucketName ? "set" : "missing");
    process.exit(1);
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log(
    `\nDeleting all objects in "${FOLDER_PREFIX}" from bucket "${bucketName}"...\n`,
  );

  let totalDeleted = 0;
  let continuationToken: string | undefined;

  do {
    // List objects with the prefix
    const listResponse = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: FOLDER_PREFIX,
        ContinuationToken: continuationToken,
      }),
    );

    const objects = listResponse.Contents;

    if (!objects || objects.length === 0) {
      if (totalDeleted === 0) {
        console.log("No objects found in the specified folder.");
      }
      break;
    }

    console.log(`Found ${objects.length} objects to delete...`);

    // Delete objects in batches of 1000 (S3 limit)
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: objects.map((obj) => ({ Key: obj.Key })),
        Quiet: false,
      },
    };

    const deleteResponse = await client.send(
      new DeleteObjectsCommand(deleteParams),
    );

    if (deleteResponse.Deleted) {
      totalDeleted += deleteResponse.Deleted.length;
      console.log(`Deleted ${deleteResponse.Deleted.length} objects`);
    }

    if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
      console.error("Errors:", deleteResponse.Errors);
    }

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);

  console.log(`\nTotal objects deleted: ${totalDeleted}`);
}

deleteR2Folder().catch(console.error);
