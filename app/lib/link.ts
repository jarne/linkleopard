import { db } from "./db/connection"
import { linksTable } from "./db/schema"
import { eq } from "drizzle-orm"

export interface Link {
    id: number
    url: string
    name: string
    icon: string
}

/**
 * Create a new link
 */
export async function createLink(data: Omit<Link, "id">): Promise<Link> {
    const result = await db
        .insert(linksTable)
        .values({
            url: data.url,
            name: data.name,
            icon: data.icon,
        })
        .returning()

    return result[0]
}

/**
 * Get all links
 */
export async function getAllLinks(): Promise<Link[]> {
    const links = await db.select().from(linksTable)
    return links
}

/**
 * Get a link by ID
 */
export async function getLinkById(id: number): Promise<Link | undefined> {
    const result = await db
        .select()
        .from(linksTable)
        .where(eq(linksTable.id, id))
        .limit(1)

    return result[0]
}

/**
 * Update a link
 */
export async function updateLink(
    id: number,
    data: Partial<Omit<Link, "id">>
): Promise<Link | undefined> {
    const result = await db
        .update(linksTable)
        .set(data)
        .where(eq(linksTable.id, id))
        .returning()

    return result[0]
}

/**
 * Delete a link
 */
export async function deleteLink(id: number): Promise<boolean> {
    const result = await db.delete(linksTable).where(eq(linksTable.id, id))

    return result.rowsAffected > 0
}
