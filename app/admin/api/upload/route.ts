import { NextResponse } from "next/server"
import { saveProcessedImage } from "@/app/admin/lib/imageProcessor"
import { getSession } from "@/app/auth/lib/session"

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const DEFAULT_IMAGE_SIZE = 64
const MIN_IMAGE_SIZE = 16
const MAX_IMAGE_SIZE = 1024

/**
 * Parse and clamp the requested output image size
 */
function parseImageSize(sizeParam: FormDataEntryValue | null): number {
    if (typeof sizeParam !== "string") return DEFAULT_IMAGE_SIZE

    const size = parseInt(sizeParam, 10)
    if (Number.isNaN(size)) return DEFAULT_IMAGE_SIZE

    return Math.min(Math.max(size, MIN_IMAGE_SIZE), MAX_IMAGE_SIZE)
}

/**
 * Handle image upload and processing
 */
export async function POST(req: Request) {
    const session = await getSession()
    if (!session.authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contentLength = Number(req.headers.get("content-length"))
    if (contentLength > MAX_UPLOAD_BYTES) {
        return NextResponse.json({ error: "File too large" }, { status: 413 })
    }

    const formData = await req.formData()
    const file = formData.get("file")
    const size = parseImageSize(formData.get("size"))

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json({ error: "File too large" }, { status: 413 })
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const fileKey = await saveProcessedImage(buffer, "", size)

        return NextResponse.json({ fileKey })
    } catch (err) {
        console.error("Error processing image:", err)
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        )
    }
}
