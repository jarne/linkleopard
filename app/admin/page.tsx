"use client"

import ProfileInformation from "./components/profileInformation"
import LinkManagement from "./components/linkManagement"

/**
 * Admin panel page for managing links and profile info
 */
export default function AdminPanel() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        LinkLeopard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your shared bio links in the admin panel
                    </p>
                </div>
                <LinkManagement />
                <ProfileInformation />
            </div>
        </div>
    )
}
