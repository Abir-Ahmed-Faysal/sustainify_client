import { getBlogBySlug } from "@/services/blog.service";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { isValidImageUrl, getPlaceholderGradient } from "@/lib/imageUtils";

// Revalidate blog detail pages every 1 hour (3600s) - blog content can be updated
export const revalidate = 3600;

interface BlogDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { id: slug } = await params;
  const response = await getBlogBySlug(slug);

  if (!response.success || !response.data) {
    redirect("/blog");
  }

  const { title, content, image, author, createdAt } = response.data;
  const isValidImage = isValidImageUrl(image);
  const placeholderGradient = getPlaceholderGradient(title);

  // Simple reading time estimate
  const readTime = Math.ceil(content.split(" ").length / 200);

  return (
    <article className="min-h-screen bg-slate-50/30 dark:bg-slate-950/30 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 transition-colors">
            <ArrowLeft className="size-4" />
          </div>
          <span className="font-medium">Back to Stories</span>
        </Link>

        {/* Content Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-100 dark:border-slate-800">
              <div className="relative size-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-emerald-500/10">
                {author.profile?.avatar ? (
                  <Image src={author.profile.avatar} alt={author.name} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-lg font-bold text-slate-400">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                   {author.name}
                </p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-8 flex-1">
              <div className="flex flex-col gap-1">
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Published</p>
                 <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="size-3.5 text-emerald-500" />
                    {format(new Date(createdAt), "MMMM d, yyyy")}
                 </div>
              </div>

              <div className="flex flex-col gap-1">
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Read Time</p>
                 <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Clock className="size-3.5 text-emerald-500" />
                    {readTime} min read
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Feature Image */}
        <div className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl">
          {isValidImage ? (
            <Image 
              src={image!} 
              alt={title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              priority 
              className="object-cover" 
            />
          ) : (
            <div className={`flex items-center justify-center h-full bg-linear-to-br ${placeholderGradient}`}>
                <span className="text-8xl">🌱</span>
            </div>
          )}
        </div>

        {/* Article Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-emerald prose-headings:font-extrabold prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300">
           {content.split('\n').map((para, idx) => (
             para.trim() ? <p key={idx}>{para}</p> : <br key={idx} />
           ))}
        </div>

        {/* Footer info */}
        <footer className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-400 text-sm italic">
                Sustainability stories for a brighter future. Share this story to spread the green spark!
            </p>
        </footer>
      </div>
    </article>
  );
}
