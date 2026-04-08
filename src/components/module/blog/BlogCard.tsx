import { IBlog } from "@/types/blog.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { isValidImageUrl, getPlaceholderGradient } from "@/lib/imageUtils";

interface BlogCardProps {
  blog: IBlog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const { title, slug, image, author, createdAt, content } = blog;
  const isValidImage = isValidImageUrl(image);
  const placeholderGradient = getPlaceholderGradient(title);

  return (
    <Card className="group overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
      <Link href={`/blog/${slug}`} className="block relative h-52 w-full overflow-hidden bg-emerald-50">
        {isValidImage ? (
          <Image
            src={image!}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`flex items-center justify-center h-full bg-linear-to-br ${placeholderGradient} group-hover:scale-110 transition-transform duration-500`}>
            <div className="text-center p-4">
              <span className="text-4xl">📝</span>
            </div>
          </div>
        )}
      </Link>

      <CardHeader className="p-5 pb-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Calendar className="size-3" />
          <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
        </div>
        <Link href={`/blog/${slug}`}>
          <CardTitle className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="px-5 py-2">
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {content.replace(/<[^>]*>/g, "").substring(0, 150)}...
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="relative size-6 rounded-full overflow-hidden bg-slate-200">
            {author.profile?.avatar ? (
              <Image src={author.profile.avatar} alt={author.name} fill sizes="24px" className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-[10px] font-bold text-slate-400">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">{author.name}</span>
        </div>

        <Button size="sm" asChild variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/btn">
          <Link href={`/blog/${slug}`} className="flex items-center gap-1">
            Read More <Eye className="size-4 group-hover/btn:scale-110 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
