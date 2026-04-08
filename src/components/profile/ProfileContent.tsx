"use client"

import { useState } from "react"
import { UserProfile } from "@/types/profile.types"
import { updateUserProfile } from "@/services/profile.service"
import { updateProfileSchema } from "@/zod/user.zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Loader2, Edit2, Save, X } from "lucide-react"
import { toast } from "sonner"
import CloudinaryImageUploader from "@/components/shared/CloudinaryImageUploader"
import { rollbackUploadedImages } from "@/services/cloudinary.service"

interface ProfileContentProps {
    initialProfile: UserProfile
}

export default function ProfileContent({ initialProfile }: ProfileContentProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [profile, setProfile] = useState<UserProfile>(initialProfile)
    const [formData, setFormData] = useState({
        name: initialProfile.name || "",
        bio: initialProfile.profile?.bio || initialProfile.bio || "",
        address: initialProfile.profile?.address || "",
        avatar: initialProfile.profile?.avatar || initialProfile.avatar || ""
    })
    const [previousAvatar, setPreviousAvatar] = useState(initialProfile.profile?.avatar || initialProfile.avatar || "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAvatarChange = (value: string | string[]) => {
        const avatarUrl = Array.isArray(value) ? value[0] : value;
        setFormData(prev => ({
            ...prev,
            avatar: avatarUrl
        }))
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            name: profile.name || "",
            bio: profile.profile?.bio || profile.bio || "",
            address: profile.profile?.address || "",
            avatar: profile.profile?.avatar || profile.avatar || ""
        })
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setFieldErrors({})

        // Client-side Zod validation
        const validationResult = updateProfileSchema.safeParse({
            name: formData.name || undefined,
            bio: formData.bio || undefined,
            address: formData.address || undefined,
            avatar: formData.avatar || undefined,
        })

        if (!validationResult.success) {
            const errors: Record<string, string> = {}
            validationResult.error.issues.forEach((err) => {
                const field = err.path[0] as string
                errors[field] = err.message
            })
            setFieldErrors(errors)
            toast.error("Please fix the validation errors before saving.")
            return
        }

        setIsLoading(true)

        try {
            const response = await updateUserProfile(validationResult.data)

            if (response.data) {
                setProfile(response.data)
                setPreviousAvatar(formData.avatar)
                setIsEditing(false)
                toast.success("Profile updated successfully!")
            }
        } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error("Error updating profile:", error);
            setError(error.message || "Failed to update profile");
            toast.error(error.message || "Failed to update profile")

            // Rollback uploaded avatar if submission failed
            if (formData.avatar && formData.avatar !== previousAvatar) {
                await rollbackUploadedImages([formData.avatar], (rollbackError) => {
                    console.warn("Avatar rollback warning:", rollbackError);
                });
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isSubmitDisabled = isLoading || isUploadingAvatar

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center relative overflow-hidden">
                    {formData.avatar ? (
                        <Image
                            src={formData.avatar}
                            alt={profile.name}
                            fill
                            sizes="128px"
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-4xl font-bold text-primary">
                            {profile.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                <p className="text-slate-600 mt-1">{profile.email}</p>
                <p className="text-sm text-slate-500 mt-2">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                        profile.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                    }`}>
                        {profile.role}
                    </span>
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Profile Form */}
            <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name
                        </label>
                        {isEditing ? (
                            <>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    disabled={isSubmitDisabled}
                                    className={fieldErrors.name ? "border-red-400 focus:ring-red-400" : ""}
                                />
                                {fieldErrors.name && (
                                    <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
                                )}
                            </>
                        ) : (
                            <p className="text-slate-900">{profile.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>
                        <p className="text-slate-900">{profile.email}</p>
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Bio
                        </label>
                        {isEditing ? (
                            <>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself"
                                    disabled={isSubmitDisabled}
                                    rows={3}
                                    maxLength={500}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 ${
                                        fieldErrors.bio
                                            ? "border-red-400 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"
                                    }`}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {fieldErrors.bio ? (
                                        <p className="text-sm text-red-600">{fieldErrors.bio}</p>
                                    ) : (
                                        <span />
                                    )}
                                    <p className={`text-xs ${
                                        formData.bio.length > 450 ? "text-amber-600" : "text-slate-400"
                                    }`}>
                                        {formData.bio.length}/500
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-900">{formData.bio || "No bio added yet"}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Address
                        </label>
                        {isEditing ? (
                            <>
                                <Input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Your address"
                                    disabled={isSubmitDisabled}
                                    className={fieldErrors.address ? "border-red-400 focus:ring-red-400" : ""}
                                />
                                {fieldErrors.address && (
                                    <p className="text-sm text-red-600 mt-1">{fieldErrors.address}</p>
                                )}
                            </>
                        ) : (
                            <p className="text-slate-900">{formData.address || "Not specified"}</p>
                        )}
                    </div>

                    {/* Avatar Upload */}
                    {isEditing && (
                        <div>
                            <CloudinaryImageUploader
                                mode="single"
                                value={formData.avatar}
                                onChange={handleAvatarChange}
                                onUploadingChange={setIsUploadingAvatar}
                                label="Profile Avatar"
                                hint="Upload a profile picture (JPG, PNG, WEBP)"
                                disabled={isSubmitDisabled}
                            />
                            {fieldErrors.avatar && (
                                <p className="text-sm text-red-600 mt-1">{fieldErrors.avatar}</p>
                            )}
                        </div>
                    )}

                    {/* Account Info */}
                    <div className="pt-4 border-t border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Account Information</h3>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-slate-600">Status:</span>
                                <span className={`ml-2 font-medium ${profile.isActive ? "text-green-600" : "text-red-600"}`}>
                                    {profile.isActive ? "Active" : "Inactive"}
                                </span>
                            </p>
                            <p>
                                <span className="text-slate-600">Member Since:</span>
                                <span className="ml-2 font-medium text-slate-900">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </span>
                            </p>
                            <p>
                                <span className="text-slate-600">Last Updated:</span>
                                <span className="ml-2 font-medium text-slate-900">
                                    {new Date(profile.updatedAt).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className="flex-1"
                            >
                                {isSubmitDisabled ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitDisabled}
                                className="flex-1"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    )
}
