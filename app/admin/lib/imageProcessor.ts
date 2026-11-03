import { PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { s3Client } from "./s3/s3Client"
import { getS3Config } from "./s3/s3Config"

/**
 * Process an image: resize to specified dimensions and convert to PNG
 */
async function processImage(
    buffer: Buffer,
    size: number = 64
): Promise<Buffer> {
    return sharp(buffer)
        .resize(size, size, {
            fit: "cover",
            position: "center",
        })
        .png()
        .toBuffer()
}

/**
 * Save a processed image to the uploads directory
 */
export async function saveProcessedImage(
    buffer: Buffer,
    prefix: string = "",
    size: number = 64
): Promise<string> {
    const processedBuffer = await processImage(buffer, size)

    const filename =
        prefix && prefix !== ""
            ? `${prefix}-${randomUUID()}.png`
            : `${randomUUID()}.png`

    await s3Client.send(
        new PutObjectCommand({
            Bucket: getS3Config().bucket,
            Key: filename,
            Body: processedBuffer,
            ContentType: "image/png",
            CacheControl: "public, max-age=31536000, immutable",
        })
    )

    return filename
}
