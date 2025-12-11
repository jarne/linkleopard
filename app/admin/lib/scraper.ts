import createMetascraper from "metascraper"
import metascraperTitle from "metascraper-title"
import metascraperFavicon from "metascraper-logo-favicon"

const metascraper = createMetascraper([
    metascraperTitle(),
    metascraperFavicon(),
])

/**
 * Fetch the title of a URL
 */
export async function getUrlTitle(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { redirect: "follow" })
        const html = await response.text()
        const result = await metascraper({ html, url })
        return result.title || null
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
        const result = await metascraper({ html, url })
        return result.logo || null
    } catch (err) {
        console.error("Failed to get favicon from URL:", err)
        return null
    }
}
