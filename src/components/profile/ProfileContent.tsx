/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { UserProfile } from "@/types/profile.types"
import { updateUserProfile } from "@/services/profile.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Edit2, Save, X } from "lucide-react"

interface ProfileContentProps {
    initialProfile: UserProfile
}

export default function ProfileContent({ initialProfile }: ProfileContentProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [profile, setProfile] = useState<UserProfile>(initialProfile)
    const [formData, setFormData] = useState({
        name: initialProfile.name || "",
        bio: initialProfile.profile?.bio || initialProfile.bio || "",
        address: initialProfile.profile?.address || "",
        avatar: initialProfile.profile?.avatar || initialProfile.avatar || ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        setIsLoading(true)

        try {
            const response = await updateUserProfile({
                name: formData.name,
                bio: formData.bio,
                address: formData.address,
                avatar: formData.avatar
            })

            if (response.data) {
                setProfile(response.data)
                setIsEditing(false)
                alert("Profile updated successfully!")
            }
        } catch (err: any) {
            console.error("Error updating profile:", err)
            setError(err.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    {formData.avatar ? (
                        <img
                            src={formData.avatar}
                            alt={profile.name}
                            className="w-full h-full rounded-full object-cover"
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
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
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
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself"
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
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
                            <Input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your address"
                            />
                        ) : (
                            <p className="text-slate-900">{formData.address || "Not specified"}</p>
                        )}
                    </div>

                    {/* Avatar URL */}
                    {isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Avatar URL
                            </label>
                            <Input
                                type="url"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                            />
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
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
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
