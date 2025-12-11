import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const linksTable = sqliteTable("links", {
    id: int().primaryKey({ autoIncrement: true }),
    url: text().notNull(),
    name: text().notNull(),
    icon: text().notNull(),
})

export const infoTable = sqliteTable("info", {
    name: text().notNull(),
    bio: text().notNull(),
    profilePicture: text().notNull(),
})
