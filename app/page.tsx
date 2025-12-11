import Image from "next/image"

interface Link {
    name: string
    url: string
    icon: string
}

interface Profile {
    name: string
    bio: string
    profileImage: string
    links: Link[]
}

const profile: Profile = {
    name: "Jane Doe",
    bio: "Designer & Developer | Creating beautiful digital experiences",
    profileImage: "/profile.jpg",
    links: [
        {
            name: "Portfolio",
            url: "https://example.com",
            icon: "🔗",
        },
        {
            name: "Twitter",
            url: "https://twitter.com",
            icon: "𝕏",
        },
        {
            name: "GitHub",
            url: "https://github.com",
            icon: "⚙️",
        },
        {
            name: "LinkedIn",
            url: "https://linkedin.com",
            icon: "💼",
        },
    ],
}

export default function Home() {
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
                    {profile.links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md group"
                        >
                            <span className="text-2xl">{link.icon}</span>
                            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>
                <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
                    <p>Made with LinkLeopard</p>
                </div>
            </main>
        </div>
    )
}
