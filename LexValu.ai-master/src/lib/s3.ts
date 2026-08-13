import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectsCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// No static credentials: on ECS the SDK resolves the IAM task role
// automatically via the default provider chain. HIPAA-safe (no keys stored).
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

export async function generatePresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: key,
    ContentType: contentType,
  });

  // URL valid for 5 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}

export async function generatePresignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: key,
  });

  // URL valid for 5 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}

export async function deleteS3Objects(keys: string[]) {
  if (keys.length === 0) return;
  
  const command = new DeleteObjectsCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Delete: {
      Objects: keys.map(key => ({ Key: key }))
    }
  });

  const response = await s3Client.send(command);
  
  if (response.Errors && response.Errors.length > 0) {
    console.error("S3 Delete Errors:", response.Errors);
    throw new Error(`Failed to delete S3 objects: ${response.Errors.map(e => e.Code).join(', ')}`);
  }
}

export async function moveS3Object(sourceKey: string, targetKey: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || "";
  if (!bucketName) throw new Error("Missing AWS_S3_BUCKET_NAME");

  const copyCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${sourceKey}`,
    Key: targetKey,
  });

  await s3Client.send(copyCommand);
  await deleteS3Objects([sourceKey]);
}

