import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
    title: "LinkLeopard",
    description:
        "Your link-in-bio hub - customize, share, and own your digital presence in one place",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    )
}
