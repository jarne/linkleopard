import type { S3Config } from "./s3Config"

/**
 * Get the public base URL of the S3 bucket (without trailing slash)
 */
export function getS3BaseUrl({
    endpoint,
    bucket,
    forcePathStyle,
}: S3Config): string {
    const url = new URL(endpoint)

    if (forcePathStyle) {
        return `${url.origin}/${bucket}`
    }

    const protocol = url.protocol.replace(":", "") || "https"
    return `${protocol}://${bucket}.${url.host}`
}

/**
 * Generate the public URL for an S3 object
 */
export function buildS3Url(baseUrl: string, key: string): string {
    return `${baseUrl}/${key}`
}
