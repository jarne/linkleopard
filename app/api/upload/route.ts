import { NextResponse } from "next/server"
import { saveProcessedImage } from "@/app/lib/image-processor"

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const url = await saveProcessedImage(buffer)

        return NextResponse.json({ url })
    } catch (err) {
        console.error("Error processing image:", err)
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        )
    }
}
