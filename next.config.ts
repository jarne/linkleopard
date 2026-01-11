import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const s3Url = new URL(process.env.NEXT_PUBLIC_S3_ENDPOINT!)
const s3Protocol =
    (s3Url.protocol.replace(":", "") as "https" | "http") || "https"
const remoteImagePatterns: RemotePattern[] = [
    { protocol: s3Protocol, hostname: s3Url.hostname },
    { protocol: s3Protocol, hostname: `*.${s3Url.hostname}` },
]

const nextConfig: NextConfig = {
    images: {
        remotePatterns: remoteImagePatterns,
        dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    },
}

export default nextConfig
