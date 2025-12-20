"use client"

import type { Link } from "@/app/lib/link"
import Button from "@/app/lib/ui/button"
import TextInput from "@/app/lib/ui/textInput"
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import Image from "next/image"
import { useEffect, useRef, useState, useTransition } from "react"
import {
    createLinkAction,
    deleteLinkAction,
    listLinksAction,
    reorderLinksAction,
    scrapeLinkMetadataAction,
    updateLinkAction,
} from "./../actions"
import SortableLinkItem from "./sortableLinkItem"

/**
 * Component for managing links in the admin panel, contains
 * link list and create/edit form
 */
export default function LinkManagement() {
    const [links, setLinks] = useState<Link[]>([])
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [iconPreview, setIconPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const scrapeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    )

    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        icon: "",
    })

    useEffect(() => {
        listLinksAction().then(setLinks)
    }, [])

    /**
     * Auto-scrape metadata when URL changes
     */
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.url])

    /**
     * Handle edit link click and populate form
     */
    const handleEditClick = (link: Link) => {
        setFormData({ name: link.name, url: link.url, icon: link.icon })
        setIconPreview(link.icon)
        setEditingId(link.id)
    }

    /**
     * Handle icon upload in form
     */
    const handleIconUpload = async (file: File) => {
        setIsUploading(true)
        setUploadError(null)
        try {
            const form = new FormData()
            form.append("file", file)

            const res = await fetch("/admin/api/upload", {
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

    /**
     * Handle save (create or update) link action of form
     */
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

    /**
     * Handle delete link action
     */
    const handleDelete = (id: number) => {
        startTransition(async () => {
            const ok = await deleteLinkAction(id)
            if (ok) {
                setLinks((prev) => prev.filter((link) => link.id !== id))
            }
        })
    }

    /**
     * Handle drag end event after reordering links
     */
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = links.findIndex((l) => l.id === active.id)
            const newIndex = links.findIndex((l) => l.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newLinks = arrayMove(links, oldIndex, newIndex)
                setLinks(newLinks)

                // Persist order by IDs
                const orderedIds = newLinks.map((l) => l.id)
                try {
                    await reorderLinksAction(orderedIds)
                } catch (err) {
                    console.error("Failed to persist order", err)
                }
            }
        }
    }

    /**
     * Reset form to initial state
     */
    const resetForm = () => {
        setFormData({ name: "", url: "", icon: "" })
        setIconPreview(null)
        setEditingId(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                            <Image
                                                src={iconPreview}
                                                width={46}
                                                height={46}
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
                                            const file = e.target.files?.[0]
                                            if (file) handleIconUpload(file)
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
                            <TextInput
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="e.g., Some Social Platform"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                URL
                            </label>
                            <TextInput
                                type="url"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        url: e.target.value,
                                    })
                                }
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button
                                color="blue"
                                onClick={handleSave}
                                disabled={
                                    isPending ||
                                    isUploading ||
                                    !formData.name ||
                                    !formData.url ||
                                    !formData.icon
                                }
                            >
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                            {editingId !== null && (
                                <Button color="gray" onClick={resetForm}>
                                    Cancel
                                </Button>
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
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={links.map((l) => l.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {links.map((link) => (
                                    <SortableLinkItem
                                        key={link.id}
                                        link={link}
                                        onEdit={handleEditClick}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    )
}
