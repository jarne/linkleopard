import { SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"

export type SessionData = {
    authenticated: boolean
}

const sessionTtlInDays = Number(process.env.SESSION_TTL) || 1
export const sessionOptions: SessionOptions = {
    cookieName: process.env.SESSION_COOKIE_NAME || "ll_session",
    password: process.env.SESSION_PASSWORD!,
    ttl: sessionTtlInDays * 86400,
    cookieOptions: {
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
    },
}

/**
 * Retrieve the current authentication session
 */
export async function getSession() {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(
        cookieStore,
        sessionOptions
    )
    if (session.authenticated === undefined) session.authenticated = false
    return session
}
