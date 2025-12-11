"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import type { Link } from "@/app/lib/link"
import {
    createLinkAction,
    deleteLinkAction,
    listLinksAction,
    updateLinkAction,
    scrapeLinkMetadataAction,
    getInfoAction,
    updateInfoAction,
} from "./actions"

export default function AdminPanel() {
    const [links, setLinks] = useState<Link[]>([])
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [iconPreview, setIconPreview] = useState<string | null>(null)
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
        null
    )
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const profilePicInputRef = useRef<HTMLInputElement | null>(null)
    const scrapeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        icon: "",
    })
    const [profileData, setProfileData] = useState({
        name: "",
        bio: "",
        profilePicture: "",
    })

    useEffect(() => {
        listLinksAction().then(setLinks)
        getInfoAction().then((data) => {
            if (data) {
                setProfileData(data)
                setProfilePicPreview(data.profilePicture)
            }
        })
    }, [])

    // Auto-scrape metadata when URL changes
    useEffect(() => {
        if (!formData.url) return
        if (formData.name || formData.icon) return

        // Clear previous timeout
        if (scrapeTimeoutRef.current) {
            clearTimeout(scrapeTimeoutRef.current)
        }

        // Debounce scraping by 1 second
        scrapeTimeoutRef.current = setTimeout(async () => {
            try {
                const result = await scrapeLinkMetadataAction(formData.url)
                setFormData((prev) => ({
                    ...prev,
                    name: result.title && !prev.name ? result.title : prev.name,
                    icon:
                        result.favicon && !prev.icon
                            ? result.favicon
                            : prev.icon,
                }))
                if (result.favicon && !formData.icon) {
                    setIconPreview(result.favicon)
                }
            } catch (err) {
                console.error("Failed to scrape metadata:", err)
            }
        }, 1000)

        return () => {
            if (scrapeTimeoutRef.current) {
                clearTimeout(scrapeTimeoutRef.current)
            }
        }
        // Only depend on URL, not name/icon to avoid infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.url])

    const handleEditClick = (link: Link) => {
        setFormData({ name: link.name, url: link.url, icon: link.icon })
        setIconPreview(link.icon)
        setEditingId(link.id)
    }

    const handleIconUpload = async (file: File) => {
        setIsUploading(true)
        setUploadError(null)
        try {
            const form = new FormData()
            form.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: form,
            })

            if (!res.ok) {
                throw new Error("Upload failed")
            }

            const data = await res.json()
            const url = data.url as string
            setFormData((prev) => ({ ...prev, icon: url }))
            setIconPreview(url)
        } catch (err) {
            console.error(err)
            setUploadError("Upload failed. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleProfilePicUpload = async (file: File) => {
        setIsUploading(true)
        setUploadError(null)
        try {
            const form = new FormData()
            form.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: form,
            })

            if (!res.ok) {
                throw new Error("Upload failed")
            }

            const data = await res.json()
            const url = data.url as string
            setProfileData((prev) => ({ ...prev, profilePicture: url }))
            setProfilePicPreview(url)
        } catch (err) {
            console.error(err)
            setUploadError("Upload failed. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleSaveProfile = () => {
        if (
            !profileData.name ||
            !profileData.bio ||
            !profileData.profilePicture
        )
            return

        startTransition(async () => {
            await updateInfoAction(profileData)
        })
    }

    const handleSave = () => {
        if (!formData.name || !formData.url || !formData.icon) return

        startTransition(async () => {
            if (editingId !== null) {
                const updated = await updateLinkAction(editingId, formData)
                if (updated) {
                    setLinks((prev) =>
                        prev.map((link) =>
                            link.id === editingId
                                ? { ...link, ...updated }
                                : link
                        )
                    )
                }
            } else {
                const created = await createLinkAction(formData)
                setLinks((prev) => [...prev, created])
            }
            resetForm()
        })
    }

    const handleDelete = (id: number) => {
        startTransition(async () => {
            const ok = await deleteLinkAction(id)
            if (ok) {
                setLinks((prev) => prev.filter((link) => link.id !== id))
            }
        })
    }

    const resetForm = () => {
        setFormData({ name: "", url: "", icon: "" })
        setIconPreview(null)
        setEditingId(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        LinkLeopard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your shared bio links in the admin panel
                    </p>
                </div>

                {/* Profile Info Section */}
                <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Profile Picture
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                        {profilePicPreview ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={profilePicPreview}
                                                alt="Profile preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400">
                                                +
                                            </span>
                                        )}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file)
                                                handleProfilePicUpload(file)
                                        }}
                                        disabled={isUploading}
                                        className="flex-1 text-sm text-gray-700 dark:text-gray-200"
                                        ref={profilePicInputRef}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Your Name"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        bio: e.target.value,
                                    })
                                }
                                placeholder="Your bio"
                                rows={3}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleSaveProfile}
                            disabled={
                                isPending ||
                                isUploading ||
                                !profileData.name ||
                                !profileData.bio ||
                                !profileData.profilePicture
                            }
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            {isPending ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </div>

                {/* Links Management Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {editingId !== null ? "Edit Link" : "New Link"}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon (upload image)
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xl">
                                                {iconPreview ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img
                                                        src={iconPreview}
                                                        alt="Icon preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400">
                                                        +
                                                    </span>
                                                )}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0]
                                                    if (file)
                                                        handleIconUpload(file)
                                                }}
                                                disabled={isUploading}
                                                className="max-w-36 flex-1 text-sm text-gray-700 dark:text-gray-200"
                                                ref={fileInputRef}
                                            />
                                        </div>
                                        {uploadError && (
                                            <p className="text-sm text-red-600">
                                                {uploadError}
                                            </p>
                                        )}
                                        {isUploading && (
                                            <p className="text-sm text-gray-500">
                                                Uploading icon...
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Portfolio"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                url: e.target.value,
                                            })
                                        }
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={
                                            isPending ||
                                            isUploading ||
                                            !formData.name ||
                                            !formData.url ||
                                            !formData.icon
                                        }
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        {isPending ? "Saving..." : "Save"}
                                    </button>
                                    {editingId !== null && (
                                        <button
                                            onClick={resetForm}
                                            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        {links.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    No links yet. Create your first one!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {links.map((link) => (
                                    <div
                                        key={link.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="text-3xl flex h-12 w-12 items-center justify-center overflow-hidden">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={link.icon}
                                                        alt={link.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                        {link.name}
                                                    </h3>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
                                                    >
                                                        {link.url}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(link)
                                                    }
                                                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 font-semibold rounded-lg transition-colors duration-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(link.id)
                                                    }
                                                    className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 font-semibold rounded-lg transition-colors duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
