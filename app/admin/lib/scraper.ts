/**
 * Extract title from HTML string
 */
function extractTitle(html: string): string | null {
    // Try og:title first
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
        /<link\s+(?=[^>]*rel=["']apple-touch-icon["'])[^>]*href=["']([^"']+)["']/i,
        /<link\s+(?=[^>]*rel=["']icon["'])[^>]*href=["']([^"']+)["']/i,
        /<link\s+(?=[^>]*rel=["']shortcut icon["'])[^>]*href=["']([^"']+)["']/i,
    ]

    for (const pattern of iconPatterns) {
        const match = html.match(pattern)
        if (match) {
            const href = match[1]
            // Resolve relative URLs
            try {
                return new URL(href, base).href
            } catch {
                return href
            }
        }
    }

    return null
}

/**
 * Fetch the title of a URL
 */
export async function getUrlTitle(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { redirect: "follow" })
        const html = await response.text()
        return extractTitle(html)
    } catch (err) {
        console.error("Failed to get title from URL:", err)
        return null
    }
}

/**
 * Fetch the favicon URL of a website
 */
export async function getUrlFavicon(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { redirect: "follow" })
        const html = await response.text()
        return extractFavicon(html, url)
    } catch (err) {
        console.error("Failed to get favicon from URL:", err)
        return null
    }
}
