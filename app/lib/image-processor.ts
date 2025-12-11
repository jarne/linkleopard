import sharp from "sharp"
import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

/**
 * Process an image: resize to 64x64 and convert to PNG
 */
async function processImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .resize(64, 64, {
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
    prefix: string = ""
): Promise<string> {
    const processedBuffer = await processImage(buffer)

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const filename =
        prefix && prefix !== ""
            ? `${prefix}-${randomUUID()}.png`
            : `${randomUUID()}.png`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, processedBuffer)

    return `/uploads/${filename}`
}
