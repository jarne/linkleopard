import { SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"

export type SessionData = {
    authenticated: boolean
}

export const sessionOptions: SessionOptions = {
    cookieName: process.env.SESSION_COOKIE_NAME || "ll_session",
    password: process.env.SESSION_PASSWORD || "change-this-session-secret",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    },
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(
        cookieStore,
        sessionOptions
    )
    if (session.authenticated === undefined) session.authenticated = false
    return session
}
