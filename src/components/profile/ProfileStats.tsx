import { Card } from "@/components/ui/card"
import { IMemberStats } from "@/types/stats.types"
import { CheckCircle, Clock, FileText, XCircle, BarChart3 } from "lucide-react"

export default function ProfileStats({ stats }: { stats: IMemberStats }) {
    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Idea Statistics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                    <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Ideas</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                    <div className="bg-amber-100 p-3 rounded-full mb-3 text-amber-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.underReview}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Under Review</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                    <div className="bg-green-100 p-3 rounded-full mb-3 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Approved</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                    <div className="bg-red-100 p-3 rounded-full mb-3 text-red-600">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.rejected}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Rejected</p>
                </div>
            </div>
        </Card>
    )
}
