import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const s3Endpoint =
    process.env.S3_ENDPOINT ?? process.env.NEXT_PUBLIC_S3_ENDPOINT
const s3Url = s3Endpoint ? new URL(s3Endpoint) : undefined
const s3Protocol =
    (s3Url?.protocol.replace(":", "") as "https" | "http") || "https"
const remoteImagePatterns: RemotePattern[] = s3Url
    ? [
          { protocol: s3Protocol, hostname: s3Url.hostname },
          { protocol: s3Protocol, hostname: `*.${s3Url.hostname}` },
      ]
    : []

const nextConfig: NextConfig = {
    images: {
        remotePatterns: remoteImagePatterns,
        dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    },
}

export default nextConfig
