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

/**
 * Save a profile picture (512x512)
 */
export async function saveProfilePicture(buffer: Buffer): Promise<string> {
    return saveProcessedImage(buffer, "profile", 512)
}

/**
 * Save a link icon (64x64)
 */
export async function saveLinkIcon(buffer: Buffer): Promise<string> {
    return saveProcessedImage(buffer)
}
