import sharp from "sharp"
import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

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
