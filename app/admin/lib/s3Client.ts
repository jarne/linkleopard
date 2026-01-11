import { S3Client } from "@aws-sdk/client-s3"

export const s3Client = new S3Client({
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
