/**
 * Generate the public URL for an S3 object
 */
export function buildPublicS3Url(key: string): string {
    const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT!
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET!

    const url = new URL(endpoint)
    const protocol = url.protocol.replace(":", "") || "https"
    const forcePathStyle =
        process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE === "true"

    if (forcePathStyle) {
        return `${url.origin}/${bucket}/${key}`
    }

    return `${protocol}://${bucket}.${url.host}/${key}`
}
