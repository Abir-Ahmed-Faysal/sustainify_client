"use client";

import { useEffect, useState } from "react";
import { getMyIdeas, deleteIdea } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import Link from "next/link";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyIdeasPage() {
    const [ideas, setIdeas] = useState<IIdea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyIdeas = async () => {
            try {
                const response = await getMyIdeas();
                if (response.data) {
                    setIdeas(response.data);
                }
            } catch (err) {
                console.error("Error fetching ideas:", err);
                setError("Failed to load your ideas");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyIdeas();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this idea?")) return;

        try {
            await deleteIdea(id);
            setIdeas(ideas.filter(idea => idea.id !== id));
        } catch (err) {
            console.error("Error deleting idea:", err);
            alert("Failed to delete idea");
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Ideas</h1>
                    <p className="text-slate-600">Manage and track your sustainability ideas</p>
                </div>
                <Link href="/dashboard/create-idea">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">+ Create New Idea</Button>
                </Link>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {!isLoading && ideas.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-600 mb-4">You haven`&apos;`t created any ideas yet</p>
                    <Link href="/dashboard/create-idea">
                        <Button>Create Your First Idea</Button>
                    </Link>
                </div>
            )}

            {!isLoading && ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ideas.map((idea) => (
                        <Card key={idea.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h2 className="font-bold text-lg text-slate-900 mb-2">{idea.title}</h2>
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{idea.problemStatement}</p>
                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            idea.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                            idea.status === "REJECTED" ? "bg-red-100 text-red-800" :
                                            idea.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                            {idea.status}
                                        </span>
                                        {idea.isPaid && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Paid ${idea.price}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {idea.status !== "APPROVED" && (
                                    <>
                                        <Link href={`/dashboard/edit-idea/${idea.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full" size="sm">
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDelete(idea.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                                <Link href={`/ideas/${idea.id}`} className="flex-1">
                                    <Button variant="default" className="w-full" size="sm">
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
