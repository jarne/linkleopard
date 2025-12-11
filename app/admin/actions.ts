"use server"

import {
    createLink,
    deleteLink,
    getAllLinks,
    updateLink,
    type Link,
} from "@/app/lib/link"
import { getInfo, updateInfo, type Info } from "@/app/lib/info"
import { getUrlTitle, getUrlFavicon } from "./lib/scraper"
import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

export async function listLinksAction(): Promise<Link[]> {
    return getAllLinks()
}

export async function createLinkAction(data: Omit<Link, "id">): Promise<Link> {
    return createLink(data)
}

export async function updateLinkAction(
    id: number,
    data: Partial<Omit<Link, "id">>
): Promise<Link | undefined> {
    return updateLink(id, data)
}

export async function deleteLinkAction(id: number): Promise<boolean> {
    return deleteLink(id)
}

export async function scrapeLinkMetadataAction(
    url: string
): Promise<{ title: string | null; favicon: string | null }> {
    const title = await getUrlTitle(url)
    let favicon = await getUrlFavicon(url)

    // Download and save favicon if found
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
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Determine file extension from content-type or use png as default
    const contentType = response.headers.get("content-type") || "image/png"
    const ext = contentType.includes("svg")
        ? ".svg"
        : contentType.includes("ico")
          ? ".ico"
          : contentType.includes("png")
            ? ".png"
            : contentType.includes("jpeg")
              ? ".jpg"
              : ".png"

    const filename = `favicon-${randomUUID()}${ext}`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, Buffer.from(buffer))

    return `/uploads/${filename}`
}

export async function getInfoAction(): Promise<Info | undefined> {
    return getInfo()
}

export async function updateInfoAction(data: Info): Promise<Info> {
    return updateInfo(data)
}
