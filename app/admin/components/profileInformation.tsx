"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { getInfoAction, updateInfoAction } from "./../actions"
import Button from "@/app/lib/ui/button"
import TextInput from "@/app/lib/ui/textInput"
import Image from "next/image"

/**
 * Component for editing profile information
 */
export default function ProfileInformation() {
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
        null
    )
    const profilePicInputRef = useRef<HTMLInputElement | null>(null)

    const [profileData, setProfileData] = useState({
        name: "",
        bio: "",
        profilePicture: "",
        analyticsCode: "",
    })

    useEffect(() => {
        getInfoAction().then((data) => {
            if (data) {
                setProfileData({
                    ...data,
                    analyticsCode: data.analyticsCode ?? "",
                })
                setProfilePicPreview(data.profilePicture)
            }
        })
    }, [])

    /**
     * Handle profile picture upload
     */
    const handleProfilePicUpload = async (file: File) => {
        setIsUploading(true)
        setUploadError(null)
        try {
            const form = new FormData()
            form.append("file", file)
            form.append("size", "512")

            const res = await fetch("/admin/api/upload", {
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

    /**
     * Handle saving profile information
     */
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
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
                                    <Image
                                        src={profilePicPreview}
                                        width={128}
                                        height={128}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">+</span>
                                )}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleProfilePicUpload(file)
                                }}
                                disabled={isUploading}
                                className="flex-1 text-sm text-gray-700 dark:text-gray-200"
                                ref={profilePicInputRef}
                            />
                        </div>
                    </div>
                    {uploadError && (
                        <p className="text-sm text-red-600">{uploadError}</p>
                    )}
                    {isUploading && (
                        <p className="text-sm text-gray-500">
                            Uploading icon...
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                    </label>
                    <TextInput
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                            setProfileData({
                                ...profileData,
                                name: e.target.value,
                            })
                        }
                        placeholder="Your Name"
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Analytics HTML Code
                    </label>
                    <textarea
                        value={profileData.analyticsCode}
                        onChange={(e) =>
                            setProfileData({
                                ...profileData,
                                analyticsCode: e.target.value,
                            })
                        }
                        placeholder="Paste analytics HTML code"
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>
            </div>
            <div className="mt-4">
                <Button
                    color="blue"
                    onClick={handleSaveProfile}
                    disabled={
                        isPending ||
                        isUploading ||
                        !profileData.name ||
                        !profileData.bio ||
                        !profileData.profilePicture
                    }
                >
                    {isPending ? "Saving..." : "Save Profile"}
                </Button>
            </div>
        </div>
    )
}
