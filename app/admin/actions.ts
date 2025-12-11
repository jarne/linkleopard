"use server"

import {
    createLink,
    deleteLink,
    getAllLinks,
    updateLink,
    type Link,
} from "@/app/lib/link"

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
