import { NextResponse } from "next/server"
import { saveProcessedImage } from "@/app/admin/lib/image-processor"

/**
 * Handle image upload and processing
 */
export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file")
    const sizeParam = formData.get("size")

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const size = sizeParam ? parseInt(sizeParam as string, 10) : 64
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
