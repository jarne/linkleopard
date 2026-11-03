/**
 * S3 configuration read from environment variables at runtime
 */
export interface S3Config {
    endpoint: string
    bucket: string
    forcePathStyle: boolean
}

export function getS3Config(): S3Config {
    const forcePathStyle =
        process.env.S3_FORCE_PATH_STYLE ??
        process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE

    return {
        endpoint:
            process.env.S3_ENDPOINT ?? process.env.NEXT_PUBLIC_S3_ENDPOINT!,
        bucket: process.env.S3_BUCKET ?? process.env.NEXT_PUBLIC_S3_BUCKET!,
        forcePathStyle: forcePathStyle === "true",
    }
}
