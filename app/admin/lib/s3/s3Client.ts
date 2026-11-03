import { S3Client } from "@aws-sdk/client-s3"
import { getS3Config } from "./s3Config"

function createS3Client() {
    const { endpoint, forcePathStyle } = getS3Config()

    return new S3Client({
        region: process.env.S3_REGION!,
        endpoint,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_ACCESS_SECRET!,
        },
        forcePathStyle,
    })
}

// Reuse the S3 client across hot reloads in development
const globalForS3 = globalThis as unknown as { s3Client?: S3Client }
export const s3Client = globalForS3.s3Client ?? createS3Client()
if (process.env.NODE_ENV !== "production") globalForS3.s3Client = s3Client
