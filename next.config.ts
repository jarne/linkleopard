import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const s3Url = process.env.NEXT_PUBLIC_S3_ENDPOINT
    ? new URL(process.env.NEXT_PUBLIC_S3_ENDPOINT!)
    : undefined
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
