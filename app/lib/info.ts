import { db } from "./db/connection"
import { infoTable } from "./db/schema"

export interface Info {
    name: string
    bio: string
    profilePicture: string
}

/**
 * Get the info (profile information)
 * Since there's only one row, we return the first one
 */
export async function getInfo(): Promise<Info | undefined> {
    const result = await db.select().from(infoTable).limit(1)
    return result[0]
}

/**
 * Update the info (profile information)
 * Since there's only one row, we delete all and insert the new one
 */
export async function updateInfo(data: Info): Promise<Info> {
    await db.delete(infoTable)
    const result = await db
        .insert(infoTable)
        .values({
            name: data.name,
            bio: data.bio,
            profilePicture: data.profilePicture,
        })
        .returning()

    return result[0]
}
