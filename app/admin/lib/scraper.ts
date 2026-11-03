import { fetchWithTimeout, readBodyWithLimit } from "./fetchUtils"

/**
 * Maximum amount of HTML read from a page, metadata lives in the
 * <head> so there's no need to buffer huge pages completely
 */
const MAX_HTML_BYTES = 512 * 1024

/**
 * Extract title from HTML string
 */
function extractTitle(html: string): string | null {
    // Try og:site_name first
    const ogSiteNameMatch = html.match(
        /<meta\s+(?=[^>]*property=["']og:site_name["'])[^>]*content=["']([^"']+)["']/i
    )
    if (ogSiteNameMatch) return ogSiteNameMatch[1]

    // Try og:title
    const ogTitleMatch = html.match(
        /<meta\s+(?=[^>]*property=["']og:title["'])[^>]*content=["']([^"']+)["']/i
    )
    if (ogTitleMatch) return ogTitleMatch[1]

    // Try twitter:title
    const twitterTitleMatch = html.match(
        /<meta\s+(?=[^>]*name=["']twitter:title["'])[^>]*content=["']([^"']+)["']/i
    )
    if (twitterTitleMatch) return twitterTitleMatch[1]

    // Try regular title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch) return titleMatch[1].trim()

    return null
}

/**
 * Extract favicon URL from HTML string and resolve relative URLs
 */
function extractFavicon(html: string, baseUrl: string): string | null {
    const base = new URL(baseUrl)

    // Priority order: apple-touch-icon, icon, shortcut icon
    const iconPatterns = [
        // apple-touch-icon (rel before href and href before rel)
        [
            /<link[^>]*\srel=["']apple-touch-icon["'][^>]*\shref=["']([^"']+)["']/i,
            /<link[^>]*\shref=["']([^"']+)["'][^>]*\srel=["']apple-touch-icon["']/i,
        ],
        // icon
        [
            /<link[^>]*\srel=["']icon["'][^>]*\shref=["']([^"']+)["']/i,
            /<link[^>]*\shref=["']([^"']+)["'][^>]*\srel=["']icon["']/i,
        ],
        // shortcut icon
        [
            /<link[^>]*\srel=["']shortcut icon["'][^>]*\shref=["']([^"']+)["']/i,
            /<link[^>]*\shref=["']([^"']+)["'][^>]*\srel=["']shortcut icon["']/i,
        ],
    ]

    for (const patterns of iconPatterns) {
        for (const pattern of patterns) {
            const match = html.match(pattern)
            if (match) {
                const href = match[1]
                try {
                    return new URL(href, base).href
                } catch {
                    return href
                }
            }
        }
    }

    return null
}

/**
 * Fetch a URL once and extract its title and favicon URL
 */
export async function getUrlMetadata(
    url: string
): Promise<{ title: string | null; favicon: string | null }> {
    try {
        const response = await fetchWithTimeout(url)
        const body = await readBodyWithLimit(response, MAX_HTML_BYTES, {
            truncate: true,
        })
        const html = body.toString("utf-8")

        return {
            title: extractTitle(html),
            favicon: extractFavicon(html, response.url || url),
        }
    } catch (err) {
        console.error("Failed to get metadata from URL:", err)
        return { title: null, favicon: null }
    }
}
