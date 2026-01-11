"use client"

import { redirect } from "next/navigation"
import Button from "../lib/ui/button"
import LinkManagement from "./components/linkManagement"
import ProfileInformation from "./components/profileInformation"

/**
 * Admin panel page for managing links and profile info
 */
export default function AdminPanel() {
    const handlePreviewButton = () => {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between flex-1 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            LinkLeopard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your shared bio links in the admin panel
                        </p>
                    </div>
                    <div>
                        <Button
                            color="light-blue"
                            onClick={handlePreviewButton}
                        >
                            Preview site
                        </Button>
                    </div>
                </div>
                <LinkManagement />
                <ProfileInformation />
            </div>
        </div>
    )
}
