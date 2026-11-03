"use server"

import {
    createLink,
    deleteLink,
    getAllLinks,
    updateLink,
    type Link,
    updateLinksOrder,
} from "@/app/lib/link"
import { getInfo, updateInfo, type Info } from "@/app/lib/info"
import { redirect } from "next/navigation"
import { getSession, requireAuth } from "@/app/auth/lib/session"
import { getUrlMetadata } from "./lib/scraper"
import { fetchWithTimeout, readBodyWithLimit } from "./lib/fetchUtils"
import { saveProcessedImage } from "@/app/admin/lib/imageProcessor"

/**
 * Maximum size of a downloaded favicon
 */
const MAX_FAVICON_BYTES = 5 * 1024 * 1024

export async function listLinksAction(): Promise<Link[]> {
    await requireAuth()
    return getAllLinks()
}

export async function createLinkAction(
    data: Omit<Link, "id" | "position">
): Promise<Link> {
    await requireAuth()
    return createLink(data)
}

export async function updateLinkAction(
    id: number,
    data: Partial<Omit<Link, "id" | "position">>
): Promise<Link | undefined> {
    await requireAuth()
    return updateLink(id, data)
}

export async function deleteLinkAction(id: number): Promise<boolean> {
    await requireAuth()
    return deleteLink(id)
}

export async function reorderLinksAction(
    idsInOrder: number[]
): Promise<boolean> {
    await requireAuth()
    await updateLinksOrder(idsInOrder)
    return true
}

export async function scrapeLinkMetadataAction(
    url: string
): Promise<{ title: string | null; favicon: string | null }> {
    await requireAuth()
    const { title, favicon: faviconUrl } = await getUrlMetadata(url)

    let favicon: string | null = null
    if (faviconUrl) {
        try {
            favicon = await downloadAndSaveFavicon(faviconUrl)
        } catch (err) {
            console.error("Failed to download favicon:", err)
        }
    }

    return { title, favicon }
}

async function downloadAndSaveFavicon(faviconUrl: string): Promise<string> {
    const response = await fetchWithTimeout(faviconUrl)
    if (!response.ok) {
        await response.body?.cancel()
        throw new Error(`Failed to download favicon: ${response.statusText}`)
    }

    const buffer = await readBodyWithLimit(response, MAX_FAVICON_BYTES)
    return saveProcessedImage(buffer, "favicon")
}

export async function getInfoAction(): Promise<Info | undefined> {
    await requireAuth()
    return getInfo()
}

export async function updateInfoAction(data: Info): Promise<Info> {
    await requireAuth()
    return updateInfo(data)
}

export async function logoutAction(): Promise<void> {
    const session = await getSession()
    session.destroy()
    redirect("/auth/login")
}
