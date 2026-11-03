import "dotenv/config"
import { drizzle } from "drizzle-orm/libsql"

type Database = ReturnType<typeof createDb>

function createDb() {
    return drizzle(process.env.DB_FILE_NAME || "file:local.db")
}

// Reuse the database client across hot reloads in development
const globalForDb = globalThis as unknown as { db?: Database }
export const db = globalForDb.db ?? createDb()
if (process.env.NODE_ENV !== "production") globalForDb.db = db
