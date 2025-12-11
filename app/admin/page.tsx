"use client"

import { useState } from "react"
import type { Link } from "@/app/lib/link"

export default function AdminPanel() {
    const [links, setLinks] = useState<Link[]>([
        {
            id: 1,
            name: "Portfolio",
            url: "https://example.com",
            icon: "🔗",
        },
        {
            id: 2,
            name: "Twitter",
            url: "https://twitter.com",
            icon: "𝕏",
        },
    ])

    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        icon: "",
    })

    const handleEditClick = (link: Link) => {
        setFormData({ name: link.name, url: link.url, icon: link.icon })
        setEditingId(link.id)
    }

    const handleSave = () => {
        if (editingId !== null) {
            setLinks(
                links.map((link) =>
                    link.id === editingId ? { ...link, ...formData } : link
                )
            )
        } else {
            const newLink: Link = {
                id: Math.max(...links.map((l) => l.id), 0) + 1,
                ...formData,
            }
            setLinks([...links, newLink])
        }
        resetForm()
    }

    const handleDelete = (id: number) => {
        setLinks(links.filter((link) => link.id !== id))
    }

    const resetForm = () => {
        setFormData({ name: "", url: "", icon: "" })
        setEditingId(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        LinkLeopard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your shared bio links in the admin panel
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {editingId !== null ? "Edit Link" : "New Link"}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                icon: e.target.value,
                                            })
                                        }
                                        placeholder="🔗 (emoji or text)"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
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
                                            !formData.name ||
                                            !formData.url ||
                                            !formData.icon
                                        }
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Save
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
                                                <div className="text-3xl">
                                                    {link.icon}
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
