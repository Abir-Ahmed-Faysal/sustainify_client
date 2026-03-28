import { IIdea } from "@/types/idea.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Eye, Calendar, User, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { isValidImageUrl, getPlaceholderGradient } from "@/lib/imageUtils";

interface IdeaCardProps {
    idea: IIdea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
    const { id, title, image, category, isPaid, totalUpVotes, totalDownVotes, author, createdAt, problemStatement, _count } = idea;
    const isValidImage = isValidImageUrl(image);
    const placeholderGradient = getPlaceholderGradient(title);
    
    return (
        <Card className="group overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
            <Link href={`/ideas/${id}`} className="block relative h-48 w-full overflow-hidden bg-emerald-50">
                {isValidImage ? (
                    <Image 
                        src={image} 
                        alt={title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className={`flex items-center justify-center h-full bg-gradient-to-br ${placeholderGradient} group-hover:scale-110 transition-transform duration-500`}>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{category.name}</p>
                        </div>
                    </div>
                )}
                
                <div className="absolute top-4 left-4 z-10">
                    <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 font-bold">
                        {category.name}
                    </Badge>
                </div>
                {isPaid && (
                    <div className="absolute top-4 right-4 z-10">
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white font-bold italic shadow-lg">
                            PAID
                        </Badge>
                    </div>
                )}
            </Link>

            <CardHeader className="p-5 pb-2">
                <Link href={`/ideas/${id}`}>
                    <CardTitle className="text-xl font-bold leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {title}
                    </CardTitle>
                </Link>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                   <User className="size-3" />
                   <span>{author.name}</span>
                   <span className="mx-1">•</span>
                   <Calendar className="size-3" />
                   <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
                </div>
            </CardHeader>

            <CardContent className="px-5 py-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {problemStatement}
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Star className="size-5 fill-current" />
                        <span className="text-sm font-bold">{totalUpVotes - totalDownVotes} Votes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <MessageCircle className="size-5" />
                        <span className="text-sm font-bold">{_count?.comments || 0}</span>
                    </div>
                </div>
                
                <Button size="sm" asChild variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/btn">
                    <Link href={`/ideas/${id}`} className="flex items-center gap-1">
                        View Details <Eye className="size-4 group-hover/btn:scale-110 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
