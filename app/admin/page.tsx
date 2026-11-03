import { connection } from "next/server"
import AdminPanel from "./components/adminPanel"
import { PublicS3UrlProvider } from "./components/publicS3UrlContext"
import { getS3Config } from "./lib/s3/s3Config"
import { getS3BaseUrl } from "./lib/s3/s3UrlBuilder"

/**
 * Admin panel page, resolves runtime configuration on the server
 * and passes it to the client components
 */
export default async function AdminPage() {
    // Render on every request so environment variables are read at runtime
    await connection()

    const publicS3BaseUrl = getS3BaseUrl(getS3Config())

    return (
        <PublicS3UrlProvider baseUrl={publicS3BaseUrl}>
            <AdminPanel />
        </PublicS3UrlProvider>
    )
}
