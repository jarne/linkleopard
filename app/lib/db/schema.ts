import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const linksTable = sqliteTable("links", {
    id: int().primaryKey({ autoIncrement: true }),
    url: text().notNull(),
    name: text().notNull(),
    icon: text().notNull(),
})
