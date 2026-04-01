import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IIdea } from "@/types/idea.types"
import { Lightbulb, MessageSquare, ThumbsUp } from "lucide-react"
import Link from "next/link"

export default function ProfileIdeas({ ideas }: { ideas: IIdea[] }) {
    if (!ideas || ideas.length === 0) {
        return (
            <Card className="p-8 text-center bg-slate-50 border-dashed border-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No Ideas Yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    You haven`&apos;`t submitted any ideas. Start sharing your sustainable solutions with the community!
                </p>
                <Link
                    href="/dashboard/my-ideas"
                    className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                >
                    Submit an Idea
                </Link>
            </Card>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Approved</Badge>
            case "REJECTED":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Rejected</Badge>
            case "UNDER_REVIEW":
                return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">Reviewing</Badge>
            case "DRAFT":
            default:
                return <Badge variant="secondary" className="border-none">Draft</Badge>
        }
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Recent Ideas
                </h3>
                <Link
                    href="/dashboard/my-ideas"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-4">
                {ideas.slice(0, 5).map((idea) => (
                    <div
                        key={idea.id}
                        className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <Link href={`/ideas/${idea.id}`} className="hover:underline">
                                <h4 className="font-semibold text-slate-900 line-clamp-1">{idea.title}</h4>
                            </Link>
                            <div>{getStatusBadge(idea.status)}</div>
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {idea.problemStatement}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{idea.totalUpVotes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{idea._count?.comments || 0}</span>
                            </div>
                            <div className="text-slate-400 ml-auto">
                                {new Date(idea.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
