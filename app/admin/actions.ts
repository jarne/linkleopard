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
import { getUrlTitle, getUrlFavicon } from "./lib/scraper"
import { saveProcessedImage } from "@/app/admin/lib/image-processor"

export async function listLinksAction(): Promise<Link[]> {
    return getAllLinks()
}

export async function createLinkAction(
    data: Omit<Link, "id" | "position">
): Promise<Link> {
    return createLink(data)
}

export async function updateLinkAction(
    id: number,
    data: Partial<Omit<Link, "id" | "position">>
): Promise<Link | undefined> {
    return updateLink(id, data)
}

export async function deleteLinkAction(id: number): Promise<boolean> {
    return deleteLink(id)
}

export async function reorderLinksAction(
    idsInOrder: number[]
): Promise<boolean> {
    await updateLinksOrder(idsInOrder)
    return true
}

export async function scrapeLinkMetadataAction(
    url: string
): Promise<{ title: string | null; favicon: string | null }> {
    const title = await getUrlTitle(url)
    let favicon = await getUrlFavicon(url)

    if (favicon) {
        try {
            favicon = await downloadAndSaveFavicon(favicon)
        } catch (err) {
            console.error("Failed to download favicon:", err)
            favicon = null
        }
    }

    return { title, favicon }
}

async function downloadAndSaveFavicon(faviconUrl: string): Promise<string> {
    const response = await fetch(faviconUrl)
    if (!response.ok) {
        throw new Error(`Failed to download favicon: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    return saveProcessedImage(Buffer.from(buffer), "favicon")
}

export async function getInfoAction(): Promise<Info | undefined> {
    return getInfo()
}

export async function updateInfoAction(data: Info): Promise<Info> {
    return updateInfo(data)
}
