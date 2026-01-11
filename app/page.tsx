import type { Metadata } from "next"
import Image from "next/image"
import { buildPublicS3Url } from "./admin/lib/s3Utils"
import { getInfo, Info } from "./lib/info"
import { getAllLinks, type Link } from "./lib/link"

const DEFAULT_NAME = "Your Name"
const DEFAULT_BIO = "Add your bio in the admin panel"
const DEFAULT_PROFILE_PICTURE = "/profile.jpg"

export const dynamic = "force-dynamic"

/**
 * Build profile info object with fallback defaults
 */
function buildProfile(info: Info | undefined) {
    return {
        name: info?.name || DEFAULT_NAME,
        bio: info?.bio || DEFAULT_BIO,
        profileImage: info?.profilePicture || DEFAULT_PROFILE_PICTURE,
    }
}

/**
 * Generate dynamic metadata based on profile info
 */
export async function generateMetadata(): Promise<Metadata> {
    const info = await getInfo()
    const profile = buildProfile(info)

    return {
        title: profile.name,
        description: profile.bio,
        icons: buildPublicS3Url(profile.profileImage),
    }
}

/**
 * Public page showing profile info and links
 */
export default async function PublicPage() {
    const links: Link[] = await getAllLinks()
    const info = await getInfo()
    const profile = buildProfile(info)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 px-4 py-12">
            <main className="w-full max-w-md">
                <div className="flex flex-col items-center mb-4">
                    <div className="mb-6">
                        <div className="relative w-24 h-24 md:w-32 md:h-32">
                            <Image
                                src={buildPublicS3Url(profile.profileImage)}
                                width={128}
                                height={128}
                                alt={profile.name}
                                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {profile.name}
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            {profile.bio}
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    {links.length === 0 ? (
                        <div className="text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-10 shadow-sm">
                            No links yet.
                        </div>
                    ) : (
                        links
                            .filter((link) => link.footer === 0)
                            .map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md group"
                                >
                                    {link.icon && (
                                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden">
                                            <Image
                                                src={buildPublicS3Url(
                                                    link.icon
                                                )}
                                                width={40}
                                                height={40}
                                                alt={link.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </span>
                                    )}
                                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                        {link.name}
                                    </span>
                                </a>
                            ))
                    )}
                </div>
                <div className="mt-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        {links
                            .filter((link) => link.footer === 1)
                            .map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mx-2 inline-flex items-center gap-1 hover:underline"
                                >
                                    <span>{link.name}</span>
                                </a>
                            ))}
                    </p>
                </div>
            </main>
            {info?.analyticsCode && (
                <div
                    dangerouslySetInnerHTML={{ __html: info.analyticsCode }}
                ></div>
            )}
        </div>
    )
}
