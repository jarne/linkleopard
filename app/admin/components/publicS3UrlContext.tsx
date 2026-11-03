"use client"

import { createContext, useCallback, useContext } from "react"
import { buildS3Url } from "../lib/s3/s3UrlBuilder"

const PublicS3BaseUrlContext = createContext<string | null>(null)

/**
 * Provide the public S3 base URL (resolved on the server at
 * request time) to client components
 */
export function PublicS3UrlProvider({
    baseUrl,
    children,
}: {
    baseUrl: string
    children: React.ReactNode
}) {
    return (
        <PublicS3BaseUrlContext.Provider value={baseUrl}>
            {children}
        </PublicS3BaseUrlContext.Provider>
    )
}

/**
 * Get a function that builds the public URL for an S3 object key
 */
export function usePublicS3Url(): (key: string) => string {
    const baseUrl = useContext(PublicS3BaseUrlContext)
    if (baseUrl === null) {
        throw new Error(
            "usePublicS3Url must be used within a PublicS3UrlProvider"
        )
    }

    return useCallback((key: string) => buildS3Url(baseUrl, key), [baseUrl])
}
