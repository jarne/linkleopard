import { S3Client } from "@aws-sdk/client-s3"

function createS3Client() {
    return new S3Client({
        region: process.env.S3_REGION!,
        endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_ACCESS_SECRET!,
        },
        forcePathStyle: process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE
            ? process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE === "true"
            : false,
    })
}

// Reuse the S3 client across hot reloads in development
const globalForS3 = globalThis as unknown as { s3Client?: S3Client }
export const s3Client = globalForS3.s3Client ?? createS3Client()
if (process.env.NODE_ENV !== "production") globalForS3.s3Client = s3Client
