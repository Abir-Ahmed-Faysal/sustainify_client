/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { updateIdea, getIdeaById } from "@/services/idea.service";
import { getCategories } from "@/services/category.service";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { IIdea } from "@/types/idea.types";

export default function EditIdeaPage() {
    const router = useRouter();
    const params = useParams();
    const ideaId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [idea, setIdea] = useState<IIdea | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        problemStatement: "",
        solution: "",
        description: "",
        categoryId: "",
        isPaid: false,
        price: 0,
        image: ""
    });

    // Fetch idea and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);
                const [ideaResponse, categoriesResponse] = await Promise.all([
                    getIdeaById(ideaId),
                    getCategories()
                ]);

                if (ideaResponse.data) {
                    const ideaData = ideaResponse.data;
                    setIdea(ideaData);
                    
                    // Check if idea is approved (can't edit approved ideas)
                    if (ideaData.status === "APPROVED") {
                        setError("You cannot edit an approved idea");
                        router.push("/dashboard/my-ideas");
                        return;
                    }

                    setFormData({
                        title: ideaData.title,
                        problemStatement: ideaData.problemStatement,
                        solution: ideaData.solution || "",
                        description: ideaData.description || "",
                        categoryId: ideaData.category.id,
                        isPaid: ideaData.isPaid || false,
                        price: ideaData.price || 0,
                        image: ideaData.image || ""
                    });
                }

                if (categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load idea or categories");
            } finally {
                setIsFetching(false);
                setIsFetchingCategories(false);
            }
        };

        if (ideaId) {
            fetchData();
        }
    }, [ideaId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await updateIdea(ideaId, formData);
            if (response.data) {
                alert("Idea updated successfully!");
                router.push("/dashboard/my-ideas");
            }
        } catch (err: any) {
            console.error("Error updating idea:", err);
            setError(err.message || "Failed to update idea. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Idea</h1>
                <p className="text-slate-600">Update your sustainability idea</p>
                {idea && (
                    <p className="text-sm text-slate-500 mt-2">
                        Current Status: <span className={`font-semibold ${
                            idea.status === "APPROVED" ? "text-green-600" :
                            idea.status === "REJECTED" ? "text-red-600" :
                            "text-yellow-600"
                        }`}>{idea.status}</span>
                    </p>
                )}
            </div>

            <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Idea Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your idea a catchy title"
                            required
                        />
                    </div>

                    {/* Problem Statement */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Problem Statement <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="problemStatement"
                            value={formData.problemStatement}
                            onChange={handleChange}
                            placeholder="What problem are you trying to solve?"
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Proposed Solution */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Proposed Solution <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="solution"
                            value={formData.solution}
                            onChange={handleChange}
                            placeholder="Describe your proposed solution"
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide more details about your idea"
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            disabled={isFetchingCategories}
                        >
                            <option value="">{isFetchingCategories ? "Loading categories..." : "Select a category"}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Paid Option */}
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPaid"
                                checked={formData.isPaid}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded"
                            />
                            <span className="text-sm font-medium text-slate-700">Make this idea paid</span>
                        </label>
                    </div>

                    {/* Price */}
                    {formData.isPaid && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Price (USD) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Set a price for your idea"
                                min="0"
                                step="0.01"
                                required={formData.isPaid}
                            />
                        </div>
                    )}

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Image URL
                        </label>
                        <Input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Idea"
                            )}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
