import { NextResponse, NextRequest } from "next/server"
import { getSession } from "./app/auth/lib/session"

export async function proxy(request: NextRequest) {
    const session = await getSession()
    if (!session.authenticated) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }
}

export const config = {
    matcher: "/admin/:path*",
}
