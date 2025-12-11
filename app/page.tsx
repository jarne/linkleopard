import Image from "next/image"
import { getAllLinks, type Link } from "./lib/link"
import { getInfo } from "./lib/info"
import type { Metadata } from "next"

const DEFAULT_NAME = "Your Name"
const DEFAULT_BIO = "Add your bio in the admin panel"
const DEFAULT_PROFILE_PICTURE = "/profile.jpg"

export async function generateMetadata(): Promise<Metadata> {
    const info = await getInfo()

    return {
        title: info?.name || DEFAULT_NAME,
        description: info?.bio || DEFAULT_BIO,
    }
}

export default async function Home() {
    const links: Link[] = await getAllLinks()
    const info = await getInfo()

    const profile = {
        name: info?.name || DEFAULT_NAME,
        bio: info?.bio || DEFAULT_BIO,
        profileImage: info?.profilePicture || DEFAULT_PROFILE_PICTURE,
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 px-4 py-12">
            <main className="w-full max-w-md">
                <div className="flex flex-col items-center mb-4">
                    <div className="mb-6">
                        <div className="relative w-24 h-24 md:w-32 md:h-32">
                            <Image
                                src={profile.profileImage}
                                alt={profile.name}
                                fill
                                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {profile.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
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
                        links.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md group"
                            >
                                <span className="flex h-10 w-10 items-center justify-center overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={link.icon}
                                        alt={link.name}
                                        className="h-full w-full object-cover"
                                    />
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                    {link.name}
                                </span>
                            </a>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
