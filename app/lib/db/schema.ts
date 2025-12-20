import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const linksTable = sqliteTable("links", {
    id: int().primaryKey({ autoIncrement: true }),
    url: text().notNull(),
    name: text().notNull(),
    icon: text().default(""),
    position: int().default(0),
    footer: int().default(0),
})

export const infoTable = sqliteTable("info", {
    name: text().notNull(),
    bio: text().notNull(),
    profilePicture: text().notNull(),
    analyticsCode: text().default(""),
})
